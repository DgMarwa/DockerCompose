# Application 3-tiers : Formulaire de contact avec React, Node.js et MySQL

Ce projet met en place une application **3-tiers** complète avec :
- **Frontend** : React (servi par Nginx)
- **Backend** : API Node.js/Express
- **Base de données** : MySQL

L'ensemble est conteneurisé avec **Docker Compose** et déployable sur **K3s (Kubernetes léger)**.

---

## 🏗️ Architecture
[ Navigateur ] ←→ [ Frontend (Nginx) ] ←→ [ Backend (Node.js) ] ←→ [ MySQL ]
⬆️                         ⬆️
frontend-net               backend-net

---

## 🛠️ Technologies utilisées

- **Frontend** : React, Nginx
- **Backend** : Node.js, Express, mysql2, cors, body-parser
- **Base de données** : MySQL 8.0
- **Conteneurisation** : Docker, Docker Compose
- **Orchestration** : K3s (Kubernetes)

---

## 📁 Structure du projet
Docker-compose/
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
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
├── k3s/
│   ├── namespace.yaml
│   ├── secret.yaml
│   ├── ingress.yaml
│   ├── mysql/
│   │   ├── pvc.yaml
│   │   ├── configmap.yaml
│   │   └── deployment.yaml
│   ├── backend/
│   │   └── deployment.yaml
│   └── frontend/
│       └── deployment.yaml
├── docker-compose.yml
└── init.sql

---

## ✅ Prérequis

- **Docker** (version 20.10 ou supérieure)
- **Docker Compose** (version 2.x ou intégré à Docker)

Vérifiez vos installations :
```bash
docker --version
docker-compose --version
```

---

## 🐳 Déploiement avec Docker Compose

1. **Construisez et démarrez les conteneurs** :
```bash
   docker-compose up -d --build
```

2. **Vérifiez que tous les conteneurs sont bien démarrés** :
```bash
   docker-compose ps
```

### 🌐 Accès aux services

- **Frontend** : [http://localhost:3000](http://localhost:3000)
- **Backend (API)** : accessible uniquement via le réseau interne
- **Base de données** : accessible uniquement depuis le backend

### 🛑 Arrêt et nettoyage

```bash
# Arrêter les conteneurs
docker-compose stop

# Arrêter et supprimer les conteneurs
docker-compose down

# Supprimer également les volumes
docker-compose down -v
```

---

## ☸️ Déploiement avec K3s

### Prérequis

- **K3s** installé sur la VM
- **kubectl** configuré
- Images Docker pushées sur Docker Hub

### 1. Configurer kubectl

```bash
mkdir -p ~/.kube
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
sudo chown $(id -u):$(id -g) ~/.kube/config
export KUBECONFIG=~/.kube/config
echo 'export KUBECONFIG=~/.kube/config' >> ~/.bashrc
```

### 2. Builder et pusher les images

```bash
docker build -t degachi/node_backend:latest ./backend
docker build -t degachi/react_frontend:latest ./frontend
docker push degachi/node_backend:latest
docker push degachi/react_frontend:latest
```

### 3. Appliquer les fichiers de configuration

```bash
sudo kubectl apply -f k3s/namespace.yaml
sudo kubectl apply -f k3s/secret.yaml
sudo kubectl apply -f k3s/mysql/pvc.yaml
sudo kubectl apply -f k3s/mysql/configmap.yaml
sudo kubectl apply -f k3s/mysql/deployment.yaml
sudo kubectl apply -f k3s/backend/deployment.yaml
sudo kubectl apply -f k3s/frontend/deployment.yaml
sudo kubectl apply -f k3s/ingress.yaml
```

### 4. Vérifier le déploiement

```bash
# Vérifier les pods
sudo kubectl get pods -n app

# Résultat attendu
NAME                        READY   STATUS
mysql-xxxxxxxxx             1/1     Running
backend-xxxxxxxxx           1/1     Running
frontend-xxxxxxxxx          1/1     Running

# Vérifier les services
sudo kubectl get services -n app

# Vérifier l'ingress
sudo kubectl get ingress -n app
```

### 5. Accéder à l'application

Ajouter le domaine dans `/etc/hosts` :
```bash
echo "<IP-de-ta-VM>  mon-app.local" | sudo tee -a /etc/hosts
```

Puis ouvrir dans le navigateur :
http://mon-app.local

### 🔍 Commandes utiles K3s

```bash
# Voir les logs d'un pod
sudo kubectl logs -n app <nom-du-pod>

# Décrire un pod en erreur
sudo kubectl describe pod -n app <nom-du-pod>

# Surveiller les pods en temps réel
sudo kubectl get pods -n app -w

# Voir toutes les ressources
sudo kubectl get all -n app
```

---

## 📝 Utilisation

1. Ouvrez votre navigateur à l'adresse `http://localhost:3000` (Docker) ou `http://mon-app.local` (K3s).
2. Remplissez les champs **ID**, **Nom**, **Poste**.
3. Cliquez sur le bouton **Continuer**.
4. Une alerte confirme l'envoi des données.
5. Vérifiez les données en base :
```bash
   docker exec -it mysql_db mysql -u user -p
```
```sql
   USE formulaire_db;
   SELECT * FROM contacts;
```

---

## ⚙️ Configuration

### Variables d'environnement

- **MySQL** : `MYSQL_ROOT_PASSWORD`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`
- **Backend** : `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`

### Initialisation de la base de données

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