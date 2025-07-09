// src/routes/langNativeRoutes.ts
import { Router } from 'express';
import { LangNativeController } from '../controllers/idiomaController';

const router = Router();
const langNativeController = new LangNativeController();

router.get('/lang/native', langNativeController.getAllLangNatives);





export default router;