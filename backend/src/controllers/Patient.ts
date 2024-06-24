import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import validator from 'validator';
import prisma from '@src/db';
import { exclude } from './helpers';

export const CreatePatient = async (req: Request, res: Response) => {
  try {
    const {
      name,
      document,
      email,
      phones,
      birthdate,
      gender,
      insuranceCardNumber,
    } = req.body;
    const patientExists = await prisma.patient.findFirst({
      where: { document },
    });
    if (!patientExists?.deletedAt) {
      console.log({ patientExists });
      return res.status(400).json({ error: 'PATIENT_ALREADY_EXISTS' });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'INVALID_EMAIL' });
    }
    const wrongPhones = new Set<string>();
    phones.forEach((phone: string) => {
      if (!validator.isMobilePhone(phone, 'pt-BR')) {
        wrongPhones.add(phone);
      }
    });
    if (wrongPhones.size) {
      return res.status(400).json({ error: 'INVALID_PHONE', phones: Array.from(wrongPhones) });
    }
    if (patientExists?.deletedAt) {
      await prisma.patient.updateWithLog(req.body.userId, patientExists.id, {
        where: { id: patientExists.id },
        data: {
          name,
          email,
          birthdate,
          gender,
          insuranceCardNumber,
          phones: { create: phones.map((phone: string) => ({ phone })) },
          deletedAt: null,
        }
      });
      return res.json({ data: 'PATIENT_UPDATED' });
    }

    await prisma.patient.create({
      data: {
        name,
        document,
        email,
        createdBy: req.body.userId,
        birthdate,
        gender,
        insuranceCardNumber,
        phones: { create: phones.map((phone: string) => ({ phone })) },
      }
    });

    return res.status(201).json({ data: 'PATIENT_CREATED' });
  } catch (_) {
    return res.status(400).json({ error: 'INVALID_FIELDS' });
  }
};

export const ListPatients = async (req: Request, res: Response) => {
  try {
    const { limit, offset, q } = req.query;
    const countPatients: number = await prisma.patient.count();
    const baseObject: Prisma.PatientFindManyArgs = {
      where: { deletedAt: null },
      include: { phones: true },
      take: limit as unknown as number,
      skip: offset as unknown as number,
      orderBy: { createdAt: 'desc' },
    };

    if (q) {
      const query = q as string;
      baseObject.where = {
        ...baseObject.where,
        OR: [
          { name: { contains: query } },
          { document: { contains: query } },
          { email: { contains: query } },
          { insuranceCardNumber: { contains: query } },
        ],
      };
    }

    const patients = await prisma.patient.findMany(baseObject);
    return res.json({ data: exclude(patients, ['updatedAt', 'deletedAt']), count: countPatients });
  } catch (_) {
    return res.status(400).json({ error: 'INVALID_FIELDS' });
  }
};

export const GetPatient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const patient = await prisma.patient.findFirst({
      where: { id, deletedAt: null },
      include: { phones: true },
    });
    if (!patient) {
      return res.status(400).json({ error: 'PATIENT_NOT_FOUND' });
    }
    return res.json({ data: exclude(patient, ['updatedAt', 'deletedAt']) });
  } catch (_) {
    return res.status(400).json({ error: 'INVALID_FIELDS' });
  }
};

export const UpdatePatient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId, ...args } = req.body;
    delete args.user;
    const patient = await prisma.patient.findFirst({ where: { id, deletedAt: null } });
    if (!patient) {
      return res.status(400).json({ error: 'PATIENT_NOT_FOUND' });
    }
    await prisma.patient.updateWithLog(userId, id, {
      where: { id },
      data: args,
    });
    return res.json({ data: 'PATIENT_UPDATED' });
  } catch (_) {
    return res.status(400).json({ error: 'INVALID_FIELDS' });
  }
}

export const DeletePatient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    await prisma.patient.softDelete(id, userId);
    return res.json({ data: 'PATIENT_DELETED' });
  } catch (_) {
    return res.status(400).json({ error: 'INVALID_FIELDS' });
  }
}
