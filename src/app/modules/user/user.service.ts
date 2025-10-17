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

const getAllFromDB = async ({
  limit,
  page,
}: {
  limit: number;
  page: number;
}) => {
  const skip = (page - 1) * limit;
  const take = limit;
  const result = await prisma.user.findMany({
    skip,
    take,
  });
  return result;
};

export const UserService = {
  createPatient,
  getAllFromDB,
};
