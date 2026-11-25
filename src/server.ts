import express from 'express';
import path from 'path';

const __dirname = import.meta.dirname;
const __filename = import.meta.filename; // Si también necesitas el archivo


export const app = express();

app.get('/health', (req, res) => {
  res.status(200).json({
    message: 'Server up an running',
    service: 'Habit Tracker API',
    status: 'OK',
    timestamp: new Date().toISOString(),
  })
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
})

app.post('/cake', (req, res) => {
  res.status(201).json({
    message: 'Item created',
    service: 'Habit Cake Service',
    status: 'OK',
    timestamp: new Date().toISOString(),
  })
});

export default app;