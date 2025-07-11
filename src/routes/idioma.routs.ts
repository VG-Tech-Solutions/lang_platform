// src/routes/langNativeRoutes.ts
import { Router } from 'express';
import { LangNativeController } from '../controllers/idiomaController';

const router = Router();
const langNativeController = new LangNativeController();

router.get('/', langNativeController.getAllLangNatives);
router.get('/lang',langNativeController.getAvailableLanguagesToLearn);
router.put("/",langNativeController.updateLangNative)




export default router;