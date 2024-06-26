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
      where: {
        OR: [{ document }, { email }],
      },
    });
    if (patientExists && !patientExists.deletedAt) {
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
      return res
        .status(400)
        .json({ error: 'INVALID_PHONE', phones: Array.from(wrongPhones) });
    }
    if (patientExists?.deletedAt) {
      await prisma.patient.updateWithLog(req.body.userId, patientExists.id, {
        where: { id: patientExists.id },
        data: {
          name,
          email: email.toLowerCase(),
          birthdate,
          gender,
          insuranceCardNumber,
          phones: { create: phones.map((phone: string) => ({ phone })) },
          deletedAt: null,
        },
      });
      return res.json({ data: 'PATIENT_UPDATED' });
    }

    await prisma.patient.create({
      data: {
        name,
        document,
        email,
        createdById: req.body.userId,
        birthdate,
        gender,
        insuranceCardNumber,
        phones: { create: phones.map((phone: string) => ({ phone })) },
      },
    });

    return res.status(201).json({ data: 'PATIENT_CREATED' });
  } catch (_) {
    return res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
};

export const ListPatients = async (req: Request, res: Response) => {
  try {
    const { limit, offset, q } = req.query;
    const countPatients: number = await prisma.patient.count({
      where: {
        deletedAt: null,
      },
    });
    const baseObject: Prisma.PatientFindManyArgs = {
      where: { deletedAt: null },
      include: { phones: { where: { deletedAt: null } } },
      take: limit as unknown as number,
      skip: offset as unknown as number,
      orderBy: { createdAt: 'desc' },
    };

    if (q) {
      const query = q as string;
      baseObject.where = {
        ...baseObject.where,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { document: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { insuranceCardNumber: { contains: query, mode: 'insensitive' } },
        ],
      };
    }

    const patients = await prisma.patient.findMany(baseObject);
    return res.json({
      data: exclude(patients, ['updatedAt', 'deletedAt', 'createdById']),
      count: countPatients,
    });
  } catch (_) {
    return res.status(500).json({ error: 'INTERNAL_ERROR' });
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
    return res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
};

export const UpdatePatient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId, ...args } = req.body;
    delete args.user;

    const patient = await prisma.patient.findFirst({
      where: { id, deletedAt: null },
    });
    if (!patient) {
      return res.status(400).json({ error: 'PATIENT_NOT_FOUND' });
    }
    const phones = args.phones;
    delete args.phones;
    await prisma.$transaction(async (trx) => {
      await trx.patient.updateWithLog(userId, id, {
        where: { id },
        data: args,
      });
      if (phones?.length) {
        phones.forEach(async (phone: {
          id: string;
          phone: string;
        }) => {
          await trx.contactPatient.updateWithLog(userId, phone.id, {
            where: { id: phone.id },
            data: { phone: phone.phone },
          });
        });
      }
    });
    return res.json({ data: 'PATIENT_UPDATED' });
  } catch (_) {
    return res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
};

export const DeletePatient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    await prisma.patient.softDelete(id, userId);
    return res.json({ data: 'PATIENT_DELETED' });
  } catch (_) {
    return res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
};
