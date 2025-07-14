import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';
import lessonRoutes from './routes/lessonRoutes';
dotenv.config();

const app = express();

app.use(express.json());
app.use(routes); 

app.use('/lessons', lessonRoutes)

export default app;
