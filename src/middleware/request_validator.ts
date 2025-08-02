import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { createErrorResponse } from "../helper/response";

export const requestValidator = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json(
        createErrorResponse(
          "Validation error",
          result.error.errors.map((err) => {
            return { path: err.path, message: err.message };
          }),
        ),
      );
      return;
    }
    req.body = result.data;
    next();
  };
};
