import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import morgan from 'morgan';
import { corsConfig } from './config/cors';
import { connectDB } from './config/db';
import projectRoutes from './routes/projectRoutes'

// Usar variables de entorno
dotenv.config()

connectDB();

const app = express();
app.use(cors(corsConfig));
// Habilitar lectura del body

// Loggin de peticiones 
app.use(morgan('dev'))

app.use(express.json());

// Routes

app.use('/api/projects', projectRoutes)



export default app;