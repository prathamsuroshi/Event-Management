import Event from '../models/Event.js';

export const createEvent = async (req, res) => {
  try {
    const { title, description, date,location } = req.body;

    const newEvent = new Event({
      title,
      description,
      date,
      location,
      createdBy: req.userId,
    });

    await newEvent.save();
    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create event' });
  }
};



export const getEvents = async (req, res) => {
  try {
    const search = req.query.search || "";
    const location = req.query.location || "";
    const date = req.query.date;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const filter = {
      title: { $regex: search, $options: "i" },
      date: { $gte: new Date() }
    };

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    
    
    if (date) {
        filter.date = {
            $gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
            $lt: new Date(new Date(date).setHours(23, 59, 59, 999)),
        };
    }
    
    const skip = (page - 1) * limit;
    
    const [events, total] = await Promise.all([
      Event.find(filter).sort({ date: 1 }).skip(skip).limit(limit),
      Event.countDocuments(filter)
    ]);
    

    res.json({
      events,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalEvents: total,
    });
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ message: "Server error" });
  }
};





export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 }).populate("user", "name");
    res.status(200).json({ events });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};
