import express, { json } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import { config } from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import protectedRoutes from './routes/protected.js'
import eventRoutes from './routes/eventRoutes.js'; 


config();

const app = express();
app.use(cors({
  origin: 'https://event-management-jlhuzjeas-pratham-suroshis-projects.vercel.app/', // your actual Vercel frontend URL
  credentials: true
}));

app.use(json());




app.use('/api/auth',authRoutes);
app.use('/api/protected',protectedRoutes)
app.use('/api/events', eventRoutes); 



app.get('/', (req, res) => {
  res.send('Server is running!');
});


connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));


const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
