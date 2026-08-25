/**
 * TM Fashion House — Admin & Client Measurement Vault Management
 */

const INITIAL_CLIENT_MEASUREMENTS = [
    {
        id: "TM-CL-101",
        name: "Chief Babatunde Adeleke",
        gender: "Male",
        phone: "+2348031234567",
        email: "babatunde.adeleke@lagoslaw.ng",
        registeredDate: "2026-08-10",
        preferredFit: "Royal Comfort / Classic Flow",
        category: "Kaftan & Agbada Sartorial",
        notes: "Prefers high neck mandarin collars, right chest concealed pocket, and 2.5-inch trouser cuffs. Sloping left shoulder.",
        measurements: {
            unit: "Inches",
            neck: "17.5",
            shoulder: "19.5",
            chest: "44.0",
            topLength: "42.0",
            agbadaLength: "56.0",
            sleeve: "34.5",
            bicep: "16.0",
            wrist: "9.5",
            waist: "37.0",
            hips: "43.0",
            thigh: "26.0",
            knee: "18.5",
            ankle: "14.5",
            trouserLength: "42.5",
            height: "6'1\"",
            capSize: "23.5"
        },
        ordersCount: 4,
        totalSpent: 340000,
        lastFitting: "2026-08-22",
        status: "Active Patron"
    },
    {
        id: "TM-CL-102",
        name: "Dr. Amina Bello",
        gender: "Female",
        phone: "+2348129876543",
        email: "amina.bello@abuja-health.gov.ng",
        registeredDate: "2026-08-14",
        preferredFit: "Cinched Hourglass / Tailored Structured",
        category: "Haute Couture Gowns & Reception Wears",
        notes: "Strict corset structure required. Floor-skimming dress hem for 4-inch stilettos. Prefers silk velvet and French beaded lace.",
        measurements: {
            unit: "Inches",
            neck: "14.0",
            shoulder: "15.5",
            chest: "36.5",
            underBust: "30.0",
            topLength: "24.0",
            gownLength: "60.0",
            sleeve: "24.0",
            bicep: "12.5",
            wrist: "6.5",
            waist: "28.5",
            hips: "41.0",
            thigh: "24.0",
            knee: "16.0",
            ankle: "11.0",
            trouserLength: "41.0",
            height: "5'8\"",
            capSize: "N/A"
        },
        ordersCount: 2,
        totalSpent: 220000,
        lastFitting: "2026-08-20",
        status: "Active Patron"
    },
    {
        id: "TM-CL-103",
        name: "Engr. Femi Alabi",
        gender: "Male",
        phone: "+2348023456789",
        email: "femi.alabi@energycorp.ng",
        registeredDate: "2026-08-18",
        preferredFit: "Slim Sartorial Cut",
        category: "Executive Senator Suits",
        notes: "Narrow ankle cut (13.5 in) with concealed zip at base. Minimalist chest embroidery only.",
        measurements: {
            unit: "Inches",
            neck: "16.5",
            shoulder: "18.5",
            chest: "41.0",
            topLength: "39.0",
            agbadaLength: "N/A",
            sleeve: "33.0",
            bicep: "15.0",
            wrist: "9.0",
            waist: "33.5",
            hips: "39.5",
            thigh: "24.5",
            knee: "17.0",
            ankle: "13.5",
            trouserLength: "40.5",
            height: "5'11\"",
            capSize: "22.5"
        },
        ordersCount: 3,
        totalSpent: 270000,
        lastFitting: "2026-08-24",
        status: "In Production"
    },
    {
        id: "TM-CL-104",
        name: "Folashade Morgan",
        gender: "Female",
        phone: "+2348098765432",
        email: "shade.morgan@creativeagency.ng",
        registeredDate: "2026-08-21",
        preferredFit: "Architectural Peplum / Body Sculpt",
        category: "Bespoke Evening Gowns",
        notes: "High neckline with structured peplum waist flare. Needs extra ease around shoulder for arm motion.",
        measurements: {
            unit: "Inches",
            neck: "14.5",
            shoulder: "16.0",
            chest: "37.0",
            underBust: "31.0",
            topLength: "26.0",
            gownLength: "58.0",
            sleeve: "25.0",
            bicep: "13.0",
            wrist: "7.0",
            waist: "29.0",
            hips: "42.0",
            thigh: "25.0",
            knee: "16.5",
            ankle: "11.5",
            trouserLength: "40.0",
            height: "5'7\"",
            capSize: "N/A"
        },
        ordersCount: 1,
        totalSpent: 110000,
        lastFitting: "2026-08-23",
        status: "Fitting Scheduled"
    }
];

const AdminApp = {
    state: {
        activeTab: 'measurements',
        clients: [],
        filteredClients: [],
        searchQuery: '',
        genderFilter: 'all',
        selectedClient: null,
        orders: [],
        bespokeRequests: [],
        products: []
    },

    init() {
        this.loadData();
        this.renderAll();
        this.bindEvents();
    },

    loadData() {
        // Load Client Measurements
        const savedClients = localStorage.getItem('tm_clients_measurements');
        if (savedClients) {
            try {
                this.state.clients = JSON.parse(savedClients);
            } catch (e) {
                this.state.clients = [...INITIAL_CLIENT_MEASUREMENTS];
            }
        } else {
            this.state.clients = [...INITIAL_CLIENT_MEASUREMENTS];
            localStorage.setItem('tm_clients_measurements', JSON.stringify(this.state.clients));
        }
        this.state.filteredClients = [...this.state.clients];

        // Load Products
        const savedProducts = localStorage.getItem('tm_fashion_products');
        if (savedProducts) {
            try { this.state.products = JSON.parse(savedProducts); } catch (e) { this.state.products = [...INITIAL_PRODUCTS]; }
        } else if (typeof INITIAL_PRODUCTS !== 'undefined') {
            this.state.products = [...INITIAL_PRODUCTS];
        }

        // Load Orders
        const savedOrders = localStorage.getItem('tm_orders');
        if (savedOrders) {
            try { this.state.orders = JSON.parse(savedOrders); } catch (e) { this.state.orders = [...INITIAL_ORDERS]; }
        } else if (typeof INITIAL_ORDERS !== 'undefined') {
            this.state.orders = [...INITIAL_ORDERS];
        }

        // Load Bespoke Requests
        const savedBespoke = localStorage.getItem('tm_bespoke_requests');
        if (savedBespoke) {
            try { this.state.bespokeRequests = JSON.parse(savedBespoke); } catch (e) { this.state.bespokeRequests = [...INITIAL_BESPOKE_REQUESTS]; }
        } else if (typeof INITIAL_BESPOKE_REQUESTS !== 'undefined') {
            this.state.bespokeRequests = [...INITIAL_BESPOKE_REQUESTS];
        }
    },

    saveClients() {
        localStorage.setItem('tm_clients_measurements', JSON.stringify(this.state.clients));
    },

    renderAll() {
        this.renderHeaderMetrics();
        this.renderActiveTab();
    },

    switchTab(tabId) {
        this.state.activeTab = tabId;
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.classList.toggle('active', link.dataset.tab === tabId);
        });
        this.renderActiveTab();
    },

    renderHeaderMetrics() {
        const totalClientsEl = document.getElementById('metric-total-clients');
        const activeBespokeEl = document.getElementById('metric-active-bespoke');
        const totalRevEl = document.getElementById('metric-total-rev');
        const rtwCountEl = document.getElementById('metric-rtw-count');

        if (totalClientsEl) totalClientsEl.textContent = this.state.clients.length;
        if (activeBespokeEl) activeBespokeEl.textContent = this.state.bespokeRequests.length;
        
        const totalRev = this.state.orders.reduce((sum, o) => sum + (o.total || 0), 0) +
                         this.state.clients.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
        if (totalRevEl) totalRevEl.textContent = `₦${totalRev.toLocaleString()}`;

        const totalItems = this.state.products.reduce((sum, p) => sum + (p.stockCount || 0), 0);
        if (rtwCountEl) rtwCountEl.textContent = `${this.state.products.length} styles (${totalItems} pcs)`;
    },

    renderActiveTab() {
        const content = document.getElementById('admin-main-content');
        if (!content) return;

        if (this.state.activeTab === 'measurements') {
            this.renderMeasurementsVault(content);
        } else if (this.state.activeTab === 'bespoke') {
            this.renderBespokeCommissions(content);
        } else if (this.state.activeTab === 'orders') {
            this.renderOrdersManagement(content);
        } else if (this.state.activeTab === 'inventory') {
            this.renderInventoryManagement(content);
        } else if (this.state.activeTab === 'settings') {
            this.renderSettings(content);
        }
    },

    // =========================================================================
    // 1. CLIENT MEASUREMENT VAULT
    // =========================================================================

    filterClients() {
        let list = [...this.state.clients];

        if (this.state.genderFilter !== 'all') {
            list = list.filter(c => c.gender.toLowerCase() === this.state.genderFilter.toLowerCase());
        }

        if (this.state.searchQuery.trim()) {
            const q = this.state.searchQuery.toLowerCase();
            list = list.filter(c => 
                c.name.toLowerCase().includes(q) ||
                c.phone.includes(q) ||
                c.email.toLowerCase().includes(q) ||
                c.category.toLowerCase().includes(q)
            );
        }

        this.state.filteredClients = list;
        this.renderClientTableOnly();
    },

    renderMeasurementsVault(container) {
        container.innerHTML = `
            <div class="admin-page-header">
                <div>
                    <h2 class="page-title">Client Measurement Vault & Profiles</h2>
                    <p class="page-subtitle">View, record, and print tailoring measurement cards for men and women bespoke patrons.</p>
                </div>
                <button class="btn btn-gold" onclick="AdminApp.openNewClientModal()">
                    <i class="fa-solid fa-user-plus"></i> Record New Client Measurement
                </button>
            </div>

            <!-- Filter and Search Bar -->
            <div class="admin-card" style="margin-bottom: 2rem; padding: 1.25rem 1.75rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="tab-btn ${this.state.genderFilter === 'all' ? 'active' : ''}" onclick="AdminApp.setGenderFilter('all', this)">All Patrons (${this.state.clients.length})</button>
                        <button class="tab-btn ${this.state.genderFilter === 'male' ? 'active' : ''}" onclick="AdminApp.setGenderFilter('male', this)"><i class="fa-solid fa-mars"></i> Men Kaftans</button>
                        <button class="tab-btn ${this.state.genderFilter === 'female' ? 'active' : ''}" onclick="AdminApp.setGenderFilter('female', this)"><i class="fa-solid fa-venus"></i> Women Couture</button>
                    </div>

                    <div style="position: relative; min-width: 280px;">
                        <i class="fa-solid fa-magnifying-glass search-icon"></i>
                        <input type="text" id="client-search-input" class="search-input" style="width: 100%;" placeholder="Search by name, phone, email..." value="${this.state.searchQuery}">
                    </div>
                </div>
            </div>

            <!-- Client Measurement Table -->
            <div class="admin-card" style="overflow-x: auto;">
                <div id="client-table-container"></div>
            </div>
        `;

        this.renderClientTableOnly();

        const searchInput = document.getElementById('client-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.state.searchQuery = e.target.value;
                this.filterClients();
            });
        }
    },

    setGenderFilter(gender, btn) {
        this.state.genderFilter = gender;
        document.querySelectorAll('.admin-card .tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.filterClients();
    },

    renderClientTableOnly() {
        const container = document.getElementById('client-table-container');
        if (!container) return;

        if (this.state.filteredClients.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 4rem 1rem;">
                    <i class="fa-solid fa-user-slash" style="font-size: 2.5rem; color: var(--c-gold); margin-bottom: 1rem;"></i>
                    <h3 style="font-family: var(--font-serif); font-size: 1.5rem; margin-bottom: 0.5rem;">No Client Measurement Records Found</h3>
                    <p style="color: var(--c-text-muted); font-size: 0.85rem;">Try adjusting your search criteria or record a new client measurement.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Client Reference</th>
                        <th>Patron & Contact</th>
                        <th>Key Measurements (Inches)</th>
                        <th>Fitting Style & Category</th>
                        <th>Tailor Card</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.state.filteredClients.map(c => {
                        const m = c.measurements;
                        const cleanPhone = c.phone.replace(/[^0-9]/g, '');

                        return `
                            <tr>
                                <td>
                                    <strong>${c.id}</strong><br>
                                    <span class="badge-status ${c.gender === 'Male' ? 'cutting' : 'finishing'}">${c.gender}</span>
                                </td>
                                <td>
                                    <div style="font-weight: 700; font-size: 0.95rem; color: var(--c-noir);">${c.name}</div>
                                    <div style="font-size: 0.8rem; color: var(--c-text-muted);">
                                        <i class="fa-brands fa-whatsapp text-gold"></i> ${c.phone}<br>
                                        <i class="fa-regular fa-envelope"></i> ${c.email}
                                    </div>
                                </td>
                                <td>
                                    <div style="background: var(--c-cream); padding: 0.6rem 0.85rem; border-radius: 4px; font-size: 0.8rem; line-height: 1.6; border: 1px solid var(--c-border);">
                                        <strong>Chest/Bust:</strong> ${m.chest || 'N/A'}" &nbsp;|&nbsp; 
                                        <strong>Shoulder:</strong> ${m.shoulder || 'N/A'}"<br>
                                        <strong>Waist:</strong> ${m.waist || 'N/A'}" &nbsp;|&nbsp; 
                                        <strong>Hips:</strong> ${m.hips || 'N/A'}"<br>
                                        <strong>Length:</strong> ${m.topLength || m.gownLength || 'N/A'}" &nbsp;|&nbsp; 
                                        <strong>Trouser:</strong> ${m.trouserLength || 'N/A'}"
                                    </div>
                                </td>
                                <td>
                                    <strong style="color: var(--c-noir); font-size: 0.85rem;">${c.category}</strong><br>
                                    <small style="color: var(--c-text-muted); font-style: italic;">"${c.preferredFit}"</small>
                                </td>
                                <td>
                                    <button class="btn btn-outline btn-sm" style="padding: 0.4rem 0.8rem; font-size: 0.72rem;" onclick="AdminApp.viewFullMeasurementCard('${c.id}')">
                                        <i class="fa-solid fa-ruler-combined text-gold"></i> Full Card
                                    </button>
                                </td>
                                <td>
                                    <div style="display: flex; gap: 0.4rem; align-items: center;">
                                        <a href="https://wa.me/${cleanPhone}?text=${encodeURIComponent('Hello ' + c.name + ', this is TM Fashion House regarding your custom fitting and measurement profile.')}" target="_blank" class="btn-icon" style="width: 32px; height: 32px; color: #25d366;" title="WhatsApp Patron">
                                            <i class="fa-brands fa-whatsapp"></i>
                                        </a>
                                        <button class="btn-icon" style="width: 32px; height: 32px;" onclick="AdminApp.printMeasurementCard('${c.id}')" title="Print Tailor Cutting Sheet">
                                            <i class="fa-solid fa-print"></i>
                                        </button>
                                        <button class="btn-icon" style="width: 32px; height: 32px;" onclick="AdminApp.editClient('${c.id}')" title="Edit Measurement">
                                            <i class="fa-solid fa-pen-to-square"></i>
                                        </button>
                                        <button class="btn-icon" style="width: 32px; height: 32px; color: var(--c-danger);" onclick="AdminApp.deleteClient('${c.id}')" title="Delete Record">
                                            <i class="fa-regular fa-trash-can"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
    },

    // =========================================================================
    // MEASUREMENT CARD MODAL & PRINTING
    // =========================================================================

    viewFullMeasurementCard(clientId) {
        const client = this.state.clients.find(c => c.id === clientId);
        if (!client) return;

        this.state.selectedClient = client;
        const modal = document.getElementById('measurement-card-modal');
        const content = document.getElementById('measurement-card-content');
        if (!modal || !content) return;

        const m = client.measurements;
        const cleanPhone = client.phone.replace(/[^0-9]/g, '');

        content.innerHTML = `
            <div style="border-bottom: 2px solid var(--c-gold); padding-bottom: 1.5rem; margin-bottom: 1.75rem; display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <span class="eyebrow" style="margin-bottom: 0.25rem;">TM ATELIER TAILORING CARD • REF: ${client.id}</span>
                    <h2 style="font-family: var(--font-serif); font-size: 2.2rem; color: var(--c-noir);">${client.name}</h2>
                    <div style="font-size: 0.85rem; color: var(--c-text-muted);">
                        <span><i class="fa-solid fa-venus-mars"></i> ${client.gender}</span> &nbsp;•&nbsp; 
                        <span><i class="fa-brands fa-whatsapp text-gold"></i> ${client.phone}</span> &nbsp;•&nbsp; 
                        <span><i class="fa-regular fa-envelope"></i> ${client.email}</span>
                    </div>
                </div>
                <div style="text-align: right;">
                    <button class="btn btn-outline btn-sm" onclick="AdminApp.printMeasurementCard('${client.id}')">
                        <i class="fa-solid fa-print"></i> Print Cutting Sheet
                    </button>
                </div>
            </div>

            <!-- Fit & Notes Banner -->
            <div style="background: var(--c-cream); border-left: 4px solid var(--c-gold); padding: 1rem 1.5rem; margin-bottom: 2rem; border-radius: var(--radius-xs);">
                <div style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--c-gold-dark); margin-bottom: 0.25rem;">
                    Category: ${client.category} | Preferred Fit: ${client.preferredFit}
                </div>
                <div style="font-size: 0.85rem; color: var(--c-text-muted); font-style: italic;">
                    <strong>Tailor Notes:</strong> "${client.notes || 'Standard bespoke ease.'}"
                </div>
            </div>

            <!-- Precision Measurement Grids -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                <!-- Upper Body -->
                <div style="background: #fff; border: 1px solid var(--c-border); padding: 1.5rem; border-radius: var(--radius-sm);">
                    <h4 style="font-family: var(--font-serif); font-size: 1.25rem; color: var(--c-noir); margin-bottom: 1rem; border-bottom: 1px solid var(--c-border); padding-bottom: 0.5rem;">
                        <i class="fa-solid fa-shirt text-gold"></i> Upper Body / Torso
                    </h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; font-size: 0.85rem;">
                        <div><strong>Neck Circumference:</strong><br><span style="font-size: 1.1rem; color: var(--c-gold-dark); font-weight: 700;">${m.neck || 'N/A'}"</span></div>
                        <div><strong>Shoulder Width:</strong><br><span style="font-size: 1.1rem; color: var(--c-gold-dark); font-weight: 700;">${m.shoulder || 'N/A'}"</span></div>
                        <div><strong>Chest / Bust:</strong><br><span style="font-size: 1.1rem; color: var(--c-gold-dark); font-weight: 700;">${m.chest || 'N/A'}"</span></div>
                        ${m.underBust ? `<div><strong>Under-Bust:</strong><br><span style="font-size: 1.1rem; color: var(--c-gold-dark); font-weight: 700;">${m.underBust}"</span></div>` : ''}
                        <div><strong>Arm / Sleeve Length:</strong><br><span style="font-size: 1.1rem; color: var(--c-gold-dark); font-weight: 700;">${m.sleeve || 'N/A'}"</span></div>
                        <div><strong>Bicep / Muscle:</strong><br><span style="font-size: 1.1rem; color: var(--c-gold-dark); font-weight: 700;">${m.bicep || 'N/A'}"</span></div>
                        <div><strong>Wrist / Cuff:</strong><br><span style="font-size: 1.1rem; color: var(--c-gold-dark); font-weight: 700;">${m.wrist || 'N/A'}"</span></div>
                        <div><strong>Top / Kaftan Length:</strong><br><span style="font-size: 1.1rem; color: var(--c-gold-dark); font-weight: 700;">${m.topLength || 'N/A'}"</span></div>
                        ${m.agbadaLength ? `<div><strong>Agbada Length:</strong><br><span style="font-size: 1.1rem; color: var(--c-gold-dark); font-weight: 700;">${m.agbadaLength}"</span></div>` : ''}
                        ${m.gownLength ? `<div><strong>Gown Length:</strong><br><span style="font-size: 1.1rem; color: var(--c-gold-dark); font-weight: 700;">${m.gownLength}"</span></div>` : ''}
                    </div>
                </div>

                <!-- Lower Body & Proportions -->
                <div style="background: #fff; border: 1px solid var(--c-border); padding: 1.5rem; border-radius: var(--radius-sm);">
                    <h4 style="font-family: var(--font-serif); font-size: 1.25rem; color: var(--c-noir); margin-bottom: 1rem; border-bottom: 1px solid var(--c-border); padding-bottom: 0.5rem;">
                        <i class="fa-solid fa-scissors text-gold"></i> Lower Body & Posture
                    </h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; font-size: 0.85rem;">
                        <div><strong>Natural Waist:</strong><br><span style="font-size: 1.1rem; color: var(--c-gold-dark); font-weight: 700;">${m.waist || 'N/A'}"</span></div>
                        <div><strong>Full Hips:</strong><br><span style="font-size: 1.1rem; color: var(--c-gold-dark); font-weight: 700;">${m.hips || 'N/A'}"</span></div>
                        <div><strong>Thigh / Lap:</strong><br><span style="font-size: 1.1rem; color: var(--c-gold-dark); font-weight: 700;">${m.thigh || 'N/A'}"</span></div>
                        <div><strong>Knee Width:</strong><br><span style="font-size: 1.1rem; color: var(--c-gold-dark); font-weight: 700;">${m.knee || 'N/A'}"</span></div>
                        <div><strong>Ankle / Bottom Hem:</strong><br><span style="font-size: 1.1rem; color: var(--c-gold-dark); font-weight: 700;">${m.ankle || 'N/A'}"</span></div>
                        <div><strong>Trouser Inseam / Length:</strong><br><span style="font-size: 1.1rem; color: var(--c-gold-dark); font-weight: 700;">${m.trouserLength || 'N/A'}"</span></div>
                        <div><strong>Client Height:</strong><br><span style="font-size: 1.1rem; color: var(--c-gold-dark); font-weight: 700;">${m.height || 'N/A'}</span></div>
                        <div><strong>Cap / Fila Size:</strong><br><span style="font-size: 1.1rem; color: var(--c-gold-dark); font-weight: 700;">${m.capSize || 'N/A'}</span></div>
                    </div>
                </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--c-border); padding-top: 1.5rem;">
                <a href="https://wa.me/${cleanPhone}?text=${encodeURIComponent('Hello ' + client.name + ', your tailored outfit is progressing at TM Fashion House atelier. Measurements confirmed!')}" target="_blank" class="btn btn-whatsapp">
                    <i class="fa-brands fa-whatsapp"></i> WhatsApp Fitting Update
                </a>
                <button class="btn btn-primary" onclick="AdminApp.editClient('${client.id}')">
                    <i class="fa-solid fa-pen-to-square"></i> Edit Measurement Values
                </button>
            </div>
        `;

        modal.classList.add('active');
    },

    printMeasurementCard(clientId) {
        const client = this.state.clients.find(c => c.id === clientId);
        if (!client) return;

        const m = client.measurements;
        const printWindow = window.open('', '_blank', 'width=800,height=900');
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>TM ATELIER CUTTING SHEET - ${client.name}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 40px; color: #111; line-height: 1.5; }
                    .header { text-align: center; border-bottom: 3px double #111; padding-bottom: 20px; margin-bottom: 25px; }
                    .header h1 { margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px; }
                    .header p { margin: 5px 0 0 0; font-size: 13px; color: #555; }
                    .meta-box { background: #f7f7f7; border: 1px solid #ddd; padding: 15px; margin-bottom: 25px; display: flex; justify-content: space-between; }
                    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; }
                    .card { border: 1px solid #111; padding: 15px; }
                    .card h3 { margin-top: 0; border-bottom: 1px solid #ccc; padding-bottom: 8px; font-size: 16px; text-transform: uppercase; }
                    .table-meas { width: 100%; border-collapse: collapse; }
                    .table-meas td { padding: 6px 0; border-bottom: 1px dotted #ccc; font-size: 13px; }
                    .val { font-weight: bold; font-size: 15px; text-align: right; }
                    .notes-box { border: 1px dashed #111; padding: 15px; margin-bottom: 25px; }
                    .footer { font-size: 11px; text-align: center; color: #777; border-top: 1px solid #ccc; padding-top: 15px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>TM FASHION HOUSE — MASTER TAILOR CUTTING SHEET</h1>
                    <p>Atelier Suite • Lagos & Abuja • Ref: ${client.id} • Date: ${new Date().toLocaleDateString()}</p>
                </div>

                <div class="meta-box">
                    <div>
                        <strong>PATRON:</strong> ${client.name}<br>
                        <strong>PHONE / WHATSAPP:</strong> ${client.phone}<br>
                        <strong>EMAIL:</strong> ${client.email}
                    </div>
                    <div style="text-align: right;">
                        <strong>GARMENT CATEGORY:</strong> ${client.category}<br>
                        <strong>DESIRED FIT:</strong> ${client.preferredFit}<br>
                        <strong>GENDER:</strong> ${client.gender}
                    </div>
                </div>

                <div class="grid">
                    <div class="card">
                        <h3>Upper Body Measurements (Inches)</h3>
                        <table class="table-meas">
                            <tr><td>Neck Circumference:</td><td class="val">${m.neck || '-'} "</td></tr>
                            <tr><td>Shoulder Width:</td><td class="val">${m.shoulder || '-'} "</td></tr>
                            <tr><td>Chest / Bust:</td><td class="val">${m.chest || '-'} "</td></tr>
                            ${m.underBust ? `<tr><td>Under-Bust:</td><td class="val">${m.underBust} "</td></tr>` : ''}
                            <tr><td>Sleeve / Arm Length:</td><td class="val">${m.sleeve || '-'} "</td></tr>
                            <tr><td>Bicep / Muscle:</td><td class="val">${m.bicep || '-'} "</td></tr>
                            <tr><td>Wrist / Cuff:</td><td class="val">${m.wrist || '-'} "</td></tr>
                            <tr><td>Top / Kaftan Length:</td><td class="val">${m.topLength || '-'} "</td></tr>
                            ${m.agbadaLength ? `<tr><td>Agbada Span / Length:</td><td class="val">${m.agbadaLength} "</td></tr>` : ''}
                            ${m.gownLength ? `<tr><td>Full Gown Length:</td><td class="val">${m.gownLength} "</td></tr>` : ''}
                        </table>
                    </div>

                    <div class="card">
                        <h3>Lower Body & Proportions</h3>
                        <table class="table-meas">
                            <tr><td>Natural Waist:</td><td class="val">${m.waist || '-'} "</td></tr>
                            <tr><td>Full Hips:</td><td class="val">${m.hips || '-'} "</td></tr>
                            <tr><td>Thigh / Lap:</td><td class="val">${m.thigh || '-'} "</td></tr>
                            <tr><td>Knee Circumference:</td><td class="val">${m.knee || '-'} "</td></tr>
                            <tr><td>Ankle / Bottom Hem:</td><td class="val">${m.ankle || '-'} "</td></tr>
                            <tr><td>Trouser Length (Inseam):</td><td class="val">${m.trouserLength || '-'} "</td></tr>
                            <tr><td>Height:</td><td class="val">${m.height || '-'}</td></tr>
                            <tr><td>Cap (Fila) Size:</td><td class="val">${m.capSize || '-'}</td></tr>
                        </table>
                    </div>
                </div>

                <div class="notes-box">
                    <strong>MASTER TAILOR & CUTTING INSTRUCTIONS:</strong><br>
                    ${client.notes || 'Follow standard TM Bespoke cutting balance.'}
                </div>

                <div class="footer">
                    TM Fashion House Atelier • Confidential Client Measurement Document • Certified Master Tailor Signature: _______________
                </div>

                <script>
                    window.onload = function() { window.print(); }
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    },

    // =========================================================================
    // NEW CLIENT MEASUREMENT MODAL & RECORDING
    // =========================================================================

    openNewClientModal() {
        const modal = document.getElementById('new-client-modal');
        const form = document.getElementById('new-client-form');
        if (form) form.reset();
        document.getElementById('form-client-id').value = '';
        document.getElementById('modal-form-title').textContent = 'Record New Client Measurement';
        if (modal) modal.classList.add('active');
    },

    editClient(clientId) {
        const client = this.state.clients.find(c => c.id === clientId);
        if (!client) return;

        this.openNewClientModal();
        document.getElementById('modal-form-title').textContent = `Edit Measurements for ${client.name}`;
        document.getElementById('form-client-id').value = client.id;
        document.getElementById('inp-name').value = client.name;
        document.getElementById('inp-gender').value = client.gender;
        document.getElementById('inp-phone').value = client.phone;
        document.getElementById('inp-email').value = client.email;
        document.getElementById('inp-category').value = client.category;
        document.getElementById('inp-fit').value = client.preferredFit;
        document.getElementById('inp-notes').value = client.notes || '';

        const m = client.measurements;
        document.getElementById('m-neck').value = m.neck || '';
        document.getElementById('m-shoulder').value = m.shoulder || '';
        document.getElementById('m-chest').value = m.chest || '';
        document.getElementById('m-sleeve').value = m.sleeve || '';
        document.getElementById('m-bicep').value = m.bicep || '';
        document.getElementById('m-wrist').value = m.wrist || '';
        document.getElementById('m-toplength').value = m.topLength || '';
        document.getElementById('m-gownlength').value = m.gownLength || '';
        document.getElementById('m-waist').value = m.waist || '';
        document.getElementById('m-hips').value = m.hips || '';
        document.getElementById('m-thigh').value = m.thigh || '';
        document.getElementById('m-ankle').value = m.ankle || '';
        document.getElementById('m-trouser').value = m.trouserLength || '';
        document.getElementById('m-height').value = m.height || '';
        document.getElementById('m-cap').value = m.capSize || '';
    },

    saveClientForm(event) {
        if (event) event.preventDefault();

        const existingId = document.getElementById('form-client-id').value;
        const name = document.getElementById('inp-name').value;
        const gender = document.getElementById('inp-gender').value;
        const phone = document.getElementById('inp-phone').value;
        const email = document.getElementById('inp-email').value;
        const category = document.getElementById('inp-category').value;
        const fit = document.getElementById('inp-fit').value;
        const notes = document.getElementById('inp-notes').value;

        const newMeasurements = {
            unit: "Inches",
            neck: document.getElementById('m-neck').value,
            shoulder: document.getElementById('m-shoulder').value,
            chest: document.getElementById('m-chest').value,
            sleeve: document.getElementById('m-sleeve').value,
            bicep: document.getElementById('m-bicep').value,
            wrist: document.getElementById('m-wrist').value,
            topLength: document.getElementById('m-toplength').value,
            gownLength: document.getElementById('m-gownlength').value,
            waist: document.getElementById('m-waist').value,
            hips: document.getElementById('m-hips').value,
            thigh: document.getElementById('m-thigh').value,
            ankle: document.getElementById('m-ankle').value,
            trouserLength: document.getElementById('m-trouser').value,
            height: document.getElementById('m-height').value,
            capSize: document.getElementById('m-cap').value
        };

        if (existingId) {
            // Update
            const index = this.state.clients.findIndex(c => c.id === existingId);
            if (index > -1) {
                this.state.clients[index].name = name;
                this.state.clients[index].gender = gender;
                this.state.clients[index].phone = phone;
                this.state.clients[index].email = email;
                this.state.clients[index].category = category;
                this.state.clients[index].preferredFit = fit;
                this.state.clients[index].notes = notes;
                this.state.clients[index].measurements = newMeasurements;
                alert(`Measurements for ${name} updated successfully!`);
            }
        } else {
            // Create
            const newClient = {
                id: `TM-CL-${Math.floor(100 + Math.random() * 900)}`,
                name: name,
                gender: gender,
                phone: phone,
                email: email,
                registeredDate: new Date().toISOString().split('T')[0],
                preferredFit: fit,
                category: category,
                notes: notes,
                measurements: newMeasurements,
                ordersCount: 0,
                totalSpent: 0,
                lastFitting: new Date().toISOString().split('T')[0],
                status: "Active Patron"
            };
            this.state.clients.unshift(newClient);
            alert(`✨ New client "${name}" recorded in Measurement Vault with ID: ${newClient.id}!`);
        }

        this.saveClients();
        this.closeModal('new-client-modal');
        this.closeModal('measurement-card-modal');
        this.filterClients();
        this.renderHeaderMetrics();
    },

    deleteClient(clientId) {
        const client = this.state.clients.find(c => c.id === clientId);
        if (!client) return;
        if (!confirm(`Are you sure you want to delete the measurement profile for ${client.name}?`)) return;

        this.state.clients = this.state.clients.filter(c => c.id !== clientId);
        this.saveClients();
        this.filterClients();
        this.renderHeaderMetrics();
    },

    // =========================================================================
    // 2. BESPOKE COMMISSIONS PIPELINE
    // =========================================================================

    renderBespokeCommissions(container) {
        container.innerHTML = `
            <div class="admin-page-header">
                <div>
                    <h2 class="page-title">Bespoke Commissions & Fitting Pipeline</h2>
                    <p class="page-subtitle">Manage VIP custom commissions submitted through the website consultation form.</p>
                </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                ${this.state.bespokeRequests.map(r => `
                    <div class="admin-card">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; border-bottom: 1px solid var(--c-border); padding-bottom: 1rem;">
                            <div>
                                <span class="eyebrow" style="margin-bottom: 0.25rem;">Ref: ${r.id}</span>
                                <h3 style="font-family: var(--font-serif); font-size: 1.5rem; color: var(--c-noir);">${r.clientName}</h3>
                                <div style="font-size: 0.85rem; color: var(--c-text-muted);">
                                    <i class="fa-brands fa-whatsapp text-gold"></i> ${r.phone || 'N/A'} &nbsp;•&nbsp; 
                                    <i class="fa-regular fa-envelope"></i> ${r.clientEmail}
                                </div>
                            </div>
                            <div style="text-align: right;">
                                <span class="badge-status finishing">${r.serviceType}</span>
                                <div style="font-size: 0.85rem; margin-top: 0.35rem; color: var(--c-gold-dark); font-weight: 700;">Budget: ${r.budget}</div>
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 2rem; font-size: 0.85rem; margin-bottom: 1.25rem;">
                            <div>
                                <strong>Consultation Type:</strong> ${r.consultationType}<br>
                                <strong>Target Event Date:</strong> ${r.eventDate}<br>
                                <strong style="display: block; margin-top: 0.5rem;">Client Style Vision:</strong>
                                <p style="font-style: italic; color: var(--c-text-muted); background: var(--c-cream); padding: 0.75rem; border-radius: 4px;">"${r.notes || 'Classic royal tailoring required.'}"</p>
                            </div>
                            <div style="background: #fff; border: 1px solid var(--c-border); padding: 1rem; border-radius: 4px;">
                                <strong style="display: block; margin-bottom: 0.5rem; color: var(--c-noir);"><i class="fa-solid fa-ruler-combined text-gold"></i> Submitted Client Proportions:</strong>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem; color: var(--c-text-muted);">
                                    <div>Chest/Bust: <strong>${r.measurements?.bust || 'TBD'}</strong></div>
                                    <div>Waist: <strong>${r.measurements?.waist || 'TBD'}</strong></div>
                                    <div>Shoulder/Hips: <strong>${r.measurements?.hips || 'TBD'}</strong></div>
                                    <div>Height: <strong>${r.measurements?.height || 'TBD'}</strong></div>
                                </div>
                            </div>
                        </div>

                        <div style="display: flex; justify-content: space-between; align-items: center; pt-2; border-top: 1px solid var(--c-border); padding-top: 1rem;">
                            <div style="display: flex; align-items: center; gap: 0.75rem;">
                                <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase;">Production Stage:</span>
                                <select class="form-control" style="width: auto; padding: 0.4rem 0.8rem; font-size: 0.8rem;" onchange="AdminApp.updateBespokeStatus('${r.id}', this.value)">
                                    <option value="Pending Review" ${r.status === 'Pending Review' ? 'selected' : ''}>Pending Review</option>
                                    <option value="Consultation Scheduled" ${r.status === 'Consultation Scheduled' ? 'selected' : ''}>Consultation Scheduled</option>
                                    <option value="Measurements Confirmed" ${r.status === 'Measurements Confirmed' ? 'selected' : ''}>Measurements Confirmed</option>
                                    <option value="In Cutting & Sewing" ${r.status === 'In Cutting & Sewing' ? 'selected' : ''}>In Cutting & Sewing</option>
                                    <option value="Toile Fitting" ${r.status === 'Toile Fitting' ? 'selected' : ''}>Toile Fitting</option>
                                    <option value="Hand Finished" ${r.status === 'Hand Finished' ? 'selected' : ''}>Hand Finished / Ready</option>
                                    <option value="Delivered" ${r.status === 'Delivered' ? 'selected' : ''}>Delivered to Patron</option>
                                </select>
                            </div>
                            <div style="display: flex; gap: 0.5rem;">
                                <button class="btn btn-outline btn-sm" onclick="AdminApp.convertBespokeToClient('${r.id}')">
                                    <i class="fa-solid fa-file-import"></i> Save to Measurement Vault
                                </button>
                                <a href="https://wa.me/${(r.phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello ' + r.clientName + ', this is TM Fashion House regarding your custom bespoke commission #' + r.id)}" target="_blank" class="btn btn-whatsapp btn-sm">
                                    <i class="fa-brands fa-whatsapp"></i> WhatsApp Client
                                </a>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    updateBespokeStatus(reqId, status) {
        const req = this.state.bespokeRequests.find(r => r.id === reqId);
        if (req) {
            req.status = status;
            localStorage.setItem('tm_bespoke_requests', JSON.stringify(this.state.bespokeRequests));
            alert(`Commission #${reqId} status updated to: ${status}`);
        }
    },

    convertBespokeToClient(reqId) {
        const req = this.state.bespokeRequests.find(r => r.id === reqId);
        if (!req) return;

        const newClient = {
            id: `TM-CL-${Math.floor(100 + Math.random() * 900)}`,
            name: req.clientName,
            gender: req.serviceType.toLowerCase().includes('men') ? 'Male' : 'Female',
            phone: req.phone || '+2348000000000',
            email: req.clientEmail || 'patron@domain.com',
            registeredDate: new Date().toISOString().split('T')[0],
            preferredFit: "Custom Royal Fit",
            category: req.serviceType,
            notes: req.notes || '',
            measurements: {
                unit: "Inches",
                chest: req.measurements?.bust || '',
                waist: req.measurements?.waist || '',
                hips: req.measurements?.hips || '',
                height: req.measurements?.height || ''
            },
            ordersCount: 1,
            totalSpent: 0,
            lastFitting: req.eventDate || 'TBD',
            status: "In Production"
        };

        this.state.clients.unshift(newClient);
        this.saveClients();
        alert(`✨ Client "${req.clientName}" is now stored in the Measurement Vault as #${newClient.id}!`);
        this.switchTab('measurements');
    },

    // =========================================================================
    // 3. ORDERS & DELIVERIES
    // =========================================================================

    renderOrdersManagement(container) {
        container.innerHTML = `
            <div class="admin-page-header">
                <div>
                    <h2 class="page-title">Store Orders & Courier Dispatches</h2>
                    <p class="page-subtitle">Track customer orders placed on the website, addresses, and delivery progression.</p>
                </div>
            </div>

            <div class="admin-card">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Patron & Destination</th>
                            <th>Garment Wares</th>
                            <th>Total Settlement</th>
                            <th>Stage Progression</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.state.orders.map(o => `
                            <tr>
                                <td>
                                    <strong>${o.id}</strong><br>
                                    <small style="color: var(--c-text-muted);">${o.date}</small>
                                </td>
                                <td>
                                    <strong>${o.customerName}</strong><br>
                                    <small>${o.customerEmail}</small><br>
                                    <small style="color: var(--c-text-muted); font-size: 0.75rem;"><i class="fa-solid fa-location-dot"></i> ${o.shippingAddress || 'Atelier Pick-up'}</small>
                                </td>
                                <td>
                                    ${o.items.map(i => `<div style="font-size: 0.8rem;">• <strong>${i.name}</strong> (${i.size}, ${i.color}) x ${i.quantity}</div>`).join('')}
                                </td>
                                <td><strong>₦${o.total.toLocaleString()}</strong></td>
                                <td>
                                    <select class="form-control" style="font-size: 0.75rem; padding: 0.4rem;" onchange="AdminApp.updateOrderStatus('${o.id}', this.value)">
                                        <option value="Pattern Cutting" ${o.status === 'Pattern Cutting' ? 'selected' : ''}>Pattern Cutting</option>
                                        <option value="In Sewing" ${o.status === 'In Sewing' ? 'selected' : ''}>In Sewing / Embroidery</option>
                                        <option value="Hand Finishing" ${o.status === 'Hand Finishing' ? 'selected' : ''}>Hand Finishing & Steam Press</option>
                                        <option value="Quality Inspection" ${o.status === 'Quality Inspection' ? 'selected' : ''}>Quality Inspection</option>
                                        <option value="Dispatched" ${o.status === 'Dispatched' ? 'selected' : ''}>Dispatched via Courier</option>
                                    </select>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    updateOrderStatus(orderId, status) {
        const order = this.state.orders.find(o => o.id === orderId);
        if (order) {
            order.status = status;
            localStorage.setItem('tm_orders', JSON.stringify(this.state.orders));
            alert(`Order #${orderId} status updated to: ${status}`);
        }
    },

    // =========================================================================
    // 4. INVENTORY MANAGEMENT
    // =========================================================================

    renderInventoryManagement(container) {
        container.innerHTML = `
            <div class="admin-page-header">
                <div>
                    <h2 class="page-title">Ready-to-Wear Wares Inventory</h2>
                    <p class="page-subtitle">Add new finished outfits, modify prices, and adjust live stock counts.</p>
                </div>
                <button class="btn btn-gold" onclick="AdminApp.showAddProductPrompt()">
                    <i class="fa-solid fa-plus"></i> Add New Ready-to-Wear Outfit
                </button>
            </div>

            <div class="admin-card">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Outfit</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>In Stock Count</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.state.products.map(p => `
                            <tr>
                                <td>
                                    <div style="display: flex; align-items: center; gap: 1rem;">
                                        <img src="${p.images && p.images[0] ? p.images[0] : ''}" style="width: 48px; height: 60px; object-fit: cover; border-radius: 4px; border: 1px solid var(--c-border);">
                                        <div>
                                            <strong>${p.name}</strong><br>
                                            <small style="color: var(--c-text-muted);">${p.id} • ${p.badge || 'Standard'}</small>
                                        </div>
                                    </div>
                                </td>
                                <td>${p.gender} / ${p.category}</td>
                                <td><strong>₦${p.price.toLocaleString()}</strong></td>
                                <td>
                                    <input type="number" min="0" value="${p.stockCount}" style="width: 65px; padding: 0.35rem; border: 1px solid var(--c-border); border-radius: 4px;"
                                           onchange="AdminApp.updateProductStock('${p.id}', this.value)">
                                </td>
                                <td>
                                    <span class="badge-status ${p.stockCount > 0 ? 'dispatched' : 'cutting'}">
                                        ${p.stockCount > 0 ? 'In Stock' : 'Sold Out'}
                                    </span>
                                </td>
                                <td>
                                    <button class="btn-icon" style="width: 32px; height: 32px; color: var(--c-danger);" onclick="AdminApp.deleteProduct('${p.id}')" title="Delete Silhouette">
                                        <i class="fa-regular fa-trash-can"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    showAddProductPrompt() {
        const name = prompt("Outfit Name (e.g. 'Royal Emerald Senator Kaftan'):");
        if (!name) return;

        const priceStr = prompt("Price (in Naira ₦, e.g. 85000):", "85000");
        const price = parseInt(priceStr, 10) || 75000;

        const category = prompt("Category ('men', 'women', 'accessories'):", "men");
        const gender = prompt("Gender ('men', 'women', 'unisex'):", "men");
        const fabric = prompt("Fabric Description (e.g. 'Superfine Cashmere Wool'):", "100% Superfine Polished Wool");
        const imageUrl = prompt("Image Path or URL:", "./img/1000465980.png");

        const newProd = {
            id: `TM-${Math.floor(100 + Math.random() * 900)}`,
            name: name,
            category: category || 'men',
            gender: gender || 'men',
            price: price,
            currencySymbol: "₦",
            originalPrice: null,
            badge: "New Silhouette",
            inStock: true,
            stockCount: 5,
            readyToShip: true,
            description: `Handcrafted luxury outfit by TM Fashion House. Signature tailoring finish.`,
            fabric: fabric,
            care: "Specialist Clean Only",
            designerNote: "A statement silhouette.",
            sizes: ["S", "M", "L", "XL", "XXL"],
            colors: [{ name: "Original Tone", hex: "#5a2a27", code: "brown" }],
            images: [imageUrl],
            rating: 5.0,
            reviewsCount: 1,
            isFeatured: true
        };

        this.state.products.unshift(newProd);
        localStorage.setItem('tm_fashion_products', JSON.stringify(this.state.products));
        this.renderInventoryManagement(document.getElementById('admin-main-content'));
        this.renderHeaderMetrics();
        alert(`Outfit "${name}" added to ready-to-wear catalog!`);
    },

    updateProductStock(productId, newCount) {
        const prod = this.state.products.find(p => p.id === productId);
        if (prod) {
            prod.stockCount = parseInt(newCount, 10) || 0;
            localStorage.setItem('tm_fashion_products', JSON.stringify(this.state.products));
            this.renderHeaderMetrics();
        }
    },

    deleteProduct(productId) {
        if (!confirm('Remove this silhouette from catalog?')) return;
        this.state.products = this.state.products.filter(p => p.id !== productId);
        localStorage.setItem('tm_fashion_products', JSON.stringify(this.state.products));
        this.renderInventoryManagement(document.getElementById('admin-main-content'));
        this.renderHeaderMetrics();
    },

    // =========================================================================
    // 5. SETTINGS
    // =========================================================================

    renderSettings(container) {
        container.innerHTML = `
            <div class="admin-page-header">
                <div>
                    <h2 class="page-title">Atelier & Studio Settings</h2>
                    <p class="page-subtitle">Manage your designer identity, WhatsApp helpline number, and tailoring default units.</p>
                </div>
            </div>

            <div class="admin-card" style="max-width: 800px;">
                <form onsubmit="event.preventDefault(); alert('✨ Atelier settings saved successfully!');" class="form-grid">
                    <div>
                        <label class="form-label">Brand Name</label>
                        <input type="text" class="form-control" value="TM Fashion House" required>
                    </div>
                    <div>
                        <label class="form-label">Lead Couturier Name</label>
                        <input type="text" class="form-control" value="T.M. (Master Fashion Designer)" required>
                    </div>
                    <div>
                        <label class="form-label">WhatsApp Fitting Hotline</label>
                        <input type="tel" class="form-control" value="+2348000000000" required>
                    </div>
                    <div>
                        <label class="form-label">Default Measurement Unit</label>
                        <select class="form-control">
                            <option value="Inches" selected>Inches (Standard Sartorial Tailoring)</option>
                            <option value="Centimeters">Centimeters (Metric System)</option>
                        </select>
                    </div>
                    <div class="form-group-full">
                        <label class="form-label">Studio Physical Location</label>
                        <input type="text" class="form-control" value="Lagos Studio & Abuja VIP Suite, Nigeria">
                    </div>
                    <div class="form-group-full" style="text-align: right; margin-top: 1rem;">
                        <button type="submit" class="btn btn-gold">
                            <i class="fa-solid fa-floppy-disk"></i> Save Studio Configuration
                        </button>
                    </div>
                </form>
            </div>
        `;
    },

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('active');
    },

    bindEvents() {
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchTab(link.dataset.tab);
            });
        });
    }
};

window.AdminApp = AdminApp;
document.addEventListener('DOMContentLoaded', () => {
    AdminApp.init();
});
