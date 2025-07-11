import { Router } from 'express';
import { UserController } from '../controllers/UserController'; 

const router = Router();
const userController = new UserController(); 


router.get('/', async (req, res) => {
  await userController.loginWithGoogle(req, res);
});

router.post('/', async (req, res) => {
  await userController.createUser(req, res);
});

export default router;