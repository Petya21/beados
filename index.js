import express from "express";
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'telefonok',
}).promise();

app.get('/telefonok', async (req, res) => {
    try {
        const [rows, fields] = await db.query('SELECT id, marka, szin, tarhely FROM telefonok');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Adatbázis hiba történt' });
    }
});

app.get('/telefonok/:telefonID', async (req, res) => {
    try {
        let telefonID = parseInt(req.params.telefonID);
        const [rows, fields] = await db.query('SELECT id, marka, szin, tarhely FROM telefonok WHERE id = ?', [telefonID]);
        if (rows.length == 1) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ error: 'Nincs ilyen telefon!' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Adatbázis hiba történt' });
    }
});

app.post('/telefonok', async (req, res) => {
    try {
        let telefonAdatai = [req.body.marka, req.body.szin, req.body.tarhely];
        await db.query('INSERT INTO telefonok(marka, szin, tarhely) VALUES (?, ?, ?)', telefonAdatai);
        res.status(201).json({ message: 'Sikeres a telefon felvétele!' });
    } catch (error) {
        res.status(500).json({ error: 'Adatbázis hiba történt' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
