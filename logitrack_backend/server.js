const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let shipments = [
  { id: "LT-48213", trackingNumber: "LT-48213", recipient: "Destinataire A - Marseille", carrier: "DHL", status: "IN_TRANSIT", isPriority: true, estDate: "12/12", internalNotes: "" },
  { id: "LT-48214", trackingNumber: "LT-48214", recipient: "Destinataire B - Lyon", carrier: "Chronopost", status: "DELAYED", isPriority: true, estDate: "10/12", internalNotes: "" },
  { id: "LT-48215", trackingNumber: "LT-48215", recipient: "Destinataire C - Paris", carrier: "Colissimo", status: "PENDING", isPriority: false, estDate: "14/12", internalNotes: "" },
  { id: "LT-48216", trackingNumber: "LT-48216", recipient: "Destinataire D - Nice", carrier: "DHL", status: "DELIVERED", isPriority: false, estDate: "08/12", internalNotes: "" }
];

app.get('/api/v1/shipments', (req, res) => {
  let result = [...shipments];
  const { status, search } = req.query;
  if (status && status !== 'ALL') {
    result = result.filter(s => s.status === status);
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(s => s.trackingNumber.toLowerCase().includes(q) || s.recipient.toLowerCase().includes(q));
  }
  res.json(result);
});

app.get('/api/v1/shipments/:id', (req, res) => {
  const item = shipments.find(s => s.id === req.params.id);
  if (!item) return res.status(404).json({ error: "Non trouvé" });
  res.json(item);
});

app.put('/api/v1/shipments/:id', (req, res) => {
  const item = shipments.find(s => s.id === req.params.id);
  if (!item) return res.status(404).json({ error: "Non trouvé" });
  
  const { status, isPriority, internalNotes } = req.body;
  if (status !== undefined) item.status = status;
  if (isPriority !== undefined) item.isPriority = isPriority;
  if (internalNotes !== undefined) item.internalNotes = internalNotes;

  res.json(item);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur LogiTrack actif sur http://localhost:${PORT}/api/v1`);
});
