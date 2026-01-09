const db = require('../config/db');

const EventModel = {
    create: async (event) => {
        const sql = 'INSERT INTO events (title, start_time, end_time, description) VALUES (?, ?, ?, ?)';
        const [result] = await db.execute(sql, [event.title, event.start_time, event.end_time, event.description]);
        return result.insertId;
    },

    findAll: async () => {
        const [rows] = await db.query('SELECT * FROM events ORDER BY start_time ASC');
        return rows;
    },

    findById: async (id) => {
        const [rows] = await db.execute('SELECT * FROM events WHERE id = ?', [id]);
        return rows[0];
    },

    update: async (id, event) => {
        const sql = 'UPDATE events SET title=?, start_time=?, end_time=?, description=? WHERE id=?';
        const [result] = await db.execute(sql, [event.title, event.start_time, event.end_time, event.description, id]);
        return result.affectedRows;
    },

    delete: async (id) => {
        const [result] = await db.execute('DELETE FROM events WHERE id=?', [id]);
        return result.affectedRows;
    }
};

module.exports = EventModel;