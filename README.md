# LogiTrack — Logistics Dashboard (Last Mile)

LogiTrack is a modern, high-performance web application designed for warehouse coordinators and logistics dispatchers. It allows users to track, filter, create, update, and delete shipments in real time for express urban distribution.

---

## Technical Choices & Architecture

In accordance with project requirements, the application was built **100% in Vanilla JavaScript (ES Modules)** without heavy UI frameworks (no React, Vue, or jQuery), ensuring maximum performance on industrial terminals and lightweight workstation setups.

The project follows a strict modular structure:

cda-b2-logitrack/
│
├── index.html # Semantic HTML5 entry point (, , etc.)
├── css/
│ └── main.css # Pure CSS styles (Flexbox, Grid, light/dark themes, variables)
└── js/
├── main.js # Main application entry point
├── i18n.js # Multilingual translation engine (French / English)
├── api/
│ └── shipmentsApi.js # Asynchronous HTTP calls (GET, POST, PUT, DELETE)
├── components/
│ └── shipmentModal.js # Native modal management
└── utils/
└── debounce.js # Debounce utility function for search optimization

---

## Installation and Project Setup

To run the application, you need to start both the provided backend server and the frontend interface.

### 1. Clone and Start the Backend

The Express backend manages the REST API and data persistence. Open a terminal and run:

```bash
git clone [https://github.com/PlateformeProjects/logitrack_backend.git](https://github.com/PlateformeProjects/logitrack_backend.git)
cd logitrack_backend
npm install
node server.js

The server will run locally at http://localhost:3000/api/v1.
2. Start the Frontend (This Repository)

Open a second terminal inside your frontend project folder (cda-b2-logitrack) and serve it using a local development server (such as the Live Server extension in VS Code or an HTTP server):
Bash

# Example using http-server (if installed globally) or via VS Code Live Server
node server.js

Access the application in your web browser at the indicated address (e.g., http://127.0.0.1:5500/index.html).
Core Concepts Implemented
1. Manual Debounce (Real-Time Search)

To prevent server overloading or filtering on every single keystroke (which would degrade performance on lightweight terminals), a custom higher-order function debounce(fn, delay) was implemented. It delays text search execution by 300 ms after the user's last keystroke using setTimeout and clearTimeout.
2. Event Delegation

To optimize memory usage and avoid attaching individual event listeners to every dynamically generated shipment card, click events are centralized on the parent container. The event.target.closest() method is then used to accurately target the requested action (view, edit, delete).
3. User Preferences (localStorage)

The application automatically remembers user preferences:

    Active theme (Dark Mode / Light Mode).

    Interface language (French / English).

    Recent filters applied (status, carrier) and the active view to restore the exact state upon reloading.
```
