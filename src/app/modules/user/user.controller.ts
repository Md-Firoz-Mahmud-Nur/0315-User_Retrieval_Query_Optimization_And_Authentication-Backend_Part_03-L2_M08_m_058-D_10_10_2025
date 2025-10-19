import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { UserService } from "./user.service";

const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createPatient(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Patient created successfully!",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const { limit, page, search, sortBy, sortOrder, role, status } = req.query;

  const result = await UserService.getAllFromDB({
    limit: Number(limit),
    page: Number(page),
    search,
    sortBy,
    sortOrder,
    role,
    status,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User retrieved successfully!",
    data: result,
  });
});

export const UserController = {
  createPatient,
  getAllFromDB,
};
