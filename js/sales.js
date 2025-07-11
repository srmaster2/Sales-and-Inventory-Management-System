// Sales Module
const Sales = {
    currentFilters: {},
    currentPage: 1,
    itemsPerPage: 10,

    // Load sales section
    load() {
        this.render();
        this.loadSalesTable();
        this.setupEventListeners();
    },

    // Render sales HTML
    render() {
        const salesSection = document.getElementById('sales');
        salesSection.innerHTML = `
            <div class="page-header">
                <div class="page-title">
                    <h2>إدارة المبيعات</h2>
                    <p>تسجيل ومتابعة جميع عمليات البيع</p>
                </div>
                <div class="page-actions">
                    <button class="btn btn-primary" onclick="Sales.openSaleModal()">
                        <i class="fas fa-plus"></i>
                        بيع جديد
                    </button>
                    <button class="btn btn-secondary" onclick="Sales.openQuickSale()">
                        <i class="fas fa-bolt"></i>
                        بيع سريع
                    </button>
                </div>
            </div>

            <!-- Sales Filters -->
            <div class="card">
                <div class="card-header">
                    <h3>فلترة المبيعات</h3>
                    <button class="btn btn-outline btn-sm" onclick="Sales.clearFilters()">
                        <i class="fas fa-times"></i>
                        مسح الفلاتر
                    </button>
                </div>
                <div class="filters-grid">
                    <div class="form-group">
                        <label class="form-label">البحث</label>
                        <input type="text" id="salesSearch" class="form-input" placeholder="رقم الفاتورة أو اسم العميل">
                    </div>
                    <div class="form-group">
                        <label class="form-label">من تاريخ</label>
                        <input type="date" id="salesFromDate" class="form-input">
                    </div>
                    <div class="form-group">
                        <label class="form-label">إلى تاريخ</label>
                        <input type="date" id="salesToDate" class="form-input">
                    </div>
                    <div class="form-group">
                        <label class="form-label">العميل</label>
                        <select id="salesCustomerFilter" class="form-select">
                            <option value="">جميع العملاء</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">الحالة</label>
                        <select id="salesStatusFilter" class="form-select">
                            <option value="">جميع الحالات</option>
                            <option value="paid">مدفوع</option>
                            <option value="pending">معلق</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">&nbsp;</label>
                        <button class="btn btn-primary" onclick="Sales.applyFilters()">
                            <i class="fas fa-filter"></i>
                            تطبيق الفلتر
                        </button>
                    </div>
                </div>
            </div>

            <!-- Sales Table -->
            <div class="table-container">
                <div class="card-header">
                    <h3>قائمة المبيعات</h3>
                    <div class="page-actions">
                        <button class="btn btn-outline btn-sm" onclick="Sales.exportSales()">
                            <i class="fas fa-download"></i>
                            تصدير
                        </button>
                        <button class="btn btn-outline btn-sm" onclick="Sales.printSales()">
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
                                    <input type="checkbox" id="selectAllSales" onchange="Sales.toggleSelectAll()">
                                </th>
                                <th>رقم الفاتورة</th>
                                <th>التاريخ</th>
                                <th>العميل</th>
                                <th>المبلغ</th>
                                <th>الربح</th>
                                <th>الحالة</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody id="salesTableBody">
                            <!-- Sales data will be populated here -->
                        </tbody>
                    </table>
                </div>
                <div class="table-pagination" id="salesPagination">
                    <!-- Pagination will be populated here -->
                </div>
            </div>
        `;

        this.loadCustomerOptions();
    },

    // Setup event listeners
    setupEventListeners() {
        // Search input
        document.getElementById('salesSearch').addEventListener('input', (e) => {
            this.currentFilters.search = e.target.value;
            this.applyFilters();
        });

        // Date filters
        document.getElementById('salesFromDate').addEventListener('change', (e) => {
            this.currentFilters.fromDate = e.target.value;
            this.applyFilters();
        });

        document.getElementById('salesToDate').addEventListener('change', (e) => {
            this.currentFilters.toDate = e.target.value;
            this.applyFilters();
        });

        // Customer filter
        document.getElementById('salesCustomerFilter').addEventListener('change', (e) => {
            this.currentFilters.customer = e.target.value;
            this.applyFilters();
        });

        // Status filter
        document.getElementById('salesStatusFilter').addEventListener('change', (e) => {
            this.currentFilters.status = e.target.value;
            this.applyFilters();
        });
    },

    // Load customer options
    loadCustomerOptions() {
        const customerSelect = document.getElementById('salesCustomerFilter');
        if (!customerSelect) return;

        let optionsHTML = '<option value="">جميع العملاء</option>';
        App.data.customers.forEach(customer => {
            optionsHTML += `<option value="${customer.id}">${customer.name}</option>`;
        });

        customerSelect.innerHTML = optionsHTML;
    },

    // Load sales table
    loadSalesTable() {
        const tbody = document.getElementById('salesTableBody');
        if (!tbody) return;

        let filteredSales = this.getFilteredSales();
        
        // Pagination
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const paginatedSales = filteredSales.slice(startIndex, endIndex);

        let html = '';
        
        if (paginatedSales.length === 0) {
            html = `
                <tr>
                    <td colspan="8" class="text-center">
                        <div class="no-data">لا توجد مبيعات</div>
                    </td>
                </tr>
            `;
        } else {
            paginatedSales.forEach(sale => {
                const customer = App.data.customers.find(c => c.id === sale.customerId);
                const profit = this.calculateProfit(sale);
                
                html += `
                    <tr>
                        <td>
                            <input type="checkbox" value="${sale.id}" class="sale-checkbox">
                        </td>
                        <td>
                            <strong>#${sale.id}</strong>
                        </td>
                        <td>${App.formatDate(sale.date)}</td>
                        <td>
                            <div class="customer-info">
                                <strong>${customer?.name || 'عميل محذوف'}</strong>
                                <small>${customer?.phone || ''}</small>
                            </div>
                        </td>
                        <td>
                            <strong>${App.formatCurrency(sale.totalAmount)}</strong>
                        </td>
                        <td>
                            <span class="profit-amount">${App.formatCurrency(profit)}</span>
                        </td>
                        <td>
                            <span class="status ${sale.paid ? 'success' : 'warning'}">
                                ${sale.paid ? 'مدفوع' : 'معلق'}
                            </span>
                        </td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn btn-outline btn-sm" onclick="Sales.viewSale('${sale.id}')" title="عرض">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn btn-outline btn-sm" onclick="Sales.editSale('${sale.id}')" title="تعديل">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-outline btn-sm" onclick="Sales.printInvoice('${sale.id}')" title="طباعة">
                                    <i class="fas fa-print"></i>
                                </button>
                                <button class="btn btn-outline btn-sm" onclick="Sales.deleteSale('${sale.id}')" title="حذف">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            });
        }

        tbody.innerHTML = html;
        this.updatePagination(filteredSales.length);
    },

    // Get filtered sales
    getFilteredSales() {
        let filtered = [...App.data.sales];

        // Search filter
        if (this.currentFilters.search) {
            const search = this.currentFilters.search.toLowerCase();
            filtered = filtered.filter(sale => {
                const customer = App.data.customers.find(c => c.id === sale.customerId);
                return sale.id.toLowerCase().includes(search) ||
                       (customer && customer.name.toLowerCase().includes(search));
            });
        }

        // Date filters
        if (this.currentFilters.fromDate) {
            filtered = filtered.filter(sale => sale.date >= this.currentFilters.fromDate);
        }

        if (this.currentFilters.toDate) {
            filtered = filtered.filter(sale => sale.date <= this.currentFilters.toDate);
        }

        // Customer filter
        if (this.currentFilters.customer) {
            filtered = filtered.filter(sale => sale.customerId === this.currentFilters.customer);
        }

        // Status filter
        if (this.currentFilters.status) {
            const isPaid = this.currentFilters.status === 'paid';
            filtered = filtered.filter(sale => sale.paid === isPaid);
        }

        // Sort by date (newest first)
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

        return filtered;
    },

    // Calculate profit for a sale
    calculateProfit(sale) {
        let totalProfit = 0;
        sale.items.forEach(item => {
            const product = App.data.products.find(p => p.id === item.productId);
            if (product) {
                const profit = (item.price - product.purchasePrice) * item.quantity;
                totalProfit += profit;
            }
        });
        return totalProfit;
    },

    // Update pagination
    updatePagination(totalItems) {
        const paginationContainer = document.getElementById('salesPagination');
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
                <button class="btn btn-outline btn-sm" onclick="Sales.goToPage(${this.currentPage - 1})">
                    <i class="fas fa-chevron-right"></i>
                </button>
            `;
        }

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === this.currentPage) {
                paginationHTML += `<button class="btn btn-primary btn-sm">${i}</button>`;
            } else if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                paginationHTML += `<button class="btn btn-outline btn-sm" onclick="Sales.goToPage(${i})">${i}</button>`;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                paginationHTML += `<span class="pagination-dots">...</span>`;
            }
        }

        // Next button
        if (this.currentPage < totalPages) {
            paginationHTML += `
                <button class="btn btn-outline btn-sm" onclick="Sales.goToPage(${this.currentPage + 1})">
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
        this.loadSalesTable();
    },

    // Apply filters
    applyFilters() {
        this.currentPage = 1;
        this.loadSalesTable();
    },

    // Clear filters
    clearFilters() {
        this.currentFilters = {};
        this.currentPage = 1;
        
        // Clear form inputs
        document.getElementById('salesSearch').value = '';
        document.getElementById('salesFromDate').value = '';
        document.getElementById('salesToDate').value = '';
        document.getElementById('salesCustomerFilter').value = '';
        document.getElementById('salesStatusFilter').value = '';
        
        this.loadSalesTable();
    },

    // Toggle select all
    toggleSelectAll() {
        const selectAll = document.getElementById('selectAllSales');
        const checkboxes = document.querySelectorAll('.sale-checkbox');
        
        checkboxes.forEach(checkbox => {
            checkbox.checked = selectAll.checked;
        });
    },

    // Open sale modal
    openSaleModal() {
        Modals.open('sale-modal', 'بيع جديد', this.getSaleModalContent(), {
            size: 'large',
            onSave: () => this.saveSale()
        });
    },

    // Get sale modal content
    getSaleModalContent() {
        return `
            <form id="saleForm">
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label">العميل *</label>
                        <select id="saleCustomer" class="form-select" required>
                            <option value="">اختر العميل</option>
                            ${App.data.customers.map(customer => 
                                `<option value="${customer.id}">${customer.name}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">تاريخ البيع *</label>
                        <input type="date" id="saleDate" class="form-input" value="${new Date().toISOString().split('T')[0]}" required>
                    </div>
                </div>

                <div class="sale-items-section">
                    <div class="section-header">
                        <h4>المنتجات</h4>
                        <button type="button" class="btn btn-outline btn-sm" onclick="Sales.addSaleItem()">
                            <i class="fas fa-plus"></i>
                            إضافة منتج
                        </button>
                    </div>
                    <div id="saleItems">
                        <!-- Sale items will be added here -->
                    </div>
                </div>

                <div class="sale-summary">
                    <div class="summary-row">
                        <span>المجموع الفرعي:</span>
                        <span id="saleSubtotal">0.00 ج.م</span>
                    </div>
                    <div class="summary-row">
                        <span>الخصم:</span>
                        <input type="number" id="saleDiscount" class="form-input" value="0" min="0" onchange="Sales.updateSaleTotal()">
                    </div>
                    <div class="summary-row total">
                        <span>المجموع الكلي:</span>
                        <span id="saleTotal">0.00 ج.م</span>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">
                        <input type="checkbox" id="salePaid"> مدفوع
                    </label>
                </div>

                <div class="form-group">
                    <label class="form-label">ملاحظات</label>
                    <textarea id="saleNotes" class="form-textarea" rows="3"></textarea>
                </div>
            </form>
        `;
    },

    // Add sale item
    addSaleItem() {
        const saleItems = document.getElementById('saleItems');
        const itemIndex = saleItems.children.length;
        
        const itemHTML = `
            <div class="sale-item" data-index="${itemIndex}">
                <div class="item-grid">
                    <div class="form-group">
                        <select class="form-select item-product" onchange="Sales.updateItemPrice(${itemIndex})" required>
                            <option value="">اختر المنتج</option>
                            ${App.data.products.map(product => 
                                `<option value="${product.id}" data-price="${product.sellingPrice}" data-stock="${product.currentStock}">
                                    ${product.name} (متوفر: ${product.currentStock})
                                </option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <input type="number" class="form-input item-quantity" placeholder="الكمية" min="1" onchange="Sales.updateItemTotal(${itemIndex})" required>
                    </div>
                    <div class="form-group">
                        <input type="number" class="form-input item-price" placeholder="السعر" min="0" step="0.01" onchange="Sales.updateItemTotal(${itemIndex})" required>
                    </div>
                    <div class="form-group">
                        <input type="text" class="form-input item-total" placeholder="المجموع" readonly>
                    </div>
                    <div class="form-group">
                        <button type="button" class="btn btn-outline btn-sm" onclick="Sales.removeSaleItem(${itemIndex})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        saleItems.insertAdjacentHTML('beforeend', itemHTML);
    },

    // Remove sale item
    removeSaleItem(index) {
        const item = document.querySelector(`[data-index="${index}"]`);
        if (item) {
            item.remove();
            this.updateSaleTotal();
        }
    },

    // Update item price when product is selected
    updateItemPrice(index) {
        const item = document.querySelector(`[data-index="${index}"]`);
        const productSelect = item.querySelector('.item-product');
        const priceInput = item.querySelector('.item-price');
        const quantityInput = item.querySelector('.item-quantity');
        
        const selectedOption = productSelect.options[productSelect.selectedIndex];
        if (selectedOption.value) {
            const price = selectedOption.dataset.price;
            const stock = parseInt(selectedOption.dataset.stock);
            
            priceInput.value = price;
            quantityInput.max = stock;
            
            this.updateItemTotal(index);
        }
    },

    // Update item total
    updateItemTotal(index) {
        const item = document.querySelector(`[data-index="${index}"]`);
        const quantity = parseFloat(item.querySelector('.item-quantity').value) || 0;
        const price = parseFloat(item.querySelector('.item-price').value) || 0;
        const total = quantity * price;
        
        item.querySelector('.item-total').value = App.formatCurrency(total);
        this.updateSaleTotal();
    },

    // Update sale total
    updateSaleTotal() {
        const items = document.querySelectorAll('.sale-item');
        let subtotal = 0;
        
        items.forEach(item => {
            const quantity = parseFloat(item.querySelector('.item-quantity').value) || 0;
            const price = parseFloat(item.querySelector('.item-price').value) || 0;
            subtotal += quantity * price;
        });
        
        const discount = parseFloat(document.getElementById('saleDiscount').value) || 0;
        const total = subtotal - discount;
        
        document.getElementById('saleSubtotal').textContent = App.formatCurrency(subtotal);
        document.getElementById('saleTotal').textContent = App.formatCurrency(total);
    },

    // Save sale
    saveSale() {
        const form = document.getElementById('saleForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return false;
        }

        const customerId = document.getElementById('saleCustomer').value;
        const customer = App.data.customers.find(c => c.id === customerId);
        const date = document.getElementById('saleDate').value;
        const paid = document.getElementById('salePaid').checked;
        const notes = document.getElementById('saleNotes').value;
        const discount = parseFloat(document.getElementById('saleDiscount').value) || 0;

        // Collect items
        const items = [];
        const saleItems = document.querySelectorAll('.sale-item');
        
        saleItems.forEach(item => {
            const productId = item.querySelector('.item-product').value;
            const product = App.data.products.find(p => p.id === productId);
            const quantity = parseInt(item.querySelector('.item-quantity').value);
            const price = parseFloat(item.querySelector('.item-price').value);
            
            if (productId && quantity && price) {
                items.push({
                    productId,
                    productName: product.name,
                    quantity,
                    price,
                    total: quantity * price
                });
            }
        });

        if (items.length === 0) {
            alert('يجب إضافة منتج واحد على الأقل');
            return false;
        }

        // Calculate totals
        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
        const totalAmount = subtotal - discount;

        // Create sale object
        const sale = {
            id: App.generateId('SALE'),
            customerId,
            customerName: customer.name,
            items,
            totalAmount,
            discount,
            date,
            paid,
            notes,
            createdAt: new Date().toISOString()
        };

        // Add to data
        App.data.sales.unshift(sale);

        // Update product stock
        items.forEach(item => {
            const product = App.data.products.find(p => p.id === item.productId);
            if (product) {
                product.currentStock -= item.quantity;
            }
        });

        // Save data
        App.saveData();

        // Refresh table
        this.loadSalesTable();

        // Add notification
        App.addNotification({
            type: 'success',
            title: 'تم إضافة البيع',
            message: `تم إضافة بيع جديد بقيمة ${App.formatCurrency(totalAmount)}`
        });

        return true;
    },

    // View sale
    viewSale(id) {
        const sale = App.data.sales.find(s => s.id === id);
        if (!sale) return;

        const customer = App.data.customers.find(c => c.id === sale.customerId);
        
        const content = `
            <div class="sale-details">
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>رقم الفاتورة:</label>
                        <span>#${sale.id}</span>
                    </div>
                    <div class="detail-item">
                        <label>التاريخ:</label>
                        <span>${App.formatDate(sale.date)}</span>
                    </div>
                    <div class="detail-item">
                        <label>العميل:</label>
                        <span>${customer?.name || 'عميل محذوف'}</span>
                    </div>
                    <div class="detail-item">
                        <label>الحالة:</label>
                        <span class="status ${sale.paid ? 'success' : 'warning'}">
                            ${sale.paid ? 'مدفوع' : 'معلق'}
                        </span>
                    </div>
                </div>

                <div class="items-section">
                    <h4>المنتجات</h4>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>المنتج</th>
                                <th>الكمية</th>
                                <th>السعر</th>
                                <th>المجموع</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${sale.items.map(item => `
                                <tr>
                                    <td>${item.productName}</td>
                                    <td>${item.quantity}</td>
                                    <td>${App.formatCurrency(item.price)}</td>
                                    <td>${App.formatCurrency(item.total)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <div class="sale-summary">
                    <div class="summary-row">
                        <span>المجموع الفرعي:</span>
                        <span>${App.formatCurrency(sale.items.reduce((sum, item) => sum + item.total, 0))}</span>
                    </div>
                    ${sale.discount ? `
                        <div class="summary-row">
                            <span>الخصم:</span>
                            <span>${App.formatCurrency(sale.discount)}</span>
                        </div>
                    ` : ''}
                    <div class="summary-row total">
                        <span>المجموع الكلي:</span>
                        <span>${App.formatCurrency(sale.totalAmount)}</span>
                    </div>
                </div>

                ${sale.notes ? `
                    <div class="notes-section">
                        <h4>ملاحظات</h4>
                        <p>${sale.notes}</p>
                    </div>
                ` : ''}
            </div>
        `;

        Modals.open('view-sale-modal', `تفاصيل البيع #${sale.id}`, content, {
            showSaveButton: false,
            additionalButtons: [
                {
                    text: 'طباعة الفاتورة',
                    class: 'btn-primary',
                    onclick: () => this.printInvoice(id)
                }
            ]
        });
    },

    // Edit sale
    editSale(id) {
        // Implementation for editing sale
        console.log('Edit sale:', id);
    },

    // Delete sale
    deleteSale(id) {
        if (!confirm('هل أنت متأكد من حذف هذا البيع؟')) return;

        const saleIndex = App.data.sales.findIndex(s => s.id === id);
        if (saleIndex === -1) return;

        const sale = App.data.sales[saleIndex];

        // Restore product stock
        sale.items.forEach(item => {
            const product = App.data.products.find(p => p.id === item.productId);
            if (product) {
                product.currentStock += item.quantity;
            }
        });

        // Remove sale
        App.data.sales.splice(saleIndex, 1);
        App.saveData();

        // Refresh table
        this.loadSalesTable();

        // Add notification
        App.addNotification({
            type: 'success',
            title: 'تم حذف البيع',
            message: `تم حذف البيع #${id} بنجاح`
        });
    },

    // Print invoice
    printInvoice(id) {
        const sale = App.data.sales.find(s => s.id === id);
        if (!sale) return;

        const customer = App.data.customers.find(c => c.id === sale.customerId);
        
        // Create print window
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html dir="rtl">
            <head>
                <meta charset="UTF-8">
                <title>فاتورة #${sale.id}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .invoice-details { margin-bottom: 20px; }
                    .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                    .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: right; }
                    .table th { background-color: #f5f5f5; }
                    .total { font-weight: bold; font-size: 18px; }
                    @media print { body { margin: 0; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>فاتورة مبيعات</h1>
                    <h2>نظام إدارة المبيعات والمخزون</h2>
                </div>
                
                <div class="invoice-details">
                    <p><strong>رقم الفاتورة:</strong> #${sale.id}</p>
                    <p><strong>التاريخ:</strong> ${App.formatDate(sale.date)}</p>
                    <p><strong>العميل:</strong> ${customer?.name || 'عميل'}</p>
                    <p><strong>الهاتف:</strong> ${customer?.phone || ''}</p>
                </div>

                <table class="table">
                    <thead>
                        <tr>
                            <th>المنتج</th>
                            <th>الكمية</th>
                            <th>السعر</th>
                            <th>المجموع</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sale.items.map(item => `
                            <tr>
                                <td>${item.productName}</td>
                                <td>${item.quantity}</td>
                                <td>${App.formatCurrency(item.price)}</td>
                                <td>${App.formatCurrency(item.total)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div class="total">
                    <p>المجموع الكلي: ${App.formatCurrency(sale.totalAmount)}</p>
                    <p>الحالة: ${sale.paid ? 'مدفوع' : 'معلق'}</p>
                </div>

                <script>
                    window.onload = function() {
                        window.print();
                        window.onafterprint = function() {
                            window.close();
                        };
                    };
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    },

    // Open quick sale
    openQuickSale() {
        // Implementation for quick sale
        console.log('Open quick sale');
    },

    // Export sales
    exportSales() {
        const filteredSales = this.getFilteredSales();
        const csvContent = this.generateCSV(filteredSales);
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `sales-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    },

    // Generate CSV
    generateCSV(sales) {
        const headers = ['رقم الفاتورة', 'التاريخ', 'العميل', 'المبلغ', 'الحالة'];
        let csv = headers.join(',') + '\n';
        
        sales.forEach(sale => {
            const customer = App.data.customers.find(c => c.id === sale.customerId);
            const row = [
                sale.id,
                sale.date,
                customer?.name || 'عميل محذوف',
                sale.totalAmount,
                sale.paid ? 'مدفوع' : 'معلق'
            ];
            csv += row.join(',') + '\n';
        });
        
        return csv;
    },

    // Print sales
    printSales() {
        window.print();
    }
};

// Add CSS for sales
const salesCSS = `
.filters-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
}

.customer-info {
    display: flex;
    flex-direction: column;
}

.customer-info small {
    color: var(--text-tertiary);
    font-size: 12px;
}

.profit-amount {
    color: var(--success-600);
    font-weight: 600;
}

.action-buttons {
    display: flex;
    gap: 0.25rem;
}

.action-buttons .btn {
    padding: 0.25rem 0.5rem;
}

.pagination-controls {
    display: flex;
    gap: 0.25rem;
    align-items: center;
}

.pagination-dots {
    padding: 0 0.5rem;
    color: var(--text-tertiary);
}

.sale-items-section {
    margin: 1.5rem 0;
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--border-color);
}

.section-header h4 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
}

.sale-item {
    margin-bottom: 1rem;
    padding: 1rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--bg-secondary);
}

.item-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr auto;
    gap: 1rem;
    align-items: end;
}

.sale-summary {
    margin-top: 1.5rem;
    padding: 1rem;
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
}

.summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
}

.summary-row.total {
    font-size: 18px;
    font-weight: 700;
    padding-top: 0.5rem;
    border-top: 1px solid var(--border-color);
    margin-top: 0.5rem;
}

.summary-row input {
    width: 100px;
    text-align: left;
}

.sale-details .detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.detail-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.detail-item label {
    font-weight: 600;
    color: var(--text-secondary);
    font-size: 14px;
}

.detail-item span {
    color: var(--text-primary);
}

.items-section {
    margin: 1.5rem 0;
}

.items-section h4 {
    margin-bottom: 1rem;
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
}

.notes-section {
    margin-top: 1.5rem;
    padding: 1rem;
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
}

.notes-section h4 {
    margin-bottom: 0.5rem;
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
}

.notes-section p {
    color: var(--text-secondary);
    line-height: 1.5;
}

@media (max-width: 768px) {
    .item-grid {
        grid-template-columns: 1fr;
    }
    
    .action-buttons {
        flex-wrap: wrap;
    }
    
    .filters-grid {
        grid-template-columns: 1fr;
    }
}
`;

// Add CSS to document
const style = document.createElement('style');
style.textContent = salesCSS;
document.head.appendChild(style);