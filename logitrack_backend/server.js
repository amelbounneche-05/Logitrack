const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let shipments = [
  { id: "LT-48213", trackingNumber: "LT-48213", recipient: "Recipient A - Marseille", carrier: "DHL", status: "IN_TRANSIT", isPriority: true, estDate: "12/12", internalNotes: "Fragile items" },
  { id: "LT-48214", trackingNumber: "LT-48214", recipient: "Recipient B - Lyon", carrier: "Chronopost", status: "DELAYED", isPriority: true, estDate: "10/12", internalNotes: "Weather delay" },
  { id: "LT-48215", trackingNumber: "LT-48215", recipient: "Recipient C - Paris", carrier: "Colissimo", status: "PENDING", isPriority: false, estDate: "14/12", internalNotes: "" },
  { id: "LT-48216", trackingNumber: "LT-48216", recipient: "Recipient D - Nice", carrier: "DHL", status: "DELIVERED", isPriority: false, estDate: "08/12", internalNotes: "Signed by recipient" },
  { id: "LT-48217", trackingNumber: "LT-48217", recipient: "Recipient E - Bordeaux", carrier: "Chronopost", status: "IN_TRANSIT", isPriority: false, estDate: "13/12", internalNotes: "" },
  { id: "LT-48218", trackingNumber: "LT-48218", recipient: "Recipient F - Toulouse", carrier: "Colissimo", status: "DELIVERED", isPriority: true, estDate: "09/12", internalNotes: "" },
  { id: "LT-48219", trackingNumber: "LT-48219", recipient: "Recipient G - Nantes", carrier: "DHL", status: "PENDING", isPriority: false, estDate: "15/12", internalNotes: "Awaiting pickup" },
  { id: "LT-48220", trackingNumber: "LT-48220", recipient: "Recipient H - Strasbourg", carrier: "Chronopost", status: "DELAYED", isPriority: true, estDate: "11/12", internalNotes: "Customs check" },
  { id: "LT-48221", trackingNumber: "LT-48221", recipient: "Recipient I - Lille", carrier: "Colissimo", status: "IN_TRANSIT", isPriority: false, estDate: "16/12", internalNotes: "" },
  { id: "LT-48222", trackingNumber: "LT-48222", recipient: "Recipient J - Montpellier", carrier: "DHL", status: "DELIVERED", isPriority: true, estDate: "07/12", internalNotes: "Express delivery" },
  { id: "LT-48223", trackingNumber: "LT-48223", recipient: "Recipient K - Rennes", carrier: "Chronopost", status: "PENDING", isPriority: false, estDate: "18/12", internalNotes: "" },
  { id: "LT-48224", trackingNumber: "LT-48224", recipient: "Recipient L - Grenoble", carrier: "Colissimo", status: "IN_TRANSIT", isPriority: true, estDate: "17/12", internalNotes: "Priority handling" }
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
  if (!item) return res.status(404).json({ error: "Shipment not found" });
  res.json(item);
});

app.put('/api/v1/shipments/:id', (req, res) => {
  const item = shipments.find(s => s.id === req.params.id);
  if (!item) return res.status(404).json({ error: "Shipment not found" });
  
  const { status, isPriority, internalNotes } = req.body;
  if (status !== undefined) item.status = status;
  if (isPriority !== undefined) item.isPriority = isPriority;
  if (internalNotes !== undefined) item.internalNotes = internalNotes;

  res.json(item);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`LogiTrack server running on http://localhost:${PORT}/api/v1`);
});
