import { Request, Response } from 'express';
import validator from 'validator';
import prisma from '@src/db';
import { Prisma } from '@prisma/client';

export const CreateContactPatient = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;
    const { phones } = req.body;
    const wrongPhones = new Set<string>();
    phones.forEach((phone: string) => {
      if (!validator.isMobilePhone(phone, 'pt-BR')) {
        wrongPhones.add(phone);
      }
    });
    if (!wrongPhones.size) {
      return res.status(400).json({ error: 'INVALID_PHONE', phones: Array.from(wrongPhones) });
    }
    const patient = await prisma.patient.findFirst({
      where: {
        id: patientId,
        deletedAt: null,
      },
    });
    if (!patient) {
      return res.status(400).json({ error: 'PATIENT_NOT_FOUND' });
    }
    await prisma.contactPatient.createMany({
      data: phones.map((phone: string) => ({
        patientId,
        phone
      })),
    });
    return res.status(201).json({ data: 'CONTACT_CREATED' });
  } catch (_) {
    return res.status(400).json({ error: 'INVALID_FIELDS' });
  }
};

export const ListContactPatient = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;
    const { limit, offset, q } = req.query;
    const patient = await prisma.patient.findFirst({
      where: {
        id: patientId,
        deletedAt: null,
      },
    });
    if (!patient) {
      return res.status(400).json({ error: 'PATIENT_NOT_FOUND' });
    }
    const data: Prisma.ContactPatientFindManyArgs = {
      where: {
        patientId,
        deletedAt: null,
      },
      select: {
        id: true,
        phone: true,
      },
      take: limit as unknown as number,
      skip: offset as unknown as number,
      orderBy: { createdAt: 'desc' },
    };
    if (q) {
      data.where = {
        ...data.where,
        phone: {
          contains: q as string,
        },
      };
    }
    const contacts = await prisma.contactPatient.findMany(data);
    return res.status(200).json({ data: contacts });
  } catch (_) {
    return res.status(400).json({ error: 'INVALID_FIELDS' });
  }
};

export const UpdateContactPatient = async (req: Request, res: Response) => {
  try {
    const { patientId, contactId } = req.params;
    const { phone, userId } = req.body;
    if (!validator.isMobilePhone(phone, 'pt-BR')) {
      return res.status(400).json({ error: 'INVALID_PHONE' });
    }
    const patient = await prisma.patient.findFirst({
      where: {
        id: patientId,
        deletedAt: null,
      },
    });
    if (!patient) {
      return res.status(400).json({ error: 'PATIENT_NOT_FOUND' });
    }
    await prisma.contactPatient.updateWithLog(userId, contactId, {
      where: {
        id: contactId,
        deletedAt: null,
      },
      data: { phone },
    });
    return res.status(200).json({ data: 'CONTACT_UPDATED' });
  } catch (_) {
    return res.status(400).json({ error: 'INVALID_FIELDS' });
  }
};

export const DeleteContactPatient = async (req: Request, res: Response) => {
  try {
    const { patientId, contactId } = req.params;
    const { userId } = req.body;
    const patient = await prisma.patient.findFirst({
      where: {
        id: patientId,
        deletedAt: null,
      },
    });
    if (!patient) {
      return res.status(400).json({ error: 'PATIENT_NOT_FOUND' });
    }
    await prisma.contactPatient.softDelete(contactId, userId);
    return res.status(200).json({ data: 'CONTACT_DELETED' });
  } catch (_) {
    return res.status(400).json({ error: 'INVALID_FIELDS' });
  }
};
