# Application 3-tiers : Formulaire de contact avec React, Node.js et MySQL

Ce projet met en place une application **3-tiers** complète avec :
- **Frontend** : React (servi par Nginx)
- **Backend** : API Node.js/Express
- **Base de données** : MySQL

L'ensemble est conteneurisé avec **Docker Compose** et utilise deux réseaux isolés :
- `frontend-net` : relie le frontend et le backend
- `backend-net` : relie le backend et la base de données

## 🏗️ Architecture

```
[ Navigateur ] ←→ [ Frontend (Nginx) ] ←→ [ Backend (Node.js) ] ←→ [ MySQL ]
                        ⬆️                         ⬆️
                    frontend-net               backend-net
```

## 🛠️ Technologies utilisées

- **Frontend** : React, Nginx
- **Backend** : Node.js, Express, mysql2, cors, body-parser
- **Base de données** : MySQL 8.0
- **Orchestration** : Docker, Docker Compose

## 📁 Structure du projet

```
Docker-compose/
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js
│   └── (autres fichiers éventuels)
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── public/
│   └── src/
│       ├── Frontend/
│       │   └── Formulaire.js
│       ├── App.js
│       └── index.js
├── docker-compose.yml
└── init.sql (optionnel, pour initialiser la BDD)
```

## ✅ Prérequis

- **Docker** (version 20.10 ou supérieure)
- **Docker Compose** (version 2.x ou intégré à Docker)

Vérifiez vos installations :
```bash
docker --version
docker-compose --version
```

## 🚀 Lancer l'application

1. **Clonez ou placez-vous** dans le dossier contenant le `docker-compose.yml`.

2. **Construisez et démarrez les conteneurs** :
   ```bash
   docker-compose up -d --build
   ```

   Cette commande va :
   - Créer les images Docker pour le frontend et le backend
   - Télécharger l'image MySQL si nécessaire
   - Créer les réseaux `frontend-net` et `backend-net`
   - Démarrer les conteneurs `db`, `backend`, `frontend`

3. **Vérifiez que tous les conteneurs sont bien démarrés** :
   ```bash
   docker-compose ps
   ```

   Vous devriez voir les trois services avec l'état `Up`.

## 🌐 Accès aux services

- **Frontend** : [http://localhost:3000](http://localhost:3000)
- **Backend (API)** : accessible uniquement via le réseau interne (pas exposé sur l'hôte)
- **Base de données** : accessible uniquement depuis le backend (non exposée)

## 📝 Utilisation

1. Ouvrez votre navigateur à l'adresse `http://localhost:3000`.
2. Remplissez les champs **ID**, **Nom**, **Poste**.
3. Cliquez sur le bouton **Continuer**.
4. Une alerte confirme l'envoi des données.
5. Vérifiez les données en base :
   ```bash
   docker exec -it mysql_db mysql -u user -p
   ```
   Mot de passe : `userpassword` (défini dans `docker-compose.yml`)
   ```sql
   USE formulaire_db;
   SELECT * FROM contacts;
   ```

## ⚙️ Configuration

### Variables d'environnement

Les paramètres sont définis dans `docker-compose.yml` :

- **MySQL** :
  - `MYSQL_ROOT_PASSWORD` : mot de passe root
  - `MYSQL_DATABASE` : nom de la base
  - `MYSQL_USER` / `MYSQL_PASSWORD` : utilisateur applicatif

- **Backend** :
  - `DB_HOST` : nom du service MySQL (`db`)
  - `DB_USER`, `DB_PASSWORD`, `DB_NAME` : identifiants de connexion

### Initialisation de la base de données

Si vous placez un fichier `init.sql` dans le même dossier que `docker-compose.yml`, il sera automatiquement exécuté lors de la première création du conteneur MySQL. Exemple de contenu :

```sql
USE formulaire_db;
CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    identifiant VARCHAR(50) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    poste VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🛑 Arrêt et nettoyage

- **Arrêter les conteneurs** (sans les supprimer) :
  ```bash
  docker-compose stop
  ```

- **Arrêter et supprimer les conteneurs** :
  ```bash
  docker-compose down
  ```

- **Supprimer également les volumes (données)** :
  ```bash
  docker-compose down -v
  ```



ports:
  - "3001:80"   # utilise le port 3001 de l'hôte
```

