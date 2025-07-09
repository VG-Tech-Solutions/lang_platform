import { Router } from 'express';
import userRoutes from './user.routes';
import authRoutes from './auth.routs';
import languageRoutes from './idioma.routs'
const routes = Router();

routes.use('/users', userRoutes);
routes.use('/auth', authRoutes);
routes.use('/lang/native',languageRoutes)

export default routes;
