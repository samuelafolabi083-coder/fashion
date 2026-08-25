/**
 * TM Fashion House — Main Client Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    MaisonApp.init();
});

const MaisonApp = {
    state: {
        products: [],
        filteredProducts: [],
        cart: [],
        wishlist: [],
        activeCategory: 'all',
        searchQuery: '',
        sortBy: 'featured',
        appliedCoupon: null,
        selectedProductForModal: null,
        selectedSize: null,
        selectedColor: null,
        bespokeStep: 1,
        bespokeData: {
            serviceId: 'bespoke-men-sartorial',
            consultationType: 'In-Person Atelier Fitting (Lagos)',
            measurements: {},
            client: {}
        }
    },

    init() {
        this.loadInitialData();
        this.loadStoredState();
        this.renderAll();
        this.bindEvents();
    },

    loadInitialData() {
        const storedProducts = localStorage.getItem('tm_fashion_products');
        if (storedProducts) {
            try {
                this.state.products = JSON.parse(storedProducts);
            } catch (e) {
                this.state.products = [...INITIAL_PRODUCTS];
            }
        } else {
            this.state.products = [...INITIAL_PRODUCTS];
        }
        this.state.filteredProducts = [...this.state.products];
    },

    loadStoredState() {
        try {
            const savedCart = localStorage.getItem('tm_fashion_cart');
            if (savedCart) this.state.cart = JSON.parse(savedCart);

            const savedWishlist = localStorage.getItem('tm_fashion_wishlist');
            if (savedWishlist) this.state.wishlist = JSON.parse(savedWishlist);
        } catch (e) {
            console.warn('Storage parse error:', e);
        }
    },

    saveState() {
        localStorage.setItem('tm_fashion_cart', JSON.stringify(this.state.cart));
        localStorage.setItem('tm_fashion_wishlist', JSON.stringify(this.state.wishlist));
        localStorage.setItem('tm_fashion_products', JSON.stringify(this.state.products));
        this.updateHeaderBadges();
    },

    renderAll() {
        this.renderProducts();
        this.renderCart();
        this.renderLookbook();
        this.renderBespokeServices();
        this.renderTestimonials();
        this.updateHeaderBadges();
    },

    // =========================================================================
    // PRODUCT CATALOG & FILTERING
    // =========================================================================

    filterProducts() {
        let list = [...this.state.products];

        // Category filter
        if (this.state.activeCategory !== 'all') {
            list = list.filter(p => 
                p.category === this.state.activeCategory || 
                p.gender === this.state.activeCategory
            );
        }

        // Search filter
        if (this.state.searchQuery.trim()) {
            const q = this.state.searchQuery.toLowerCase();
            list = list.filter(p => 
                p.name.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.fabric.toLowerCase().includes(q) ||
                (p.badge && p.badge.toLowerCase().includes(q))
            );
        }

        // Sorting
        if (this.state.sortBy === 'price-low') {
            list.sort((a, b) => a.price - b.price);
        } else if (this.state.sortBy === 'price-high') {
            list.sort((a, b) => b.price - a.price);
        } else if (this.state.sortBy === 'rating') {
            list.sort((a, b) => b.rating - a.rating);
        } else if (this.state.sortBy === 'newest') {
            list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        }

        this.state.filteredProducts = list;
        this.renderProducts();
    },

    renderProducts() {
        const grid = document.getElementById('products-grid');
        if (!grid) return;

        if (this.state.filteredProducts.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
                    <i class="fa-regular fa-compass" style="font-size: 2.5rem; color: var(--c-gold); margin-bottom: 1rem;"></i>
                    <h3 style="font-family: var(--font-serif); font-size: 1.6rem; margin-bottom: 0.5rem;">No Outfits Found</h3>
                    <p style="color: var(--c-text-muted); font-size: 0.9rem;">Try adjusting your filter or search keywords to view our bespoke collections.</p>
                    <button class="btn btn-outline" style="margin-top: 1.5rem;" onclick="MaisonApp.resetFilters()">View All Collections</button>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.state.filteredProducts.map(p => {
            const isWishlisted = this.state.wishlist.includes(p.id);
            const primaryImg = p.images && p.images[0] ? p.images[0] : './img/c43660ab-0248-4a86-8bbc-b82530665571.png';
            const secondaryImg = p.images && p.images[1] ? p.images[1] : primaryImg;
            const curr = p.currencySymbol || "₦";

            return `
                <div class="product-card" data-id="${p.id}">
                    <div class="product-media">
                        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
                        <div class="product-actions-floating">
                            <button class="quick-action-btn ${isWishlisted ? 'active-wishlist' : ''}" 
                                    title="${isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}"
                                    onclick="MaisonApp.toggleWishlist('${p.id}')">
                                <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                            </button>
                        </div>
                        <img src="${primaryImg}" 
                             alt="${p.name}" 
                             class="product-img" 
                             onmouseover="this.src='${secondaryImg}'" 
                             onmouseout="this.src='${primaryImg}'"
                             onclick="MaisonApp.openQuickView('${p.id}')">
                        <button class="quick-view-overlay-btn" onclick="MaisonApp.openQuickView('${p.id}')">
                            <i class="fa-regular fa-eye"></i> Quick View & Specs
                        </button>
                    </div>
                    <div class="product-info">
                        <span class="product-category-tag">${p.gender} / ${p.category}</span>
                        <h3 class="product-name" onclick="MaisonApp.openQuickView('${p.id}')" style="cursor: pointer;">${p.name}</h3>
                        
                        <div class="product-price-row">
                            <span class="product-price">${curr}${p.price.toLocaleString()}</span>
                            ${p.originalPrice ? `<span class="product-original-price">${curr}${p.originalPrice.toLocaleString()}</span>` : ''}
                        </div>

                        <p class="product-meta-specs">${p.description}</p>

                        ${p.colors && p.colors.length ? `
                            <div class="swatches-row">
                                ${p.colors.map((c, i) => `
                                    <span class="color-swatch ${i === 0 ? 'active' : ''}" 
                                          style="background-color: ${c.hex};" 
                                          title="${c.name}"></span>
                                `).join('')}
                            </div>
                        ` : ''}

                        <div class="stock-indicator">
                            <span class="stock-dot"></span>
                            <span>${p.stockCount <= 3 ? `Only ${p.stockCount} left in Atelier` : 'Ready to Ship (Fast Dispatch)'}</span>
                        </div>

                        <div class="product-card-footer">
                            <button class="btn btn-primary" style="width: 100%;" onclick="MaisonApp.quickAddToCart('${p.id}')">
                                <i class="fa-solid fa-bag-shopping"></i> Add to Bag
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    resetFilters() {
        this.state.activeCategory = 'all';
        this.state.searchQuery = '';
        this.state.sortBy = 'featured';
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === 'all');
        });
        const searchEl = document.getElementById('search-input');
        if (searchEl) searchEl.value = '';
        const sortEl = document.getElementById('sort-select');
        if (sortEl) sortEl.value = 'featured';
        this.filterProducts();
    },

    // =========================================================================
    // QUICK VIEW MODAL
    // =========================================================================

    openQuickView(productId) {
        const product = this.state.products.find(p => p.id === productId);
        if (!product) return;

        this.state.selectedProductForModal = product;
        this.state.selectedSize = product.sizes ? product.sizes[0] : 'Standard';
        this.state.selectedColor = product.colors ? product.colors[0] : null;

        const modal = document.getElementById('quick-view-modal');
        const content = document.getElementById('quick-view-content');
        if (!modal || !content) return;

        const primaryImg = product.images && product.images[0] ? product.images[0] : '';
        const isWishlisted = this.state.wishlist.includes(product.id);
        const curr = product.currencySymbol || "₦";

        content.innerHTML = `
            <div class="quick-view-grid">
                <div class="quick-view-gallery">
                    <img id="qv-main-img" src="${primaryImg}" alt="${product.name}">
                    ${product.images && product.images.length > 1 ? `
                        <div style="display: flex; gap: 0.5rem; position: absolute; bottom: 1rem; left: 1rem; z-index: 5;">
                            ${product.images.map((img, i) => `
                                <img src="${img}" style="width: 50px; height: 65px; object-fit: cover; cursor: pointer; border: 2px solid ${i === 0 ? 'var(--c-gold)' : '#fff'}; border-radius: 2px;"
                                     onclick="document.getElementById('qv-main-img').src='${img}';">
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
                <div class="quick-view-details">
                    <span class="eyebrow">${product.gender} Couture / ${product.category}</span>
                    <h2 style="font-family: var(--font-serif); font-size: 2rem; margin-bottom: 0.75rem; color: var(--c-noir);">${product.name}</h2>
                    
                    <div style="display: flex; align-items: baseline; gap: 1rem; margin-bottom: 1.25rem;">
                        <span style="font-family: var(--font-serif); font-size: 1.75rem; font-weight: 700; color: var(--c-noir);">${curr}${product.price.toLocaleString()}</span>
                        ${product.originalPrice ? `<span style="text-decoration: line-through; color: var(--c-text-light);">${curr}${product.originalPrice.toLocaleString()}</span>` : ''}
                        <span style="font-size: 0.75rem; color: var(--c-success); font-weight: 600; margin-left: auto;">
                            <i class="fa-solid fa-check"></i> ${product.stockCount} Ready at Atelier
                        </span>
                    </div>

                    <p style="font-size: 0.9rem; color: var(--c-text-muted); line-height: 1.7; margin-bottom: 1.5rem;">${product.description}</p>

                    ${product.designerNote ? `
                        <div style="background: var(--c-cream-soft); border-left: 3px solid var(--c-gold); padding: 0.85rem 1.25rem; font-style: italic; font-size: 0.85rem; margin-bottom: 1.5rem;">
                            <strong>Designer Note:</strong> "${product.designerNote}"
                        </div>
                    ` : ''}

                    <div class="size-selector-group">
                        <div class="size-selector-header">
                            <strong>Select Size / Cut</strong>
                            <span class="size-guide-link" onclick="MaisonApp.openSizeGuide()"><i class="fa-solid fa-ruler-combined"></i> Size Reference Guide</span>
                        </div>
                        <div class="size-options">
                            ${product.sizes.map(s => `
                                <div class="size-pill ${s === this.state.selectedSize ? 'selected' : ''}" 
                                     onclick="MaisonApp.selectModalSize('${s}', this)">${s}</div>
                            `).join('')}
                        </div>
                    </div>

                    ${product.colors && product.colors.length ? `
                        <div style="margin-bottom: 1.5rem;">
                            <div style="font-size: 0.8rem; font-weight: 600; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.1em;">
                                Color Palette: <span id="qv-color-name" style="font-weight: 400; color: var(--c-gold-dark);">${product.colors[0].name}</span>
                            </div>
                            <div class="swatches-row">
                                ${product.colors.map((c, i) => `
                                    <span class="color-swatch ${i === 0 ? 'active' : ''}" 
                                          style="background-color: ${c.hex}; width: 24px; height: 24px;" 
                                          onclick="MaisonApp.selectModalColor('${c.name}', '${c.hex}', this)"></span>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}

                    <div style="background: #fff; border: 1px solid var(--c-border); padding: 1rem; border-radius: var(--radius-xs); margin-bottom: 1.75rem; font-size: 0.8rem; color: var(--c-text-muted);">
                        <div style="margin-bottom: 0.35rem;"><strong>Fabric Composition:</strong> ${product.fabric}</div>
                        <div><strong>Care & Valet:</strong> ${product.care}</div>
                    </div>

                    <div style="display: flex; gap: 1rem; margin-top: auto; flex-wrap: wrap;">
                        <button class="btn btn-primary" style="flex-grow: 1;" onclick="MaisonApp.addModalProductToCart()">
                            <i class="fa-solid fa-bag-shopping"></i> Add to Shopping Bag
                        </button>
                        <a href="https://wa.me/2348000000000?text=${encodeURIComponent('Hello TM Fashion House, I want to order/inquire about ' + product.name + ' (Price: ' + curr + product.price.toLocaleString() + ')')}" target="_blank" class="btn btn-whatsapp">
                            <i class="fa-brands fa-whatsapp"></i> Order on WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        `;

        modal.classList.add('active');
    },

    selectModalSize(size, el) {
        this.state.selectedSize = size;
        document.querySelectorAll('.size-pill').forEach(p => p.classList.remove('selected'));
        el.classList.add('selected');
    },

    selectModalColor(colorName, hex, el) {
        this.state.selectedColor = { name: colorName, hex: hex };
        const label = document.getElementById('qv-color-name');
        if (label) label.textContent = colorName;
        document.querySelectorAll('.quick-view-details .color-swatch').forEach(s => s.classList.remove('active'));
        el.classList.add('active');
    },

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('active');
    },

    openSizeGuide() {
        alert("TM FASHION HOUSE SIZE REFERENCE:\n\nMEN KAFTANS & SUITS:\nS: Chest 36-38\" | Waist 30-32\" | Shoulder 17\"\nM: Chest 39-41\" | Waist 33-35\" | Shoulder 18\"\nL: Chest 42-44\" | Waist 36-38\" | Shoulder 19\"\nXL: Chest 45-47\" | Waist 39-42\" | Shoulder 20\"\nXXL: Chest 48-50\" | Waist 43-46\" | Shoulder 21\"\n\nWOMEN COUTURE & GOWNS:\nXS: Bust 32\" | Waist 24\" | Hips 34\"\nS: Bust 34\" | Waist 26\" | Hips 36\"\nM: Bust 36\" | Waist 28\" | Hips 38\"\nL: Bust 38\" | Waist 30\" | Hips 40\"\nXL: Bust 40\" | Waist 32\" | Hips 42\"\n\n* Custom bespoke tailored measurements can be requested via our Bespoke Consultation Form!");
    },

    // =========================================================================
    // CART & CHECKOUT MANAGEMENT
    // =========================================================================

    quickAddToCart(productId) {
        const product = this.state.products.find(p => p.id === productId);
        if (!product) return;

        const defaultSize = product.sizes ? product.sizes[0] : 'Standard';
        const defaultColor = product.colors ? product.colors[0].name : 'Original';

        this.addToCartInternal(product, defaultSize, defaultColor);
    },

    addModalProductToCart() {
        if (!this.state.selectedProductForModal) return;
        const product = this.state.selectedProductForModal;
        const size = this.state.selectedSize || (product.sizes ? product.sizes[0] : 'Standard');
        const color = this.state.selectedColor ? this.state.selectedColor.name : (product.colors ? product.colors[0].name : 'Original');

        this.addToCartInternal(product, size, color);
        this.closeModal('quick-view-modal');
    },

    addToCartInternal(product, size, color) {
        const existingIndex = this.state.cart.findIndex(item => 
            item.id === product.id && item.size === size && item.color === color
        );

        if (existingIndex > -1) {
            this.state.cart[existingIndex].quantity += 1;
        } else {
            this.state.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                currencySymbol: product.currencySymbol || "₦",
                size: size,
                color: color,
                image: product.images && product.images[0] ? product.images[0] : '',
                quantity: 1
            });
        }

        this.saveState();
        this.renderCart();
        this.openCartDrawer();
        this.showToast(`Added "${product.name}" (${size}) to your bag.`);
    },

    updateCartItemQty(index, delta) {
        if (!this.state.cart[index]) return;
        this.state.cart[index].quantity += delta;
        if (this.state.cart[index].quantity <= 0) {
            this.state.cart.splice(index, 1);
        }
        this.saveState();
        this.renderCart();
    },

    removeCartItem(index) {
        this.state.cart.splice(index, 1);
        this.saveState();
        this.renderCart();
        this.showToast('Item removed from shopping bag.');
    },

    applyPromoCode() {
        const input = document.getElementById('coupon-input');
        if (!input) return;
        const code = input.value.trim().toUpperCase();

        if (code === 'TMVIP10' || code === 'AURELIA10') {
            this.state.appliedCoupon = { code: 'TMVIP10', discount: 0.10, label: '10% TM VIP Patron Privilege' };
            this.showToast('Privilege Code Applied: 10% Off Entire Order!');
        } else if (code === 'ROYAL15' || code === 'VOGUE15') {
            this.state.appliedCoupon = { code: 'ROYAL15', discount: 0.15, label: '15% Royal Collection Access' };
            this.showToast('Royal Code Applied: 15% Off!');
        } else {
            this.showToast('Invalid or expired privilege code.');
            return;
        }

        this.renderCart();
    },

    renderCart() {
        const container = document.getElementById('cart-items-container');
        const countBadge = document.getElementById('cart-count-badge');
        const subtotalEl = document.getElementById('cart-subtotal');
        const discountEl = document.getElementById('cart-discount-row');
        const totalEl = document.getElementById('cart-total');

        const totalItemsCount = this.state.cart.reduce((sum, item) => sum + item.quantity, 0);
        if (countBadge) countBadge.textContent = totalItemsCount;

        if (!container) return;

        if (this.state.cart.length === 0) {
            container.innerHTML = `
                <div class="cart-empty-state">
                    <i class="fa-solid fa-bag-shopping cart-empty-icon"></i>
                    <h3 style="font-family: var(--font-serif); font-size: 1.4rem; margin-bottom: 0.5rem;">Your Bag is Empty</h3>
                    <p style="font-size: 0.85rem; color: var(--c-text-muted); margin-bottom: 1.5rem;">Discover our latest ready-to-wear wears handcrafted in our TM atelier.</p>
                    <button class="btn btn-outline" onclick="MaisonApp.closeCartDrawer()">Explore Collection</button>
                </div>
            `;
            if (subtotalEl) subtotalEl.textContent = '₦0';
            if (totalEl) totalEl.textContent = '₦0';
            if (discountEl) discountEl.style.display = 'none';
            return;
        }

        const curr = this.state.cart[0]?.currencySymbol || "₦";

        container.innerHTML = `
            <div class="cart-items-list">
                ${this.state.cart.map((item, idx) => `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                        <div class="cart-item-info">
                            <div class="item-name">${item.name}</div>
                            <div class="item-variant">Size: ${item.size} | ${item.color}</div>
                            <div class="item-price">${item.currencySymbol || "₦"}${(item.price * item.quantity).toLocaleString()}</div>
                            <div class="qty-control" style="margin-top: 0.5rem;">
                                <button class="qty-btn" onclick="MaisonApp.updateCartItemQty(${idx}, -1)">-</button>
                                <span class="qty-display">${item.quantity}</span>
                                <button class="qty-btn" onclick="MaisonApp.updateCartItemQty(${idx}, 1)">+</button>
                            </div>
                        </div>
                        <button class="cart-item-remove" onclick="MaisonApp.removeCartItem(${idx})" title="Remove">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>
                    </div>
                `).join('')}
            </div>
        `;

        const subtotal = this.state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        let discountAmt = 0;
        if (this.state.appliedCoupon) {
            discountAmt = subtotal * this.state.appliedCoupon.discount;
        }
        const total = Math.max(0, subtotal - discountAmt);

        if (subtotalEl) subtotalEl.textContent = `${curr}${subtotal.toLocaleString()}`;
        if (discountEl) {
            if (this.state.appliedCoupon) {
                discountEl.style.display = 'flex';
                discountEl.innerHTML = `<span>${this.state.appliedCoupon.label}</span><span>-${curr}${discountAmt.toLocaleString()}</span>`;
            } else {
                discountEl.style.display = 'none';
            }
        }
        if (totalEl) totalEl.textContent = `${curr}${total.toLocaleString()}`;
    },

    openCartDrawer() {
        document.getElementById('cart-drawer')?.classList.add('active');
        document.getElementById('drawer-backdrop')?.classList.add('active');
    },

    closeCartDrawer() {
        document.getElementById('cart-drawer')?.classList.remove('active');
        document.getElementById('drawer-backdrop')?.classList.remove('active');
    },

    toggleWishlist(productId) {
        const index = this.state.wishlist.indexOf(productId);
        if (index > -1) {
            this.state.wishlist.splice(index, 1);
            this.showToast('Removed from your private wishlist.');
        } else {
            this.state.wishlist.push(productId);
            this.showToast('Saved to your private wishlist.');
        }
        this.saveState();
        this.renderProducts();
    },

    updateHeaderBadges() {
        const cartBadge = document.getElementById('cart-count-badge');
        if (cartBadge) {
            const count = this.state.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartBadge.textContent = count;
        }
        const wishBadge = document.getElementById('wishlist-count-badge');
        if (wishBadge) {
            wishBadge.textContent = this.state.wishlist.length;
        }
    },

    // =========================================================================
    // BESPOKE CONSULTATION WIZARD
    // =========================================================================

    openBespokeModal(preselectedServiceId = null) {
        if (preselectedServiceId) {
            this.state.bespokeData.serviceId = preselectedServiceId;
        }
        this.state.bespokeStep = 1;
        this.renderBespokeStep();
        const modal = document.getElementById('bespoke-modal');
        if (modal) modal.classList.add('active');
    },

    renderBespokeStep() {
        const container = document.getElementById('bespoke-form-container');
        if (!container) return;

        // Step 1: Select Service & Type
        if (this.state.bespokeStep === 1) {
            container.innerHTML = `
                <div class="wizard-progress">
                    <div class="wizard-step-indicator active">
                        <div class="step-circle">1</div>
                        <span style="font-size: 0.7rem; font-weight: 600;">Service</span>
                    </div>
                    <div class="wizard-step-indicator">
                        <div class="step-circle">2</div>
                        <span style="font-size: 0.7rem; font-weight: 600;">Measurements</span>
                    </div>
                    <div class="wizard-step-indicator">
                        <div class="step-circle">3</div>
                        <span style="font-size: 0.7rem; font-weight: 600;">Contact</span>
                    </div>
                </div>

                <h3 style="font-family: var(--font-serif); font-size: 1.6rem; margin-bottom: 0.5rem; text-align: center;">Commission a TM Bespoke Creation</h3>
                <p style="font-size: 0.85rem; color: var(--c-text-muted); text-align: center; margin-bottom: 2rem;">Every bespoke outfit is personally cut and supervised by our Master Fashion Designer.</p>

                <div class="form-group-full" style="margin-bottom: 1.5rem;">
                    <label class="form-label">Select Bespoke Service Tier</label>
                    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                        ${BESPOKE_SERVICES.map(s => `
                            <label style="display: flex; align-items: center; justify-content: space-between; padding: 1.25rem; border: 1px solid ${this.state.bespokeData.serviceId === s.id ? 'var(--c-gold)' : 'var(--c-border)'}; border-radius: var(--radius-xs); cursor: pointer; background: ${this.state.bespokeData.serviceId === s.id ? 'var(--c-gold-light)' : '#fff'};">
                                <div style="display: flex; align-items: center; gap: 1rem;">
                                    <input type="radio" name="bespoke_svc" value="${s.id}" ${this.state.bespokeData.serviceId === s.id ? 'checked' : ''} onchange="MaisonApp.state.bespokeData.serviceId='${s.id}'; MaisonApp.renderBespokeStep();">
                                    <div>
                                        <div style="font-weight: 600; font-size: 0.95rem;">${s.title}</div>
                                        <div style="font-size: 0.75rem; color: var(--c-text-muted);">${s.tagline}</div>
                                    </div>
                                </div>
                                <span style="font-family: var(--font-serif); font-weight: 700; color: var(--c-noir);">From ${s.currencySymbol || "₦"}${s.startingPrice.toLocaleString()}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>

                <div class="form-grid">
                    <div>
                        <label class="form-label">Consultation Format</label>
                        <select class="form-control" id="bespoke-format" onchange="MaisonApp.state.bespokeData.consultationType=this.value">
                            <option value="In-Person Atelier Fitting (Lagos)" ${this.state.bespokeData.consultationType.includes('Lagos') ? 'selected' : ''}>In-Person Atelier Fitting (Lagos)</option>
                            <option value="In-Person Atelier Fitting (Abuja)" ${this.state.bespokeData.consultationType.includes('Abuja') ? 'selected' : ''}>In-Person Atelier Fitting (Abuja)</option>
                            <option value="WhatsApp Video Fitting Consultation" ${this.state.bespokeData.consultationType.includes('WhatsApp') ? 'selected' : ''}>WhatsApp Video Fitting (Nationwide & Diaspora)</option>
                        </select>
                    </div>
                    <div>
                        <label class="form-label">Target Event Date (Optional)</label>
                        <input type="date" class="form-control" id="bespoke-date" value="${this.state.bespokeData.eventDate || ''}">
                    </div>
                </div>

                <div style="display: flex; justify-content: flex-end; margin-top: 2.5rem;">
                    <button class="btn btn-primary" onclick="MaisonApp.nextBespokeStep()">
                        Proceed to Measurements & Style <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            `;
        } 
        // Step 2: Proportions & Measurements
        else if (this.state.bespokeStep === 2) {
            container.innerHTML = `
                <div class="wizard-progress">
                    <div class="wizard-step-indicator completed">
                        <div class="step-circle"><i class="fa-solid fa-check"></i></div>
                        <span style="font-size: 0.7rem; font-weight: 600;">Service</span>
                    </div>
                    <div class="wizard-step-indicator active">
                        <div class="step-circle">2</div>
                        <span style="font-size: 0.7rem; font-weight: 600;">Measurements</span>
                    </div>
                    <div class="wizard-step-indicator">
                        <div class="step-circle">3</div>
                        <span style="font-size: 0.7rem; font-weight: 600;">Contact</span>
                    </div>
                </div>

                <h3 style="font-family: var(--font-serif); font-size: 1.6rem; margin-bottom: 0.5rem; text-align: center;">Body Proportions & Custom Style Notes</h3>
                <p style="font-size: 0.85rem; color: var(--c-text-muted); text-align: center; margin-bottom: 2rem;">Estimates are completely fine. Exact measurements will be taken during your fitting consultation.</p>

                <div class="form-grid">
                    <div>
                        <label class="form-label">Chest / Bust (inches)</label>
                        <input type="text" class="form-control" id="m-bust" placeholder="e.g. 42 inches" value="${this.state.bespokeData.measurements.bust || ''}">
                    </div>
                    <div>
                        <label class="form-label">Waist (inches)</label>
                        <input type="text" class="form-control" id="m-waist" placeholder="e.g. 34 inches" value="${this.state.bespokeData.measurements.waist || ''}">
                    </div>
                    <div>
                        <label class="form-label">Shoulder / Hips (inches)</label>
                        <input type="text" class="form-control" id="m-hips" placeholder="e.g. 19 in shoulder / 40 in hips" value="${this.state.bespokeData.measurements.hips || ''}">
                    </div>
                    <div>
                        <label class="form-label">Height / Length</label>
                        <input type="text" class="form-control" id="m-height" placeholder="e.g. 5'11\"" value="${this.state.bespokeData.measurements.height || ''}">
                    </div>
                    <div class="form-group-full">
                        <label class="form-label">Design Vision & Fabric Desires</label>
                        <textarea class="form-control" id="bespoke-notes" rows="3" placeholder="Describe the embroidery, colors, collar style, or specific event requirements...">${this.state.bespokeData.notes || ''}</textarea>
                    </div>
                </div>

                <div style="display: flex; justify-content: space-between; margin-top: 2.5rem;">
                    <button class="btn btn-outline" onclick="MaisonApp.state.bespokeStep=1; MaisonApp.renderBespokeStep();">
                        <i class="fa-solid fa-arrow-left"></i> Back
                    </button>
                    <button class="btn btn-primary" onclick="MaisonApp.nextBespokeStep()">
                        Contact & Confirmation <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            `;
        } 
        // Step 3: Contact & Booking
        else if (this.state.bespokeStep === 3) {
            container.innerHTML = `
                <div class="wizard-progress">
                    <div class="wizard-step-indicator completed">
                        <div class="step-circle"><i class="fa-solid fa-check"></i></div>
                        <span style="font-size: 0.7rem; font-weight: 600;">Service</span>
                    </div>
                    <div class="wizard-step-indicator completed">
                        <div class="step-circle"><i class="fa-solid fa-check"></i></div>
                        <span style="font-size: 0.7rem; font-weight: 600;">Measurements</span>
                    </div>
                    <div class="wizard-step-indicator active">
                        <div class="step-circle">3</div>
                        <span style="font-size: 0.7rem; font-weight: 600;">Contact</span>
                    </div>
                </div>

                <h3 style="font-family: var(--font-serif); font-size: 1.6rem; margin-bottom: 0.5rem; text-align: center;">Client Contact & WhatsApp Details</h3>
                <p style="font-size: 0.85rem; color: var(--c-text-muted); text-align: center; margin-bottom: 2rem;">Our master tailor concierge will contact you via WhatsApp / Phone to schedule your fitting.</p>

                <div class="form-grid">
                    <div>
                        <label class="form-label">Full Name *</label>
                        <input type="text" class="form-control" id="c-name" placeholder="e.g. Chief Babatunde Adeleke" required>
                    </div>
                    <div>
                        <label class="form-label">Email Address *</label>
                        <input type="email" class="form-control" id="c-email" placeholder="babatunde@domain.com" required>
                    </div>
                    <div>
                        <label class="form-label">WhatsApp / Phone Number *</label>
                        <input type="tel" class="form-control" id="c-phone" placeholder="+234 800 000 0000" required>
                    </div>
                    <div>
                        <label class="form-label">Estimated Budget Tier</label>
                        <select class="form-control" id="c-budget">
                            <option value="₦70,000 - ₦120,000">₦70,000 - ₦120,000</option>
                            <option value="₦120,000 - ₦250,000">₦120,000 - ₦250,000 (Royal Luxury)</option>
                            <option value="₦250,000+">₦250,000+ (Grand Agbada / Wedding Entourage)</option>
                        </select>
                    </div>
                </div>

                <div style="display: flex; justify-content: space-between; margin-top: 2.5rem;">
                    <button class="btn btn-outline" onclick="MaisonApp.state.bespokeStep=2; MaisonApp.renderBespokeStep();">
                        <i class="fa-solid fa-arrow-left"></i> Back
                    </button>
                    <button class="btn btn-gold" onclick="MaisonApp.submitBespokeRequest()">
                        <i class="fa-solid fa-calendar-check"></i> Submit Custom Tailoring Request
                    </button>
                </div>
            `;
        }
    },

    nextBespokeStep() {
        if (this.state.bespokeStep === 1) {
            const dateEl = document.getElementById('bespoke-date');
            if (dateEl) this.state.bespokeData.eventDate = dateEl.value;
            this.state.bespokeStep = 2;
            this.renderBespokeStep();
        } else if (this.state.bespokeStep === 2) {
            this.state.bespokeData.measurements = {
                bust: document.getElementById('m-bust')?.value || '',
                waist: document.getElementById('m-waist')?.value || '',
                hips: document.getElementById('m-hips')?.value || '',
                height: document.getElementById('m-height')?.value || ''
            };
            this.state.bespokeData.notes = document.getElementById('bespoke-notes')?.value || '';
            this.state.bespokeStep = 3;
            this.renderBespokeStep();
        }
    },

    submitBespokeRequest() {
        const name = document.getElementById('c-name')?.value;
        const email = document.getElementById('c-email')?.value;
        const phone = document.getElementById('c-phone')?.value;
        const budget = document.getElementById('c-budget')?.value;

        if (!name || !email || !phone) {
            alert('Please provide your name, phone/WhatsApp number, and email.');
            return;
        }

        const newRequest = {
            id: `TM-BSPK-${Math.floor(100 + Math.random() * 900)}`,
            clientName: name,
            clientEmail: email,
            phone: phone,
            budget: budget,
            serviceType: BESPOKE_SERVICES.find(s => s.id === this.state.bespokeData.serviceId)?.title || 'Bespoke Couture',
            consultationType: this.state.bespokeData.consultationType,
            eventDate: this.state.bespokeData.eventDate || 'Flexible',
            status: 'Pending Review',
            notes: this.state.bespokeData.notes,
            measurements: this.state.bespokeData.measurements
        };

        // Save to requests list
        let storedRequests = [];
        try {
            storedRequests = JSON.parse(localStorage.getItem('tm_bespoke_requests')) || [...INITIAL_BESPOKE_REQUESTS];
        } catch (e) {
            storedRequests = [...INITIAL_BESPOKE_REQUESTS];
        }
        storedRequests.unshift(newRequest);
        localStorage.setItem('tm_bespoke_requests', JSON.stringify(storedRequests));

        this.closeModal('bespoke-modal');

        // Show confirmation alert
        alert(`✨ TM FASHION HOUSE BESPOKE CONFIRMATION ✨\n\nThank you, ${name}.\nYour custom tailoring consultation reference is #${newRequest.id}.\n\nOur Master Designer and fitting concierge will review your measurements and reach out via WhatsApp (${phone}) to schedule your fitting.`);
    },

    // =========================================================================
    // CHECKOUT SIMULATION
    // =========================================================================

    openCheckoutModal() {
        if (this.state.cart.length === 0) {
            this.showToast('Your shopping bag is empty.');
            return;
        }
        this.closeCartDrawer();
        const modal = document.getElementById('checkout-modal');
        const summaryContainer = document.getElementById('checkout-summary-items');
        
        const curr = this.state.cart[0]?.currencySymbol || "₦";
        const subtotal = this.state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        let discountAmt = 0;
        if (this.state.appliedCoupon) {
            discountAmt = subtotal * this.state.appliedCoupon.discount;
        }
        const total = Math.max(0, subtotal - discountAmt);

        if (summaryContainer) {
            summaryContainer.innerHTML = `
                <div style="margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem;">
                    ${this.state.cart.map(item => `
                        <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                            <span>${item.name} (${item.size}, ${item.color}) x ${item.quantity}</span>
                            <strong>${curr}${(item.price * item.quantity).toLocaleString()}</strong>
                        </div>
                    `).join('')}
                </div>
                <div style="border-top: 1px solid var(--c-border); padding-top: 1rem; font-size: 0.9rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem;">
                        <span>Subtotal:</span>
                        <span>${curr}${subtotal.toLocaleString()}</span>
                    </div>
                    ${discountAmt > 0 ? `
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem; color: var(--c-gold);">
                            <span>Discount (${this.state.appliedCoupon.code}):</span>
                            <span>-${curr}${discountAmt.toLocaleString()}</span>
                        </div>
                    ` : ''}
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem;">
                        <span>Express Courier Delivery:</span>
                        <span style="color: var(--c-success); font-weight: 600;">Complimentary</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 1.3rem; font-weight: 700; color: var(--c-noir); margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid var(--c-border);">
                        <span>Total:</span>
                        <span>${curr}${total.toLocaleString()}</span>
                    </div>
                </div>
            `;
        }

        if (modal) modal.classList.add('active');
    },

    submitOrder(event) {
        if (event) event.preventDefault();

        const name = document.getElementById('chk-name')?.value || 'Guest Patron';
        const email = document.getElementById('chk-email')?.value || 'client@tmfashion.ng';
        const address = document.getElementById('chk-address')?.value || 'Lagos, Nigeria';
        const delivery = document.querySelector('input[name="delivery_type"]:checked')?.value || 'Express Doorstep Courier';

        const curr = this.state.cart[0]?.currencySymbol || "₦";
        const subtotal = this.state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        let discountAmt = 0;
        if (this.state.appliedCoupon) {
            discountAmt = subtotal * this.state.appliedCoupon.discount;
        }
        const total = Math.max(0, subtotal - discountAmt);

        const newOrder = {
            id: `TM-ORD-${Math.floor(1000 + Math.random() * 9000)}`,
            customerName: name,
            customerEmail: email,
            shippingAddress: address,
            deliveryType: delivery,
            items: [...this.state.cart],
            total: total,
            currencySymbol: curr,
            date: new Date().toISOString().split('T')[0],
            status: 'Pattern Cutting'
        };

        // Save order to store
        let storedOrders = [];
        try {
            storedOrders = JSON.parse(localStorage.getItem('tm_orders')) || [...INITIAL_ORDERS];
        } catch (e) {
            storedOrders = [...INITIAL_ORDERS];
        }
        storedOrders.unshift(newOrder);
        localStorage.setItem('tm_orders', JSON.stringify(storedOrders));

        // Clear Cart
        this.state.cart = [];
        this.state.appliedCoupon = null;
        this.saveState();
        this.renderCart();
        this.closeModal('checkout-modal');

        // Show Order Receipt Confirmation
        this.showOrderConfirmation(newOrder);
    },

    showOrderConfirmation(order) {
        const modal = document.getElementById('order-success-modal');
        const detailsEl = document.getElementById('order-success-details');
        const curr = order.currencySymbol || "₦";

        if (detailsEl) {
            detailsEl.innerHTML = `
                <div style="background: var(--c-cream); padding: 1.5rem; border: 1px solid var(--c-border); border-radius: var(--radius-xs); text-align: left; margin: 1.5rem 0;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
                        <strong>Order Reference:</strong>
                        <span style="font-family: var(--font-serif); font-weight: 700; color: var(--c-gold-dark);">${order.id}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
                        <strong>Patron:</strong>
                        <span>${order.customerName} (${order.customerEmail})</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
                        <strong>Delivery Protocol:</strong>
                        <span>${order.deliveryType}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
                        <strong>Total:</strong>
                        <span style="font-weight: 700;">${curr}${order.total.toLocaleString()}</span>
                    </div>
                    <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px dashed var(--c-border); font-size: 0.8rem; color: var(--c-text-muted);">
                        Every garment is neatly pressed, packed in our signature TM luxury box with dust cover, and dispatched promptly.
                    </div>
                </div>
            `;
        }
        if (modal) modal.classList.add('active');
    },

    // =========================================================================
    // LOOKBOOK & BESPOKE CARDS RENDERING
    // =========================================================================

    renderLookbook() {
        const container = document.getElementById('lookbook-grid');
        if (!container) return;

        container.innerHTML = LOOKBOOK_ITEMS.map(item => `
            <div class="lookbook-card" onclick="MaisonApp.scrollToShop()">
                <img src="${item.image}" alt="${item.title}">
                <div class="lookbook-card-overlay">
                    <span class="lookbook-season">${item.season}</span>
                    <h3 class="lookbook-card-title">${item.title}</h3>
                    <p class="lookbook-card-desc">${item.description}</p>
                    <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em; color: var(--c-gold);">
                        <i class="fa-solid fa-arrow-right"></i> Explore Collection
                    </div>
                </div>
            </div>
        `).join('');
    },

    renderBespokeServices() {
        const container = document.getElementById('bespoke-services-grid');
        if (!container) return;

        container.innerHTML = BESPOKE_SERVICES.map(svc => `
            <div class="bespoke-card">
                <img src="${svc.image}" alt="${svc.title}" class="bespoke-card-img">
                <div class="bespoke-card-body">
                    <h3 class="bespoke-card-title">${svc.title}</h3>
                    <div class="bespoke-card-tagline">${svc.tagline}</div>
                    <p style="font-size: 0.85rem; color: var(--c-text-light); line-height: 1.6;">${svc.description}</p>
                    
                    <ul class="bespoke-meta-list">
                        <li><i class="fa-solid fa-hourglass-half"></i> Lead Time: ${svc.duration}</li>
                        <li><i class="fa-solid fa-user-check"></i> ${svc.fittings}</li>
                    </ul>

                    <div class="bespoke-price-starting">
                        <div>
                            <div class="starting-label">Starting Investment</div>
                            <div class="starting-price">${svc.currencySymbol || "₦"}${svc.startingPrice.toLocaleString()}</div>
                        </div>
                        <button class="btn btn-outline-gold btn-sm" onclick="MaisonApp.openBespokeModal('${svc.id}')">
                            Commission <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    },

    renderTestimonials() {
        const container = document.getElementById('press-grid');
        if (!container) return;

        container.innerHTML = PRESS_TESTIMONIALS.map(t => `
            <div class="press-card">
                <div class="quote-icon">“</div>
                <p class="press-quote">${t.quote}</p>
                <div class="press-source">${t.source}</div>
                <div class="press-author">${t.author}</div>
            </div>
        `).join('');
    },

    scrollToShop() {
        document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
    },

    showToast(message) {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fa-solid fa-circle-check text-gold"></i> <span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(30px)';
            toast.style.transition = 'all 0.3s';
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    },

    bindEvents() {
        // Category filtering
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.state.activeCategory = btn.dataset.category || 'all';
                this.filterProducts();
            });
        });

        // Search input
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.state.searchQuery = e.target.value;
                this.filterProducts();
            });
        }

        // Sort select
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.state.sortBy = e.target.value;
                this.filterProducts();
            });
        }
    }
};

window.MaisonApp = MaisonApp;
