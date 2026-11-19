const API_BASE_URL = 'http://localhost:3000/api/v1';

export async function getShipments(queryString = '') {
  try {
    const response = await fetch(`${API_BASE_URL}/shipments${queryString}`);
    if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Impossible de récupérer les expéditions :", error);
    throw error;
  }
}

export async function getShipmentById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/shipments/${id}`);
    if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Impossible de récupérer l'expédition ${id} :`, error);
    throw error;
  }
}

export async function updateShipment(id, updateData) {
  try {
    const response = await fetch(`${API_BASE_URL}/shipments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de l'expédition ${id} :`, error);
    throw error;
  }
}

export async function createShipment(shipmentData) {
  try {
    const response = await fetch(`${API_BASE_URL}/shipments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shipmentData),
    });
    if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la création de l'expédition :", error);
    throw error;
  }
}
