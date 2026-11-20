const API_URL = 'http://localhost:3000/api/v1';

export async function fetchShipments(queryparams = '') {
  const response = await fetch(`${API_URL}/shipments${queryparams}`);
  if (!response.ok) throw new Error("Erreur réseau");
  return await response.json();
}

export async function fetchShipmentById(id) {
  const response = await fetch(`${API_URL}/shipments/${id}`);
  if (!response.ok) throw new Error("Colis introuvable");
  return await response.json();
}

export async function updateShipment(id, data) {
  const response = await fetch(`${API_URL}/shipments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error("Échec de la mise à jour");
  return await response.json();
}
