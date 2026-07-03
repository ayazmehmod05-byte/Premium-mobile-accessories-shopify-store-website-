/* ===================================================================
   Admin.js — Royal Sphire Product Management
   Hidden admin panel accessible via 5 logo clicks or #admin hash.
   Products are persisted in localStorage and rendered into the
   public #products-grid as affiliate product cards.
   =================================================================== */

(function () {
  'use strict';

  /* ---------- Constants ---------- */

  var getAdminPassword = function () {
    return localStorage.getItem('royalSphire_admin_password') || 'royal123';
  };
  var STORAGE_KEY    = 'royalSphire_products_v5';

  /* =================================================================
     Product Manager  —  CRUD operations backed by localStorage
     ================================================================= */
  var ProductManager = {

    /**
     * Retrieve all products from localStorage.
     * @returns {Array} Products array (never null).
     */
    getProducts: function () {
      try {
        // Version check: force refresh defaults when product images are updated
        var DATA_VERSION = 'v2_corrected_images';
        var currentVersion = localStorage.getItem('royalSphire_data_version');
        if (currentVersion !== DATA_VERSION) {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.setItem('royalSphire_data_version', DATA_VERSION);
        }
        
        var stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          var parsed = JSON.parse(stored);
          if (parsed && parsed.length > 0) {
            return parsed;
          }
        }
        
        // If empty, pre-populate with default products for all categories
        var defaultProducts = [
          // Phone Cases (6 items)
          {
            id: "default-case-1",
            name: "Sleek Matte Carbon Case",
            price: "19.99",
            description: "Ultra-slim carbon fiber texture protective case with matte anti-fingerprint coating.",
            imageUrl: "images/products/product_1.jpg",
            category: "Phone Cases",
            amazonLink: "https://amazon.com",
            alibabaLink: "https://alibaba.com",
            aliexpressLink: "https://aliexpress.com"
          },
          {
            id: "default-case-2",
            name: "Armor Shockproof Bumper",
            price: "24.99",
            description: "Military grade dual-layer shockproof rugged protector with built-in kickstand.",
            imageUrl: "images/products/product_2.jpg",
            category: "Phone Cases",
            amazonLink: "https://amazon.com",
            alibabaLink: "https://alibaba.com",
            aliexpressLink: "https://aliexpress.com"
          },
          {
            id: "default-case-3",
            name: "Crystal Clear TPU Case",
            price: "14.99",
            description: "Non-yellowing clear flexible TPU shell showing off your phone's original color.",
            imageUrl: "images/products/product_3.jpg",
            category: "Phone Cases",
            amazonLink: "https://amazon.com",
            alibabaLink: "https://alibaba.com",
            aliexpressLink: "https://aliexpress.com"
          },
          {
            id: "default-case-4",
            name: "Luxury Leather Wallet Case",
            price: "29.99",
            description: "Genuine split leather folio style case with card slots and magnetic closure stand.",
            imageUrl: "images/products/product_4.jpg",
            category: "Phone Cases",
            amazonLink: "https://amazon.com",
            alibabaLink: "https://alibaba.com",
            aliexpressLink: "https://aliexpress.com"
          },
          {
            id: "default-case-5",
            name: "Minimalist Silicone Guard",
            price: "16.99",
            description: "Soft liquid silicone case with microfibre lining, snug fit, and multiple colors.",
            imageUrl: "images/products/product_5.jpg",
            category: "Phone Cases",
            amazonLink: "https://amazon.com",
            alibabaLink: "https://alibaba.com",
            aliexpressLink: "https://aliexpress.com"
          },
          {
            id: "default-case-6",
            name: "Neo Hybrid Shield",
            price: "22.99",
            description: "Tactile grid back pattern with accent color metallic camera frame protection.",
            imageUrl: "images/products/product_6.jpg",
            category: "Phone Cases",
            amazonLink: "https://amazon.com",
            alibabaLink: "https://alibaba.com",
            aliexpressLink: "https://aliexpress.com"
          },

          // Chargers & Cables (6 items)
          {
            id: "default-charger-1",
            name: "65W GaN Fast Wall Charger",
            price: "39.99",
            description: "Ultra-compact Gallium Nitride 3-port fast wall charger with Power Delivery 3.0.",
            imageUrl: "images/products/product_7.jpg",
            category: "Chargers",
            amazonLink: "https://amazon.com",
            alibabaLink: "https://alibaba.com",
            aliexpressLink: "https://aliexpress.com"
          },
          {
            id: "default-charger-2",
            name: "100W Braided USB-C Cable",
            price: "12.99",
            description: "Heavy duty double braided nylon Type-C to Type-C cable with power display screen.",
            imageUrl: "images/products/product_8.jpg",
            category: "Chargers",
            amazonLink: "https://amazon.com",
            alibabaLink: "https://alibaba.com",
            aliexpressLink: "https://aliexpress.com"
          },
          {
            id: "default-charger-3",
            name: "3-in-1 Wireless Charging Stand",
            price: "49.99",
            description: "Fast wireless charging dock for smartphone, smart watch, and wireless earbud case.",
            imageUrl: "images/products/product_9.jpg",
            category: "Chargers",
            amazonLink: "https://amazon.com",
            alibabaLink: "https://alibaba.com",
            aliexpressLink: "https://aliexpress.com"
          },
          {
            id: "default-charger-4",
            name: "Magnetic Wireless Charger Pad",
            price: "24.99",
            description: "Ultra slim MagSafe compatible wireless charger puck with reinforced USB-C input.",
            imageUrl: "images/products/product_10.jpg",
            category: "Chargers",
            amazonLink: "https://amazon.com",
            alibabaLink: "https://alibaba.com",
            aliexpressLink: "https://aliexpress.com"
          },
          {
            id: "default-charger-5",
            name: "Dual Port 45W Car Charger",
            price: "18.99",
            description: "Full metal mini car power adapter supporting USB-A QC3.0 and USB-C PD fast outputs.",
            imageUrl: "images/products/product_11.jpg",
            category: "Chargers",
            amazonLink: "https://amazon.com",
            alibabaLink: "https://alibaba.com",
            aliexpressLink: "https://aliexpress.com"
          },
          {
            id: "default-charger-6",
            name: "Coiled Fast Spring Cable",
            price: "10.99",
            description: "Flexible coiled spring USB-C charging cord, perfect length design for vehicles.",
            imageUrl: "images/products/product_12.jpg",
            category: "Chargers",
            amazonLink: "https://amazon.com",
            alibabaLink: "https://alibaba.com",
            aliexpressLink: "https://aliexpress.com"
          },

          // Earbuds & Audio (6 items)
          {
            id: "default-earbud-1",
            name: "Elite TWS Pro Earbuds",
            price: "89.99",
            description: "True wireless stereo earbuds with Active Noise Cancelling, transparency mode, and 30h battery.",
            imageUrl: "images/products/product_13.jpg",
            category: "Earbuds",
            amazonLink: "https://amazon.com",
            alibabaLink: "https://alibaba.com",
            aliexpressLink: "https://aliexpress.com"
          },
          {
            id: "default-earbud-2",
            name: "Studio Wireless Headphone",
            price: "129.99",
            description: "Hi-Res over-ear headphones with deep dynamic bass, soft protein ear pads, and fast charging.",
            imageUrl: "images/products/product_14.jpg",
            category: "Earbuds",
            amazonLink: "https://amazon.com",
            alibabaLink: "https://alibaba.com",
            aliexpressLink: "https://aliexpress.com"
          },
          {
            id: "default-earbud-3",
            name: "Noise Cancelling Pods",
            price: "59.99",
            description: "Smart environmental noise cancelling wireless pods with sweatproof design and touch controls.",
            imageUrl: "images/products/product_15.jpg",
            category: "Earbuds",
            amazonLink: "https://amazon.com",
            alibabaLink: "https://alibaba.com",
            aliexpressLink: "https://aliexpress.com"
          },
          {
            id: "default-earbud-4",
            name: "Sport Loop Hook Buds",
            price: "49.99",
            description: "Secure-fit ear hook wireless sports headphones with IPX7 rating for intense workouts.",
            imageUrl: "images/products/product_16.jpg",
            category: "Earbuds",
            amazonLink: "https://amazon.com",
            alibabaLink: "https://alibaba.com",
            aliexpressLink: "https://aliexpress.com"
          },
          {
            id: "default-earbud-5",
            name: "Mini Capsule Speaker",
            price: "34.99",
            description: "Pocket-sized wireless Bluetooth speaker with 360° surround audio and durable outdoor design.",
            imageUrl: "images/products/product_17.jpg",
            category: "Earbuds",
            amazonLink: "https://amazon.com",
            alibabaLink: "https://alibaba.com",
            aliexpressLink: "https://aliexpress.com"
          },
          {
            id: "default-earbud-6",
            name: "Crystal Sound In-Ear Buds",
            price: "29.99",
            description: "Ultra-lightweight hybrid drivers wireless in-ear monitors with high-fidelity sound signature.",
            imageUrl: "images/products/product_18.jpg",
            category: "Earbuds",
            amazonLink: "https://amazon.com",
            alibabaLink: "https://alibaba.com",
            aliexpressLink: "https://aliexpress.com"
          },

          // Power Banks (6 items)
          {
            id: "default-power-1",
            name: "20000mAh Power Station",
            price: "45.99",
            description: "High capacity portable battery pack with 22.5W Super Fast Charge and digital LED screen.",
            imageUrl: "images/products/product_19.jpg",
            category: "Power Banks",
            amazonLink: "https://amazon.com",
            alibabaLink: "https://alibaba.com",
            aliexpressLink: "https://aliexpress.com"
          },
          {
            id: "default-power-2",
            name: "MagSafe Magnetic Power Bank",
            price: "34.99",
            description: "Slim 10000mAh battery pack attaching magnetically to snap-on wireless charging phones.",
            imageUrl: "images/products/product_20.jpg",
            category: "Power Banks",
            amazonLink: "https://amazon.com",
            alibabaLink: "https://alibaba.com",
            aliexpressLink: "https://aliexpress.com"
          },
          {
            id: "default-power-3",
            name: "Solar Rugged Power Bank",
            price: "39.99",
            description: "Outdoor solar panel charging power bank with built-in dual LED flashlight and compass.",
            imageUrl: "images/products/product_21.jpg",
            category: "Power Banks",
            amazonLink: "https://amazon.com",
            alibabaLink: "https://alibaba.com",
            aliexpressLink: "https://aliexpress.com"
          },
          {
            id: "default-power-4",
            name: "Mini Pocket Power Bank",
            price: "19.99",
            description: "Ultra compact lipstick-sized portable charger plugging directly into your phone connector.",
            imageUrl: "images/products/product_22.jpg",
            category: "Power Banks",
            amazonLink: "https://amazon.com",
            alibabaLink: "https://alibaba.com",
            aliexpressLink: "https://aliexpress.com"
          },
          {
            id: "default-power-5",
            name: "100W PD Laptop Power Bank",
            price: "89.99",
            description: "High output backup power bank capable of full speed charging for notebooks and phones.",
            imageUrl: "images/products/product_23.jpg",
            category: "Power Banks",
            amazonLink: "https://amazon.com",
            alibabaLink: "https://alibaba.com",
            aliexpressLink: "https://aliexpress.com"
          },
          {
            id: "default-power-6",
            name: "Wireless QI Power Bank",
            price: "29.99",
            description: "Dual output USB power bank with a 10W integrated top wireless induction pad charging surface.",
            imageUrl: "images/products/product_24.jpg",
            category: "Power Banks",
            amazonLink: "https://amazon.com",
            alibabaLink: "https://alibaba.com",
            aliexpressLink: "https://aliexpress.com"
          },

          // Smart Watches (6 items)
          {
            id: "default-watch-1",
            name: "Aura Smartwatch Series 7",
            price: "119.99",
            description: "AMOLED high-resolution display smartwatch with comprehensive health and sleep tracking.",
            imageUrl: "images/products/product_25.jpg",
            category: "Smart Watches",
            amazonLink: "https://amazon.com",
            alibabaLink: "https://alibaba.com",
            aliexpressLink: "https://aliexpress.com"
          },
          {
            id: "default-watch-2",
            name: "Active Fitness Tracker",
            price: "69.99",
            description: "IP68 waterproof sport fitness tracker with blood oxygen tracking and 14 sport modes.",
            imageUrl: "images/products/product_26.jpg",
            category: "Smart Watches",
            amazonLink: "https://amazon.com",
            alibabaLink: "https://alibaba.com",
            aliexpressLink: "https://aliexpress.com"
          },
          {
            id: "default-watch-3",
            name: "Classic Hybrid Smartwatch",
            price: "99.99",
            description: "Classic analog watch dials layout with a smart hidden digital notifications OLED sub-display screen.",
            imageUrl: "images/products/product_27.jpg",
            category: "Smart Watches",
            amazonLink: "https://amazon.com",
            alibabaLink: "https://alibaba.com",
            aliexpressLink: "https://aliexpress.com"
          },
          {
            id: "default-watch-4",
            name: "Minimalist Sport Tracker",
            price: "49.99",
            description: "Lightweight, clean silicon sport activity tracker showing step counts, calories, and time.",
            imageUrl: "images/products/product_28.jpg",
            category: "Smart Watches",
            amazonLink: "https://amazon.com",
            alibabaLink: "https://alibaba.com",
            aliexpressLink: "https://aliexpress.com"
          },
          {
            id: "default-watch-5",
            name: "Titanium Adventure Watch",
            price: "159.99",
            description: "Hardened titanium case smartwatch built with advanced dual-band multi-system GPS sensor.",
            imageUrl: "images/products/product_29.jpg",
            category: "Smart Watches",
            amazonLink: "https://amazon.com",
            alibabaLink: "https://alibaba.com",
            aliexpressLink: "https://aliexpress.com"
          },
          {
            id: "default-watch-6",
            name: "Elegant Slim Band",
            price: "39.99",
            description: "Ultra slim fitness band monitor with continuous heart rate tracker and premium mesh metal strap.",
            imageUrl: "images/products/product_30.jpg",
            category: "Smart Watches",
            amazonLink: "https://amazon.com",
            alibabaLink: "https://alibaba.com",
            aliexpressLink: "https://aliexpress.com"
          },

          // Screen Protectors (6 items)
          {
            id: "default-protector-1",
            name: "9H Tempered Glass Guard",
            price: "9.99",
            description: "Ultra clear high-definition 9H tempered glass screen protector with case friendly edges.",
            imageUrl: "images/products/product_31.jpg",
            category: "Screen Protectors",
            amazonLink: "https://amazon.com",
            alibabaLink: "https://alibaba.com",
            aliexpressLink: "https://aliexpress.com"
          },
          {
            id: "default-protector-2",
            name: "Privacy Tempered Glass Shield",
            price: "12.99",
            description: "2-way anti-spy privacy screen shield preventing side angle visibility from observers.",
            imageUrl: "images/products/product_32.jpg",
            category: "Screen Protectors",
            amazonLink: "https://amazon.com",
            alibabaLink: "https://alibaba.com",
            aliexpressLink: "https://aliexpress.com"
          },
          {
            id: "default-protector-3",
            name: "Matte Anti-Glare Protector",
            price: "10.99",
            description: "Fingerprint resistant matte texture screen guard reducing screen light reflections.",
            imageUrl: "images/products/product_33.jpg",
            category: "Screen Protectors",
            amazonLink: "https://amazon.com",
            alibabaLink: "https://alibaba.com",
            aliexpressLink: "https://aliexpress.com"
          },
          {
            id: "default-protector-4",
            name: "Camera Lens Protector Trio",
            price: "8.99",
            description: "Premium tempered glass camera ring overlays, keeping lens glass scratch free.",
            imageUrl: "images/products/product_34.jpg",
            category: "Screen Protectors",
            amazonLink: "https://amazon.com",
            alibabaLink: "https://alibaba.com",
            aliexpressLink: "https://aliexpress.com"
          },
          {
            id: "default-protector-5",
            name: "Liquid UV Gel Screen Guard",
            price: "19.99",
            description: "Liquid dispersion tech tempered glass, curing with UV light, perfect fit for curved screen edges.",
            imageUrl: "images/products/product_35.jpg",
            category: "Screen Protectors",
            amazonLink: "https://amazon.com",
            alibabaLink: "https://alibaba.com",
            aliexpressLink: "https://aliexpress.com"
          },
          {
            id: "default-protector-6",
            name: "Flexible TPU Self-Healing Film",
            price: "11.99",
            description: "High-transparency flexible polyurethane film with self-healing tech for minor daily scratches.",
            imageUrl: "images/products/product_36.jpg",
            category: "Screen Protectors",
            amazonLink: "https://amazon.com",
            alibabaLink: "https://alibaba.com",
            aliexpressLink: "https://aliexpress.com"
          }
        ];
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts));
        return defaultProducts;
      } catch (_) {
        return [];
      }
    },

    /**
     * Persist the full products array to localStorage.
     * @param {Array} products
     */
    saveProducts: function (products) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      } catch (e) {
        if (typeof console !== 'undefined') {
          console.warn('[ProductManager] Could not save to localStorage:', e);
        }
      }
    },

    /**
     * Add a new product. Auto-generates `id` and `createdAt`.
     * @param {Object} product
     * @returns {Object} The product with generated fields.
     */
    addProduct: function (product) {
      var products       = this.getProducts();
      product.id         = Date.now().toString();
      product.createdAt  = new Date().toISOString();
      products.push(product);
      this.saveProducts(products);
      return product;
    },

    /**
     * Remove a product by ID.
     * @param {string} id
     */
    removeProduct: function (id) {
      var products = this.getProducts().filter(function (p) { return p.id !== id; });
      this.saveProducts(products);
    },

    /**
     * Merge `updates` into an existing product found by ID.
     * @param {string} id
     * @param {Object} updates
     */
    updateProduct: function (id, updates) {
      var products = this.getProducts();
      var index    = -1;
      for (var i = 0; i < products.length; i++) {
        if (products[i].id === id) { index = i; break; }
      }
      if (index !== -1) {
        var keys = Object.keys(updates);
        for (var k = 0; k < keys.length; k++) {
          products[index][keys[k]] = updates[keys[k]];
        }
        this.saveProducts(products);
      }
    },

    /**
     * Download all products as a JSON file.
     */
    exportJSON: function () {
      var data = JSON.stringify(this.getProducts(), null, 2);
      var blob = new Blob([data], { type: 'application/json' });
      var url  = URL.createObjectURL(blob);
      var a    = document.createElement('a');
      a.href     = url;
      a.download = 'royal-sphire-products.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },

    /**
     * Import products from a JSON file (replaces all existing products).
     * @param {File} file
     * @returns {Promise}
     */
    importJSON: function (file) {
      var self = this;
      return new Promise(function (resolve, reject) {
        var reader = new FileReader();

        reader.onerror = function () {
          reject('File read error');
        };

        reader.onload = function (e) {
          try {
            var products = JSON.parse(e.target.result);
            if (Array.isArray(products)) {
              self.saveProducts(products);
              resolve(products);
            } else {
              reject('Invalid format: expected a JSON array');
            }
          } catch (_) {
            reject('Invalid JSON');
          }
        };

        reader.readAsText(file);
      });
    }
  };

  /* =================================================================
     Escape HTML utility — prevents XSS when rendering user content
     ================================================================= */
  function esc(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  /* =================================================================
     Admin Panel Controller
     ================================================================= */
  var AdminPanel = {

    isAuthenticated:  false,
    logoClickCount:   0,
    logoClickTimer:   null,
    editingProductId: null,

    /* ---------- Bootstrap ---------- */

    init: function () {
      this.setupLogoAccess();
      this.setupHashAccess();
      this.setupPasswordGate();
      this.setupProductForm();
      this.setupExportImport();
      this.setupAdminTabs();
      this.setupCloseButton();

      // Render public product grid on initial page load
      this.renderPublicProducts();

      // If someone lands on example.com/#admin, open immediately
      if (window.location.hash === '#admin') {
        this.openModal();
      }
    },

    /* ---------- Access methods ---------- */

    /**
     * Open admin panel after 5 rapid clicks on the logo.
     */
    setupLogoAccess: function () {
      var self = this;
      var logo = document.getElementById('logo-click-area');
      if (!logo) return;

      logo.addEventListener('click', function (e) {
        self.logoClickCount++;
        clearTimeout(self.logoClickTimer);
        self.logoClickTimer = setTimeout(function () { self.logoClickCount = 0; }, 2000);

        if (self.logoClickCount >= 5) {
          e.preventDefault();
          self.logoClickCount = 0;
          self.openModal();
        }
      });
    },

    /**
     * React to hash changes — open modal on #admin.
     */
    setupHashAccess: function () {
      var self = this;
      window.addEventListener('hashchange', function () {
        if (window.location.hash === '#admin') {
          self.openModal();
        }
      });
    },

    /* ---------- Modal open / close ---------- */

    openModal: function () {
      var modal = document.getElementById('admin-modal');
      if (!modal) return;

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';

      if (!this.isAuthenticated) {
        this.showPasswordGate();
      } else {
        this.showDashboard();
      }
    },

    closeModal: function () {
      var modal = document.getElementById('admin-modal');
      if (!modal) return;

      modal.classList.remove('active');
      document.body.style.overflow = 'auto';

      // Clean hash without triggering hashchange scroll
      if (window.history && window.history.replaceState) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      } else {
        window.location.hash = '';
      }
    },

    setupCloseButton: function () {
      var self     = this;
      var closeBtn = document.getElementById('close-admin');
      var overlay  = document.getElementById('admin-overlay');

      if (closeBtn) closeBtn.addEventListener('click', function () { self.closeModal(); });
      if (overlay)  overlay.addEventListener('click',  function () { self.closeModal(); });

      // Close on Escape key
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          var modal = document.getElementById('admin-modal');
          if (modal && modal.classList.contains('active')) {
            self.closeModal();
          }
        }
      });
    },

    /* ---------- Password gate ---------- */

    showPasswordGate: function () {
      var gate      = document.getElementById('admin-password-gate');
      var dashboard = document.getElementById('admin-dashboard');
      if (gate)      gate.style.display = 'block';
      if (dashboard) dashboard.classList.remove('active');
    },

    showDashboard: function () {
      var gate      = document.getElementById('admin-password-gate');
      var dashboard = document.getElementById('admin-dashboard');
      if (gate)      gate.style.display = 'none';
      if (dashboard) dashboard.classList.add('active');
      this.renderAdminProducts();
    },

    setupPasswordGate: function () {
      var self      = this;
      var submitBtn = document.getElementById('admin-password-submit');
      var input     = document.getElementById('admin-password-input');
      var errorEl   = document.getElementById('admin-password-error');

      if (submitBtn) {
        submitBtn.addEventListener('click', function () {
          if (input && input.value === getAdminPassword()) {
            self.isAuthenticated = true;
            self.showDashboard();
            if (errorEl) errorEl.textContent = '';
          } else {
            if (errorEl) errorEl.textContent = 'Incorrect password. Try again.';
            if (input) { input.value = ''; input.focus(); }
          }
        });
      }

      if (input) {
        input.addEventListener('keypress', function (e) {
          if (e.key === 'Enter' && submitBtn) {
            submitBtn.click();
          }
        });
      }
    },

    /* ---------- Admin tabs ---------- */

    setupAdminTabs: function () {
      var tabs = document.querySelectorAll('.admin-tab');

      for (var i = 0; i < tabs.length; i++) {
        tabs[i].addEventListener('click', function () {
          // Deactivate all tabs & panels
          var allTabs   = document.querySelectorAll('.admin-tab');
          var allPanels = document.querySelectorAll('.admin-tab-content');
          for (var t = 0; t < allTabs.length; t++)   allTabs[t].classList.remove('active');
          for (var p = 0; p < allPanels.length; p++) allPanels[p].classList.remove('active');

          // Activate clicked tab + matching panel
          this.classList.add('active');
          var target = document.getElementById(this.dataset.tab);
          if (target) target.classList.add('active');
        });
      }
    },

    /* ---------- Product form (Add / Edit) ---------- */

    setupProductForm: function () {
      var self = this;
      var form = document.getElementById('add-product-form');
      if (!form) return;

      form.addEventListener('submit', function (e) {
        e.preventDefault();

        var product = {
          name:           (document.getElementById('product-name')        || {}).value || '',
          price:          (document.getElementById('product-price')       || {}).value || '',
          description:    (document.getElementById('product-description') || {}).value || '',
          imageUrl:       (document.getElementById('product-image-url')   || {}).value || '',
          category:       (document.getElementById('product-category')    || {}).value || 'general',
          amazonLink:     (document.getElementById('amazon-link')         || {}).value || '',
          alibabaLink:    (document.getElementById('alibaba-link')        || {}).value || '',
          aliexpressLink: (document.getElementById('aliexpress-link')     || {}).value || ''
        };

        if (!product.name || !product.price) {
          showToast('Please fill in at least name and price', 'error');
          return;
        }

        if (self.editingProductId) {
          ProductManager.updateProduct(self.editingProductId, product);
          self.editingProductId = null;

          var submitBtn = form.querySelector('button[type="submit"]');
          if (submitBtn) submitBtn.textContent = '+ Add Product';

          showToast('Product updated!', 'success');
        } else {
          ProductManager.addProduct(product);
          showToast('Product added!', 'success');
        }

        form.reset();
        self.renderAdminProducts();
        self.renderPublicProducts();
      });
    },

    /* ---------- Edit / Delete actions ---------- */

    editProduct: function (id) {
      var products = ProductManager.getProducts();
      var product  = null;
      for (var i = 0; i < products.length; i++) {
        if (products[i].id === id) { product = products[i]; break; }
      }
      if (!product) return;

      this.editingProductId = id;

      // Populate form fields
      var fields = {
        'product-name':        product.name,
        'product-price':       product.price,
        'product-description': product.description,
        'product-image-url':   product.imageUrl,
        'product-category':    product.category,
        'amazon-link':         product.amazonLink,
        'alibaba-link':        product.alibabaLink,
        'aliexpress-link':     product.aliexpressLink
      };

      var keys = Object.keys(fields);
      for (var k = 0; k < keys.length; k++) {
        var el = document.getElementById(keys[k]);
        if (el) el.value = fields[keys[k]] || '';
      }

      // Change submit button label
      var submitBtn = document.querySelector('#add-product-form button[type="submit"]');
      if (submitBtn) submitBtn.textContent = '\u2713 Update Product'; // ✓

      // Switch to "Add" tab so the form is visible
      var allTabs   = document.querySelectorAll('.admin-tab');
      var allPanels = document.querySelectorAll('.admin-tab-content');
      for (var t = 0; t < allTabs.length; t++)   allTabs[t].classList.remove('active');
      for (var p = 0; p < allPanels.length; p++) allPanels[p].classList.remove('active');

      var addTab   = document.querySelector('[data-tab="tab-add"]');
      var addPanel = document.getElementById('tab-add');
      if (addTab)   addTab.classList.add('active');
      if (addPanel) addPanel.classList.add('active');
    },

    deleteProduct: function (id) {
      if (!confirm('Are you sure you want to delete this product?')) return;

      ProductManager.removeProduct(id);
      this.renderAdminProducts();
      this.renderPublicProducts();
      showToast('Product deleted', 'success');
    },

    /* ---------- Admin product list ---------- */

    renderAdminProducts: function () {
      var list = document.getElementById('admin-products-list');
      if (!list) return;

      var products = ProductManager.getProducts();

      if (products.length === 0) {
        list.innerHTML = '<div class="no-products"><p>No products added yet. Add your first product!</p></div>';
        return;
      }

      var html = '';
      for (var i = 0; i < products.length; i++) {
        var p = products[i];
        var platformBadges =
          (p.amazonLink     ? '\uD83D\uDFE0 Amazon '     : '') +   // 🟠
          (p.alibabaLink    ? '\uD83D\uDFE1 Alibaba '    : '') +   // 🟡
          (p.aliexpressLink ? '\uD83D\uDD34 AliExpress'   : '');    // 🔴

        html +=
          '<div class="admin-product-item">' +
            '<img src="' + esc(p.imageUrl || 'https://via.placeholder.com/80x80/0A0E17/00A8FF?text=📱') + '" ' +
                 'alt="' + esc(p.name) + '" class="admin-product-thumb" ' +
                 'onerror="this.src=\'https://via.placeholder.com/80x80/0A0E17/00A8FF?text=📱\'">' +
            '<div class="admin-product-info">' +
              '<strong>' + esc(p.name) + '</strong>' +
              '<span class="product-category">' + esc(p.category || 'General') + '</span>' +
              '<span class="product-price">$' + esc(p.price) + '</span>' +
              '<div style="margin-top:0.3rem;font-size:0.7rem;color:#64748B">' +
                platformBadges +
              '</div>' +
            '</div>' +
            '<div class="admin-product-actions">' +
              '<button class="admin-btn secondary" data-edit-id="' + esc(p.id) + '">\u270F\uFE0F Edit</button>' +
              '<button class="admin-btn danger"    data-delete-id="' + esc(p.id) + '">\uD83D\uDDD1\uFE0F Delete</button>' +
            '</div>' +
          '</div>';
      }

      list.innerHTML = html;

      // Attach event listeners (avoids inline onclick for CSP compatibility)
      var self = this;

      var editBtns = list.querySelectorAll('[data-edit-id]');
      for (var e = 0; e < editBtns.length; e++) {
        editBtns[e].addEventListener('click', function () {
          self.editProduct(this.getAttribute('data-edit-id'));
        });
      }

      var deleteBtns = list.querySelectorAll('[data-delete-id]');
      for (var d = 0; d < deleteBtns.length; d++) {
        deleteBtns[d].addEventListener('click', function () {
          self.deleteProduct(this.getAttribute('data-delete-id'));
        });
      }
    },

    /* ---------- Public product grid ---------- */

    renderPublicProducts: function () {
      var grid = document.getElementById('products-grid');
      if (!grid) return;

      var filter = grid.getAttribute('data-category-filter');
      var products = ProductManager.getProducts();

      if (filter) {
        products = products.filter(function (p) {
          return p.category === filter;
        });
      }

      if (products.length === 0) {
        grid.innerHTML =
          '<div class="no-products glass" style="grid-column:1/-1;">' +
            '<i class="fas fa-box-open" style="font-size:3rem;color:var(--primary);margin-bottom:1rem"></i>' +
            '<h3>Coming Soon</h3>' +
            '<p>Premium mobile accessories arriving soon. Stay tuned!</p>' +
          '</div>';
        return;
      }

      var html = '';
      for (var i = 0; i < products.length; i++) {
        var p = products[i];

        var affiliateLinks = '';
        if (p.amazonLink) {
          affiliateLinks += '<a href="' + esc(p.amazonLink) + '" target="_blank" rel="noopener" class="affiliate-btn amazon"><i class="fab fa-amazon"></i> Amazon</a>';
        }
        if (p.alibabaLink) {
          affiliateLinks += '<a href="' + esc(p.alibabaLink) + '" target="_blank" rel="noopener" class="affiliate-btn alibaba"><i class="fas fa-shopping-bag"></i> Alibaba</a>';
        }
        if (p.aliexpressLink) {
          affiliateLinks += '<a href="' + esc(p.aliexpressLink) + '" target="_blank" rel="noopener" class="affiliate-btn aliexpress"><i class="fas fa-shopping-cart"></i> AliExpress</a>';
        }

        var r = Math.floor(i / 3);
        var pos = i % 3;
        var cardsInRow = Math.min(3, products.length - (r * 3));
        
        var aosAnimation = 'fade-up';
        if (cardsInRow === 3) {
          if (pos === 0) aosAnimation = 'fade-right';
          else if (pos === 1) aosAnimation = 'fade-up';
          else if (pos === 2) aosAnimation = 'fade-left';
        } else if (cardsInRow === 2) {
          if (pos === 0) aosAnimation = 'fade-right';
          else if (pos === 1) aosAnimation = 'fade-left';
        } else if (cardsInRow === 1) {
          aosAnimation = 'fade-up';
        }

        html +=
          '<div class="product-card" data-aos="' + aosAnimation + '" data-aos-delay="' + ((i % 3) * 100) + '" data-product-id="' + esc(p.id) + '" data-category="' + esc(p.category) + '">' +
            '<div class="product-card-inner">' +
              '<div class="product-card-front">' +
                '<div class="product-img-wrapper">' +
                  '<img src="' + esc(p.imageUrl || 'https://via.placeholder.com/400x300/0A0E17/00A8FF?text=📱') + '" ' +
                       'alt="' + esc(p.name) + '" class="product-img" loading="lazy" ' +
                       'onerror="this.src=\'https://via.placeholder.com/400x300/0A0E17/00A8FF?text=📱\'">' +
                  (p.category ? '<span class="product-badge">' + esc(p.category) + '</span>' : '') +
                '</div>' +
                '<div class="product-info">' +
                  '<span class="product-category">' + esc(p.category || 'Accessory') + '</span>' +
                  '<h3 class="product-name">' + esc(p.name) + '</h3>' +
                  '<div class="product-price">$' + esc(p.price) + '</div>' +
                '</div>' +
              '</div>' +
              '<div class="product-card-back">' +
                '<div class="product-info">' +
                  '<h3 class="product-name" style="margin-top:0;">' + esc(p.name) + '</h3>' +
                  '<div class="product-price" style="margin-bottom:1rem;">$' + esc(p.price) + '</div>' +
                  (p.description ? '<p class="product-desc">' + esc(p.description) + '</p>' : '') +
                  '<div class="affiliate-links">' + affiliateLinks + '</div>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>';
      }

      grid.innerHTML = html;

      if (typeof window.initScrollAnimations === 'function') {
        window.initScrollAnimations();
      }
    },

    /* ---------- Export / Import ---------- */

    setupExportImport: function () {
      var self       = this;
      var exportBtn  = document.getElementById('export-btn');
      var importBtn  = document.getElementById('import-btn');
      var importFile = document.getElementById('import-file');

      if (exportBtn) {
        exportBtn.addEventListener('click', function () {
          ProductManager.exportJSON();
          showToast('Products exported!', 'success');
        });
      }

      if (importBtn && importFile) {
        importBtn.addEventListener('click', function () { importFile.click(); });

        importFile.addEventListener('change', function (e) {
          var file = e.target.files && e.target.files[0];
          if (!file) return;

          ProductManager.importJSON(file)
            .then(function () {
              self.renderAdminProducts();
              self.renderPublicProducts();
              showToast('Products imported!', 'success');
            })
            .catch(function (err) {
              showToast('Import failed: ' + err, 'error');
            });

          // Reset so the same file can be re-imported
          importFile.value = '';
        });
      }

      // Change Password form handler
      var changePwdForm = document.getElementById('change-password-form');
      var newPwdInput  = document.getElementById('new-admin-password');
      var confPwdInput = document.getElementById('confirm-admin-password');
      var pwdMsgEl     = document.getElementById('change-password-message');

      if (changePwdForm) {
        changePwdForm.addEventListener('submit', function (e) {
          e.preventDefault();
          if (!newPwdInput || !confPwdInput) return;

          var newPwd = newPwdInput.value;
          var confPwd = confPwdInput.value;

          if (newPwd !== confPwd) {
            if (pwdMsgEl) {
              pwdMsgEl.textContent = 'Passwords do not match!';
              pwdMsgEl.style.color = '#EF4444';
            }
            return;
          }

          localStorage.setItem('royalSphire_admin_password', newPwd);
          
          if (pwdMsgEl) {
            pwdMsgEl.textContent = 'Password updated successfully!';
            pwdMsgEl.style.color = '#10B981';
          }

          newPwdInput.value = '';
          confPwdInput.value = '';

          showToast('Admin password updated!', 'success');
        });
      }
    }
  };

  // Expose AdminPanel globally so data-attribute event handlers can reach it
  // (kept for backwards compatibility, though we now use delegated listeners)
  window.AdminPanel = AdminPanel;

  /* ---------- Bootstrap ---------- */

  document.addEventListener('DOMContentLoaded', function () {
    try {
      AdminPanel.init();
    } catch (e) {
      if (typeof console !== 'undefined') {
        console.error('[AdminPanel] Initialisation error:', e);
      }
    }
  });
})();
