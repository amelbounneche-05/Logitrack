const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let shipments = [
  { id: "LT-48213", trackingNumber: "LT-48213", recipient: "Recipient A - Marseille", carrier: "DHL", status: "IN_TRANSIT", isPriority: true, estDate: "12/12", internalNotes: "Fragile items" },
  { id: "LT-48214", trackingNumber: "LT-48214", recipient: "Recipient B - Lyon", carrier: "Chronopost", status: "DELAYED", isPriority: true, estDate: "10/12", internalNotes: "Weather delay" },
  { id: "LT-48215", trackingNumber: "LT-48215", recipient: "Recipient C - Paris", carrier: "Colissimo", status: "PENDING", isPriority: false, estDate: "14/12", internalNotes: "" },
  { id: "LT-48216", trackingNumber: "LT-48216", recipient: "Recipient D - Nice", carrier: "DHL", status: "DELIVERED", isPriority: false, estDate: "08/12", internalNotes: "Signed by recipient" }
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

app.post('/api/v1/shipments', (req, res) => {
  const { trackingNumber, recipient, carrier, status, isPriority, estDate, internalNotes } = req.body;
  const newShipment = {
    id: trackingNumber || `LT-${Math.floor(10000 + Math.random() * 90000)}`,
    trackingNumber: trackingNumber || `LT-${Math.floor(10000 + Math.random() * 90000)}`,
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
  const item = shipments.find(s => s.id === req.params.id);
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
  const index = shipments.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Shipment not found" });
  const deleted = shipments.splice(index, 1);
  res.json(deleted[0]);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`LogiTrack server running on http://localhost:${PORT}/api/v1`);
});
