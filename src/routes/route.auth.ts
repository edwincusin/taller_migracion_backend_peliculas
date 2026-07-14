import { Router } from "express";
import { login } from "../controllers/auth.controller.js";

export const routerLogin=Router();

routerLogin.post("/login",login)


