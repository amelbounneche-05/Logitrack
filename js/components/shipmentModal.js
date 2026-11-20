import { fetchShipmentById, updateShipment } from '../api/shipmentsApi.js';

export async function openShipmentModal(shipmentId, onUpdateSuccess) {
  const modal = document.getElementById('shipment-modal');
  try {
    const s = await fetchShipmentById(shipmentId);
    
    modal.innerHTML = `
      <div class="modal-content" style="padding: 10px;">
        <h2>Détails du colis : ${s.trackingNumber}</h2>
        <p style="margin: 10px 0;"><strong>Destinataire :</strong> ${s.recipient}</p>
        <p style="margin: 10px 0;"><strong>Transporteur :</strong> ${s.carrier}</p>
        <p style="margin: 10px 0;"><strong>Date estimée :</strong> ${s.estDate}</p>
        
        <form id="edit-form" style="margin-top: 15px; display: flex; flex-direction: column; gap: 10px;">
          <label>Statut :
            <select id="modal-status" style="width: 100%; padding: 5px; border: 2px solid #000; border-radius: 6px; margin-top: 5px;">
              <option value="IN_TRANSIT" ${s.status === 'IN_TRANSIT' ? 'selected' : ''}>En transit</option>
              <option value="DELIVERED" ${s.status === 'DELIVERED' ? 'selected' : ''}>Livré</option>
              <option value="DELAYED" ${s.status === 'DELAYED' ? 'selected' : ''}>Retard</option>
              <option value="PENDING" ${s.status === 'PENDING' ? 'selected' : ''}>En attente</option>
            </select>
          </label>
          
          <label style="display: flex; align-items: center; gap: 10px;">
            <input type="checkbox" id="modal-priority" ${s.isPriority ? 'checked' : ''}> Prioritaire
          </label>

          <label>Notes internes :
            <textarea id="modal-notes" style="width: 100%; border: 2px solid #000; border-radius: 6px; padding: 5px; margin-top: 5px;">${s.internalNotes || ''}</textarea>
          </label>

          <div style="display: flex; gap: 10px; margin-top: 10px;">
            <button type="submit" style="padding: 8px 12px; background: #c8e6c9; border: 2px solid #000; border-radius: 6px; font-weight: bold; cursor: pointer;">Enregistrer</button>
            <button type="button" id="close-modal-btn" style="padding: 8px 12px; background: #ffcdd2; border: 2px solid #000; border-radius: 6px; font-weight: bold; cursor: pointer;">Fermer</button>
          </div>
        </form>
      </div>
    `;

    modal.showModal();
    document.getElementById('close-modal-btn').onclick = () => modal.close();

    document.getElementById('edit-form').onsubmit = async (e) => {
      e.preventDefault();
      const updatedData = {
        status: document.getElementById('modal-status').value,
        isPriority: document.getElementById('modal-priority').checked,
        internalNotes: document.getElementById('modal-notes').value
      };
      await updateShipment(s.id, updatedData);
      modal.close();
      if (onUpdateSuccess) onUpdateSuccess();
    };
  } catch (err) {
    console.error(err);
  }
}
