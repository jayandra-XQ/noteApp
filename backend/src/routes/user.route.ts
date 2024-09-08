import express from "express";
import { getAutheticatedUser, login, logout, signUp } from "../controllers/user.controller";
import { requiresAuth } from "../middleware/auth";

const router = express.Router();

router.get('/',requiresAuth, getAutheticatedUser)

router.post('/signup', signUp);
router.post('/login', login);

router.post('/logout', logout)

export default router;