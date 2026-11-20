import { fetchShipmentById, updateShipment, createShipment } from '../api/shipmentsApi.js';

export async function openShipmentModal(shipmentId, onUpdateSuccess) {
  const modal = document.getElementById('shipment-modal');
  const isCreating = !shipmentId;

  let s = {
    trackingNumber: `LT-${Math.floor(10000 + Math.random() * 90000)}`,
    recipient: '',
    carrier: 'DHL',
    status: 'IN_TRANSIT',
    isPriority: false,
    estDate: '20/12',
    internalNotes: ''
  };

  if (!isCreating) {
    try {
      s = await fetchShipmentById(shipmentId);
    } catch (err) {
      console.error(err);
      return;
    }
  }

  modal.innerHTML = `
    <div class="modal-content" style="padding: 10px;">
      <h2>${isCreating ? 'New Shipment' : 'Shipment Details: ' + s.trackingNumber}</h2>
      
      <form id="edit-form" style="margin-top: 15px; display: flex; flex-direction: column; gap: 10px;">
        ${isCreating ? `
          <label>Tracking Number:
            <input type="text" id="modal-tracking" value="${s.trackingNumber}" style="width: 100%; padding: 5px; border: 2px solid #000; border-radius: 6px; margin-top: 5px;" required>
          </label>
        ` : ''}

        <label>Recipient & Location:
          <input type="text" id="modal-recipient" value="${s.recipient}" placeholder="e.g. Recipient X - Marseille" style="width: 100%; padding: 5px; border: 2px solid #000; border-radius: 6px; margin-top: 5px;" required>
        </label>

        <label>Carrier:
          <select id="modal-carrier" style="width: 100%; padding: 5px; border: 2px solid #000; border-radius: 6px; margin-top: 5px;">
            <option value="DHL" ${s.carrier === 'DHL' ? 'selected' : ''}>DHL</option>
            <option value="Chronopost" ${s.carrier === 'Chronopost' ? 'selected' : ''}>Chronopost</option>
            <option value="Colissimo" ${s.carrier === 'Colissimo' ? 'selected' : ''}>Colissimo</option>
          </select>
        </label>

        <label>Status:
          <select id="modal-status" style="width: 100%; padding: 5px; border: 2px solid #000; border-radius: 6px; margin-top: 5px;">
            <option value="IN_TRANSIT" ${s.status === 'IN_TRANSIT' ? 'selected' : ''}>In Transit</option>
            <option value="DELIVERED" ${s.status === 'DELIVERED' ? 'selected' : ''}>Delivered</option>
            <option value="DELAYED" ${s.status === 'DELAYED' ? 'selected' : ''}>Delayed</option>
            <option value="PENDING" ${s.status === 'PENDING' ? 'selected' : ''}>Pending</option>
          </select>
        </label>
        
        <label style="display: flex; align-items: center; gap: 10px;">
          <input type="checkbox" id="modal-priority" ${s.isPriority ? 'checked' : ''}> Priority shipment
        </label>

        <label>Internal Notes:
          <textarea id="modal-notes" style="width: 100%; border: 2px solid #000; border-radius: 6px; padding: 5px; margin-top: 5px;">${s.internalNotes || ''}</textarea>
        </label>

        <div style="display: flex; gap: 10px; margin-top: 10px;">
          <button type="submit" style="padding: 8px 12px; background: #c8e6c9; border: 2px solid #000; border-radius: 6px; font-weight: bold; cursor: pointer;">${isCreating ? 'Create shipment' : 'Save changes'}</button>
          <button type="button" id="close-modal-btn" style="padding: 8px 12px; background: #ffcdd2; border: 2px solid #000; border-radius: 6px; font-weight: bold; cursor: pointer;">Close</button>
        </div>
      </form>
    </div>
  `;

  modal.showModal();
  document.getElementById('close-modal-btn').onclick = () => modal.close();

  document.getElementById('edit-form').onsubmit = async (e) => {
    e.preventDefault();
    const formData = {
      trackingNumber: isCreating ? document.getElementById('modal-tracking').value : s.trackingNumber,
      recipient: document.getElementById('modal-recipient').value,
      carrier: document.getElementById('modal-carrier').value,
      status: document.getElementById('modal-status').value,
      isPriority: document.getElementById('modal-priority').checked,
      internalNotes: document.getElementById('modal-notes').value,
      estDate: s.estDate || '20/12'
    };

    if (isCreating) {
      await createShipment(formData);
    } else {
      await updateShipment(s.id, formData);
    }

    modal.close();
    if (onUpdateSuccess) onUpdateSuccess();
  };
}
