import { fetchShipments, deleteShipment } from './api/shipmentsApi.js';
import { debounce } from './utils/debounce.js';
import { openShipmentModal } from './components/shipmentModal.js';

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('shipments-container');
  const tableBody = document.getElementById('shipments-table-body');
  const searchInput = document.getElementById('search-input');
  const filterStatus = document.getElementById('filter-status-dash');
  
  const navBtns = document.querySelectorAll('.nav-btn');
  const viewDashboard = document.getElementById('view-dashboard');
  const viewShipments = document.getElementById('view-shipments');
  const viewDetails = document.getElementById('view-details');
  const newShipmentBtn = document.getElementById('new-shipment-btn');

  let currentActiveShipmentId = null;

  if (newShipmentBtn) {
    newShipmentBtn.addEventListener('click', () => {
      openShipmentModal(null, () => { loadAndRender(); loadTableData(); });
    });
  }

  const homeLogo = document.getElementById('home-logo');
  if (homeLogo) {
    homeLogo.addEventListener('click', () => {
      const dashboardBtn = document.querySelector('.nav-btn[data-view="dashboard"]');
      if (dashboardBtn) dashboardBtn.click();
    });
  }

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const view = btn.dataset.view;
      viewDetails.style.display = 'none';
      if (view === 'dashboard') {
        viewDashboard.style.display = 'block';
        viewShipments.style.display = 'none';
        loadAndRender();
      } else {
        viewDashboard.style.display = 'none';
        viewShipments.style.display = 'block';
        loadTableData();
      }
    });
  });

  async function showDetailsView(shipmentId) {
    currentActiveShipmentId = shipmentId;
    try {
      const shipments = await fetchShipments();
      const s = shipments.find(item => item.id === shipmentId || item.trackingNumber === shipmentId);
      if (!s) return;

      viewDashboard.style.display = 'none';
      viewShipments.style.display = 'none';
      viewDetails.style.display = 'block';

      document.getElementById('details-title').textContent = `Détails expédition ${s.trackingNumber}`;
      document.getElementById('details-recipient').textContent = `${s.recipient}`;
      document.getElementById('details-carrier').textContent = `Transporteur : ${s.carrier}`;
      document.getElementById('details-priority').textContent = `${s.isPriority ? 'Prioritaire' : 'Standard'}`;
      document.getElementById('details-date').textContent = `Est. ${s.estDate || '12/12'}`;

      const dot1 = document.getElementById('t-step-1');
      const dot2 = document.getElementById('t-step-2');
      const dot3 = document.getElementById('t-step-3');
      const dot4 = document.getElementById('t-step-4');

      dot1.style.background = '#64b5f6';
      dot2.style.background = '#e0e0e0';
      dot3.style.background = '#e0e0e0';
      dot4.style.background = '#e0e0e0';

      if (s.status === 'IN_TRANSIT') {
        dot2.style.background = '#64b5f6';
      } else if (s.status === 'DELAYED') {
        dot2.style.background = '#e57373';
      } else if (s.status === 'DELIVERED') {
        dot2.style.background = '#64b5f6';
        dot3.style.background = '#64b5f6';
        dot4.style.background = '#81c784';
      }
    } catch (err) {
      console.error(err);
    }
  }

  document.getElementById('details-back-btn').onclick = () => {
    viewDetails.style.display = 'none';
    viewShipments.style.display = 'block';
    loadTableData();
  };

  document.getElementById('page-edit-btn').onclick = () => {
    if (currentActiveShipmentId) {
      openShipmentModal(currentActiveShipmentId, () => {
        showDetailsView(currentActiveShipmentId);
        loadTableData();
      });
    }
  };

  document.getElementById('page-delete-btn').onclick = async () => {
    if (currentActiveShipmentId) {
      const confirmed = confirm("Êtes-vous sûr de vouloir supprimer cette expédition ?");
      if (confirmed) {
        await deleteShipment(currentActiveShipmentId);
        viewDetails.style.display = 'none';
        viewShipments.style.display = 'block';
        loadTableData();
        loadAndRender();
      }
    }
  };

  async function loadAndRender(queryParams = '') {
    try {
      const shipments = await fetchShipments(queryParams);
      container.innerHTML = '';
      
      if (shipments.length === 0) {
        container.innerHTML = '<p>No shipments found.</p>';
        return;
      }

      shipments.forEach(s => {
        const card = document.createElement('div');
        card.className = 'shipment-card';
        
        let statusClass = 'status-pending';
        if (s.status === 'IN_TRANSIT') statusClass = 'status-in-transit';
        if (s.status === 'DELIVERED') statusClass = 'status-delivered';
        if (s.status === 'DELAYED') statusClass = 'status-delayed';

        card.innerHTML = `
          <h3>${s.trackingNumber}</h3>
          <p>${s.recipient}</p>
          <p>Carrier: <strong>${s.carrier}</strong></p>
          <span class="status-badge ${statusClass}">${s.status}</span>
        `;

        card.addEventListener('click', () => {
          showDetailsView(s.id);
        });

        container.appendChild(card);
      });
    } catch (err) {
      container.innerHTML = '<p style="color: red;">Error connecting to backend server.</p>';
    }
  }

  async function loadTableData() {
    try {
      const shipments = await fetchShipments();
      tableBody.innerHTML = '';
      
      if (shipments.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No shipments found.</td></tr>';
        return;
      }

      shipments.forEach(s => {
        let statusClass = 'status-pending';
        let statusLabel = 'En attente';
        if (s.status === 'IN_TRANSIT') { statusClass = 'status-in-transit'; statusLabel = 'En transit'; }
        if (s.status === 'DELIVERED') { statusClass = 'status-delivered'; statusLabel = 'Livré'; }
        if (s.status === 'DELAYED') { statusClass = 'status-delayed'; statusLabel = 'Retard'; }

        const row = document.createElement('tr');
        row.innerHTML = `
          <td><strong>${s.trackingNumber}</strong></td>
          <td>${s.recipient} - ${s.carrier}</td>
          <td><span class="status-badge ${statusClass}">${statusLabel}</span></td>
          <td>
            <div style="display: flex; gap: 8px;">
              <button class="btn-action view-btn" title="Voir les détails" style="background: #e3f2fd; border: 1.5px solid #000; border-radius: 6px; padding: 4px 10px; cursor: pointer; font-family: monospace;">▢</button>
              <button class="btn-action edit-btn" title="Modifier" style="background: #fff9c4; border: 1.5px solid #000; border-radius: 6px; padding: 4px 8px; cursor: pointer;">✏️</button>
              <button class="btn-action delete-btn" title="Supprimer" style="background: #ffcdd2; border: 1.5px solid #000; border-radius: 6px; padding: 4px 8px; cursor: pointer;">🗑️</button>
            </div>
          </td>
        `;

        row.querySelector('.view-btn').onclick = (e) => {
          e.stopPropagation();
          showDetailsView(s.id);
        };
        row.querySelector('.edit-btn').onclick = (e) => {
          e.stopPropagation();
          openShipmentModal(s.id, () => { loadTableData(); loadAndRender(); });
        };
        row.querySelector('.delete-btn').onclick = async (e) => {
          e.stopPropagation();
          const confirmed = confirm("Êtes-vous sûr de vouloir supprimer cette expédition ?");
          if (confirmed) {
            await deleteShipment(s.id);
            loadAndRender();
            loadTableData();
          }
        };
        
        tableBody.appendChild(row);
      });
    } catch (err) {
      console.error(err);
    }
  }

  searchInput.addEventListener('input', debounce((e) => {
    loadAndRender(`?search=${encodeURIComponent(e.target.value)}`);
  }, 300));

  filterStatus.addEventListener('change', (e) => {
    const val = e.target.value;
    loadAndRender(val !== 'ALL' ? `?status=${val}` : '');
  });

  loadTableData();
});
