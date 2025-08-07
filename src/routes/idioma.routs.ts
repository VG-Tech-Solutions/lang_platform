// src/routes/langNativeRoutes.ts
import { Router } from 'express';
import { LangNativeController } from '../controllers/idiomaController';
import {optionalAuth} from '../config/midlleware/auth_op';

const router = Router();
const langNativeController = new LangNativeController();

router.get('/', langNativeController.getAllLangNatives);
router.get('/lang',langNativeController.getAvailableLanguagesToLearn);
router.put("/",langNativeController.updateLangNative)

router.get('/:id', optionalAuth, langNativeController.getLessonById.bind(langNativeController));


export default router;