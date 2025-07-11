// Inventory Module

class Inventory {
    constructor() {
        this.products = [];
        this.categories = [];
        this.dataTable = null;
        this.currentProduct = null;
    }

    async init() {
        await this.loadData();
        this.render();
        this.bindEvents();
    }

    async loadData() {
        try {
            loading.show('inventory');
            
            const [productsResponse, categoriesResponse] = await Promise.all([
                api.getProducts(),
                api.getCategories()
            ]);

            if (productsResponse.success) {
                this.products = productsResponse.data;
            }
            
            if (categoriesResponse.success) {
                this.categories = categoriesResponse.data;
            }
        } catch (error) {
            console.error('Inventory data loading error:', error);
            toast.error('حدث خطأ في تحميل بيانات المخزون');
        } finally {
            loading.hide('inventory');
        }
    }

    render() {
        const content = `
            <div class="inventory-container">
                <!-- Header Actions -->
                <div class="module-header">
                    <div class="module-title">
                        <h2>إدارة المخزون</h2>
                        <p>إدارة وتتبع جميع المنتجات والمخزون</p>
                    </div>
                    <div class="module-actions">
                        <button class="btn btn-success" onclick="inventoryModule.showAddProductModal()">
                            <i class="fas fa-plus"></i>
                            منتج جديد
                        </button>
                        <button class="btn btn-primary" onclick="inventoryModule.showCategoriesModal()">
                            <i class="fas fa-tags"></i>
                            إدارة الفئات
                        </button>
                    </div>
                </div>

                <!-- Inventory Stats -->
                <div class="inventory-stats">
                    <div class="stats-grid">
                        <div class="stat-card primary">
                            <div class="stat-header">
                                <span class="stat-title">إجمالي المنتجات</span>
                                <div class="stat-icon primary">
                                    <i class="fas fa-boxes"></i>
                                </div>
                            </div>
                            <div class="stat-value">${formatNumber(this.products.length)}</div>
                            <div class="stat-change positive">
                                <i class="fas fa-arrow-up"></i>
                                +3 هذا الأسبوع
                            </div>
                        </div>
                        
                        <div class="stat-card success">
                            <div class="stat-header">
                                <span class="stat-title">قيمة المخزون</span>
                                <div class="stat-icon success">
                                    <i class="fas fa-dollar-sign"></i>
                                </div>
                            </div>
                            <div class="stat-value">${formatCurrency(this.getTotalInventoryValue())}</div>
                            <div class="stat-change positive">
                                <i class="fas fa-arrow-up"></i>
                                +5.2%
                            </div>
                        </div>
                        
                        <div class="stat-card warning">
                            <div class="stat-header">
                                <span class="stat-title">مخزون منخفض</span>
                                <div class="stat-icon warning">
                                    <i class="fas fa-exclamation-triangle"></i>
                                </div>
                            </div>
                            <div class="stat-value">${formatNumber(this.getLowStockCount())}</div>
                            <div class="stat-change negative">
                                <i class="fas fa-arrow-down"></i>
                                يحتاج متابعة
                            </div>
                        </div>
                        
                        <div class="stat-card info">
                            <div class="stat-header">
                                <span class="stat-title">الفئات</span>
                                <div class="stat-icon info">
                                    <i class="fas fa-tags"></i>
                                </div>
                            </div>
                            <div class="stat-value">${formatNumber(this.categories.length)}</div>
                            <div class="stat-change positive">
                                <i class="fas fa-arrow-up"></i>
                                +1 جديدة
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Filters -->
                <div class="inventory-filters">
                    <div class="filters-row">
                        <div class="filter-group">
                            <label>الفئة:</label>
                            <select id="category-filter" class="form-select">
                                <option value="">جميع الفئات</option>
                                ${this.categories.map(cat => `
                                    <option value="${cat.id}">${cat.name}</option>
                                `).join('')}
                            </select>
                        </div>
                        <div class="filter-group">
                            <label>حالة المخزون:</label>
                            <select id="stock-filter" class="form-select">
                                <option value="">جميع المنتجات</option>
                                <option value="in-stock">متوفر</option>
                                <option value="low-stock">مخزون منخفض</option>
                                <option value="out-of-stock">غير متوفر</option>
                            </select>
                        </div>
                        <div class="filter-group">
                            <button class="btn btn-ghost" onclick="inventoryModule.resetFilters()">
                                <i class="fas fa-undo"></i>
                                إعادة تعيين
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Products Table -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">قائمة المنتجات</h3>
                        <div class="card-actions">
                            <button class="btn btn-ghost btn-sm" onclick="inventoryModule.exportProducts()">
                                <i class="fas fa-download"></i>
                                تصدير
                            </button>
                            <button class="btn btn-ghost btn-sm" onclick="inventoryModule.printProducts()">
                                <i class="fas fa-print"></i>
                                طباعة
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div id="products-table"></div>
                    </div>
                </div>
            </div>
        `;

        $('page-content').innerHTML = content;
        this.initDataTable();
        this.bindFilterEvents();
    }

    initDataTable() {
        const columns = [
            {
                key: 'id',
                title: 'الكود',
                render: (value) => `#${value}`
            },
            {
                key: 'name',
                title: 'اسم المنتج'
            },
            {
                key: 'category',
                title: 'الفئة'
            },
            {
                key: 'price',
                title: 'السعر',
                render: (value) => formatCurrency(value)
            },
            {
                key: 'stock',
                title: 'المخزون',
                render: (value, row) => {
                    const status = this.getStockStatus(value, row.minStock);
                    const badgeClass = status === 'متوفر' ? 'badge-success' : 
                                     status === 'منخفض' ? 'badge-warning' : 'badge-danger';
                    return `
                        <div class="stock-info">
                            <span class="stock-quantity">${formatNumber(value)}</span>
                            <span class="badge ${badgeClass}">${status}</span>
                        </div>
                    `;
                }
            },
            {
                key: 'minStock',
                title: 'الحد الأدنى',
                render: (value) => formatNumber(value)
            },
            {
                key: 'actions',
                title: 'الإجراءات',
                render: (value, row) => `
                    <div class="table-actions">
                        <button class="btn btn-ghost btn-sm" onclick="inventoryModule.viewProduct(${row.id})" title="عرض">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-ghost btn-sm" onclick="inventoryModule.editProduct(${row.id})" title="تعديل">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-ghost btn-sm" onclick="inventoryModule.adjustStock(${row.id})" title="تعديل المخزون">
                            <i class="fas fa-warehouse"></i>
                        </button>
                        <button class="btn btn-ghost btn-sm text-danger" onclick="inventoryModule.deleteProduct(${row.id})" title="حذف">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `
            }
        ];

        this.dataTable = new DataTable('#products-table', {
            data: this.products,
            columns: columns,
            searchable: true,
            sortable: true,
            pagination: true,
            pageSize: 15
        });
    }

    bindEvents() {
        // Module-specific events
    }

    bindFilterEvents() {
        const categoryFilter = $('category-filter');
        const stockFilter = $('stock-filter');

        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.applyFilters());
        }

        if (stockFilter) {
            stockFilter.addEventListener('change', () => this.applyFilters());
        }
    }

    applyFilters() {
        let filteredProducts = [...this.products];

        const categoryFilter = $('category-filter').value;
        const stockFilter = $('stock-filter').value;

        if (categoryFilter) {
            filteredProducts = filteredProducts.filter(product => product.category === categoryFilter);
        }

        if (stockFilter) {
            filteredProducts = filteredProducts.filter(product => {
                const status = this.getStockStatus(product.stock, product.minStock);
                switch (stockFilter) {
                    case 'in-stock':
                        return status === 'متوفر';
                    case 'low-stock':
                        return status === 'منخفض';
                    case 'out-of-stock':
                        return status === 'غير متوفر';
                    default:
                        return true;
                }
            });
        }

        this.dataTable.updateData(filteredProducts);
    }

    resetFilters() {
        $('category-filter').value = '';
        $('stock-filter').value = '';
        this.dataTable.updateData(this.products);
    }

    showAddProductModal() {
        this.currentProduct = null;
        const content = this.renderProductForm();
        
        modal.show(content, {
            title: 'إضافة منتج جديد',
            size: 'large'
        });

        this.bindProductFormEvents();
    }

    showCategoriesModal() {
        const content = `
            <div class="categories-management">
                <div class="categories-header">
                    <button class="btn btn-primary btn-sm" onclick="inventoryModule.showAddCategoryForm()">
                        <i class="fas fa-plus"></i>
                        فئة جديدة
                    </button>
                </div>
                
                <div class="categories-list">
                    ${this.categories.map(category => `
                        <div class="category-item">
                            <div class="category-info">
                                <span class="category-name">${category.name}</span>
                                <span class="category-count">${this.getProductsInCategory(category.id)} منتج</span>
                            </div>
                            <div class="category-actions">
                                <button class="btn btn-ghost btn-sm" onclick="inventoryModule.editCategory(${category.id})">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-ghost btn-sm text-danger" onclick="inventoryModule.deleteCategory(${category.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="modal-footer">
                    <button class="btn btn-ghost" onclick="modal.hide()">
                        إغلاق
                    </button>
                </div>
            </div>
        `;

        modal.show(content, {
            title: 'إدارة الفئات',
            size: 'medium'
        });
    }

    renderProductForm() {
        const product = this.currentProduct || {};
        
        return `
            <form class="product-form">
                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label">اسم المنتج *</label>
                        <input type="text" class="form-input" name="name" value="${product.name || ''}" required>
                    </div>
                    <div class="form-col">
                        <label class="form-label">الفئة *</label>
                        <select class="form-select" name="category" required>
                            <option value="">اختر الفئة</option>
                            ${this.categories.map(cat => `
                                <option value="${cat.name}" ${product.category === cat.name ? 'selected' : ''}>
                                    ${cat.name}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label">السعر *</label>
                        <input type="number" class="form-input" name="price" step="0.01" min="0" value="${product.price || ''}" required>
                    </div>
                    <div class="form-col">
                        <label class="form-label">تكلفة الشراء</label>
                        <input type="number" class="form-input" name="cost" step="0.01" min="0" value="${product.cost || ''}">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label">الكمية الحالية *</label>
                        <input type="number" class="form-input" name="stock" min="0" value="${product.stock || 0}" required>
                    </div>
                    <div class="form-col">
                        <label class="form-label">الحد الأدنى للمخزون *</label>
                        <input type="number" class="form-input" name="minStock" min="0" value="${product.minStock || 5}" required>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label">الباركود</label>
                        <input type="text" class="form-input" name="barcode" value="${product.barcode || ''}">
                    </div>
                    <div class="form-col">
                        <label class="form-label">الوحدة</label>
                        <select class="form-select" name="unit">
                            <option value="قطعة" ${product.unit === 'قطعة' ? 'selected' : ''}>قطعة</option>
                            <option value="كيلو" ${product.unit === 'كيلو' ? 'selected' : ''}>كيلو</option>
                            <option value="متر" ${product.unit === 'متر' ? 'selected' : ''}>متر</option>
                            <option value="لتر" ${product.unit === 'لتر' ? 'selected' : ''}>لتر</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">الوصف</label>
                    <textarea class="form-textarea" name="description" rows="3" placeholder="وصف المنتج...">${product.description || ''}</textarea>
                </div>

                <div class="form-group">
                    <label class="form-label">ملاحظات</label>
                    <textarea class="form-textarea" name="notes" rows="2" placeholder="ملاحظات إضافية...">${product.notes || ''}</textarea>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-success" onclick="inventoryModule.saveProduct()">
                        <i class="fas fa-save"></i>
                        ${this.currentProduct ? 'تحديث' : 'حفظ'}
                    </button>
                    <button type="button" class="btn btn-ghost" onclick="modal.hide()">
                        إلغاء
                    </button>
                </div>
            </form>
        `;
    }

    bindProductFormEvents() {
        // Auto-generate barcode if empty
        const nameInput = $$('input[name="name"]');
        const barcodeInput = $$('input[name="barcode"]');
        
        if (nameInput && barcodeInput && !barcodeInput.value) {
            nameInput.addEventListener('blur', () => {
                if (!barcodeInput.value && nameInput.value) {
                    barcodeInput.value = this.generateBarcode();
                }
            });
        }
    }

    async saveProduct() {
        const form = $$('.product-form');
        const formData = new FormData(form);
        
        const productData = {
            name: formData.get('name'),
            category: formData.get('category'),
            price: parseFloat(formData.get('price')),
            cost: parseFloat(formData.get('cost')) || 0,
            stock: parseInt(formData.get('stock')),
            minStock: parseInt(formData.get('minStock')),
            barcode: formData.get('barcode'),
            unit: formData.get('unit'),
            description: formData.get('description'),
            notes: formData.get('notes')
        };

        // Validation
        if (!productData.name || !productData.category || !productData.price) {
            toast.error('يرجى ملء جميع الحقول المطلوبة');
            return;
        }

        try {
            loading.show('save-product');
            
            let response;
            if (this.currentProduct) {
                response = await api.updateProduct(this.currentProduct.id, productData);
            } else {
                response = await api.createProduct(productData);
            }
            
            if (response.success) {
                toast.success(`تم ${this.currentProduct ? 'تحديث' : 'إضافة'} المنتج بنجاح`);
                modal.hide();
                await this.loadData();
                this.dataTable.updateData(this.products);
            } else {
                toast.error(`فشل في ${this.currentProduct ? 'تحديث' : 'إضافة'} المنتج`);
            }
        } catch (error) {
            console.error('Save product error:', error);
            toast.error('حدث خطأ في حفظ المنتج');
        } finally {
            loading.hide('save-product');
        }
    }

    viewProduct(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) return;

        const content = `
            <div class="product-details">
                <div class="product-header">
                    <h3>${product.name}</h3>
                    <span class="badge badge-primary">${product.category}</span>
                </div>
                
                <div class="product-info-grid">
                    <div class="info-item">
                        <label>السعر:</label>
                        <span>${formatCurrency(product.price)}</span>
                    </div>
                    <div class="info-item">
                        <label>المخزون:</label>
                        <span>${formatNumber(product.stock)} ${product.unit || 'قطعة'}</span>
                    </div>
                    <div class="info-item">
                        <label>الحد الأدنى:</label>
                        <span>${formatNumber(product.minStock)}</span>
                    </div>
                    <div class="info-item">
                        <label>الباركود:</label>
                        <span>${product.barcode || 'غير محدد'}</span>
                    </div>
                </div>
                
                ${product.description ? `
                    <div class="product-description">
                        <label>الوصف:</label>
                        <p>${product.description}</p>
                    </div>
                ` : ''}
                
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="inventoryModule.editProduct(${product.id}); modal.hide();">
                        <i class="fas fa-edit"></i>
                        تعديل
                    </button>
                    <button class="btn btn-ghost" onclick="modal.hide()">
                        إغلاق
                    </button>
                </div>
            </div>
        `;

        modal.show(content, {
            title: 'تفاصيل المنتج',
            size: 'medium'
        });
    }

    editProduct(id) {
        this.currentProduct = this.products.find(p => p.id === id);
        if (!this.currentProduct) return;

        const content = this.renderProductForm();
        
        modal.show(content, {
            title: 'تعديل المنتج',
            size: 'large'
        });

        this.bindProductFormEvents();
    }

    adjustStock(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) return;

        const content = `
            <div class="stock-adjustment">
                <div class="current-stock">
                    <h4>المخزون الحالي: ${formatNumber(product.stock)} ${product.unit || 'قطعة'}</h4>
                </div>
                
                <div class="form-group">
                    <label class="form-label">نوع التعديل</label>
                    <select class="form-select" name="adjustmentType">
                        <option value="add">إضافة للمخزون</option>
                        <option value="subtract">خصم من المخزون</option>
                        <option value="set">تعيين كمية جديدة</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">الكمية</label>
                    <input type="number" class="form-input" name="quantity" min="0" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">سبب التعديل</label>
                    <select class="form-select" name="reason">
                        <option value="purchase">شراء جديد</option>
                        <option value="return">مرتجع</option>
                        <option value="damage">تلف</option>
                        <option value="theft">فقدان</option>
                        <option value="correction">تصحيح</option>
                        <option value="other">أخرى</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">ملاحظات</label>
                    <textarea class="form-textarea" name="notes" rows="2" placeholder="ملاحظات التعديل..."></textarea>
                </div>
                
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="inventoryModule.confirmStockAdjustment(${product.id})">
                        <i class="fas fa-check"></i>
                        تأكيد التعديل
                    </button>
                    <button class="btn btn-ghost" onclick="modal.hide()">
                        إلغاء
                    </button>
                </div>
            </div>
        `;

        modal.show(content, {
            title: `تعديل مخزون: ${product.name}`,
            size: 'medium'
        });
    }

    async confirmStockAdjustment(productId) {
        const adjustmentType = $$('select[name="adjustmentType"]').value;
        const quantity = parseInt($$('input[name="quantity"]').value);
        const reason = $$('select[name="reason"]').value;
        const notes = $$('textarea[name="notes"]').value;

        if (!quantity || quantity <= 0) {
            toast.error('يرجى إدخال كمية صحيحة');
            return;
        }

        const product = this.products.find(p => p.id === productId);
        let newStock = product.stock;

        switch (adjustmentType) {
            case 'add':
                newStock += quantity;
                break;
            case 'subtract':
                newStock = Math.max(0, newStock - quantity);
                break;
            case 'set':
                newStock = quantity;
                break;
        }

        try {
            loading.show('adjust-stock');
            
            const response = await api.updateProduct(productId, { stock: newStock });
            
            if (response.success) {
                toast.success('تم تعديل المخزون بنجاح');
                modal.hide();
                await this.loadData();
                this.dataTable.updateData(this.products);
            } else {
                toast.error('فشل في تعديل المخزون');
            }
        } catch (error) {
            console.error('Stock adjustment error:', error);
            toast.error('حدث خطأ في تعديل المخزون');
        } finally {
            loading.hide('adjust-stock');
        }
    }

    async deleteProduct(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) return;

        const confirmed = await modal.confirm(
            `هل أنت متأكد من حذف المنتج "${product.name}"؟`,
            'تأكيد الحذف'
        );
        
        if (!confirmed) return;

        try {
            loading.show('delete-product');
            const response = await api.deleteProduct(id);
            
            if (response.success) {
                toast.success('تم حذف المنتج بنجاح');
                await this.loadData();
                this.dataTable.updateData(this.products);
            } else {
                toast.error('فشل في حذف المنتج');
            }
        } catch (error) {
            console.error('Delete product error:', error);
            toast.error('حدث خطأ في حذف المنتج');
        } finally {
            loading.hide('delete-product');
        }
    }

    exportProducts() {
        const csvContent = this.generateProductsCSV();
        downloadFile(csvContent, 'products.csv', 'text/csv');
        toast.success('تم تصدير البيانات بنجاح');
    }

    printProducts() {
        const printContent = this.generateProductsPrintContent();
        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    }

    // Helper methods
    getStockStatus(stock, minStock) {
        if (stock <= 0) return 'غير متوفر';
        if (stock <= minStock) return 'منخفض';
        return 'متوفر';
    }

    getTotalInventoryValue() {
        return this.products.reduce((total, product) => {
            return total + (product.price * product.stock);
        }, 0);
    }

    getLowStockCount() {
        return this.products.filter(product => 
            product.stock <= product.minStock
        ).length;
    }

    getProductsInCategory(categoryId) {
        const category = this.categories.find(c => c.id === categoryId);
        if (!category) return 0;
        return this.products.filter(p => p.category === category.name).length;
    }

    generateBarcode() {
        return Date.now().toString() + Math.random().toString(36).substr(2, 5);
    }

    generateProductsCSV() {
        const headers = ['الكود', 'اسم المنتج', 'الفئة', 'السعر', 'المخزون', 'الحد الأدنى'];
        const rows = this.products.map(product => [
            product.id,
            product.name,
            product.category,
            product.price,
            product.stock,
            product.minStock
        ]);

        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    generateProductsPrintContent() {
        return `
            <html>
                <head>
                    <title>قائمة المنتجات</title>
                    <style>
                        body { font-family: 'Cairo', Arial, sans-serif; direction: rtl; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
                        th { background-color: #f5f5f5; }
                        h1 { text-align: center; color: #333; }
                    </style>
                </head>
                <body>
                    <h1>قائمة المنتجات</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>الكود</th>
                                <th>اسم المنتج</th>
                                <th>الفئة</th>
                                <th>السعر</th>
                                <th>المخزون</th>
                                <th>الحد الأدنى</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.products.map(product => `
                                <tr>
                                    <td>#${product.id}</td>
                                    <td>${product.name}</td>
                                    <td>${product.category}</td>
                                    <td>${formatCurrency(product.price)}</td>
                                    <td>${formatNumber(product.stock)}</td>
                                    <td>${formatNumber(product.minStock)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
            </html>
        `;
    }
}

// Export inventory module
window.inventoryModule = new Inventory();

