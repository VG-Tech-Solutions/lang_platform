import { Router } from 'express';
import userRoutes from './user.routes';
import authRoutes from './auth.routs';
const routes = Router();

routes.use('/users', userRoutes);
routes.use('/auth', authRoutes);

export default routes;
