import { fetchShipments } from './api/shipmentsApi.js';
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

  // Handle click on brand logo to return home (dashboard)
  const homeLogo = document.getElementById('home-logo');
  if (homeLogo) {
    homeLogo.addEventListener('click', () => {
      const dashboardBtn = document.querySelector('.nav-btn[data-view="dashboard"]');
      if (dashboardBtn) dashboardBtn.click();
    });
  }

  // Handle sidebar navigation between views
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

  // Fetch and render dashboard grid cards
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

  // Fetch and render shipments table view
  async function loadTableData() {
    try {
      const shipments = await fetchShipments();
      tableBody.innerHTML = '';
      shipments.forEach(s => {
        let statusClass = 'status-pending';
        if (s.status === 'IN_TRANSIT') statusClass = 'status-in-transit';
        if (s.status === 'DELIVERED') statusClass = 'status-delivered';
        if (s.status === 'DELAYED') statusClass = 'status-delayed';

        const row = document.createElement('tr');
        row.innerHTML = `
          <td><strong>${s.trackingNumber}</strong></td>
          <td>${s.recipient} (${s.carrier})</td>
          <td><span class="status-badge ${statusClass}">${s.status}</span></td>
          <td>
            <button class="btn-primary" style="padding: 4px 8px; font-size: 12px;">🔍 View</button>
          </td>
        `;
        row.onclick = () => openShipmentModal(s.id, () => { loadAndRender(); loadTableData(); });
        tableBody.appendChild(row);
      });
    } catch (err) {
      console.error(err);
    }
  }

  // Search input event listener with debounce
  searchInput.addEventListener('input', debounce((e) => {
    loadAndRender(`?search=${encodeURIComponent(e.target.value)}`);
  }, 300));

  // Status filter event listener
  filterStatus.addEventListener('change', (e) => {
    const val = e.target.value;
    loadAndRender(val !== 'ALL' ? `?status=${val}` : '');
  });

  loadAndRender();
});
