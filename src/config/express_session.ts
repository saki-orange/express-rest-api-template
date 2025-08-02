import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";

import { SESSION_SECRET } from ".";
import { prisma } from "../db/prisma";

export const expressSession = session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  },
  // DB session store
  store: new PrismaSessionStore(prisma, {
    checkPeriod: 2 * 60 * 1000,
    dbRecordIdIsSessionId: undefined,
    dbRecordIdFunction: undefined,
  }),
});
