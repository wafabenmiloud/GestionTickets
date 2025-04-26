const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/tickets');
const cookieParser = require('cookie-parser');

dotenv.config();

app.use(express.json());
app.use(cookieParser());

//clien side origin
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,              
}));

connectDB();

//routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);

app.use('/api/users', authRoutes);

//server
app.listen(process.env.PORT || 5000, () => console.log('Server running'));