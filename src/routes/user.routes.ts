import { Router } from 'express';
import UserController from '../controllers/UserController';

const router = Router();

router.get('/', UserController.index as any);
router.post('/', UserController.create as any);

export default router;
