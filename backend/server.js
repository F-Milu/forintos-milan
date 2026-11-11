import express from "express";
import mysql from "mysql2";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DBPORT 
})

app.get('/', (req, res ) => {
    res.status(200).json({message: 'Működik'});
});


//1
app.get('/szolgaltatasok', (req, res) => {
    pool.query('SELECT kategoriak.nev, szolgaltatasok.megnevezes, szolgaltatasok.id, szolgaltatasok.alapar, szolgaltatasok.aktiv, szolgaltatasok.munkaido_perc FROM szolgaltatasok INNER JOIN kategoriak ON szolgaltatasok.kategoria_id WHERE kategoriak.id =szolgaltatasok.kategoria_id ORDER BY szolgaltatasok.alapar', (err, result) => {
        if (err) res.status(500).json ({hiba: err});

        res.status(200).json(result);
    })
});


//2
app.get('/szolgaltatasok/elerheto', (req, res) => {
    pool.query('SELECT kategoriak.nev, szolgaltatasok.megnevezes, szolgaltatasok.id, szolgaltatasok.alapar, szolgaltatasok.aktiv, szolgaltatasok.munkaido_perc FROM szolgaltatasok INNER JOIN kategoriak ON szolgaltatasok.kategoria_id WHERE kategoriak.id =szolgaltatasok.kategoria_id && szolgaltatasok.munkaido_perc<=60 ', (err, result) => {
        if (err) res.status(500).json ({hiba: err});

        res.status(200).json(result);
    })
});


//3
app.get('/szolgaltatasok/kereses:szoveg', (req, res) => {
    pool.query('SELECT kategoriak.nev, szolgaltatasok.megnevezes, szolgaltatasok.id, szolgaltatasok.alapar, szolgaltatasok.aktiv, szolgaltatasok.munkaido_perc FROM szolgaltatasok INNER JOIN kategoriak ON szolgaltatasok.kategoria_id WHERE kategoriak.id =szolgaltatasok.kategoria_id && szolgaltatasok.munkaido_perc<=60 ', (err, result) => {
        if (err) res.status(500).json ({hiba: err});

        res.status(200).json(result);
    })
});


//4
app.get('/kategoriak/statisztika', (req, res) => {
    pool.query('SELECT kategoriak.nev, COUNT(szolgaltatasok.id) AS "szolgaltatasok_szama", AVG(szolgaltatasok.alapar) AS "atlagos_alapar" FROM szolgaltatasok INNER JOIN kategoriak ON szolgaltatasok.kategoria_id WHERE kategoriak.id =szolgaltatasok.kategoria_id GROUP BY kategoriak.nev', (err, result) => {
        if (err) res.status(500).json ({hiba: err});

        res.status(200).json(result);
    })
});


//5
app.get('/szolgaltatasok/dragak', (req, res) => {
    pool.query('SELECT szolgaltatasok.megnevezes, szolgaltatasok.alapar, szolgaltatasok.munkaido_perc FROM szolgaltatasok WHERE szolgaltatasok.alapar>= 25000 ORDER BY szolgaltatasok.munkaido_perc DESC', (err, result) => {
        if (err) res.status(500).json ({hiba: err});

        res.status(200).json(result);
    })
});


app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`);
});

