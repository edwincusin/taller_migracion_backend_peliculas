import { Router } from "express";
import { login, logout } from "../controllers/auth.controller.js";

export const routerLogin=Router();

routerLogin.post("/login",login)
routerLogin.post("/logout",logout)


