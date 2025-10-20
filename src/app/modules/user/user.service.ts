import bcrypt from "bcryptjs";
import { Request } from "express";
import { fileUploader } from "../../helper/fileUploader";
import { prisma } from "../../shared/prisma";

const createPatient = async (req: Request) => {
  if (req.file) {
    const uploadResult = await fileUploader.uploadToCloudinary(req.file);
    console.log("uploadResult", uploadResult);
    req.body.patient.profilePhoto = uploadResult?.secure_url;
  }

  const hashPassword = await bcrypt.hash(req.body.password, 10);

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: req.body.patient.email,
        password: hashPassword,
      },
    });

    return await tnx.patient.create({
      data: req.body.patient,
    });
  });

  return result;
};

const getAllFromDB = async (params: any,options: any) => {
  const pageNumber = options.page || 1;
  const limitNumber = options.limit || 10;

  const skip = (pageNumber - 1) * limitNumber;
  const take = limitNumber;

  const result = await prisma.user.findMany({
    skip,
    take,

    where: {
      email: {
        contains: search,
        mode: "insensitive",
      },
      role: role,
      status: status,
    },

    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });
  return result;
};

export const UserService = {
  createPatient,
  getAllFromDB,
};
