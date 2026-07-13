import { Router } from "express";

import { authenticate } from "../../middleware/authenticate.middleware.js";
import {
  getMe,
  postLogin,
  postLogout,
  postRefresh,
} from "./auth.controller.js";

export const authRouter = Router();

authRouter.post("/login", postLogin);
authRouter.post("/refresh", postRefresh);
authRouter.post("/logout", authenticate, postLogout);
authRouter.get("/me", authenticate, getMe);
