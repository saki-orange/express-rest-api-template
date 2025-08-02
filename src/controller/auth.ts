import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";

import passport from "../config/passport";
import { prisma } from "../db/prisma";
import { registerRequestSchema } from "../schema/auth";
import { createErrorResponse, createSuccessResponse } from "../helper/response";

export const registUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body as z.infer<typeof registerRequestSchema>;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (user) {
      res.status(400).json(createErrorResponse("User already exists"));
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json();
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json(createErrorResponse("Internal server error"));
  }
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", (err: Error | null, user: Express.User | false, info: { message: string }) => {
    if (err) {
      console.error("Login error:", err);
      return res.status(500).json(createErrorResponse("Internal server error"));
    }
    if (!user) {
      // 認証失敗
      return res.status(401).json(createErrorResponse(info.message || "Invalid credentials"));
    }

    // 認証成功
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        console.error("Login error:", loginErr);
        return res.status(500).json(createErrorResponse("Internal server error"));
      }
      return res.status(200).json(
        createSuccessResponse("Login successful", {
          user: { id: user.id, email: user.email },
        }),
      );
    });
  })(req, res, next);
};

export const logout = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json(createErrorResponse("Internal server error"));
    }
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destroy error:", err);
        return res.status(500).json(createErrorResponse("Internal server error"));
      }
      res.clearCookie("connect.sid"); // セッションIDのクッキーを削除
      res.status(200).json(createSuccessResponse("Logout successful"));
    });
  });
};
