// Inventory Module
const Inventory = {
    currentFilters: {},
    currentPage: 1,
    itemsPerPage: 10,

    // Load inventory section
    load() {
        this.render();
        this.loadInventoryTable();
        this.setupEventListeners();
    },

    // Render inventory HTML
    render() {
        const inventorySection = document.getElementById('inventory');
        inventorySection.innerHTML = `
            <div class="page-header">
                <div class="page-title">
                    <h2>إدارة المخزون</h2>
                    <p>متابعة وإدارة جميع المنتجات</p>
                </div>
                <div class="page-actions">
                    <button class="btn btn-primary" onclick="Inventory.openProductModal()">
                        <i class="fas fa-plus"></i>
                        منتج جديد
                    </button>
                    <button class="btn btn-secondary" onclick="Inventory.importProducts()">
                        <i class="fas fa-upload"></i>
                        استيراد منتجات
                    </button>
                </div>
            </div>

            <!-- Inventory Stats -->
            <div class="inventory-stats">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-boxes"></i>
                    </div>
                    <div class="stat-content">
                        <h3>إجمالي المنتجات</h3>
                        <p class="stat-value" id="totalProducts">0</p>
                    </div>
                </div>
                <div class="stat-card warning">
                    <div class="stat-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div class="stat-content">
                        <h3>منتجات قاربت على النفاد</h3>
                        <p class="stat-value" id="lowStockProducts">0</p>
                    </div>
                </div>
                <div class="stat-card danger">
                    <div class="stat-icon">
                        <i class="fas fa-times-circle"></i>
                    </div>
                    <div class="stat-content">
                        <h3>منتجات نفدت</h3>
                        <p class="stat-value" id="outOfStockProducts">0</p>
                    </div>
                </div>
                <div class="stat-card info">
                    <div class="stat-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="stat-content">
                        <h3>منتجات قاربت على الانتهاء</h3>
                        <p class="stat-value" id="expiringProducts">0</p>
                    </div>
                </div>
            </div>

            <!-- Inventory Filters -->
            <div class="card">
                <div class="card-header">
                    <h3>فلترة المنتجات</h3>
                    <button class="btn btn-outline btn-sm" onclick="Inventory.clearFilters()">
                        <i class="fas fa-times"></i>
                        مسح الفلاتر
                    </button>
                </div>
                <div class="filters-grid">
                    <div class="form-group">
                        <label class="form-label">البحث</label>
                        <input type="text" id="inventorySearch" class="form-input" placeholder="اسم المنتج أو الباركود">
                    </div>
                    <div class="form-group">
                        <label class="form-label">الفئة</label>
                        <select id="inventoryCategory" class="form-select">
                            <option value="">جميع الفئات</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">المورد</label>
                        <select id="inventorySupplier" class="form-select">
                            <option value="">جميع الموردين</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">حالة المخزون</label>
                        <select id="inventoryStockStatus" class="form-select">
                            <option value="">جميع الحالات</option>
                            <option value="in-stock">متوفر</option>
                            <option value="low-stock">قارب على النفاد</option>
                            <option value="out-of-stock">نفد</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">حالة الصلاحية</label>
                        <select id="inventoryExpiryStatus" class="form-select">
                            <option value="">جميع الحالات</option>
                            <option value="fresh">صالح</option>
                            <option value="expiring">قارب على الانتهاء</option>
                            <option value="expired">منتهي الصلاحية</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">&nbsp;</label>
                        <button class="btn btn-primary" onclick="Inventory.applyFilters()">
                            <i class="fas fa-filter"></i>
                            تطبيق الفلتر
                        </button>
                    </div>
                </div>
            </div>

            <!-- Inventory Table -->
            <div class="table-container">
                <div class="card-header">
                    <h3>قائمة المنتجات</h3>
                    <div class="page-actions">
                        <button class="btn btn-outline btn-sm" onclick="Inventory.exportInventory()">
                            <i class="fas fa-download"></i>
                            تصدير
                        </button>
                        <button class="btn btn-outline btn-sm" onclick="Inventory.printInventory()">
                            <i class="fas fa-print"></i>
                            طباعة
                        </button>
                    </div>
                </div>
                <div class="table-wrapper">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>
                                    <input type="checkbox" id="selectAllProducts" onchange="Inventory.toggleSelectAll()">
                                </th>
                                <th>المنتج</th>
                                <th>الباركود</th>
                                <th>الفئة</th>
                                <th>سعر الشراء</th>
                                <th>سعر البيع</th>
                                <th>المخزون الحالي</th>
                                <th>الحد الأدنى</th>
                                <th>تاريخ الانتهاء</th>
                                <th>الحالة</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody id="inventoryTableBody">
                            <!-- Inventory data will be populated here -->
                        </tbody>
                    </table>
                </div>
                <div class="table-pagination" id="inventoryPagination">
                    <!-- Pagination will be populated here -->
                </div>
            </div>
        `;

        this.loadFilterOptions();
        this.updateStats();
    },

    // Setup event listeners
    setupEventListeners() {
        // Search input
        document.getElementById('inventorySearch').addEventListener('input', (e) => {
            this.currentFilters.search = e.target.value;
            this.applyFilters();
        });

        // Filter selects
        ['inventoryCategory', 'inventorySupplier', 'inventoryStockStatus', 'inventoryExpiryStatus'].forEach(id => {
            document.getElementById(id).addEventListener('change', (e) => {
                const filterKey = id.replace('inventory', '').toLowerCase();
                this.currentFilters[filterKey] = e.target.value;
                this.applyFilters();
            });
        });
    },

    // Load filter options
    loadFilterOptions() {
        // Load categories
        const categories = [...new Set(App.data.products.map(p => p.category))];
        const categorySelect = document.getElementById('inventoryCategory');
        categorySelect.innerHTML = '<option value="">جميع الفئات</option>' +
            categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');

        // Load suppliers
        const supplierSelect = document.getElementById('inventorySupplier');
        supplierSelect.innerHTML = '<option value="">جميع الموردين</option>' +
            App.data.suppliers.map(supplier => `<option value="${supplier.id}">${supplier.name}</option>`).join('');
    },

    // Update stats
    updateStats() {
        const totalProducts = App.data.products.length;
        const lowStockProducts = App.data.products.filter(p => p.currentStock <= p.minStock && p.currentStock > 0).length;
        const outOfStockProducts = App.data.products.filter(p => p.currentStock === 0).length;
        
        const expiringProducts = App.data.products.filter(p => {
            if (!p.expiryDate) return false;
            const daysUntilExpiry = Math.ceil((new Date(p.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
            return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
        }).length;

        document.getElementById('totalProducts').textContent = totalProducts;
        document.getElementById('lowStockProducts').textContent = lowStockProducts;
        document.getElementById('outOfStockProducts').textContent = outOfStockProducts;
        document.getElementById('expiringProducts').textContent = expiringProducts;
    },

    // Load inventory table
    loadInventoryTable() {
        const tbody = document.getElementById('inventoryTableBody');
        if (!tbody) return;

        let filteredProducts = this.getFilteredProducts();
        
        // Pagination
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

        let html = '';
        
        if (paginatedProducts.length === 0) {
            html = `
                <tr>
                    <td colspan="11" class="text-center">
                        <div class="no-data">لا توجد منتجات</div>
                    </td>
                </tr>
            `;
        } else {
            paginatedProducts.forEach(product => {
                const supplier = App.data.suppliers.find(s => s.id === product.supplierId);
                const stockStatus = this.getStockStatus(product);
                const expiryStatus = this.getExpiryStatus(product);
                
                html += `
                    <tr>
                        <td>
                            <input type="checkbox" value="${product.id}" class="product-checkbox">
                        </td>
                        <td>
                            <div class="product-info">
                                <strong>${product.name}</strong>
                                <small>${supplier?.name || 'مورد محذوف'}</small>
                            </div>
                        </td>
                        <td>
                            <code>${product.barcode}</code>
                        </td>
                        <td>
                            <span class="category-badge">${product.category}</span>
                        </td>
                        <td>
                            ${App.formatCurrency(product.purchasePrice)}
                        </td>
                        <td>
                            <strong>${App.formatCurrency(product.sellingPrice)}</strong>
                        </td>
                        <td>
                            <span class="stock-amount ${stockStatus.class}">${product.currentStock}</span>
                        </td>
                        <td>
                            ${product.minStock}
                        </td>
                        <td>
                            ${product.expiryDate ? App.formatDate(product.expiryDate) : '-'}
                        </td>
                        <td>
                            <div class="status-badges">
                                <span class="status ${stockStatus.class}">${stockStatus.text}</span>
                                ${expiryStatus ? `<span class="status ${expiryStatus.class}">${expiryStatus.text}</span>` : ''}
                            </div>
                        </td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn btn-outline btn-sm" onclick="Inventory.viewProduct('${product.id}')" title="عرض">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn btn-outline btn-sm" onclick="Inventory.editProduct('${product.id}')" title="تعديل">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-outline btn-sm" onclick="Inventory.adjustStock('${product.id}')" title="تعديل المخزون">
                                    <i class="fas fa-plus-minus"></i>
                                </button>
                                <button class="btn btn-outline btn-sm" onclick="Inventory.deleteProduct('${product.id}')" title="حذف">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            });
        }

        tbody.innerHTML = html;
        this.updatePagination(filteredProducts.length);
    },

    // Get filtered products
    getFilteredProducts() {
        let filtered = [...App.data.products];

        // Search filter
        if (this.currentFilters.search) {
            const search = this.currentFilters.search.toLowerCase();
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(search) ||
                product.barcode.toLowerCase().includes(search)
            );
        }

        // Category filter
        if (this.currentFilters.category) {
            filtered = filtered.filter(product => product.category === this.currentFilters.category);
        }

        // Supplier filter
        if (this.currentFilters.supplier) {
            filtered = filtered.filter(product => product.supplierId === this.currentFilters.supplier);
        }

        // Stock status filter
        if (this.currentFilters.stockstatus) {
            filtered = filtered.filter(product => {
                const status = this.getStockStatus(product);
                return status.key === this.currentFilters.stockstatus;
            });
        }

        // Expiry status filter
        if (this.currentFilters.expirystatus) {
            filtered = filtered.filter(product => {
                const status = this.getExpiryStatus(product);
                return status && status.key === this.currentFilters.expirystatus;
            });
        }

        return filtered;
    },

    // Get stock status
    getStockStatus(product) {
        if (product.currentStock === 0) {
            return { key: 'out-of-stock', class: 'error', text: 'نفد' };
        } else if (product.currentStock <= product.minStock) {
            return { key: 'low-stock', class: 'warning', text: 'قارب على النفاد' };
        } else {
            return { key: 'in-stock', class: 'success', text: 'متوفر' };
        }
    },

    // Get expiry status
    getExpiryStatus(product) {
        if (!product.expiryDate) return null;
        
        const daysUntilExpiry = Math.ceil((new Date(product.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilExpiry < 0) {
            return { key: 'expired', class: 'error', text: 'منتهي الصلاحية' };
        } else if (daysUntilExpiry <= 30) {
            return { key: 'expiring', class: 'warning', text: 'قارب على الانتهاء' };
        } else {
            return { key: 'fresh', class: 'success', text: 'صالح' };
        }
    },

    // Update pagination
    updatePagination(totalItems) {
        const paginationContainer = document.getElementById('inventoryPagination');
        if (!paginationContainer) return;

        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
        const endItem = Math.min(this.currentPage * this.itemsPerPage, totalItems);

        let paginationHTML = `
            <div class="pagination-info">
                عرض ${startItem}-${endItem} من ${totalItems} نتيجة
            </div>
            <div class="pagination-controls">
        `;

        // Previous button
        if (this.currentPage > 1) {
            paginationHTML += `
                <button class="btn btn-outline btn-sm" onclick="Inventory.goToPage(${this.currentPage - 1})">
                    <i class="fas fa-chevron-right"></i>
                </button>
            `;
        }

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === this.currentPage) {
                paginationHTML += `<button class="btn btn-primary btn-sm">${i}</button>`;
            } else if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                paginationHTML += `<button class="btn btn-outline btn-sm" onclick="Inventory.goToPage(${i})">${i}</button>`;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                paginationHTML += `<span class="pagination-dots">...</span>`;
            }
        }

        // Next button
        if (this.currentPage < totalPages) {
            paginationHTML += `
                <button class="btn btn-outline btn-sm" onclick="Inventory.goToPage(${this.currentPage + 1})">
                    <i class="fas fa-chevron-left"></i>
                </button>
            `;
        }

        paginationHTML += '</div>';
        paginationContainer.innerHTML = paginationHTML;
    },

    // Go to page
    goToPage(page) {
        this.currentPage = page;
        this.loadInventoryTable();
    },

    // Apply filters
    applyFilters() {
        this.currentPage = 1;
        this.loadInventoryTable();
    },

    // Clear filters
    clearFilters() {
        this.currentFilters = {};
        this.currentPage = 1;
        
        // Clear form inputs
        document.getElementById('inventorySearch').value = '';
        document.getElementById('inventoryCategory').value = '';
        document.getElementById('inventorySupplier').value = '';
        document.getElementById('inventoryStockStatus').value = '';
        document.getElementById('inventoryExpiryStatus').value = '';
        
        this.loadInventoryTable();
    },

    // Toggle select all
    toggleSelectAll() {
        const selectAll = document.getElementById('selectAllProducts');
        const checkboxes = document.querySelectorAll('.product-checkbox');
        
        checkboxes.forEach(checkbox => {
            checkbox.checked = selectAll.checked;
        });
    },

    // Open product modal
    openProductModal() {
        Modals.open('product-modal', 'منتج جديد', this.getProductModalContent(), {
            size: 'large',
            onSave: () => this.saveProduct()
        });
    },

    // Get product modal content
    getProductModalContent() {
        return `
            <form id="productForm">
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label">اسم المنتج *</label>
                        <input type="text" id="productName" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">الباركود *</label>
                        <input type="text" id="productBarcode" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">الفئة *</label>
                        <input type="text" id="productCategory" class="form-input" list="categories" required>
                        <datalist id="categories">
                            ${[...new Set(App.data.products.map(p => p.category))].map(cat => 
                                `<option value="${cat}">`
                            ).join('')}
                        </datalist>
                    </div>
                    <div class="form-group">
                        <label class="form-label">المورد *</label>
                        <select id="productSupplier" class="form-select" required>
                            <option value="">اختر المورد</option>
                            ${App.data.suppliers.map(supplier => 
                                `<option value="${supplier.id}">${supplier.name}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">سعر الشراء *</label>
                        <input type="number" id="productPurchasePrice" class="form-input" min="0" step="0.01" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">سعر البيع *</label>
                        <input type="number" id="productSellingPrice" class="form-input" min="0" step="0.01" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">المخزون الحالي *</label>
                        <input type="number" id="productCurrentStock" class="form-input" min="0" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">الحد الأدنى للمخزون *</label>
                        <input type="number" id="productMinStock" class="form-input" min="0" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">تاريخ الانتهاء</label>
                        <input type="date" id="productExpiryDate" class="form-input">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">وصف المنتج</label>
                    <textarea id="productDescription" class="form-textarea" rows="3"></textarea>
                </div>
            </form>
        `;
    },

    // Save product
    saveProduct() {
        const form = document.getElementById('productForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return false;
        }

        const product = {
            id: App.generateId('PROD'),
            name: document.getElementById('productName').value,
            barcode: document.getElementById('productBarcode').value,
            category: document.getElementById('productCategory').value,
            supplierId: document.getElementById('productSupplier').value,
            purchasePrice: parseFloat(document.getElementById('productPurchasePrice').value),
            sellingPrice: parseFloat(document.getElementById('productSellingPrice').value),
            currentStock: parseInt(document.getElementById('productCurrentStock').value),
            minStock: parseInt(document.getElementById('productMinStock').value),
            expiryDate: document.getElementById('productExpiryDate').value || null,
            description: document.getElementById('productDescription').value,
            createdAt: new Date().toISOString()
        };

        // Check if barcode already exists
        if (App.data.products.some(p => p.barcode === product.barcode)) {
            alert('الباركود موجود مسبقاً');
            return false;
        }

        // Add to data
        App.data.products.unshift(product);
        App.saveData();

        // Refresh table and stats
        this.loadInventoryTable();
        this.updateStats();
        this.loadFilterOptions();

        // Add notification
        App.addNotification({
            type: 'success',
            title: 'تم إضافة المنتج',
            message: `تم إضافة المنتج "${product.name}" بنجاح`
        });

        return true;
    },

    // View product
    viewProduct(id) {
        const product = App.data.products.find(p => p.id === id);
        if (!product) return;

        const supplier = App.data.suppliers.find(s => s.id === product.supplierId);
        const stockStatus = this.getStockStatus(product);
        const expiryStatus = this.getExpiryStatus(product);
        
        const content = `
            <div class="product-details">
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>اسم المنتج:</label>
                        <span>${product.name}</span>
                    </div>
                    <div class="detail-item">
                        <label>الباركود:</label>
                        <span><code>${product.barcode}</code></span>
                    </div>
                    <div class="detail-item">
                        <label>الفئة:</label>
                        <span>${product.category}</span>
                    </div>
                    <div class="detail-item">
                        <label>المورد:</label>
                        <span>${supplier?.name || 'مورد محذوف'}</span>
                    </div>
                    <div class="detail-item">
                        <label>سعر الشراء:</label>
                        <span>${App.formatCurrency(product.purchasePrice)}</span>
                    </div>
                    <div class="detail-item">
                        <label>سعر البيع:</label>
                        <span>${App.formatCurrency(product.sellingPrice)}</span>
                    </div>
                    <div class="detail-item">
                        <label>المخزون الحالي:</label>
                        <span class="stock-amount ${stockStatus.class}">${product.currentStock}</span>
                    </div>
                    <div class="detail-item">
                        <label>الحد الأدنى:</label>
                        <span>${product.minStock}</span>
                    </div>
                    <div class="detail-item">
                        <label>تاريخ الانتهاء:</label>
                        <span>${product.expiryDate ? App.formatDate(product.expiryDate) : 'غير محدد'}</span>
                    </div>
                    <div class="detail-item">
                        <label>الحالة:</label>
                        <div class="status-badges">
                            <span class="status ${stockStatus.class}">${stockStatus.text}</span>
                            ${expiryStatus ? `<span class="status ${expiryStatus.class}">${expiryStatus.text}</span>` : ''}
                        </div>
                    </div>
                </div>

                ${product.description ? `
                    <div class="description-section">
                        <h4>الوصف</h4>
                        <p>${product.description}</p>
                    </div>
                ` : ''}

                <div class="product-stats">
                    <h4>إحصائيات المنتج</h4>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <label>هامش الربح:</label>
                            <span class="profit-margin">${Math.round(((product.sellingPrice - product.purchasePrice) / product.purchasePrice) * 100)}%</span>
                        </div>
                        <div class="stat-item">
                            <label>قيمة المخزون:</label>
                            <span>${App.formatCurrency(product.currentStock * product.purchasePrice)}</span>
                        </div>
                        <div class="stat-item">
                            <label>تاريخ الإضافة:</label>
                            <span>${App.formatDate(product.createdAt)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        Modals.open('view-product-modal', `تفاصيل المنتج: ${product.name}`, content, {
            showSaveButton: false,
            additionalButtons: [
                {
                    text: 'تعديل المنتج',
                    class: 'btn-primary',
                    onclick: () => {
                        Modals.close();
                        this.editProduct(id);
                    }
                }
            ]
        });
    },

    // Edit product
    editProduct(id) {
        // Implementation for editing product
        console.log('Edit product:', id);
    },

    // Adjust stock
    adjustStock(id) {
        const product = App.data.products.find(p => p.id === id);
        if (!product) return;

        const content = `
            <form id="adjustStockForm">
                <div class="current-stock-info">
                    <h4>المخزون الحالي: <span class="stock-amount">${product.currentStock}</span></h4>
                </div>
                
                <div class="form-group">
                    <label class="form-label">نوع التعديل</label>
                    <select id="adjustmentType" class="form-select" onchange="Inventory.updateAdjustmentForm()">
                        <option value="add">إضافة مخزون</option>
                        <option value="subtract">خصم مخزون</option>
                        <option value="set">تحديد مخزون</option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label" id="quantityLabel">الكمية المضافة</label>
                    <input type="number" id="adjustmentQuantity" class="form-input" min="1" required>
                </div>

                <div class="form-group">
                    <label class="form-label">سبب التعديل</label>
                    <select id="adjustmentReason" class="form-select">
                        <option value="purchase">شراء جديد</option>
                        <option value="return">مرتجع من عميل</option>
                        <option value="damage">تلف</option>
                        <option value="theft">سرقة</option>
                        <option value="correction">تصحيح</option>
                        <option value="other">أخرى</option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">ملاحظات</label>
                    <textarea id="adjustmentNotes" class="form-textarea" rows="3"></textarea>
                </div>

                <div class="new-stock-preview">
                    <h4>المخزون الجديد: <span id="newStockPreview">${product.currentStock}</span></h4>
                </div>
            </form>
        `;

        Modals.open('adjust-stock-modal', `تعديل مخزون: ${product.name}`, content, {
            onSave: () => this.saveStockAdjustment(id)
        });

        // Setup quantity input listener
        setTimeout(() => {
            document.getElementById('adjustmentQuantity').addEventListener('input', () => {
                this.updateStockPreview(product.currentStock);
            });
        }, 100);
    },

    // Update adjustment form
    updateAdjustmentForm() {
        const type = document.getElementById('adjustmentType').value;
        const label = document.getElementById('quantityLabel');
        const quantityInput = document.getElementById('adjustmentQuantity');
        
        switch(type) {
            case 'add':
                label.textContent = 'الكمية المضافة';
                quantityInput.min = 1;
                break;
            case 'subtract':
                label.textContent = 'الكمية المخصومة';
                quantityInput.min = 1;
                break;
            case 'set':
                label.textContent = 'المخزون الجديد';
                quantityInput.min = 0;
                break;
        }
        
        this.updateStockPreview();
    },

    // Update stock preview
    updateStockPreview(currentStock) {
        const type = document.getElementById('adjustmentType').value;
        const quantity = parseInt(document.getElementById('adjustmentQuantity').value) || 0;
        const preview = document.getElementById('newStockPreview');
        
        if (!currentStock) {
            const productId = document.querySelector('#adjust-stock-modal').dataset.productId;
            const product = App.data.products.find(p => p.id === productId);
            currentStock = product ? product.currentStock : 0;
        }
        
        let newStock = currentStock;
        
        switch(type) {
            case 'add':
                newStock = currentStock + quantity;
                break;
            case 'subtract':
                newStock = Math.max(0, currentStock - quantity);
                break;
            case 'set':
                newStock = quantity;
                break;
        }
        
        preview.textContent = newStock;
    },

    // Save stock adjustment
    saveStockAdjustment(productId) {
        const form = document.getElementById('adjustStockForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return false;
        }

        const product = App.data.products.find(p => p.id === productId);
        if (!product) return false;

        const type = document.getElementById('adjustmentType').value;
        const quantity = parseInt(document.getElementById('adjustmentQuantity').value);
        const reason = document.getElementById('adjustmentReason').value;
        const notes = document.getElementById('adjustmentNotes').value;

        const oldStock = product.currentStock;
        let newStock = oldStock;

        switch(type) {
            case 'add':
                newStock = oldStock + quantity;
                break;
            case 'subtract':
                newStock = Math.max(0, oldStock - quantity);
                break;
            case 'set':
                newStock = quantity;
                break;
        }

        // Update product stock
        product.currentStock = newStock;

        // Log the adjustment (you can add this to a separate adjustments array if needed)
        const adjustment = {
            id: App.generateId('ADJ'),
            productId,
            productName: product.name,
            type,
            quantity,
            oldStock,
            newStock,
            reason,
            notes,
            timestamp: new Date().toISOString()
        };

        // Save data
        App.saveData();

        // Refresh table and stats
        this.loadInventoryTable();
        this.updateStats();

        // Add notification
        App.addNotification({
            type: 'success',
            title: 'تم تعديل المخزون',
            message: `تم تعديل مخزون "${product.name}" من ${oldStock} إلى ${newStock}`
        });

        return true;
    },

    // Delete product
    deleteProduct(id) {
        if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;

        const productIndex = App.data.products.findIndex(p => p.id === id);
        if (productIndex === -1) return;

        const product = App.data.products[productIndex];

        // Remove product
        App.data.products.splice(productIndex, 1);
        App.saveData();

        // Refresh table and stats
        this.loadInventoryTable();
        this.updateStats();
        this.loadFilterOptions();

        // Add notification
        App.addNotification({
            type: 'success',
            title: 'تم حذف المنتج',
            message: `تم حذف المنتج "${product.name}" بنجاح`
        });
    },

    // Import products
    importProducts() {
        // Implementation for importing products
        console.log('Import products');
    },

    // Export inventory
    exportInventory() {
        const filteredProducts = this.getFilteredProducts();
        const csvContent = this.generateCSV(filteredProducts);
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    },

    // Generate CSV
    generateCSV(products) {
        const headers = ['اسم المنتج', 'الباركود', 'الفئة', 'سعر الشراء', 'سعر البيع', 'المخزون الحالي', 'الحد الأدنى', 'تاريخ الانتهاء'];
        let csv = headers.join(',') + '\n';
        
        products.forEach(product => {
            const row = [
                product.name,
                product.barcode,
                product.category,
                product.purchasePrice,
                product.sellingPrice,
                product.currentStock,
                product.minStock,
                product.expiryDate || ''
            ];
            csv += row.join(',') + '\n';
        });
        
        return csv;
    },

    // Print inventory
    printInventory() {
        window.print();
    }
};

// Add CSS for inventory
const inventoryCSS = `
.inventory-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.inventory-stats .stat-card {
    background: var(--bg-primary);
    border-radius: var(--radius-xl);
    padding: 1.5rem;
    box-shadow: var(--shadow-md);
    border: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    gap: 1rem;
}

.inventory-stats .stat-card.warning {
    border-left: 4px solid var(--warning-500);
}

.inventory-stats .stat-card.danger {
    border-left: 4px solid var(--error-500);
}

.inventory-stats .stat-card.info {
    border-left: 4px solid var(--primary-500);
}

.inventory-stats .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: white;
    background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
}

.inventory-stats .stat-card.warning .stat-icon {
    background: linear-gradient(135deg, var(--warning-500), var(--warning-600));
}

.inventory-stats .stat-card.danger .stat-icon {
    background: linear-gradient(135deg, var(--error-500), var(--error-600));
}

.inventory-stats .stat-card.info .stat-icon {
    background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
}

.inventory-stats .stat-content h3 {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-secondary);
    margin-bottom: 0.5rem;
}

.inventory-stats .stat-value {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
}

.product-info {
    display: flex;
    flex-direction: column;
}

.product-info small {
    color: var(--text-tertiary);
    font-size: 12px;
}

.category-badge {
    background: var(--primary-100);
    color: var(--primary-700);
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius-md);
    font-size: 12px;
    font-weight: 500;
}

.stock-amount {
    font-weight: 600;
}

.stock-amount.success {
    color: var(--success-600);
}

.stock-amount.warning {
    color: var(--warning-600);
}

.stock-amount.error {
    color: var(--error-600);
}

.status-badges {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.current-stock-info {
    text-align: center;
    padding: 1rem;
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
    margin-bottom: 1.5rem;
}

.current-stock-info h4 {
    margin: 0;
    color: var(--text-primary);
}

.current-stock-info .stock-amount {
    font-size: 24px;
    color: var(--primary-600);
}

.new-stock-preview {
    text-align: center;
    padding: 1rem;
    background: var(--success-50);
    border: 1px solid var(--success-200);
    border-radius: var(--radius-md);
    margin-top: 1.5rem;
}

.new-stock-preview h4 {
    margin: 0;
    color: var(--success-700);
}

.new-stock-preview span {
    font-size: 20px;
    font-weight: 700;
}

.product-details .detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.description-section {
    margin: 1.5rem 0;
    padding: 1rem;
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
}

.description-section h4 {
    margin-bottom: 0.5rem;
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
}

.description-section p {
    color: var(--text-secondary);
    line-height: 1.5;
    margin: 0;
}

.product-stats {
    margin-top: 1.5rem;
    padding: 1rem;
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
}

.product-stats h4 {
    margin-bottom: 1rem;
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
}

.product-stats .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
}

.stat-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.stat-item label {
    font-weight: 600;
    color: var(--text-secondary);
    font-size: 14px;
}

.stat-item span {
    color: var(--text-primary);
}

.profit-margin {
    color: var(--success-600);
    font-weight: 600;
}

@media (max-width: 768px) {
    .inventory-stats {
        grid-template-columns: 1fr;
    }
    
    .product-details .detail-grid {
        grid-template-columns: 1fr;
    }
    
    .product-stats .stats-grid {
        grid-template-columns: 1fr;
    }
}
`;

// Add CSS to document
const style = document.createElement('style');
style.textContent = inventoryCSS;
document.head.appendChild(style);