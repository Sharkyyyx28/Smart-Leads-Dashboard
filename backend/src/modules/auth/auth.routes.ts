import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '../../middleware/validate.middleware';
import { registerSchema, loginSchema } from './auth.validation';
import { protect } from '../../middleware/auth.middleware';

const router = Router();

router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);
router.get('/me', protect, AuthController.getMe);

export const authRoutes = router;
