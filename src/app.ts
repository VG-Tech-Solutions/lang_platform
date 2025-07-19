import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';
import lessonRoutes from './routes/lessonRoutes';
import antiTranslationHeaders from './config/translater';
import cors from 'cors'
dotenv.config();

const app = express();

app.use(express.json());
app.use(routes); 

app.use('/lessons', lessonRoutes)
app.use(cors())
app.use(antiTranslationHeaders)


export default app;
