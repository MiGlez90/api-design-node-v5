import express from 'express';
import path from 'path';
import authRoutes from './routes/authRoutes.ts';
import habitRoutes from './routes/habitRoutes.ts';
import userRoutes from './routes/userRoutes.ts';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { ENVS } from '../constants.ts';
import { getIsTest } from '../env.ts';
import { authenticateToken } from './middlewares/auth.ts';
import { errorHandler } from './middlewares/errorHandler.ts';

export const __dirname = import.meta.dirname;
export const __filename = import.meta.filename;

export const app = express();
// global middlewares
// Will inject basic security
app.use(helmet());
// Will allow multiple origin to consume this api
app.use(cors());
// Will parse the body and convert it to js object
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  morgan(ENVS.DEV, {
    skip: () => getIsTest(),
  })
);

app.get('/health', (req, res) => {
  res.status(200).json({
    message: 'Server up an running',
    service: 'Habit Tracker API',
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/cake', (req, res) => {
  res.status(201).json({
    message: 'Item created',
    service: 'Habit Cake Service',
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

// Strategy 1 for routing: based on resources
app.use('/api/auth', authRoutes);
app.use('/api/habits', authenticateToken, habitRoutes);
app.use('/api/users', authenticateToken, userRoutes);

app.use(errorHandler);

export default app;
