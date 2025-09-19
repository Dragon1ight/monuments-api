# 🏛️ Monumento API

API REST pour la gestion des monuments avec système de favoris et notifications WebSocket en temps réel.

## 📋 Fonctionnalités

### ✅ Modèles de données
- **User** : Gestion des utilisateurs avec authentification JWT
- **Monument** : Gestion des monuments (titre, pays, ville, description, etc.)
- **Anecdote** : Anecdotes liées aux monuments
- **Favorite** : Système de favoris Many-to-Many entre User et Monument

### ✅ API REST
- **Authentification** : Login/Register avec JWT
- **Monuments** : CRUD complet (Create, Read, Update, Delete)
- **Anecdotes** : Gestion des anecdotes par monument
- **Favoris** : Ajout, suppression et consultation des favoris

### ✅ WebSocket
- **Notifications temps réel** : Notification automatique lors de la création d'un monument
- **Authentification** : Connexion WebSocket sécurisée avec JWT

## 🚀 Installation

### Prérequis
- Node.js (v14+)
- MySQL
- npm

### Étapes d'installation

1. **Cloner le projet**
```bash
git clone <votre-repo-github>
cd monumento-api
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration de la base de données**
- Créer une base de données MySQL nommée `monumento`
- Configurer les paramètres de connexion dans `src/db/sequelize.js`

4. **Démarrer le serveur**
```bash
npm run dev
```

Le serveur sera accessible sur `http://localhost:3000`

## 📚 Documentation API

### Authentification


#### POST /api/register
Inscription utilisateur
```json
{
  "username": "testuser",
  "password": "password123"
}
```

#### POST /api/login
Connexion utilisateur
```json
{
  "username": "testuser",
  "password": "password123"
}
```


### Monuments

#### GET /api/monuments
Récupérer tous les monuments

#### POST /api/monuments
Créer un nouveau monument
```json
{
  "monument": {
    "title": "Tour Eiffel",
    "country": "France",
    "city": "Paris",
    "description": "Monument emblématique de Paris",
    "buildYear": 1889,
    "picture": "https://example.com/image.jpg"
  }
}
```

#### GET /api/monuments/:id
Récupérer un monument par ID

#### PUT /api/monuments/:id
Modifier un monument

#### DELETE /api/monuments/:id
Supprimer un monument

### Favoris

#### POST /api/favorites/:monumentId
Ajouter un monument aux favoris
- **Headers** : `Authorization: Bearer <token>`
- **Réponse** : 201 Created ou 400 si déjà en favoris

#### DELETE /api/favorites/:monumentId
Supprimer un monument des favoris
- **Headers** : `Authorization: Bearer <token>`
- **Réponse** : 204 No Content

#### GET /api/favorites
Récupérer la liste des favoris de l'utilisateur connecté
- **Headers** : `Authorization: Bearer <token>`
- **Réponse** : Liste des monuments favoris avec détails

### Anecdotes

#### GET /api/monuments/:id/anecdotes
Récupérer les anecdotes d'un monument

#### POST /api/monuments/:id/anecdotes
Créer une anecdote pour un monument

#### PUT /api/anecdotes/:id
Modifier une anecdote

#### DELETE /api/anecdotes/:id
Supprimer une anecdote

## 🔔 WebSocket

### Connexion
```javascript
const io = require('socket.io-client');

const socket = io('http://localhost:3000', {
  auth: {
    token: 'votre_jwt_token'
  }
});
```

### Événements

#### newMonument
Notification reçue lors de la création d'un monument
```json
{
  "event": "newMonument",
  "data": {
    "id": 15,
    "title": "Arc de Triomphe",
    "description": "Construit pour célébrer les victoires de Napoléon",
    "createdAt": "2025-09-19T10:15:00Z"
  }
}
```

## 🧪 Tests

### Test des favoris
1. Se connecter : `POST /api/login`
2. Ajouter un favori : `POST /api/favorites/1`
3. Lister les favoris : `GET /api/favorites`
4. Supprimer un favori : `DELETE /api/favorites/1`

### Test des notifications WebSocket
1. Ouvrir le client WebSocket : `http://localhost:8080`
2. Se connecter avec un token JWT
3. Créer un monument : `POST /api/monuments`
4. Vérifier la notification reçue en temps réel

## 🛠️ Technologies utilisées

- **Backend** : Node.js, Express.js
- **Base de données** : MySQL, Sequelize ORM
- **Authentification** : JWT (RS256)
- **WebSocket** : Socket.IO
- **Documentation** : Swagger
- **Développement** : Nodemon

## 📁 Structure du projet

```
monumento-api/
├── src/
│   ├── auth/           # Authentification JWT
│   ├── db/             # Configuration base de données
│   ├── docs/           # Documentation Swagger
│   ├── models/         # Modèles Sequelize
│   ├── routes/         # Routes API
│   └── socket/         # Configuration WebSocket
├── client/             # Client HTML
├── server.js           # Point d'entrée
└── package.json
```

## 🔒 Sécurité

- Authentification JWT obligatoire pour les routes protégées
- Validation des données d'entrée
- Gestion des erreurs centralisée
- Protection contre les doublons de favoris

## 📝 Validation des données

### Monument
- **title** : 3-70 caractères, mots interdits bloqués
- **country** : 2-100 caractères
- **city** : 2-100 caractères, différente du pays
- **buildYear** : Entier entre -3000 et année actuelle
- **picture** : URL valide
- **description** : Maximum 2000 caractères

### User
- **username** : 3-25 caractères, unique
- **password** : Minimum 6 caractères

## 🎯 Fonctionnalités implémentées

- ✅ Modèle Favorite avec relations Many-to-Many
- ✅ API Favoris (POST, DELETE, GET)
- ✅ Validation des doublons (erreur 400)
- ✅ Notifications WebSocket temps réel
- ✅ Gestion d'erreurs avec handleError
- ✅ Authentification JWT sécurisée
- ✅ Documentation complète

## 👨‍💻 Auteur

Khalid ZAIM - DSP4 Archi F25A - TP NodeJS

## 📅 Date

Septembre 2025
