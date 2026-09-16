# Toki

Toki est une application de messagerie instantanée au design minimaliste proposant les fonctionnalités suivantes :

- Création de compte
- Vérification d'email
- Réinitialisation de mot de passe
- Ajout d'une photo de profil
- Changement de nom d'utilisateur et bio
- Recherche d'utilisateurs par pseudo
- Conversations privées avec d'autres utilisateurs
- Suppression de messages

![Aperçu de l'application](./assets/preview.png)

**L'application est séparée en deux repositories différents, vous consultez actuellement la partie Backend de l'application.**

[Cliquez pour accéder au repository du Frontend](https://github.com/NzlThomas/toki-frontend)

---

## Stacks utilisées

### Frontend

- React
- React Router DOM
- Axios
- Context API
- Modules CSS

### Backend

- Node.js
- Express
- Prisma
- PostgreSQL
- Multer
- Sharp
- JWT
- Cloudinary

## Installation

_Il est nécessaire de créer votre base de données en amont en veillant à la laisser vide, Prisma s'occupera alors de créer les tables._

### Cloner le projet

```bash
git clone git@github.com:NzlThomas/toki-backend.git
```

### Installer les dépendances

A la racine du projet :

```bash
npm i
```

### Créer et remplir les variables .env

```env
EXPRESS_PORT= Port de votre serveur Express (3000 par défaut)
DATABASE_URL= URL BDD Postgres (voir .env.example pour le format)
FRONTEND_URL= URL de Vite (http://localhost:5173 par défaut)
JWT_SECRET= Votre secret JWT
NODE_ENV= Facultatif si le projet tourne en local

CLOUDINARY_CLOUD_NAME= Facultatif (voir note)
CLOUDINARY_API_KEY= Facultatif (voir note)
CLOUDINARY_API_SECRET= Facultatif (voir note)
```

_Le projet est configuré pour que les photos de profil soient stockées sur Cloudinary et ne supporte donc pas l'ajout de photos de profil sur un dossier local (sauf si vous modifiez le code)._

_Si vous ne configurez pas Cloudinary le projet utilisera des [photos de profil par défaut](https://github.com/NzlThomas/toki-backend/blob/main/uploads/default.webp) pour éviter des erreurs d'affichage._

### Initialiser Prisma ORM

```bash
npx prisma generate
```

```bash
npx prisma migrate dev
```

### Lancer le backend

```bash
node app.js
```

### Initialisation du Frontend

[Référez vous au README de ce repository](https://github.com/NzlThomas/toki-frontend)
