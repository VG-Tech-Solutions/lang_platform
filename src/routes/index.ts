import { Router } from 'express';
import userRoutes from './user.routes';
import authRoutes from './auth.routs';
import languageRoutes from './idioma.routs'
import campanha from './campanha.routs'
import eventRoutes from './event.routs';
const routes = Router();

routes.use('/users', userRoutes);
routes.use('/auth', authRoutes);
routes.use('/lang/native',languageRoutes)

routes.use('/campanha', campanha);
routes.use('/events', eventRoutes);


export default routes;
