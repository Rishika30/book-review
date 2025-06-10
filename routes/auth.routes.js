import { Router } from 'express';
import { signUp, logIn } from '../controllers/auth.controller.js';
import { validateRequest, signupSchema, loginSchema } from '../middleware/validator.js';
const authRouter = Router();

authRouter.post('/signup', validateRequest(signupSchema), signUp);
authRouter.post('/login', validateRequest(loginSchema), logIn);

export default authRouter;