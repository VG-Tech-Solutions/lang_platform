import { Router } from 'express';
import { UserController } from '../controllers/UserController'; 
import { authMiddleware } from '../config/midlleware/user_authOp'; 

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

router.put("/:id", authMiddleware, (req, res)=>{
   userController.updateUser(req, res);
})

router.patch("/:email", authMiddleware, (req, res)=>{
  userController.updateEmail(req, res);
});





router.get('/security-question',authMiddleware, async (req, res) => {
  await userController.getSecurityQuestion(req, res);
});

/**
 * Redefine a senha usando pergunta de segurança
 * Ex: POST /users/security-question/reset-password
 */
router.post('/security-question/reset-password', authMiddleware, async (req, res) => {
  await userController.resetPassword(req, res);
});

/**
 * Configura pergunta de segurança para usuário logado
 * Ex: POST /users/security-question/setup
 */
router.post('/security-question/setup', authMiddleware, async (req, res) => {
  await userController.setSecurityQuestion(req, res);
});

/**
 * Verifica se o usuário autenticado já configurou uma pergunta de segurança
 * Ex: GET /users/security-question/has
 */
router.get('/security-question/has', authMiddleware, async (req, res) => {
  await userController.hasSecurityQuestion(req, res);
});

router.get('/security-question', authMiddleware, async (req, res) => {
  await userController.getSecurityQuestionByEmail(req, res);
});

export default router;