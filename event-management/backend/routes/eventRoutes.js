import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import Event from '../models/Event.js'; 
import { getEvents } from '../controllers/eventController.js';

const router = express.Router();


router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, date,location } = req.body;

    const newEvent = new Event({
      title,
      description,
      date,
      location,
      user: req.user.userId  
    });

    await newEvent.save();
    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ message: 'Server error while creating event' });
  }
});




router.get("/:id/attendees", authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("attendees", "name email");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ attendees: event.attendees });
  } catch (err) {
    console.error("Error fetching attendees:", err);
    res.status(500).json({ message: "Server error while fetching attendees" });
  }
});



router.post("/:id/register", authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ message: "Event not found" });

    
    if (String(event.user) === req.user.userId) {
      return res.status(400).json({ message: "You cannot register for your own event." });
    }

   
    if (event.attendees.includes(req.user.userId)) {
      return res.status(400).json({ message: "Already registered." });
    }


    event.attendees.push(req.user.userId);
    await event.save();

    res.json({ message: "Successfully registered." });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Error registering for event." });
  }
});

router.get("/", authMiddleware, getEvents);


export default router;
