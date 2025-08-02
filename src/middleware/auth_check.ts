import { Request, Response, NextFunction } from "express";
import { createErrorResponse } from "../helper/response";

export const checkAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json(createErrorResponse("Unauthorized access"));
};
