// src/routes/langNativeRoutes.ts
import { Router } from 'express';
import { LangNativeController } from '../controllers/idiomaController';

const router = Router();
const langNativeController = new LangNativeController();

/**
 * @route GET /api/lang-natives
 * @description Listar todos os idiomas nativos ordenados por native_order
 * @access Public
 */
router.get('/', langNativeController.getAllLangNatives);





export default router;