import express from "express";

import { registerRequestSchema } from "../schema/auth";
import { requestValidator } from "../middleware/request_validator";
import { login, logout, registUser } from "../controller/auth";
import { checkAuthenticated } from "../middleware/auth_check";

const router = express.Router();

router.post("/register", requestValidator(registerRequestSchema), registUser);

router.post("/login", login);

router.post("/logout", checkAuthenticated, logout);

export default router;
