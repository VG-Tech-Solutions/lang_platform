import { Router } from 'express';
import { loginController } from '../auth/login';


const router = Router();

router.post('/', loginController.login);


export default router;
