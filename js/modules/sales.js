// Sales Module

class Sales {
    constructor() {
        this.sales = [];
        this.products = [];
        this.customers = [];
        this.currentSale = {
            items: [],
            customer: null,
            discount: 0,
            tax: 14, // 14% VAT
            notes: ''
        };
        this.dataTable = null;
    }

    async init() {
        await this.loadData();
        this.render();
        this.bindEvents();
    }

    async loadData() {
        try {
            loading.show('sales');
            
            const [salesResponse, productsResponse, customersResponse] = await Promise.all([
                api.getSales(),
                api.getProducts(),
                api.getCustomers()
            ]);

            if (salesResponse.success) {
                this.sales = salesResponse.data;
            }
            
            if (productsResponse.success) {
                this.products = productsResponse.data;
            }
            
            if (customersResponse.success) {
                this.customers = customersResponse.data;
            }
        } catch (error) {
            console.error('Sales data loading error:', error);
            toast.error('حدث خطأ في تحميل بيانات المبيعات');
        } finally {
            loading.hide('sales');
        }
    }

    render() {
        const content = `
            <div class="sales-container">
                <!-- Header Actions -->
                <div class="module-header">
                    <div class="module-title">
                        <h2>إدارة المبيعات</h2>
                        <p>إدارة وتتبع جميع عمليات البيع</p>
                    </div>
                    <div class="module-actions">
                        <button class="btn btn-success" onclick="salesModule.showAddSaleModal()">
                            <i class="fas fa-plus"></i>
                            بيع جديد
                        </button>
                        <button class="btn btn-primary" onclick="salesModule.showQuickSaleModal()">
                            <i class="fas fa-bolt"></i>
                            بيع سريع
                        </button>
                    </div>
                </div>

                <!-- Sales Stats -->
                <div class="sales-stats">
                    <div class="stats-grid">
                        <div class="stat-card primary">
                            <div class="stat-header">
                                <span class="stat-title">مبيعات اليوم</span>
                                <div class="stat-icon primary">
                                    <i class="fas fa-calendar-day"></i>
                                </div>
                            </div>
                            <div class="stat-value">${formatCurrency(this.getTodaySales())}</div>
                            <div class="stat-change positive">
                                <i class="fas fa-arrow-up"></i>
                                +12.5%
                            </div>
                        </div>
                        
                        <div class="stat-card success">
                            <div class="stat-header">
                                <span class="stat-title">مبيعات الشهر</span>
                                <div class="stat-icon success">
                                    <i class="fas fa-calendar-alt"></i>
                                </div>
                            </div>
                            <div class="stat-value">${formatCurrency(this.getMonthSales())}</div>
                            <div class="stat-change positive">
                                <i class="fas fa-arrow-up"></i>
                                +8.3%
                            </div>
                        </div>
                        
                        <div class="stat-card warning">
                            <div class="stat-header">
                                <span class="stat-title">عدد المبيعات</span>
                                <div class="stat-icon warning">
                                    <i class="fas fa-shopping-cart"></i>
                                </div>
                            </div>
                            <div class="stat-value">${formatNumber(this.sales.length)}</div>
                            <div class="stat-change positive">
                                <i class="fas fa-arrow-up"></i>
                                +5 اليوم
                            </div>
                        </div>
                        
                        <div class="stat-card info">
                            <div class="stat-header">
                                <span class="stat-title">متوسط البيع</span>
                                <div class="stat-icon info">
                                    <i class="fas fa-chart-bar"></i>
                                </div>
                            </div>
                            <div class="stat-value">${formatCurrency(this.getAverageSale())}</div>
                            <div class="stat-change positive">
                                <i class="fas fa-arrow-up"></i>
                                +3.2%
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sales Table -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">قائمة المبيعات</h3>
                        <div class="card-actions">
                            <button class="btn btn-ghost btn-sm" onclick="salesModule.exportSales()">
                                <i class="fas fa-download"></i>
                                تصدير
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div id="sales-table"></div>
                    </div>
                </div>
            </div>
        `;

        $('page-content').innerHTML = content;
        this.initDataTable();
    }

    initDataTable() {
        const columns = [
            {
                key: 'id',
                title: 'رقم البيع',
                render: (value) => `#${value}`
            },
            {
                key: 'customer',
                title: 'العميل'
            },
            {
                key: 'items',
                title: 'عدد الأصناف',
                render: (value) => formatNumber(value)
            },
            {
                key: 'total',
                title: 'المبلغ الإجمالي',
                render: (value) => formatCurrency(value)
            },
            {
                key: 'date',
                title: 'التاريخ',
                render: (value) => formatDate(value)
            },
            {
                key: 'status',
                title: 'الحالة',
                render: (value) => `
                    <span class="badge ${value === 'مكتملة' ? 'badge-success' : 
                                       value === 'معلقة' ? 'badge-warning' : 'badge-danger'}">
                        ${value}
                    </span>
                `
            },
            {
                key: 'actions',
                title: 'الإجراءات',
                render: (value, row) => `
                    <div class="table-actions">
                        <button class="btn btn-ghost btn-sm" onclick="salesModule.viewSale(${row.id})" title="عرض">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-ghost btn-sm" onclick="salesModule.editSale(${row.id})" title="تعديل">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-ghost btn-sm" onclick="salesModule.printSale(${row.id})" title="طباعة">
                            <i class="fas fa-print"></i>
                        </button>
                        <button class="btn btn-ghost btn-sm text-danger" onclick="salesModule.deleteSale(${row.id})" title="حذف">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `
            }
        ];

        this.dataTable = new DataTable('#sales-table', {
            data: this.sales,
            columns: columns,
            searchable: true,
            sortable: true,
            pagination: true,
            pageSize: 10
        });
    }

    showAddSaleModal() {
        this.resetCurrentSale();
        const content = this.renderSaleForm();
        
        modal.show(content, {
            title: 'بيع جديد',
            size: 'large'
        });

        this.bindSaleFormEvents();
    }

    showQuickSaleModal() {
        const content = `
            <div class="quick-sale-form">
                <div class="form-group">
                    <label class="form-label">المنتج</label>
                    <select class="form-input" name="product" required>
                        <option value="">اختر المنتج</option>
                        ${this.products.map(product => `
                            <option value="${product.id}" data-price="${product.price}" data-stock="${product.stock}">
                                ${product.name} - ${formatCurrency(product.price)} (متوفر: ${product.stock})
                            </option>
                        `).join('')}
                    </select>
                </div>
                
                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label">الكمية</label>
                        <input type="number" class="form-input" name="quantity" min="1" value="1" required>
                    </div>
                    <div class="form-col">
                        <label class="form-label">السعر</label>
                        <input type="number" class="form-input" name="price" step="0.01" readonly>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">العميل (اختياري)</label>
                    <select class="form-input" name="customer">
                        <option value="">عميل عادي</option>
                        ${this.customers.map(customer => `
                            <option value="${customer.id}">${customer.name}</option>
                        `).join('')}
                    </select>
                </div>
                
                <div class="quick-sale-total">
                    <div class="total-row">
                        <span>المجموع الفرعي:</span>
                        <span id="quick-subtotal">${formatCurrency(0)}</span>
                    </div>
                    <div class="total-row">
                        <span>الضريبة (14%):</span>
                        <span id="quick-tax">${formatCurrency(0)}</span>
                    </div>
                    <div class="total-row total-final">
                        <span>المجموع النهائي:</span>
                        <span id="quick-total">${formatCurrency(0)}</span>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-success" onclick="salesModule.processQuickSale()">
                        <i class="fas fa-check"></i>
                        إتمام البيع
                    </button>
                    <button type="button" class="btn btn-ghost" onclick="modal.hide()">
                        إلغاء
                    </button>
                </div>
            </div>
        `;

        modal.show(content, {
            title: 'بيع سريع',
            size: 'medium'
        });

        this.bindQuickSaleEvents();
    }

    renderSaleForm() {
        return `
            <div class="sale-form">
                <div class="sale-form-header">
                    <div class="form-row">
                        <div class="form-col">
                            <label class="form-label">العميل</label>
                            <select class="form-input" name="customer">
                                <option value="">اختر العميل</option>
                                ${this.customers.map(customer => `
                                    <option value="${customer.id}">${customer.name}</option>
                                `).join('')}
                            </select>
                        </div>
                        <div class="form-col">
                            <label class="form-label">تاريخ البيع</label>
                            <input type="date" class="form-input" name="date" value="${new Date().toISOString().split('T')[0]}">
                        </div>
                    </div>
                </div>

                <div class="sale-items">
                    <h4>أصناف البيع</h4>
                    <div class="items-header">
                        <button type="button" class="btn btn-primary btn-sm" onclick="salesModule.addSaleItem()">
                            <i class="fas fa-plus"></i>
                            إضافة صنف
                        </button>
                    </div>
                    <div id="sale-items-list">
                        ${this.renderSaleItems()}
                    </div>
                </div>

                <div class="sale-summary">
                    <div class="form-row">
                        <div class="form-col">
                            <label class="form-label">خصم (%)</label>
                            <input type="number" class="form-input" name="discount" min="0" max="100" step="0.01" value="0">
                        </div>
                        <div class="form-col">
                            <label class="form-label">ضريبة (%)</label>
                            <input type="number" class="form-input" name="tax" min="0" max="100" step="0.01" value="14">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">ملاحظات</label>
                        <textarea class="form-textarea" name="notes" rows="3" placeholder="ملاحظات إضافية..."></textarea>
                    </div>
                    
                    <div class="sale-totals">
                        <div class="total-row">
                            <span>المجموع الفرعي:</span>
                            <span id="subtotal">${formatCurrency(0)}</span>
                        </div>
                        <div class="total-row">
                            <span>الخصم:</span>
                            <span id="discount-amount">${formatCurrency(0)}</span>
                        </div>
                        <div class="total-row">
                            <span>الضريبة:</span>
                            <span id="tax-amount">${formatCurrency(0)}</span>
                        </div>
                        <div class="total-row total-final">
                            <span>المجموع النهائي:</span>
                            <span id="final-total">${formatCurrency(0)}</span>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-success" onclick="salesModule.saveSale()">
                        <i class="fas fa-save"></i>
                        حفظ البيع
                    </button>
                    <button type="button" class="btn btn-primary" onclick="salesModule.saveSale(true)">
                        <i class="fas fa-print"></i>
                        حفظ وطباعة
                    </button>
                    <button type="button" class="btn btn-ghost" onclick="modal.hide()">
                        إلغاء
                    </button>
                </div>
            </div>
        `;
    }

    renderSaleItems() {
        if (this.currentSale.items.length === 0) {
            return '<p class="text-muted">لم يتم إضافة أي أصناف بعد</p>';
        }

        return `
            <div class="sale-items-table">
                <table class="table">
                    <thead>
                        <tr>
                            <th>المنتج</th>
                            <th>الكمية</th>
                            <th>السعر</th>
                            <th>المجموع</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.currentSale.items.map((item, index) => `
                            <tr>
                                <td>${item.productName}</td>
                                <td>${item.quantity}</td>
                                <td>${formatCurrency(item.price)}</td>
                                <td>${formatCurrency(item.quantity * item.price)}</td>
                                <td>
                                    <button class="btn btn-ghost btn-sm text-danger" onclick="salesModule.removeSaleItem(${index})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    bindEvents() {
        // Module-specific events
    }

    bindSaleFormEvents() {
        // Update totals when discount or tax changes
        const discountInput = $$('input[name="discount"]');
        const taxInput = $$('input[name="tax"]');
        
        if (discountInput) {
            discountInput.addEventListener('input', () => this.updateSaleTotals());
        }
        
        if (taxInput) {
            taxInput.addEventListener('input', () => this.updateSaleTotals());
        }
    }

    bindQuickSaleEvents() {
        const productSelect = $$('select[name="product"]');
        const quantityInput = $$('input[name="quantity"]');
        const priceInput = $$('input[name="price"]');

        if (productSelect) {
            productSelect.addEventListener('change', () => {
                const selectedOption = productSelect.selectedOptions[0];
                if (selectedOption) {
                    const price = selectedOption.dataset.price;
                    if (priceInput) {
                        priceInput.value = price;
                    }
                    this.updateQuickSaleTotal();
                }
            });
        }

        if (quantityInput) {
            quantityInput.addEventListener('input', () => {
                this.updateQuickSaleTotal();
            });
        }
    }

    addSaleItem() {
        const content = `
            <div class="add-item-form">
                <div class="form-group">
                    <label class="form-label">المنتج</label>
                    <select class="form-input" name="product" required>
                        <option value="">اختر المنتج</option>
                        ${this.products.map(product => `
                            <option value="${product.id}" data-price="${product.price}" data-stock="${product.stock}">
                                ${product.name} - ${formatCurrency(product.price)} (متوفر: ${product.stock})
                            </option>
                        `).join('')}
                    </select>
                </div>
                
                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label">الكمية</label>
                        <input type="number" class="form-input" name="quantity" min="1" value="1" required>
                    </div>
                    <div class="form-col">
                        <label class="form-label">السعر</label>
                        <input type="number" class="form-input" name="price" step="0.01" required>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" onclick="salesModule.confirmAddItem()">
                        إضافة
                    </button>
                    <button type="button" class="btn btn-ghost" onclick="modal.hide()">
                        إلغاء
                    </button>
                </div>
            </div>
        `;

        modal.show(content, {
            title: 'إضافة صنف',
            size: 'medium'
        });

        // Bind product selection event
        const productSelect = $$('select[name="product"]');
        const priceInput = $$('input[name="price"]');
        
        if (productSelect && priceInput) {
            productSelect.addEventListener('change', () => {
                const selectedOption = productSelect.selectedOptions[0];
                if (selectedOption) {
                    priceInput.value = selectedOption.dataset.price;
                }
            });
        }
    }

    confirmAddItem() {
        const productSelect = $$('select[name="product"]');
        const quantityInput = $$('input[name="quantity"]');
        const priceInput = $$('input[name="price"]');

        if (!productSelect.value || !quantityInput.value || !priceInput.value) {
            toast.error('يرجى ملء جميع الحقول المطلوبة');
            return;
        }

        const product = this.products.find(p => p.id == productSelect.value);
        const quantity = parseInt(quantityInput.value);
        const price = parseFloat(priceInput.value);

        if (quantity > product.stock) {
            toast.error('الكمية المطلوبة غير متوفرة في المخزون');
            return;
        }

        const item = {
            productId: product.id,
            productName: product.name,
            quantity: quantity,
            price: price
        };

        this.currentSale.items.push(item);
        this.updateSaleItemsList();
        this.updateSaleTotals();
        modal.hide();
        toast.success('تم إضافة الصنف بنجاح');
    }

    removeSaleItem(index) {
        this.currentSale.items.splice(index, 1);
        this.updateSaleItemsList();
        this.updateSaleTotals();
    }

    updateSaleItemsList() {
        const itemsList = $('sale-items-list');
        if (itemsList) {
            itemsList.innerHTML = this.renderSaleItems();
        }
    }

    updateSaleTotals() {
        const subtotal = this.currentSale.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        const discountPercent = parseFloat($$('input[name="discount"]')?.value || 0);
        const taxPercent = parseFloat($$('input[name="tax"]')?.value || 0);
        
        const discountAmount = subtotal * (discountPercent / 100);
        const taxableAmount = subtotal - discountAmount;
        const taxAmount = taxableAmount * (taxPercent / 100);
        const finalTotal = taxableAmount + taxAmount;

        // Update display
        const subtotalEl = $('subtotal');
        const discountEl = $('discount-amount');
        const taxEl = $('tax-amount');
        const totalEl = $('final-total');

        if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
        if (discountEl) discountEl.textContent = formatCurrency(discountAmount);
        if (taxEl) taxEl.textContent = formatCurrency(taxAmount);
        if (totalEl) totalEl.textContent = formatCurrency(finalTotal);
    }

    updateQuickSaleTotal() {
        const quantityInput = $$('input[name="quantity"]');
        const priceInput = $$('input[name="price"]');
        
        const quantity = parseInt(quantityInput?.value || 0);
        const price = parseFloat(priceInput?.value || 0);
        
        const subtotal = quantity * price;
        const tax = subtotal * 0.14; // 14% VAT
        const total = subtotal + tax;

        const subtotalEl = $('quick-subtotal');
        const taxEl = $('quick-tax');
        const totalEl = $('quick-total');

        if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
        if (taxEl) taxEl.textContent = formatCurrency(tax);
        if (totalEl) totalEl.textContent = formatCurrency(total);
    }

    async processQuickSale() {
        const productSelect = $$('select[name="product"]');
        const quantityInput = $$('input[name="quantity"]');
        const customerSelect = $$('select[name="customer"]');

        if (!productSelect.value || !quantityInput.value) {
            toast.error('يرجى اختيار المنتج والكمية');
            return;
        }

        const product = this.products.find(p => p.id == productSelect.value);
        const quantity = parseInt(quantityInput.value);

        if (quantity > product.stock) {
            toast.error('الكمية المطلوبة غير متوفرة في المخزون');
            return;
        }

        const saleData = {
            customer: customerSelect.value || 'عميل عادي',
            items: [{
                productId: product.id,
                productName: product.name,
                quantity: quantity,
                price: product.price
            }],
            discount: 0,
            tax: 14,
            notes: 'بيع سريع'
        };

        try {
            loading.show('quick-sale');
            const response = await api.createSale(saleData);
            
            if (response.success) {
                toast.success('تم إتمام البيع بنجاح');
                modal.hide();
                await this.loadData();
                this.dataTable.updateData(this.sales);
            } else {
                toast.error('فشل في إتمام البيع');
            }
        } catch (error) {
            console.error('Quick sale error:', error);
            toast.error('حدث خطأ في إتمام البيع');
        } finally {
            loading.hide('quick-sale');
        }
    }

    async saveSale(print = false) {
        if (this.currentSale.items.length === 0) {
            toast.error('يرجى إضافة أصناف للبيع');
            return;
        }

        const customerSelect = $$('select[name="customer"]');
        const dateInput = $$('input[name="date"]');
        const discountInput = $$('input[name="discount"]');
        const taxInput = $$('input[name="tax"]');
        const notesInput = $$('textarea[name="notes"]');

        const saleData = {
            customer: customerSelect.value || 'عميل عادي',
            date: dateInput.value,
            items: this.currentSale.items,
            discount: parseFloat(discountInput.value || 0),
            tax: parseFloat(taxInput.value || 0),
            notes: notesInput.value
        };

        try {
            loading.show('save-sale');
            const response = await api.createSale(saleData);
            
            if (response.success) {
                toast.success('تم حفظ البيع بنجاح');
                modal.hide();
                
                if (print) {
                    this.printSale(response.data.id);
                }
                
                await this.loadData();
                this.dataTable.updateData(this.sales);
            } else {
                toast.error('فشل في حفظ البيع');
            }
        } catch (error) {
            console.error('Save sale error:', error);
            toast.error('حدث خطأ في حفظ البيع');
        } finally {
            loading.hide('save-sale');
        }
    }

    resetCurrentSale() {
        this.currentSale = {
            items: [],
            customer: null,
            discount: 0,
            tax: 14,
            notes: ''
        };
    }

    viewSale(id) {
        const sale = this.sales.find(s => s.id === id);
        if (!sale) return;

        // Implementation for viewing sale details
        toast.info('عرض تفاصيل البيع قيد التطوير');
    }

    editSale(id) {
        const sale = this.sales.find(s => s.id === id);
        if (!sale) return;

        // Implementation for editing sale
        toast.info('تعديل البيع قيد التطوير');
    }

    printSale(id) {
        const sale = this.sales.find(s => s.id === id);
        if (!sale) return;

        // Implementation for printing sale
        toast.info('طباعة البيع قيد التطوير');
    }

    async deleteSale(id) {
        const confirmed = await modal.confirm('هل أنت متأكد من حذف هذا البيع؟', 'تأكيد الحذف');
        if (!confirmed) return;

        try {
            loading.show('delete-sale');
            const response = await api.deleteSale(id);
            
            if (response.success) {
                toast.success('تم حذف البيع بنجاح');
                await this.loadData();
                this.dataTable.updateData(this.sales);
            } else {
                toast.error('فشل في حذف البيع');
            }
        } catch (error) {
            console.error('Delete sale error:', error);
            toast.error('حدث خطأ في حذف البيع');
        } finally {
            loading.hide('delete-sale');
        }
    }

    exportSales() {
        // Implementation for exporting sales data
        toast.info('تصدير البيانات قيد التطوير');
    }

    // Helper methods
    getTodaySales() {
        const today = new Date().toDateString();
        return this.sales
            .filter(sale => new Date(sale.date).toDateString() === today)
            .reduce((sum, sale) => sum + sale.total, 0);
    }

    getMonthSales() {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        return this.sales
            .filter(sale => {
                const saleDate = new Date(sale.date);
                return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
            })
            .reduce((sum, sale) => sum + sale.total, 0);
    }

    getAverageSale() {
        if (this.sales.length === 0) return 0;
        const total = this.sales.reduce((sum, sale) => sum + sale.total, 0);
        return total / this.sales.length;
    }
}

// Export sales module
window.salesModule = new Sales();

