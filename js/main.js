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
  const newShipmentBtn = document.getElementById('new-shipment-btn');

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
          openShipmentModal(s.id, () => { loadAndRender(); loadTableData(); });
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
        let statusLabel = 'Pending';
        if (s.status === 'IN_TRANSIT') { statusClass = 'status-in-transit'; statusLabel = 'In Transit'; }
        if (s.status === 'DELIVERED') { statusClass = 'status-delivered'; statusLabel = 'Delivered'; }
        if (s.status === 'DELAYED') { statusClass = 'status-delayed'; statusLabel = 'Delayed'; }

        const row = document.createElement('tr');
        row.innerHTML = `
          <td><strong>${s.trackingNumber}</strong></td>
          <td>${s.recipient} - ${s.carrier}</td>
          <td><span class="status-badge ${statusClass}">${statusLabel}</span></td>
          <td>
            <div style="display: flex; gap: 8px;">
              <button class="btn-action view-btn" title="View Details" style="background: #e3f2fd; border: 1.5px solid #000; border-radius: 6px; padding: 4px 8px; cursor: pointer;">🔍</button>
              <button class="btn-action edit-btn" title="Edit" style="background: #fff9c4; border: 1.5px solid #000; border-radius: 6px; padding: 4px 8px; cursor: pointer;">✏️</button>
              <button class="btn-action delete-btn" title="Delete" style="background: #ffcdd2; border: 1.5px solid #000; border-radius: 6px; padding: 4px 8px; cursor: pointer;">🗑️</button>
            </div>
          </td>
        `;

        row.querySelector('.view-btn').onclick = (e) => {
          e.stopPropagation();
          openShipmentModal(s.id, () => { loadAndRender(); loadTableData(); });
        };
        row.querySelector('.edit-btn').onclick = (e) => {
          e.stopPropagation();
          openShipmentModal(s.id, () => { loadAndRender(); loadTableData(); });
        };
        row.querySelector('.delete-btn').onclick = async (e) => {
          e.stopPropagation();
          const confirmed = confirm("Are you sure you want to delete this shipment?");
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
