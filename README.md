# LogiTrack — Tableau de Bord Logistique (Dernier Kilomètre)

LogiTrack est une application web moderne et performante conçue pour les coordinateurs d'entrepôt et répartiteurs logistiques. Elle permet de suivre, filtrer, créer, modifier et supprimer des expéditions en temps réel dans le cadre de la distribution urbaine express.

---

## Choix Techniques & Architecture

Conformément aux exigences du projet, l'application a été développée **100% en Vanilla JavaScript (ES Modules)**, sans aucun framework UI lourd (pas de React, Vue ou jQuery), garantissant une fluidité maximale sur les terminaux industriels et postes d'atelier légers.

L'architecture du projet respecte une structure modulaire stricte :

cda-b2-logitrack/
│
├── index.html # Point d'entrée HTML5 sémantique (, , etc.)
├── css/
│ └── main.css # Styles CSS purs (Flexbox, Grid, thèmes clair/sombre, variables)
└── js/
├── main.js # Point d'entrée principal de l'application
├── i18n.js # Moteur de traduction multilingue (Français / Anglais)
├── api/
│ └── shipmentsApi.js # Appels HTTP asynchrones (GET, POST, PUT, DELETE)
├── components/
│ └── shipmentModal.js # Gestion de la modale native
└── utils/
└── debounce.js # Fonction utilitaire de Debounce pour la recherche

---

## Installation et Lancement du Projet

Pour faire fonctionner l'application, vous devez lancer le serveur backend fourni ainsi que l'interface frontend.

### 1. Cloner et lancer le Backend

Le backend Express gère l'API REST et la persistance des données. Ouvrez un premier terminal et exécutez :

```bash

git clone [https://github.com/PlateformeProjects/logitrack_backend.git](https://github.com/PlateformeProjects/logitrack_backend.git)
cd logitrack_backend
npm install
node server.js

Le serveur s'exécutera localement sur http://localhost:3000/api/v1.

2. Lancer le Frontend (Ce dépôt)
Ouvrez un second terminal dans le dossier de votre projet frontend (cda-b2-logitrack) puis lancez-le via un serveur de développement local (comme l'extension Live Server sur VS Code ou un serveur http) :
Bash

# Exemple avec http-server (si installé globalement) ou via Live Server sur VS Code

node server.js

Accédez ensuite à l'application dans votre navigateur à l'adresse indiquée (ex: http://127.0.0.1:5500/index.html).

Concepts Clés Implémentés

1. Le Debounce Manuel (Recherche Temps Réel)

Pour éviter de saturer le serveur ou de déclencher un filtrage à chaque frappe (ce qui nuirait aux performances sur terminaux légers), une fonction d'ordre supérieur debounce(fn, delay) a été implémentée manuellement. Elle retarde l'exécution de la recherche textuelle de 300 ms après la dernière frappe de l'utilisateur en s'appuyant sur setTimeout et clearTimeout.

2. La Délégation d'Événements

Afin d'optimiser la gestion mémoire et d'éviter d'attacher des écouteurs d'événements individuels sur chaque carte de colis générée dynamiquement, l'écoute des clics est centralisée sur le conteneur parent. La méthode event.target.closest() est ensuite utilisée pour cibler précisément l'action demandée (voir, modifier, supprimer).

3. Préférences Utilisateur (localStorage)

L'application mémorise automatiquement les préférences de l'utilisateur :

    Le thème actif (Mode Sombre / Mode Clair).
    La langue de l'interface (Français / Anglais).
    Les derniers filtres appliqués (statut, transporteur) et la vue active pour restaurer l'état exact au rechargement.
```
