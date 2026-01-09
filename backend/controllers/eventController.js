const EventModel = require('../models/eventModel');
const { mergeIntervals } = require('../logic/scheduler');

const EventController = {
    // GET /api/events
    getAllEvents: async (req, res) => {
        try {
            const events = await EventModel.findAll();
            res.json(events);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

   // POST /api/events
    createEvent: async (req, res) => {
        const { title, start_time, end_time, description } = req.body;
        
        // 1. Basic Validation
        if (!title || !start_time || !end_time) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        if (new Date(start_time) >= new Date(end_time)) {
            return res.status(400).json({ error: "Start time must be before end time" });
        }

        try {
            const db = require('../config/db');

            // 2. OVERLAP CHECK
            // We check if the New Event overlaps with ANY existing event.
            // Logic: (ExistingStart < NewEnd) AND (ExistingEnd > NewStart)
            const checkSql = 'SELECT id FROM events WHERE start_time < ? AND end_time > ?';
            
            // Note the order of params: [NewEndTime, NewStartTime]
            const [conflicts] = await db.execute(checkSql, [end_time, start_time]);
            
            if (conflicts.length > 0) {
                return res.status(409).json({ 
                    error: "This time slot overlaps with an existing event! Please choose a different time." 
                });
            }

            // 3. Create Event (Only if no conflicts found)
            const newId = await EventModel.create({ title, start_time, end_time, description: description || '' });
            res.status(201).json({ id: newId, message: "Event created successfully" });

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // PUT /api/events/:id
    updateEvent: async (req, res) => {
        const { title, start_time, end_time, description } = req.body;
        
        if (new Date(start_time) >= new Date(end_time)) {
            return res.status(400).json({ error: "Start time must be before end time" });
        }

        try {
            const affected = await EventModel.update(req.params.id, { title, start_time, end_time, description });
            if (affected === 0) return res.status(404).json({ error: "Event not found" });
            res.json({ message: "Event updated successfully" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // DELETE /api/events/:id
    deleteEvent: async (req, res) => {
        try {
            const affected = await EventModel.delete(req.params.id);
            if (affected === 0) return res.status(404).json({ error: "Event not found" });
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // GET /api/events/merged
    getMergedIntervals: async (req, res) => {
        try {
            const events = await EventModel.findAll();
            // Call the Logic Layer
            const busyBlocks = mergeIntervals(events); 
            res.json(busyBlocks);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

module.exports = EventController;