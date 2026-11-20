const API_URL = 'http://localhost:3000/api/v1';

export async function fetchShipments(queryparams = '') {
  const response = await fetch(`${API_URL}/shipments${queryparams}`);
  if (!response.ok) throw new Error("Network response was not ok");
  return await response.json();
}

export async function fetchShipmentById(id) {
  const response = await fetch(`${API_URL}/shipments/${id}`);
  if (!response.ok) throw new Error("Shipment not found");
  return await response.json();
}

export async function createShipment(data) {
  const response = await fetch(`${API_URL}/shipments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error("Failed to create shipment");
  return await response.json();
}

export async function updateShipment(id, data) {
  const response = await fetch(`${API_URL}/shipments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error("Failed to update shipment");
  return await response.json();
}

export async function deleteShipment(id) {
  const response = await fetch(`${API_URL}/shipments/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error("Failed to delete shipment");
  return await response.json();
}
