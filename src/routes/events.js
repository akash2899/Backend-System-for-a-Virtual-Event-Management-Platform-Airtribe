import express from "express";
import { events } from "../data/store.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// CREATE EVENT
router.post("/events", authMiddleware, (req, res) => {
  try {
    // only organizer can create
    if (req.user.role !== "organizer") {
      return res.status(403).json({ message: "Only organizers can create events" });
    }

    const { title, date, time, description } = req.body;

    const newEvent = {
      id: Date.now(),
      title,
      date,
      time,
      description,
      participants: []
    };

    events.push(newEvent);

    res.json({ message: "Event created", event: newEvent });
  } catch (error) {
    res.status(500).json({ message: "Error creating event" });
  }
});

// REGISTER FOR EVENT
router.post("/events/:id/register", authMiddleware, (req, res) => {
  try {
    const eventId = parseInt(req.params.id);

    const event = events.find(e => e.id === eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // prevent duplicate registration
    if (event.participants.includes(req.user.id)) {
      return res.status(400).json({ message: "Already registered" });
    }

    event.participants.push(req.user.id);

    res.json({ message: "Registered successfully", event });
  } catch (error) {
    res.status(500).json({ message: "Error registering for event" });
  }
});
// GET ALL EVENTS
router.get("/events", authMiddleware, (req, res) => {
  try {
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events" });
  }
});
// UPDATE EVENT
router.put("/events/:id", authMiddleware, (req, res) => {
  try {
    if (req.user.role !== "organizer") {
      return res.status(403).json({ message: "Only organizers can update events" });
    }

    const eventId = parseInt(req.params.id);
    const event = events.find(e => e.id === eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const { title, date, time, description } = req.body;

    if (title) event.title = title;
    if (date) event.date = date;
    if (time) event.time = time;
    if (description) event.description = description;

    res.json({ message: "Event updated", event });
  } catch (error) {
    res.status(500).json({ message: "Error updating event" });
  }
});
// DELETE EVENT
router.delete("/events/:id", authMiddleware, (req, res) => {
  try {
    if (req.user.role !== "organizer") {
      return res.status(403).json({ message: "Only organizers can delete events" });
    }

    const eventId = parseInt(req.params.id);
    const index = events.findIndex(e => e.id === eventId);

    if (index === -1) {
      return res.status(404).json({ message: "Event not found" });
    }

    events.splice(index, 1);

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event" });
  }
});

export default router;