const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

// Event Schema
const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  price: Number,
  date: String,
  location: String,
  imageUrl: String
});

const Event = mongoose.model('Event', eventSchema);

// API Routes
app.get('/api/events', async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

app.post('/api/events', async (req, res) => {
  const newEvent = new Event(req.body);
  await newEvent.save();
  res.status(201).json(newEvent);
});

app.listen(5000, () => console.log('Server running on port 5000'));