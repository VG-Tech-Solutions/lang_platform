import { Router } from 'express';
import { UserController } from '../controllers/UserController'; 
import { authMiddleware } from '../config/midlleware/user_authOp'; // Assuming you have an auth middleware for user authentication
const router = Router();
const userController = new UserController(); 


router.get('/', async (req, res) => {
  await userController.loginWithGoogle(req, res);
});

router.post('/', async (req, res) => {
  await userController.createUser(req, res);
});

router.get('/me',authMiddleware, async (req, res) => {
  await userController.getProfile(req, res);
});



export default router;