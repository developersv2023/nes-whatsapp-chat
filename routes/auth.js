import express from "express";
import { AuthController } from "../controllers/index.js";
import {mdAuth} from "../middlewares/index.js";

const api=express.Router();

// TODO DEfinifir endpoint
api.post("/auth/register", AuthController.register);
api.post("/auth/login", AuthController.login);
api.post("/auth/refresh_access_token", AuthController.refreshAccessToken);
api.get("/auth/test_md",[mdAuth.asureAuth], (req, res) =>{
res.status(200).send({msg: "todo OK"});
});
export const authRoutes=api;
