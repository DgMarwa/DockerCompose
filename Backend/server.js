const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Configuration de la connexion MySQL
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'marwadegachi12*',
    database: process.env.DB_NAME || 'formulaire_db',
    connectTimeout: 20000 // 20 secondes
};

let db;

// Fonction pour établir la connexion avec tentatives
function connectWithRetry() {
    console.log('Tentative de connexion à MySQL...');
    db = mysql.createConnection(dbConfig);

    db.connect((err) => {
        if (err) {
            console.error('Erreur de connexion à MySQL :', err);
            console.log('Nouvelle tentative dans 5 secondes...');
            setTimeout(connectWithRetry, 5000);
        } else {
            console.log('Connecté à MySQL');
        }
    });

    // Gérer les erreurs de connexion ultérieures
    db.on('error', (err) => {
        console.error('Erreur MySQL :', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('Tentative de reconnexion...');
            connectWithRetry();
        } else {
            throw err;
        }
    });
}

// Démarrer la connexion
connectWithRetry();

// Route POST
app.post('/api/contact', (req, res) => {
    const { id, nom, poste } = req.body;

    if (!id || !nom || !poste) {
        return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    const query = 'INSERT INTO contacts (identifiant, nom, poste) VALUES (?, ?, ?)';
    db.execute(query, [id, nom, poste], (err, results) => {
        if (err) {
            console.error('Erreur lors de l\'insertion :', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        res.status(201).json({ message: 'Données insérées avec succès', id: results.insertId });
    });
});

app.listen(port, () => {
    console.log(`Serveur backend démarré sur le port ${port}`);
});