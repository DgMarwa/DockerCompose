const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Configuration MySQL
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'formulaire_db',
    connectTimeout: 20000
};

let db;

// Fonction de connexion avec tentatives
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

connectWithRetry();

// Route POST pour créer un contact
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

// Route GET pour obtenir tous les contacts
app.get('/api/contacts', (req, res) => {
    const query = 'SELECT * FROM contacts ORDER BY created_at DESC';
    db.execute(query, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération :', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        res.json(results);
    });
});

// Route GET pour obtenir un contact par son ID (auto-incrémenté)
app.get('/api/contacts/:id', (req, res) => {
    const contactId = req.params.id;
    const query = 'SELECT * FROM contacts WHERE id = ?';
    db.execute(query, [contactId], (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération :', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Contact non trouvé' });
        }
        res.json(results[0]);
    });
});

// Route PUT pour mettre à jour un contact
app.put('/api/contacts/:id', (req, res) => {
    const contactId = req.params.id;
    const { id, nom, poste } = req.body;

    if (!id || !nom || !poste) {
        return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    const query = 'UPDATE contacts SET identifiant = ?, nom = ?, poste = ? WHERE id = ?';
    db.execute(query, [id, nom, poste, contactId], (err, results) => {
        if (err) {
            console.error('Erreur lors de la mise à jour :', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Contact non trouvé' });
        }
        res.json({ message: 'Contact mis à jour avec succès' });
    });
});

// Route DELETE pour supprimer un contact
app.delete('/api/contacts/:id', (req, res) => {
    const contactId = req.params.id;
    const query = 'DELETE FROM contacts WHERE id = ?';
    db.execute(query, [contactId], (err, results) => {
        if (err) {
            console.error('Erreur lors de la suppression :', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Contact non trouvé' });
        }
        res.json({ message: 'Contact supprimé avec succès' });
    });
});

// Route racine simple pour éviter l'erreur "Cannot GET /"
app.get('/', (req, res) => {
    res.send('API Backend fonctionnelle. Utilisez /api/contacts pour accéder aux données.');
});

app.listen(port, () => {
    console.log(`Serveur backend démarré sur le port ${port}`);
});