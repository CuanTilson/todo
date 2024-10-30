import express from 'express';
import cors from 'cors';
import { pool } from './helper/db.js';

const port = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    pool.query('SELECT * FROM task', (error, result) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(200).json(result.rows);
    });
});

app.post('/create', (req, res) => {
    pool.query(
        'INSERT INTO task (description) VALUES ($1) RETURNING *',
        [req.body.description],
        (error, result) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            return res.status(200).json({ id: result.rows[0].id });
        }
    );
});

app.delete('/delete/:id', (req, res) => {
    const id = parseInt(req.params.id);

    pool.query(
        'DELETE FROM task WHERE id = $1',
        [id],
        (error, result) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            return res.status(200).json({ id: id });
        }
    );
});



app.listen(port);