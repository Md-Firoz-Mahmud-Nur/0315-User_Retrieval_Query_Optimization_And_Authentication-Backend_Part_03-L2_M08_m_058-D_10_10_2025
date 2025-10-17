import express, { NextFunction, Request, Response } from "express";
import { fileUploader } from "../../helper/fileUploader";
import { UserController } from "./user.controller";
import { userValidation } from "./user.validation";

const router = express.Router();

router.post(
  "/create-patient",

  fileUploader.upload.single("file"),

  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createPatientValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    return UserController.createPatient(req, res, next);
  }
);

export const userRoutes = router;
