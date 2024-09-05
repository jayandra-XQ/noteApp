import express from "express";
import { getAutheticatedUser, login, logout, signUp } from "../controllers/user.controller";

const router = express.Router();

router.get('/', getAutheticatedUser)

router.post('/signup', signUp);
router.post('/login', login);

router.post('/logout', logout)

export default router;