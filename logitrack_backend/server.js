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
  { id: "LT-48224", trackingNumber: "LT-48224", recipient: "Recipient L - Grenoble", carrier: "Colissimo", status: "IN_TRANSIT", isPriority: true, estDate: "17/12", internalNotes: "Priority handling" },
  { id: "LT-48225", trackingNumber: "LT-48225", recipient: "Recipient M - Rouen", carrier: "DHL", status: "DELIVERED", isPriority: false, estDate: "05/12", internalNotes: "" },
  { id: "LT-48226", trackingNumber: "LT-48226", recipient: "Recipient N - Toulon", carrier: "Chronopost", status: "IN_TRANSIT", isPriority: false, estDate: "19/12", internalNotes: "" },
  { id: "LT-48227", trackingNumber: "LT-48227", recipient: "Recipient O - Reims", carrier: "Colissimo", status: "DELAYED", isPriority: true, estDate: "06/12", internalNotes: "Address issue" }
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
  const item = shipments.find(s => s.id === req.params.id || s.trackingNumber === req.params.id);
  if (!item) return res.status(404).json({ error: "Shipment not found" });
  res.json(item);
});

app.post('/api/v1/shipments', (req, res) => {
  const { trackingNumber, recipient, carrier, status, isPriority, estDate, internalNotes } = req.body;
  const newId = trackingNumber || `LT-${Math.floor(10000 + Math.random() * 90000)}`;
  const newShipment = {
    id: newId,
    trackingNumber: newId,
    recipient: recipient || 'New Recipient',
    carrier: carrier || 'DHL',
    status: status || 'PENDING',
    isPriority: isPriority || false,
    estDate: estDate || '20/12',
    internalNotes: internalNotes || ''
  };
  shipments.unshift(newShipment);
  res.status(201).json(newShipment);
});

app.put('/api/v1/shipments/:id', (req, res) => {
  const item = shipments.find(s => s.id === req.params.id || s.trackingNumber === req.params.id);
  if (!item) return res.status(404).json({ error: "Shipment not found" });
  
  const { status, isPriority, internalNotes, recipient, carrier } = req.body;
  if (status !== undefined) item.status = status;
  if (isPriority !== undefined) item.isPriority = isPriority;
  if (internalNotes !== undefined) item.internalNotes = internalNotes;
  if (recipient !== undefined) item.recipient = recipient;
  if (carrier !== undefined) item.carrier = carrier;

  res.json(item);
});

app.delete('/api/v1/shipments/:id', (req, res) => {
  const targetId = req.params.id;
  const index = shipments.findIndex(s => s.id === targetId || s.trackingNumber === targetId);
  if (index === -1) return res.status(404).json({ error: "Shipment not found" });
  
  const deleted = shipments.splice(index, 1);
  res.json(deleted[0]);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`LogiTrack server running on http://localhost:${PORT}/api/v1`);
});
