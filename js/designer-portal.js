/**
 * TM Fashion House — Designer & Atelier Owner Management Dashboard
 */

const DesignerPortal = {
    state: {
        activeTab: 'overview',
        orders: [],
        bespokeRequests: [],
        products: []
    },

    init() {
        this.loadData();
    },

    loadData() {
        // Load products
        const savedProducts = localStorage.getItem('tm_fashion_products');
        if (savedProducts) {
            try { this.state.products = JSON.parse(savedProducts); } catch(e) { this.state.products = [...INITIAL_PRODUCTS]; }
        } else {
            this.state.products = [...INITIAL_PRODUCTS];
        }

        // Load orders
        const savedOrders = localStorage.getItem('tm_orders');
        if (savedOrders) {
            try { this.state.orders = JSON.parse(savedOrders); } catch(e) { this.state.orders = [...INITIAL_ORDERS]; }
        } else {
            this.state.orders = [...INITIAL_ORDERS];
        }

        // Load bespoke requests
        const savedBespoke = localStorage.getItem('tm_bespoke_requests');
        if (savedBespoke) {
            try { this.state.bespokeRequests = JSON.parse(savedBespoke); } catch(e) { this.state.bespokeRequests = [...INITIAL_BESPOKE_REQUESTS]; }
        } else {
            this.state.bespokeRequests = [...INITIAL_BESPOKE_REQUESTS];
        }
    },

    openPortal() {
        this.loadData();
        const modal = document.getElementById('designer-portal-modal');
        if (modal) modal.classList.add('active');
        this.renderActiveTab();
    },

    closePortal() {
        const modal = document.getElementById('designer-portal-modal');
        if (modal) modal.classList.remove('active');
        if (window.MaisonApp) {
            MaisonApp.loadInitialData();
            MaisonApp.renderAll();
        }
    },

    switchTab(tabName) {
        this.state.activeTab = tabName;
        document.querySelectorAll('.portal-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        this.renderActiveTab();
    },

    renderActiveTab() {
        const container = document.getElementById('portal-tab-content');
        if (!container) return;

        if (this.state.activeTab === 'overview') {
            this.renderOverview(container);
        } else if (this.state.activeTab === 'inventory') {
            this.renderInventory(container);
        } else if (this.state.activeTab === 'orders') {
            this.renderOrders(container);
        } else if (this.state.activeTab === 'bespoke') {
            this.renderBespokeInbox(container);
        } else if (this.state.activeTab === 'profile') {
            this.renderProfileEditor(container);
        }
    },

    renderOverview(container) {
        const totalRev = this.state.orders.reduce((sum, o) => sum + (o.total || 0), 0);
        const totalItems = this.state.products.reduce((sum, p) => sum + (p.stockCount || 0), 0);

        container.innerHTML = `
            <div class="stat-cards-grid">
                <div class="stat-card">
                    <div class="stat-desc">Direct Store Sales</div>
                    <div class="stat-val">₦${totalRev.toLocaleString()}</div>
                    <span style="font-size: 0.75rem; color: var(--c-success);"><i class="fa-solid fa-arrow-trend-up"></i> Online & Atelier Orders</span>
                </div>
                <div class="stat-card">
                    <div class="stat-desc">Ready-to-Wear Wares</div>
                    <div class="stat-val">${this.state.products.length}</div>
                    <span style="font-size: 0.75rem; color: var(--c-text-muted);">${totalItems} Total Finished Outfits</span>
                </div>
                <div class="stat-card">
                    <div class="stat-desc">Production Orders</div>
                    <div class="stat-val">${this.state.orders.length}</div>
                    <span style="font-size: 0.75rem; color: #4338ca;"><i class="fa-solid fa-scissors"></i> In Cutting / Sewing</span>
                </div>
                <div class="stat-card">
                    <div class="stat-desc">Bespoke Inquiries</div>
                    <div class="stat-val">${this.state.bespokeRequests.length}</div>
                    <span style="font-size: 0.75rem; color: var(--c-gold-dark);"><i class="fa-solid fa-gem"></i> VIP Commissions</span>
                </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h3 style="font-family: var(--font-serif); font-size: 1.5rem; color: var(--c-noir);">Recent Orders to Tailor & Dispatch</h3>
                <button class="btn btn-sm btn-outline" onclick="DesignerPortal.switchTab('orders')">View All Orders</button>
            </div>

            <table class="data-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Patron</th>
                        <th>Wares</th>
                        <th>Total</th>
                        <th>Production Stage</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.state.orders.slice(0, 3).map(o => `
                        <tr>
                            <td><strong>${o.id}</strong></td>
                            <td>${o.customerName}<br><small style="color: var(--c-text-muted);">${o.customerEmail}</small></td>
                            <td>${o.items.map(i => `${i.name} (${i.size})`).join(', ')}</td>
                            <td><strong>₦${o.total.toLocaleString()}</strong></td>
                            <td><span class="badge-status ${o.status.toLowerCase().includes('cutting') ? 'cutting' : 'finishing'}">${o.status}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    },

    renderInventory(container) {
        container.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <div>
                    <h3 style="font-family: var(--font-serif); font-size: 1.6rem; color: var(--c-noir);">Ready-to-Wear Wares Inventory</h3>
                    <p style="font-size: 0.85rem; color: var(--c-text-muted);">Manage readily available outfits, stock counts, and prices.</p>
                </div>
                <button class="btn btn-primary" onclick="DesignerPortal.showAddProductModal()">
                    <i class="fa-solid fa-plus"></i> Add New Ready-to-Wear Outfit
                </button>
            </div>

            <table class="data-table">
                <thead>
                    <tr>
                        <th>Outfit</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>In Stock</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.state.products.map(p => `
                        <tr>
                            <td>
                                <div style="display: flex; align-items: center; gap: 1rem;">
                                    <img src="${p.images && p.images[0] ? p.images[0] : ''}" style="width: 48px; height: 60px; object-fit: cover; border-radius: 2px;">
                                    <div>
                                        <strong>${p.name}</strong><br>
                                        <small style="color: var(--c-text-muted);">${p.id} • ${p.badge || 'Standard'}</small>
                                    </div>
                                </div>
                            </td>
                            <td>${p.gender} / ${p.category}</td>
                            <td><strong>₦${p.price.toLocaleString()}</strong></td>
                            <td>
                                <input type="number" min="0" value="${p.stockCount}" style="width: 60px; padding: 0.3rem; border: 1px solid var(--c-border); border-radius: 2px;"
                                       onchange="DesignerPortal.updateProductStock('${p.id}', this.value)">
                            </td>
                            <td>
                                <span class="badge-status ${p.stockCount > 0 ? 'dispatched' : 'cutting'}">
                                    ${p.stockCount > 0 ? 'In Stock' : 'Sold Out'}
                                </span>
                            </td>
                            <td>
                                <button class="btn-icon" style="width: 32px; height: 32px;" onclick="DesignerPortal.deleteProduct('${p.id}')" title="Remove Piece">
                                    <i class="fa-regular fa-trash-can"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    },

    renderOrders(container) {
        container.innerHTML = `
            <div style="margin-bottom: 2rem;">
                <h3 style="font-family: var(--font-serif); font-size: 1.6rem; color: var(--c-noir);">Production Pipeline & Order Valet</h3>
                <p style="font-size: 0.85rem; color: var(--c-text-muted);">Advance customer garment orders through atelier craftsmanship and courier dispatch stages.</p>
            </div>

            <table class="data-table">
                <thead>
                    <tr>
                        <th>Order</th>
                        <th>Patron & Address</th>
                        <th>Outfit Specs</th>
                        <th>Amount</th>
                        <th>Production Stage</th>
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
                                <small style="color: var(--c-text-muted); font-size: 0.75rem;">${o.shippingAddress || 'Atelier Pick-up'}</small>
                            </td>
                            <td>
                                ${o.items.map(i => `<div style="font-size: 0.8rem;">• ${i.name} (Size: ${i.size}, Color: ${i.color}) x ${i.quantity}</div>`).join('')}
                            </td>
                            <td><strong>₦${o.total.toLocaleString()}</strong></td>
                            <td>
                                <select class="form-control" style="font-size: 0.75rem; padding: 0.4rem;" onchange="DesignerPortal.updateOrderStatus('${o.id}', this.value)">
                                    <option value="Pattern Cutting" ${o.status === 'Pattern Cutting' ? 'selected' : ''}>Pattern Cutting</option>
                                    <option value="In Sewing" ${o.status === 'In Sewing' ? 'selected' : ''}>In Sewing / Embroidery</option>
                                    <option value="Hand Finishing" ${o.status === 'Hand Finishing' ? 'selected' : ''}>Hand Finishing & Steam Press</option>
                                    <option value="Quality Inspection" ${o.status === 'Quality Inspection' ? 'selected' : ''}>Atelier Quality Check</option>
                                    <option value="Dispatched" ${o.status === 'Dispatched' ? 'selected' : ''}>Dispatched via Courier</option>
                                </select>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    },

    renderBespokeInbox(container) {
        container.innerHTML = `
            <div style="margin-bottom: 2rem;">
                <h3 style="font-family: var(--font-serif); font-size: 1.6rem; color: var(--c-noir);">Bespoke Custom Tailoring Requests</h3>
                <p style="font-size: 0.85rem; color: var(--c-text-muted);">Review VIP client bespoke commission requests, measurements, and contact info.</p>
            </div>

            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                ${this.state.bespokeRequests.map(r => `
                    <div style="background: var(--c-white); border: 1px solid var(--c-border); padding: 1.75rem; border-radius: var(--radius-sm); box-shadow: var(--shadow-sm);">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; border-bottom: 1px solid var(--c-border); padding-bottom: 1rem;">
                            <div>
                                <span class="eyebrow" style="margin-bottom: 0.25rem;">Reference: ${r.id}</span>
                                <h4 style="font-family: var(--font-serif); font-size: 1.4rem; color: var(--c-noir);">${r.clientName}</h4>
                                <div style="font-size: 0.8rem; color: var(--c-text-muted);">${r.clientEmail} • WhatsApp: ${r.phone || 'N/A'}</div>
                            </div>
                            <div style="text-align: right;">
                                <span class="badge-status finishing">${r.serviceType}</span>
                                <div style="font-size: 0.8rem; margin-top: 0.35rem; color: var(--c-gold-dark);">Budget: <strong>${r.budget}</strong></div>
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; font-size: 0.85rem; margin-bottom: 1.25rem;">
                            <div>
                                <strong>Consultation Type:</strong> ${r.consultationType}<br>
                                <strong>Target Event Date:</strong> ${r.eventDate}<br>
                                <strong>Design Vision Notes:</strong>
                                <p style="font-style: italic; color: var(--c-text-muted); margin-top: 0.35rem;">"${r.notes || 'Classic bespoke design required.'}"</p>
                            </div>
                            <div style="background: var(--c-cream); padding: 1rem; border-radius: var(--radius-xs);">
                                <strong>Client Measurements:</strong>
                                <div style="margin-top: 0.4rem; color: var(--c-text-muted);">
                                    Chest/Bust: ${r.measurements?.bust || 'TBD'} | Waist: ${r.measurements?.waist || 'TBD'}<br>
                                    Shoulder/Hips: ${r.measurements?.hips || 'TBD'} | Height: ${r.measurements?.height || 'TBD'}
                                </div>
                            </div>
                        </div>

                        <div style="display: flex; justify-content: space-between; align-items: center; pt-2;">
                            <div>
                                <label style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">Status: </label>
                                <select style="padding: 0.4rem 0.8rem; border: 1px solid var(--c-border); border-radius: 2px;" onchange="DesignerPortal.updateBespokeStatus('${r.id}', this.value)">
                                    <option value="Pending Review" ${r.status === 'Pending Review' ? 'selected' : ''}>Pending Review</option>
                                    <option value="Consultation Scheduled" ${r.status === 'Consultation Scheduled' ? 'selected' : ''}>Consultation Scheduled</option>
                                    <option value="In Toile Fitting" ${r.status === 'In Toile Fitting' ? 'selected' : ''}>In Fitting / Sewing</option>
                                    <option value="Completed" ${r.status === 'Completed' ? 'selected' : ''}>Completed / Delivered</option>
                                </select>
                            </div>
                            <a href="https://wa.me/${(r.phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello ' + r.clientName + ', this is TM Fashion House regarding your custom bespoke commission #' + r.id)}" target="_blank" class="btn btn-whatsapp btn-sm">
                                <i class="fa-brands fa-whatsapp"></i> Chat on WhatsApp
                            </a>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    renderProfileEditor(container) {
        container.innerHTML = `
            <div style="margin-bottom: 2rem;">
                <h3 style="font-family: var(--font-serif); font-size: 1.6rem; color: var(--c-noir);">Designer Credentials & Brand Story</h3>
                <p style="font-size: 0.85rem; color: var(--c-text-muted);">Customize the creative director bio, design philosophy, and achievements displayed on the website.</p>
            </div>

            <form onsubmit="DesignerPortal.saveProfile(event)" class="form-grid">
                <div>
                    <label class="form-label">Creative Director / Designer Name</label>
                    <input type="text" class="form-control" id="dp-name" value="T.M. (Lead Couturier & Creative Director)" required>
                </div>
                <div>
                    <label class="form-label">Title / Role</label>
                    <input type="text" class="form-control" id="dp-title" value="Founder, Master Tailor & Creative Director" required>
                </div>
                <div class="form-group-full">
                    <label class="form-label">Design Philosophy Quote</label>
                    <input type="text" class="form-control" id="dp-quote" value="Every stitch is a statement of elegance, confidence, and bespoke craftsmanship.">
                </div>
                <div class="form-group-full">
                    <label class="form-label">Biography & Craftsmanship Story</label>
                    <textarea class="form-control" id="dp-bio" rows="4">As the founder and master designer behind TM Fashion House, our creative director brings over a decade of mastery in bespoke tailoring, high-precision African sartorial kaftans, sharp executive suits, and bespoke women's couture gowns. Every ready-to-wear piece is hand-finished with signature embroidery, premium cashmere wools, and rich silks.</textarea>
                </div>
                <div class="form-group-full" style="text-align: right;">
                    <button type="submit" class="btn btn-gold">
                        <i class="fa-solid fa-floppy-disk"></i> Update Designer Profile
                    </button>
                </div>
            </form>
        `;
    },

    showAddProductModal() {
        const name = prompt("Outfit Name (e.g. 'Royal Emerald Senator Kaftan'):");
        if (!name) return;

        const priceStr = prompt("Price (in Naira ₦, e.g. 85000):", "85000");
        const price = parseInt(priceStr, 10) || 75000;

        const category = prompt("Category ('men', 'women', 'accessories'):", "men");
        const gender = prompt("Collection / Target ('men', 'women', 'unisex'):", "men");
        const fabric = prompt("Fabric Description (e.g. '100% Superfine Italian Cashmere Wool'):", "Superfine Wool Blend");
        const imageUrl = prompt("Image Path or URL (e.g. './img/1000465980.png'):", "./img/1000465980.png");

        const newProd = {
            id: `TM-${Math.floor(100 + Math.random() * 900)}`,
            name: name,
            category: category || 'men',
            gender: gender || 'men',
            price: price,
            currencySymbol: "₦",
            originalPrice: null,
            badge: "New Atelier Piece",
            inStock: true,
            stockCount: 5,
            readyToShip: true,
            description: `Handcrafted luxury outfit by TM Fashion House master tailors. Built with signature embroidery and clean bespoke finish.`,
            fabric: fabric,
            care: "Dry Clean or Gentle Steam Press",
            designerNote: "A statement silhouette designed for elegance and prestige.",
            sizes: ["S", "M", "L", "XL", "XXL"],
            colors: [{ name: "Original Tone", hex: "#5a2a27", code: "brown" }],
            images: [imageUrl],
            rating: 5.0,
            reviewsCount: 1,
            isFeatured: true
        };

        this.state.products.unshift(newProd);
        localStorage.setItem('tm_fashion_products', JSON.stringify(this.state.products));
        this.renderActiveTab();
        alert(`Outfit "${name}" added to ready-to-wear catalog!`);
    },

    updateProductStock(productId, newCount) {
        const prod = this.state.products.find(p => p.id === productId);
        if (prod) {
            prod.stockCount = parseInt(newCount, 10) || 0;
            localStorage.setItem('tm_fashion_products', JSON.stringify(this.state.products));
        }
    },

    deleteProduct(productId) {
        if (!confirm('Are you sure you want to remove this piece from the catalog?')) return;
        this.state.products = this.state.products.filter(p => p.id !== productId);
        localStorage.setItem('tm_fashion_products', JSON.stringify(this.state.products));
        this.renderActiveTab();
    },

    updateOrderStatus(orderId, newStatus) {
        const order = this.state.orders.find(o => o.id === orderId);
        if (order) {
            order.status = newStatus;
            localStorage.setItem('tm_orders', JSON.stringify(this.state.orders));
            alert(`Order #${orderId} status updated to: ${newStatus}`);
        }
    },

    updateBespokeStatus(reqId, newStatus) {
        const req = this.state.bespokeRequests.find(r => r.id === reqId);
        if (req) {
            req.status = newStatus;
            localStorage.setItem('tm_bespoke_requests', JSON.stringify(this.state.bespokeRequests));
            alert(`Commission #${reqId} status updated to: ${newStatus}`);
        }
    },

    saveProfile(event) {
        event.preventDefault();
        alert('✨ Designer Profile & Atelier Story Updated Successfully! ✨');
    }
};

window.DesignerPortal = DesignerPortal;
