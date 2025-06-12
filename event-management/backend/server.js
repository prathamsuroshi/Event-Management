import express, { json } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import { config } from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import protectedRoutes from './routes/protected.js'
import eventRoutes from './routes/eventRoutes.js'; 


config();

const app = express();
const allowedOrigins = [
  'https://event-management-2n7i8tg8w-pratham-suroshis-projects.vercel.app',
  'https://event-management-jlhuzjeas-pratham-suroshis-projects.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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
