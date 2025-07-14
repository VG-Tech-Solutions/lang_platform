import { Router } from 'express';
import lessonController from '../controllers/lessonController';
import { validateLanguages, validateLessonId } from '../middleware/validation';

const router = Router();

// Retorna todas as lições traduzidas
router.get('/', validateLanguages, lessonController.getAllLessons);

// Retorna tipos de conteúdo disponíveis
router.get('/:id/types', validateLessonId, validateLanguages, lessonController.getLessonTypes);

// Retorna conteúdo da lição
router.get('/:id/content', validateLessonId, validateLanguages, lessonController.getLessonContent);

export default router;