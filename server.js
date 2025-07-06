const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const movieRoutes = require('./routes/movieRoutes');


const cors = require('cors');
dotenv.config();
connectDB();

const app = express();
app.use(express.json()); // to accept JSON body
app.use(cors({
  origin: 'https://bongovia.netlify.app/',
  credentials: true,
}));
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);


app.use('/uploads', express.static('uploads'));

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
