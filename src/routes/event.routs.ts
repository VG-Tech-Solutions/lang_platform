import { Router } from 'express';
import { EventController } from '../controllers/eventController';

const router = Router();

// CRUD de eventos


router.post("/",async (req, res) => {
    await EventController.createEvent(req, res);
    });


router.post("/bacth", async (req, res) => {
    await EventController.createEventsBatch(req, res);
});
router.get('/', EventController.getEvents);
router.get('/stats', EventController.getEventStats);
router.get('/session/:sessionId', EventController.getEventsBySession);
router.get('/:id', EventController.getEventById);







router.post("/track", async (req, res) => {
    await EventController.trackEvent(req, res);
});

router.post("/funel", async (req, res) => {
    await EventController.getConversionFunnel(req, res);
});
router.delete('/cleanup', EventController.deleteOldEvents);


export default router;