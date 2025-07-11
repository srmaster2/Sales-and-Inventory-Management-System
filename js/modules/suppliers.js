// Suppliers Module

class Suppliers {
    constructor() {
        this.suppliers = [];
        this.dataTable = null;
        this.currentSupplier = null;
    }

    async init() {
        await this.loadData();
        this.render();
        this.bindEvents();
    }

    async loadData() {
        try {
            loading.show('suppliers');
            const response = await api.getSuppliers();
            
            if (response.success) {
                this.suppliers = response.data;
            }
        } catch (error) {
            console.error('Suppliers data loading error:', error);
            toast.error('حدث خطأ في تحميل بيانات الموردين');
        } finally {
            loading.hide('suppliers');
        }
    }

    render() {
        const content = `
            <div class="suppliers-container">
                <!-- Header Actions -->
                <div class="module-header">
                    <div class="module-title">
                        <h2>إدارة الموردين</h2>
                        <p>إدارة وتتبع جميع الموردين والمشتريات</p>
                    </div>
                    <div class="module-actions">
                        <button class="btn btn-success" onclick="suppliersModule.showAddSupplierModal()">
                            <i class="fas fa-plus"></i>
                            مورد جديد
                        </button>
                        <button class="btn btn-primary" onclick="suppliersModule.showAddPurchaseModal()">
                            <i class="fas fa-shopping-cart"></i>
                            شراء جديد
                        </button>
                    </div>
                </div>

                <!-- Suppliers Stats -->
                <div class="suppliers-stats">
                    <div class="stats-grid">
                        <div class="stat-card primary">
                            <div class="stat-header">
                                <span class="stat-title">إجمالي الموردين</span>
                                <div class="stat-icon primary">
                                    <i class="fas fa-truck"></i>
                                </div>
                            </div>
                            <div class="stat-value">${formatNumber(this.suppliers.length)}</div>
                            <div class="stat-change positive">
                                <i class="fas fa-arrow-up"></i>
                                +2 هذا الشهر
                            </div>
                        </div>
                        
                        <div class="stat-card success">
                            <div class="stat-header">
                                <span class="stat-title">إجمالي المشتريات</span>
                                <div class="stat-icon success">
                                    <i class="fas fa-dollar-sign"></i>
                                </div>
                            </div>
                            <div class="stat-value">${formatCurrency(this.getTotalPurchases())}</div>
                            <div class="stat-change positive">
                                <i class="fas fa-arrow-up"></i>
                                +15.2%
                            </div>
                        </div>
                        
                        <div class="stat-card warning">
                            <div class="stat-header">
                                <span class="stat-title">موردين نشطين</span>
                                <div class="stat-icon warning">
                                    <i class="fas fa-handshake"></i>
                                </div>
                            </div>
                            <div class="stat-value">${formatNumber(this.getActiveSuppliers())}</div>
                            <div class="stat-change positive">
                                <i class="fas fa-arrow-up"></i>
                                +3 جديد
                            </div>
                        </div>
                        
                        <div class="stat-card info">
                            <div class="stat-header">
                                <span class="stat-title">متوسط الشراء</span>
                                <div class="stat-icon info">
                                    <i class="fas fa-chart-line"></i>
                                </div>
                            </div>
                            <div class="stat-value">${formatCurrency(this.getAveragePurchase())}</div>
                            <div class="stat-change positive">
                                <i class="fas fa-arrow-up"></i>
                                +8.7%
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Suppliers Table -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">قائمة الموردين</h3>
                        <div class="card-actions">
                            <button class="btn btn-ghost btn-sm" onclick="suppliersModule.exportSuppliers()">
                                <i class="fas fa-download"></i>
                                تصدير
                            </button>
                            <button class="btn btn-ghost btn-sm" onclick="suppliersModule.printSuppliers()">
                                <i class="fas fa-print"></i>
                                طباعة
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div id="suppliers-table"></div>
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
                title: 'الكود',
                render: (value) => `#${value}`
            },
            {
                key: 'name',
                title: 'اسم المورد'
            },
            {
                key: 'company',
                title: 'الشركة'
            },
            {
                key: 'phone',
                title: 'رقم الهاتف'
            },
            {
                key: 'email',
                title: 'البريد الإلكتروني'
            },
            {
                key: 'totalPurchases',
                title: 'إجمالي المشتريات',
                render: (value) => formatCurrency(value || 0)
            },
            {
                key: 'lastPurchase',
                title: 'آخر شراء',
                render: (value) => value ? formatDate(value) : 'لا يوجد'
            },
            {
                key: 'status',
                title: 'الحالة',
                render: (value) => `
                    <span class="badge ${value === 'نشط' ? 'badge-success' : 'badge-secondary'}">
                        ${value}
                    </span>
                `
            },
            {
                key: 'actions',
                title: 'الإجراءات',
                render: (value, row) => `
                    <div class="table-actions">
                        <button class="btn btn-ghost btn-sm" onclick="suppliersModule.viewSupplier(${row.id})" title="عرض">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-ghost btn-sm" onclick="suppliersModule.editSupplier(${row.id})" title="تعديل">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-ghost btn-sm" onclick="suppliersModule.viewPurchaseHistory(${row.id})" title="سجل المشتريات">
                            <i class="fas fa-history"></i>
                        </button>
                        <button class="btn btn-ghost btn-sm text-danger" onclick="suppliersModule.deleteSupplier(${row.id})" title="حذف">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `
            }
        ];

        this.dataTable = new DataTable('#suppliers-table', {
            data: this.suppliers,
            columns: columns,
            searchable: true,
            sortable: true,
            pagination: true,
            pageSize: 15
        });
    }

    showAddSupplierModal() {
        this.currentSupplier = null;
        const content = this.renderSupplierForm();
        
        modal.show(content, {
            title: 'إضافة مورد جديد',
            size: 'large'
        });

        this.bindSupplierFormEvents();
    }

    renderSupplierForm() {
        const supplier = this.currentSupplier || {};
        
        return `
            <form class="supplier-form">
                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label">اسم المورد *</label>
                        <input type="text" class="form-input" name="name" value="${supplier.name || ''}" required>
                    </div>
                    <div class="form-col">
                        <label class="form-label">اسم الشركة</label>
                        <input type="text" class="form-input" name="company" value="${supplier.company || ''}">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label">رقم الهاتف *</label>
                        <input type="tel" class="form-input" name="phone" value="${supplier.phone || ''}" required>
                    </div>
                    <div class="form-col">
                        <label class="form-label">البريد الإلكتروني</label>
                        <input type="email" class="form-input" name="email" value="${supplier.email || ''}">
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">العنوان</label>
                    <textarea class="form-textarea" name="address" rows="2" placeholder="العنوان الكامل...">${supplier.address || ''}</textarea>
                </div>

                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label">المدينة</label>
                        <input type="text" class="form-input" name="city" value="${supplier.city || ''}">
                    </div>
                    <div class="form-col">
                        <label class="form-label">الرقم الضريبي</label>
                        <input type="text" class="form-input" name="taxNumber" value="${supplier.taxNumber || ''}">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label">فئة المنتجات</label>
                        <input type="text" class="form-input" name="productCategory" value="${supplier.productCategory || ''}" placeholder="مثل: أجهزة كمبيوتر، ملحقات، إلخ">
                    </div>
                    <div class="form-col">
                        <label class="form-label">مدة التوريد (يوم)</label>
                        <input type="number" class="form-input" name="deliveryTime" min="0" value="${supplier.deliveryTime || 7}">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label">شروط الدفع</label>
                        <select class="form-select" name="paymentTerms">
                            <option value="cash" ${supplier.paymentTerms === 'cash' ? 'selected' : ''}>نقدي</option>
                            <option value="30_days" ${supplier.paymentTerms === '30_days' ? 'selected' : ''}>30 يوم</option>
                            <option value="60_days" ${supplier.paymentTerms === '60_days' ? 'selected' : ''}>60 يوم</option>
                            <option value="90_days" ${supplier.paymentTerms === '90_days' ? 'selected' : ''}>90 يوم</option>
                        </select>
                    </div>
                    <div class="form-col">
                        <label class="form-label">تقييم المورد</label>
                        <select class="form-select" name="rating">
                            <option value="5" ${supplier.rating === 5 ? 'selected' : ''}>ممتاز (5 نجوم)</option>
                            <option value="4" ${supplier.rating === 4 ? 'selected' : ''}>جيد جداً (4 نجوم)</option>
                            <option value="3" ${supplier.rating === 3 ? 'selected' : ''}>جيد (3 نجوم)</option>
                            <option value="2" ${supplier.rating === 2 ? 'selected' : ''}>مقبول (2 نجمة)</option>
                            <option value="1" ${supplier.rating === 1 ? 'selected' : ''}>ضعيف (1 نجمة)</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">ملاحظات</label>
                    <textarea class="form-textarea" name="notes" rows="3" placeholder="ملاحظات إضافية...">${supplier.notes || ''}</textarea>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-success" onclick="suppliersModule.saveSupplier()">
                        <i class="fas fa-save"></i>
                        ${this.currentSupplier ? 'تحديث' : 'حفظ'}
                    </button>
                    <button type="button" class="btn btn-ghost" onclick="modal.hide()">
                        إلغاء
                    </button>
                </div>
            </form>
        `;
    }

    showAddPurchaseModal() {
        const content = `
            <div class="purchase-form">
                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label">المورد *</label>
                        <select class="form-select" name="supplier" required>
                            <option value="">اختر المورد</option>
                            ${this.suppliers.map(supplier => `
                                <option value="${supplier.id}">${supplier.name} - ${supplier.company || 'غير محدد'}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-col">
                        <label class="form-label">تاريخ الشراء</label>
                        <input type="date" class="form-input" name="date" value="${new Date().toISOString().split('T')[0]}">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label">رقم الفاتورة</label>
                        <input type="text" class="form-input" name="invoiceNumber" placeholder="رقم فاتورة المورد">
                    </div>
                    <div class="form-col">
                        <label class="form-label">طريقة الدفع</label>
                        <select class="form-select" name="paymentMethod">
                            <option value="cash">نقدي</option>
                            <option value="bank_transfer">تحويل بنكي</option>
                            <option value="check">شيك</option>
                            <option value="credit">آجل</option>
                        </select>
                    </div>
                </div>

                <div class="purchase-items">
                    <h4>أصناف الشراء</h4>
                    <div class="items-header">
                        <button type="button" class="btn btn-primary btn-sm" onclick="suppliersModule.addPurchaseItem()">
                            <i class="fas fa-plus"></i>
                            إضافة صنف
                        </button>
                    </div>
                    <div id="purchase-items-list">
                        <p class="text-muted">لم يتم إضافة أي أصناف بعد</p>
                    </div>
                </div>

                <div class="purchase-summary">
                    <div class="form-row">
                        <div class="form-col">
                            <label class="form-label">خصم (%)</label>
                            <input type="number" class="form-input" name="discount" min="0" max="100" step="0.01" value="0">
                        </div>
                        <div class="form-col">
                            <label class="form-label">ضريبة (%)</label>
                            <input type="number" class="form-input" name="tax" min="0" max="100" step="0.01" value="15">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">ملاحظات</label>
                        <textarea class="form-textarea" name="notes" rows="2" placeholder="ملاحظات الشراء..."></textarea>
                    </div>
                    
                    <div class="purchase-totals">
                        <div class="total-row">
                            <span>المجموع الفرعي:</span>
                            <span id="purchase-subtotal">${formatCurrency(0)}</span>
                        </div>
                        <div class="total-row">
                            <span>الخصم:</span>
                            <span id="purchase-discount-amount">${formatCurrency(0)}</span>
                        </div>
                        <div class="total-row">
                            <span>الضريبة:</span>
                            <span id="purchase-tax-amount">${formatCurrency(0)}</span>
                        </div>
                        <div class="total-row total-final">
                            <span>المجموع النهائي:</span>
                            <span id="purchase-final-total">${formatCurrency(0)}</span>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-success" onclick="suppliersModule.savePurchase()">
                        <i class="fas fa-save"></i>
                        حفظ الشراء
                    </button>
                    <button type="button" class="btn btn-ghost" onclick="modal.hide()">
                        إلغاء
                    </button>
                </div>
            </div>
        `;

        modal.show(content, {
            title: 'شراء جديد',
            size: 'large'
        });

        this.currentPurchase = { items: [] };
        this.bindPurchaseFormEvents();
    }

    bindEvents() {
        // Module-specific events
    }

    bindSupplierFormEvents() {
        // Phone number formatting
        const phoneInput = $$('input[name="phone"]');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 0) {
                    if (value.startsWith('966')) {
                        value = '+' + value;
                    } else if (!value.startsWith('0') && value.length === 9) {
                        value = '0' + value;
                    }
                }
                e.target.value = value;
            });
        }
    }

    bindPurchaseFormEvents() {
        const discountInput = $$('input[name="discount"]');
        const taxInput = $$('input[name="tax"]');
        
        if (discountInput) {
            discountInput.addEventListener('input', () => this.updatePurchaseTotals());
        }
        
        if (taxInput) {
            taxInput.addEventListener('input', () => this.updatePurchaseTotals());
        }
    }

    addPurchaseItem() {
        const content = `
            <div class="add-purchase-item-form">
                <div class="form-group">
                    <label class="form-label">اسم المنتج *</label>
                    <input type="text" class="form-input" name="productName" required placeholder="اسم المنتج">
                </div>
                
                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label">الكمية *</label>
                        <input type="number" class="form-input" name="quantity" min="1" value="1" required>
                    </div>
                    <div class="form-col">
                        <label class="form-label">سعر الوحدة *</label>
                        <input type="number" class="form-input" name="unitPrice" step="0.01" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label">الوحدة</label>
                        <select class="form-select" name="unit">
                            <option value="قطعة">قطعة</option>
                            <option value="كيلو">كيلو</option>
                            <option value="متر">متر</option>
                            <option value="لتر">لتر</option>
                        </select>
                    </div>
                    <div class="form-col">
                        <label class="form-label">المجموع</label>
                        <input type="number" class="form-input" name="total" readonly>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" onclick="suppliersModule.confirmAddPurchaseItem()">
                        إضافة
                    </button>
                    <button type="button" class="btn btn-ghost" onclick="modal.hide()">
                        إلغاء
                    </button>
                </div>
            </div>
        `;

        modal.show(content, {
            title: 'إضافة صنف للشراء',
            size: 'medium'
        });

        // Auto calculate total
        const quantityInput = $$('input[name="quantity"]');
        const priceInput = $$('input[name="unitPrice"]');
        const totalInput = $$('input[name="total"]');

        const calculateTotal = () => {
            const quantity = parseFloat(quantityInput.value) || 0;
            const price = parseFloat(priceInput.value) || 0;
            totalInput.value = (quantity * price).toFixed(2);
        };

        if (quantityInput) quantityInput.addEventListener('input', calculateTotal);
        if (priceInput) priceInput.addEventListener('input', calculateTotal);
    }

    confirmAddPurchaseItem() {
        const productName = $$('input[name="productName"]').value;
        const quantity = parseFloat($$('input[name="quantity"]').value);
        const unitPrice = parseFloat($$('input[name="unitPrice"]').value);
        const unit = $$('select[name="unit"]').value;

        if (!productName || !quantity || !unitPrice) {
            toast.error('يرجى ملء جميع الحقول المطلوبة');
            return;
        }

        const item = {
            productName,
            quantity,
            unitPrice,
            unit,
            total: quantity * unitPrice
        };

        this.currentPurchase.items.push(item);
        this.updatePurchaseItemsList();
        this.updatePurchaseTotals();
        modal.hide();
        toast.success('تم إضافة الصنف بنجاح');
    }

    updatePurchaseItemsList() {
        const itemsList = $('purchase-items-list');
        if (!itemsList) return;

        if (this.currentPurchase.items.length === 0) {
            itemsList.innerHTML = '<p class="text-muted">لم يتم إضافة أي أصناف بعد</p>';
            return;
        }

        itemsList.innerHTML = `
            <div class="purchase-items-table">
                <table class="table">
                    <thead>
                        <tr>
                            <th>المنتج</th>
                            <th>الكمية</th>
                            <th>سعر الوحدة</th>
                            <th>المجموع</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.currentPurchase.items.map((item, index) => `
                            <tr>
                                <td>${item.productName}</td>
                                <td>${item.quantity} ${item.unit}</td>
                                <td>${formatCurrency(item.unitPrice)}</td>
                                <td>${formatCurrency(item.total)}</td>
                                <td>
                                    <button class="btn btn-ghost btn-sm text-danger" onclick="suppliersModule.removePurchaseItem(${index})">
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

    removePurchaseItem(index) {
        this.currentPurchase.items.splice(index, 1);
        this.updatePurchaseItemsList();
        this.updatePurchaseTotals();
    }

    updatePurchaseTotals() {
        const subtotal = this.currentPurchase.items.reduce((sum, item) => sum + item.total, 0);
        const discountPercent = parseFloat($$('input[name="discount"]')?.value || 0);
        const taxPercent = parseFloat($$('input[name="tax"]')?.value || 0);
        
        const discountAmount = subtotal * (discountPercent / 100);
        const taxableAmount = subtotal - discountAmount;
        const taxAmount = taxableAmount * (taxPercent / 100);
        const finalTotal = taxableAmount + taxAmount;

        // Update display
        const subtotalEl = $('purchase-subtotal');
        const discountEl = $('purchase-discount-amount');
        const taxEl = $('purchase-tax-amount');
        const totalEl = $('purchase-final-total');

        if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
        if (discountEl) discountEl.textContent = formatCurrency(discountAmount);
        if (taxEl) taxEl.textContent = formatCurrency(taxAmount);
        if (totalEl) totalEl.textContent = formatCurrency(finalTotal);
    }

    async saveSupplier() {
        const form = $$('.supplier-form');
        const formData = new FormData(form);
        
        const supplierData = {
            name: formData.get('name'),
            company: formData.get('company'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            address: formData.get('address'),
            city: formData.get('city'),
            taxNumber: formData.get('taxNumber'),
            productCategory: formData.get('productCategory'),
            deliveryTime: parseInt(formData.get('deliveryTime')) || 7,
            paymentTerms: formData.get('paymentTerms'),
            rating: parseInt(formData.get('rating')) || 5,
            notes: formData.get('notes')
        };

        // Validation
        if (!supplierData.name || !supplierData.phone) {
            toast.error('يرجى ملء الحقول المطلوبة (الاسم ورقم الهاتف)');
            return;
        }

        if (!validatePhone(supplierData.phone)) {
            toast.error('يرجى إدخال رقم هاتف صحيح');
            return;
        }

        if (supplierData.email && !validateEmail(supplierData.email)) {
            toast.error('يرجى إدخال بريد إلكتروني صحيح');
            return;
        }

        try {
            loading.show('save-supplier');
            
            let response;
            if (this.currentSupplier) {
                response = await api.updateSupplier(this.currentSupplier.id, supplierData);
            } else {
                response = await api.createSupplier(supplierData);
            }
            
            if (response.success) {
                toast.success(`تم ${this.currentSupplier ? 'تحديث' : 'إضافة'} المورد بنجاح`);
                modal.hide();
                await this.loadData();
                this.dataTable.updateData(this.suppliers);
            } else {
                toast.error(`فشل في ${this.currentSupplier ? 'تحديث' : 'إضافة'} المورد`);
            }
        } catch (error) {
            console.error('Save supplier error:', error);
            toast.error('حدث خطأ في حفظ المورد');
        } finally {
            loading.hide('save-supplier');
        }
    }

    async savePurchase() {
        if (this.currentPurchase.items.length === 0) {
            toast.error('يرجى إضافة أصناف للشراء');
            return;
        }

        const supplierSelect = $$('select[name="supplier"]');
        const dateInput = $$('input[name="date"]');
        const invoiceNumberInput = $$('input[name="invoiceNumber"]');
        const paymentMethodSelect = $$('select[name="paymentMethod"]');
        const discountInput = $$('input[name="discount"]');
        const taxInput = $$('input[name="tax"]');
        const notesInput = $$('textarea[name="notes"]');

        if (!supplierSelect.value) {
            toast.error('يرجى اختيار المورد');
            return;
        }

        const purchaseData = {
            supplierId: supplierSelect.value,
            date: dateInput.value,
            invoiceNumber: invoiceNumberInput.value,
            paymentMethod: paymentMethodSelect.value,
            items: this.currentPurchase.items,
            discount: parseFloat(discountInput.value || 0),
            tax: parseFloat(taxInput.value || 0),
            notes: notesInput.value
        };

        try {
            loading.show('save-purchase');
            const response = await api.createPurchase(purchaseData);
            
            if (response.success) {
                toast.success('تم حفظ الشراء بنجاح');
                modal.hide();
                // Refresh suppliers data to update purchase totals
                await this.loadData();
                this.dataTable.updateData(this.suppliers);
            } else {
                toast.error('فشل في حفظ الشراء');
            }
        } catch (error) {
            console.error('Save purchase error:', error);
            toast.error('حدث خطأ في حفظ الشراء');
        } finally {
            loading.hide('save-purchase');
        }
    }

    viewSupplier(id) {
        const supplier = this.suppliers.find(s => s.id === id);
        if (!supplier) return;

        const content = `
            <div class="supplier-details">
                <div class="supplier-header">
                    <h3>${supplier.name}</h3>
                    ${supplier.company ? `<p class="supplier-company">${supplier.company}</p>` : ''}
                    <div class="supplier-rating">
                        ${this.renderStars(supplier.rating || 5)}
                    </div>
                </div>
                
                <div class="supplier-info-grid">
                    <div class="info-section">
                        <h4>معلومات الاتصال</h4>
                        <div class="info-item">
                            <label>الهاتف:</label>
                            <span>${supplier.phone}</span>
                        </div>
                        <div class="info-item">
                            <label>البريد الإلكتروني:</label>
                            <span>${supplier.email || 'غير محدد'}</span>
                        </div>
                        <div class="info-item">
                            <label>العنوان:</label>
                            <span>${supplier.address || 'غير محدد'}</span>
                        </div>
                        <div class="info-item">
                            <label>المدينة:</label>
                            <span>${supplier.city || 'غير محدد'}</span>
                        </div>
                    </div>
                    
                    <div class="info-section">
                        <h4>معلومات التوريد</h4>
                        <div class="info-item">
                            <label>فئة المنتجات:</label>
                            <span>${supplier.productCategory || 'غير محدد'}</span>
                        </div>
                        <div class="info-item">
                            <label>مدة التوريد:</label>
                            <span>${supplier.deliveryTime || 7} يوم</span>
                        </div>
                        <div class="info-item">
                            <label>شروط الدفع:</label>
                            <span>${this.getPaymentTermsText(supplier.paymentTerms)}</span>
                        </div>
                        <div class="info-item">
                            <label>إجمالي المشتريات:</label>
                            <span>${formatCurrency(supplier.totalPurchases || 0)}</span>
                        </div>
                    </div>
                </div>
                
                ${supplier.notes ? `
                    <div class="supplier-notes">
                        <h4>ملاحظات:</h4>
                        <p>${supplier.notes}</p>
                    </div>
                ` : ''}
                
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="suppliersModule.editSupplier(${supplier.id}); modal.hide();">
                        <i class="fas fa-edit"></i>
                        تعديل
                    </button>
                    <button class="btn btn-info" onclick="suppliersModule.viewPurchaseHistory(${supplier.id}); modal.hide();">
                        <i class="fas fa-history"></i>
                        سجل المشتريات
                    </button>
                    <button class="btn btn-ghost" onclick="modal.hide()">
                        إغلاق
                    </button>
                </div>
            </div>
        `;

        modal.show(content, {
            title: 'تفاصيل المورد',
            size: 'large'
        });
    }

    editSupplier(id) {
        this.currentSupplier = this.suppliers.find(s => s.id === id);
        if (!this.currentSupplier) return;

        const content = this.renderSupplierForm();
        
        modal.show(content, {
            title: 'تعديل المورد',
            size: 'large'
        });

        this.bindSupplierFormEvents();
    }

    viewPurchaseHistory(id) {
        const supplier = this.suppliers.find(s => s.id === id);
        if (!supplier) return;

        // Mock purchase history data
        const purchases = [
            { id: 1, date: '2024-01-15', amount: 15000, items: 5, status: 'مكتملة' },
            { id: 2, date: '2024-01-10', amount: 23000, items: 8, status: 'مكتملة' },
            { id: 3, date: '2024-01-05', amount: 8000, items: 3, status: 'مكتملة' }
        ];

        const content = `
            <div class="purchase-history">
                <div class="history-header">
                    <h4>سجل مشتريات: ${supplier.name}</h4>
                    <div class="history-stats">
                        <span>إجمالي المشتريات: ${formatCurrency(supplier.totalPurchases || 0)}</span>
                        <span>عدد العمليات: ${purchases.length}</span>
                    </div>
                </div>
                
                <div class="history-table">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>رقم الشراء</th>
                                <th>التاريخ</th>
                                <th>المبلغ</th>
                                <th>عدد الأصناف</th>
                                <th>الحالة</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${purchases.map(purchase => `
                                <tr>
                                    <td>#${purchase.id}</td>
                                    <td>${formatDate(purchase.date)}</td>
                                    <td>${formatCurrency(purchase.amount)}</td>
                                    <td>${purchase.items}</td>
                                    <td>
                                        <span class="badge badge-success">${purchase.status}</span>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="suppliersModule.exportSupplierHistory(${supplier.id})">
                        <i class="fas fa-download"></i>
                        تصدير السجل
                    </button>
                    <button class="btn btn-ghost" onclick="modal.hide()">
                        إغلاق
                    </button>
                </div>
            </div>
        `;

        modal.show(content, {
            title: 'سجل المشتريات',
            size: 'large'
        });
    }

    async deleteSupplier(id) {
        const supplier = this.suppliers.find(s => s.id === id);
        if (!supplier) return;

        const confirmed = await modal.confirm(
            `هل أنت متأكد من حذف المورد "${supplier.name}"؟`,
            'تأكيد الحذف'
        );
        
        if (!confirmed) return;

        try {
            loading.show('delete-supplier');
            const response = await api.deleteSupplier(id);
            
            if (response.success) {
                toast.success('تم حذف المورد بنجاح');
                await this.loadData();
                this.dataTable.updateData(this.suppliers);
            } else {
                toast.error('فشل في حذف المورد');
            }
        } catch (error) {
            console.error('Delete supplier error:', error);
            toast.error('حدث خطأ في حذف المورد');
        } finally {
            loading.hide('delete-supplier');
        }
    }

    exportSuppliers() {
        const csvContent = this.generateSuppliersCSV();
        downloadFile(csvContent, 'suppliers.csv', 'text/csv');
        toast.success('تم تصدير البيانات بنجاح');
    }

    exportSupplierHistory(supplierId) {
        // Implementation for exporting supplier purchase history
        toast.info('تصدير سجل المورد قيد التطوير');
    }

    printSuppliers() {
        const printContent = this.generateSuppliersPrintContent();
        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    }

    // Helper methods
    getTotalPurchases() {
        return this.suppliers.reduce((total, supplier) => total + (supplier.totalPurchases || 0), 0);
    }

    getActiveSuppliers() {
        return this.suppliers.filter(supplier => supplier.status === 'نشط').length;
    }

    getAveragePurchase() {
        if (this.suppliers.length === 0) return 0;
        const total = this.getTotalPurchases();
        return total / this.suppliers.length;
    }

    renderStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += `<i class="fas fa-star ${i <= rating ? 'text-warning' : 'text-muted'}"></i>`;
        }
        return stars;
    }

    getPaymentTermsText(terms) {
        const termsMap = {
            'cash': 'نقدي',
            '30_days': '30 يوم',
            '60_days': '60 يوم',
            '90_days': '90 يوم'
        };
        return termsMap[terms] || 'غير محدد';
    }

    generateSuppliersCSV() {
        const headers = ['الكود', 'الاسم', 'الشركة', 'الهاتف', 'البريد الإلكتروني', 'المدينة', 'إجمالي المشتريات'];
        const rows = this.suppliers.map(supplier => [
            supplier.id,
            supplier.name,
            supplier.company || '',
            supplier.phone,
            supplier.email || '',
            supplier.city || '',
            supplier.totalPurchases || 0
        ]);

        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    generateSuppliersPrintContent() {
        return `
            <html>
                <head>
                    <title>قائمة الموردين</title>
                    <style>
                        body { font-family: 'Cairo', Arial, sans-serif; direction: rtl; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
                        th { background-color: #f5f5f5; }
                        h1 { text-align: center; color: #333; }
                    </style>
                </head>
                <body>
                    <h1>قائمة الموردين</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>الكود</th>
                                <th>الاسم</th>
                                <th>الشركة</th>
                                <th>الهاتف</th>
                                <th>البريد الإلكتروني</th>
                                <th>المدينة</th>
                                <th>إجمالي المشتريات</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.suppliers.map(supplier => `
                                <tr>
                                    <td>#${supplier.id}</td>
                                    <td>${supplier.name}</td>
                                    <td>${supplier.company || '-'}</td>
                                    <td>${supplier.phone}</td>
                                    <td>${supplier.email || '-'}</td>
                                    <td>${supplier.city || '-'}</td>
                                    <td>${formatCurrency(supplier.totalPurchases || 0)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
            </html>
        `;
    }
}

// Export suppliers module
window.suppliersModule = new Suppliers();

