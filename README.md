# NeuroAlchemy

Site vitrine multipage de **NeuroAlchemy** — Reprogrammation & Transformation Neuro-Émotionnelle (Paris).

Site statique HTML / CSS / JavaScript, sans backend, prêt pour un déploiement **Vercel**.

## Structure

```
/
├── index.html              Accueil
├── accompagnements.html    Accompagnements
├── methodes.html           Méthodes
├── a-propos.html           À propos
├── reservation.html        Réservation (formulaire frontend)
├── contact.html            Contact + FAQ
└── assets/
    ├── css/style.css       Styles (design system + responsive)
    ├── js/main.js          Menu burger, FAQ, formulaire
    ├── img/                Images utilisées par le site
    └── sources/            Fichiers sources (logo original, diplômes, PDF, maquette, notes)
```

## Déploiement Vercel

Projet 100 % statique : aucune configuration nécessaire. Vercel sert directement `index.html` à la racine.

## Notes

- Le formulaire de réservation est fonctionnel côté interface uniquement (confirmation frontend).
- Le dossier `assets/sources/` contient les fichiers de travail ; il n'affecte pas le rendu du site.
