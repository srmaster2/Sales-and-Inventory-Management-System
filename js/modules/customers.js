// Customers Module

class Customers {
    constructor() {
        this.customers = [];
        this.dataTable = null;
        this.currentCustomer = null;
    }

    async init() {
        await this.loadData();
        this.render();
        this.bindEvents();
    }

    async loadData() {
        try {
            loading.show('customers');
            const response = await api.getCustomers();
            
            if (response.success) {
                this.customers = response.data;
            }
        } catch (error) {
            console.error('Customers data loading error:', error);
            toast.error('حدث خطأ في تحميل بيانات العملاء');
        } finally {
            loading.hide('customers');
        }
    }

    render() {
        const content = `
            <div class="customers-container">
                <!-- Header Actions -->
                <div class="module-header">
                    <div class="module-title">
                        <h2>إدارة العملاء</h2>
                        <p>إدارة وتتبع جميع العملاء وبياناتهم</p>
                    </div>
                    <div class="module-actions">
                        <button class="btn btn-success" onclick="customersModule.showAddCustomerModal()">
                            <i class="fas fa-user-plus"></i>
                            عميل جديد
                        </button>
                        <button class="btn btn-primary" onclick="customersModule.importCustomers()">
                            <i class="fas fa-upload"></i>
                            استيراد
                        </button>
                    </div>
                </div>

                <!-- Customers Stats -->
                <div class="customers-stats">
                    <div class="stats-grid">
                        <div class="stat-card primary">
                            <div class="stat-header">
                                <span class="stat-title">إجمالي العملاء</span>
                                <div class="stat-icon primary">
                                    <i class="fas fa-users"></i>
                                </div>
                            </div>
                            <div class="stat-value">${formatNumber(this.customers.length)}</div>
                            <div class="stat-change positive">
                                <i class="fas fa-arrow-up"></i>
                                +5 هذا الأسبوع
                            </div>
                        </div>
                        
                        <div class="stat-card success">
                            <div class="stat-header">
                                <span class="stat-title">عملاء نشطون</span>
                                <div class="stat-icon success">
                                    <i class="fas fa-user-check"></i>
                                </div>
                            </div>
                            <div class="stat-value">${formatNumber(this.getActiveCustomers())}</div>
                            <div class="stat-change positive">
                                <i class="fas fa-arrow-up"></i>
                                +8.5%
                            </div>
                        </div>
                        
                        <div class="stat-card warning">
                            <div class="stat-header">
                                <span class="stat-title">عملاء جدد</span>
                                <div class="stat-icon warning">
                                    <i class="fas fa-user-plus"></i>
                                </div>
                            </div>
                            <div class="stat-value">${formatNumber(this.getNewCustomers())}</div>
                            <div class="stat-change positive">
                                <i class="fas fa-arrow-up"></i>
                                +3 هذا الشهر
                            </div>
                        </div>
                        
                        <div class="stat-card info">
                            <div class="stat-header">
                                <span class="stat-title">متوسط المشتريات</span>
                                <div class="stat-icon info">
                                    <i class="fas fa-chart-line"></i>
                                </div>
                            </div>
                            <div class="stat-value">${formatCurrency(this.getAveragePurchases())}</div>
                            <div class="stat-change positive">
                                <i class="fas fa-arrow-up"></i>
                                +12.3%
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Customers Table -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">قائمة العملاء</h3>
                        <div class="card-actions">
                            <button class="btn btn-ghost btn-sm" onclick="customersModule.exportCustomers()">
                                <i class="fas fa-download"></i>
                                تصدير
                            </button>
                            <button class="btn btn-ghost btn-sm" onclick="customersModule.printCustomers()">
                                <i class="fas fa-print"></i>
                                طباعة
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div id="customers-table"></div>
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
                title: 'اسم العميل'
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
                        <button class="btn btn-ghost btn-sm" onclick="customersModule.viewCustomer(${row.id})" title="عرض">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-ghost btn-sm" onclick="customersModule.editCustomer(${row.id})" title="تعديل">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-ghost btn-sm" onclick="customersModule.viewPurchaseHistory(${row.id})" title="سجل المشتريات">
                            <i class="fas fa-history"></i>
                        </button>
                        <button class="btn btn-ghost btn-sm text-danger" onclick="customersModule.deleteCustomer(${row.id})" title="حذف">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `
            }
        ];

        this.dataTable = new DataTable('#customers-table', {
            data: this.customers,
            columns: columns,
            searchable: true,
            sortable: true,
            pagination: true,
            pageSize: 15
        });
    }

    showAddCustomerModal() {
        this.currentCustomer = null;
        const content = this.renderCustomerForm();
        
        modal.show(content, {
            title: 'إضافة عميل جديد',
            size: 'large'
        });

        this.bindCustomerFormEvents();
    }

    renderCustomerForm() {
        const customer = this.currentCustomer || {};
        
        return `
            <form class="customer-form">
                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label">اسم العميل *</label>
                        <input type="text" class="form-input" name="name" value="${customer.name || ''}" required>
                    </div>
                    <div class="form-col">
                        <label class="form-label">نوع العميل</label>
                        <select class="form-select" name="type">
                            <option value="individual" ${customer.type === 'individual' ? 'selected' : ''}>فرد</option>
                            <option value="company" ${customer.type === 'company' ? 'selected' : ''}>شركة</option>
                        </select>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label">رقم الهاتف *</label>
                        <input type="tel" class="form-input" name="phone" value="${customer.phone || ''}" required>
                    </div>
                    <div class="form-col">
                        <label class="form-label">البريد الإلكتروني</label>
                        <input type="email" class="form-input" name="email" value="${customer.email || ''}">
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">العنوان</label>
                    <textarea class="form-textarea" name="address" rows="2" placeholder="العنوان الكامل...">${customer.address || ''}</textarea>
                </div>

                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label">المدينة</label>
                        <input type="text" class="form-input" name="city" value="${customer.city || ''}">
                    </div>
                    <div class="form-col">
                        <label class="form-label">الرقم الضريبي</label>
                        <input type="text" class="form-input" name="taxNumber" value="${customer.taxNumber || ''}">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label">حد الائتمان</label>
                        <input type="number" class="form-input" name="creditLimit" step="0.01" min="0" value="${customer.creditLimit || 0}">
                    </div>
                    <div class="form-col">
                        <label class="form-label">مدة السداد (يوم)</label>
                        <input type="number" class="form-input" name="paymentTerms" min="0" value="${customer.paymentTerms || 30}">
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">ملاحظات</label>
                    <textarea class="form-textarea" name="notes" rows="3" placeholder="ملاحظات إضافية...">${customer.notes || ''}</textarea>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-success" onclick="customersModule.saveCustomer()">
                        <i class="fas fa-save"></i>
                        ${this.currentCustomer ? 'تحديث' : 'حفظ'}
                    </button>
                    <button type="button" class="btn btn-ghost" onclick="modal.hide()">
                        إلغاء
                    </button>
                </div>
            </form>
        `;
    }

    bindEvents() {
        // Module-specific events
    }

    bindCustomerFormEvents() {
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

    async saveCustomer() {
        const form = $$('.customer-form');
        const formData = new FormData(form);
        
        const customerData = {
            name: formData.get('name'),
            type: formData.get('type'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            address: formData.get('address'),
            city: formData.get('city'),
            taxNumber: formData.get('taxNumber'),
            creditLimit: parseFloat(formData.get('creditLimit')) || 0,
            paymentTerms: parseInt(formData.get('paymentTerms')) || 30,
            notes: formData.get('notes')
        };

        // Validation
        if (!customerData.name || !customerData.phone) {
            toast.error('يرجى ملء الحقول المطلوبة (الاسم ورقم الهاتف)');
            return;
        }

        if (!validatePhone(customerData.phone)) {
            toast.error('يرجى إدخال رقم هاتف صحيح');
            return;
        }

        if (customerData.email && !validateEmail(customerData.email)) {
            toast.error('يرجى إدخال بريد إلكتروني صحيح');
            return;
        }

        try {
            loading.show('save-customer');
            
            let response;
            if (this.currentCustomer) {
                response = await api.updateCustomer(this.currentCustomer.id, customerData);
            } else {
                response = await api.createCustomer(customerData);
            }
            
            if (response.success) {
                toast.success(`تم ${this.currentCustomer ? 'تحديث' : 'إضافة'} العميل بنجاح`);
                modal.hide();
                await this.loadData();
                this.dataTable.updateData(this.customers);
            } else {
                toast.error(`فشل في ${this.currentCustomer ? 'تحديث' : 'إضافة'} العميل`);
            }
        } catch (error) {
            console.error('Save customer error:', error);
            toast.error('حدث خطأ في حفظ العميل');
        } finally {
            loading.hide('save-customer');
        }
    }

    viewCustomer(id) {
        const customer = this.customers.find(c => c.id === id);
        if (!customer) return;

        const content = `
            <div class="customer-details">
                <div class="customer-header">
                    <h3>${customer.name}</h3>
                    <span class="badge ${customer.type === 'company' ? 'badge-primary' : 'badge-info'}">
                        ${customer.type === 'company' ? 'شركة' : 'فرد'}
                    </span>
                </div>
                
                <div class="customer-info-grid">
                    <div class="info-section">
                        <h4>معلومات الاتصال</h4>
                        <div class="info-item">
                            <label>الهاتف:</label>
                            <span>${customer.phone}</span>
                        </div>
                        <div class="info-item">
                            <label>البريد الإلكتروني:</label>
                            <span>${customer.email || 'غير محدد'}</span>
                        </div>
                        <div class="info-item">
                            <label>العنوان:</label>
                            <span>${customer.address || 'غير محدد'}</span>
                        </div>
                        <div class="info-item">
                            <label>المدينة:</label>
                            <span>${customer.city || 'غير محدد'}</span>
                        </div>
                    </div>
                    
                    <div class="info-section">
                        <h4>معلومات مالية</h4>
                        <div class="info-item">
                            <label>إجمالي المشتريات:</label>
                            <span>${formatCurrency(customer.totalPurchases || 0)}</span>
                        </div>
                        <div class="info-item">
                            <label>حد الائتمان:</label>
                            <span>${formatCurrency(customer.creditLimit || 0)}</span>
                        </div>
                        <div class="info-item">
                            <label>مدة السداد:</label>
                            <span>${customer.paymentTerms || 30} يوم</span>
                        </div>
                        <div class="info-item">
                            <label>آخر شراء:</label>
                            <span>${customer.lastPurchase ? formatDate(customer.lastPurchase) : 'لا يوجد'}</span>
                        </div>
                    </div>
                </div>
                
                ${customer.notes ? `
                    <div class="customer-notes">
                        <h4>ملاحظات:</h4>
                        <p>${customer.notes}</p>
                    </div>
                ` : ''}
                
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="customersModule.editCustomer(${customer.id}); modal.hide();">
                        <i class="fas fa-edit"></i>
                        تعديل
                    </button>
                    <button class="btn btn-info" onclick="customersModule.viewPurchaseHistory(${customer.id}); modal.hide();">
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
            title: 'تفاصيل العميل',
            size: 'large'
        });
    }

    editCustomer(id) {
        this.currentCustomer = this.customers.find(c => c.id === id);
        if (!this.currentCustomer) return;

        const content = this.renderCustomerForm();
        
        modal.show(content, {
            title: 'تعديل العميل',
            size: 'large'
        });

        this.bindCustomerFormEvents();
    }

    viewPurchaseHistory(id) {
        const customer = this.customers.find(c => c.id === id);
        if (!customer) return;

        // Mock purchase history data
        const purchases = [
            { id: 1, date: '2024-01-15', amount: 1500, items: 3, status: 'مكتملة' },
            { id: 2, date: '2024-01-10', amount: 2300, items: 5, status: 'مكتملة' },
            { id: 3, date: '2024-01-05', amount: 800, items: 2, status: 'مكتملة' }
        ];

        const content = `
            <div class="purchase-history">
                <div class="history-header">
                    <h4>سجل مشتريات: ${customer.name}</h4>
                    <div class="history-stats">
                        <span>إجمالي المشتريات: ${formatCurrency(customer.totalPurchases || 0)}</span>
                        <span>عدد العمليات: ${purchases.length}</span>
                    </div>
                </div>
                
                <div class="history-table">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>رقم البيع</th>
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
                    <button class="btn btn-primary" onclick="customersModule.exportCustomerHistory(${customer.id})">
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

    async deleteCustomer(id) {
        const customer = this.customers.find(c => c.id === id);
        if (!customer) return;

        const confirmed = await modal.confirm(
            `هل أنت متأكد من حذف العميل "${customer.name}"؟`,
            'تأكيد الحذف'
        );
        
        if (!confirmed) return;

        try {
            loading.show('delete-customer');
            const response = await api.deleteCustomer(id);
            
            if (response.success) {
                toast.success('تم حذف العميل بنجاح');
                await this.loadData();
                this.dataTable.updateData(this.customers);
            } else {
                toast.error('فشل في حذف العميل');
            }
        } catch (error) {
            console.error('Delete customer error:', error);
            toast.error('حدث خطأ في حذف العميل');
        } finally {
            loading.hide('delete-customer');
        }
    }

    importCustomers() {
        const content = `
            <div class="import-customers">
                <div class="import-instructions">
                    <h4>استيراد العملاء من ملف CSV</h4>
                    <p>يجب أن يحتوي الملف على الأعمدة التالية:</p>
                    <ul>
                        <li>الاسم (مطلوب)</li>
                        <li>رقم الهاتف (مطلوب)</li>
                        <li>البريد الإلكتروني</li>
                        <li>العنوان</li>
                        <li>المدينة</li>
                    </ul>
                </div>
                
                <div class="form-group">
                    <label class="form-label">اختر ملف CSV</label>
                    <input type="file" class="form-input" accept=".csv" name="csvFile">
                </div>
                
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="customersModule.processImport()">
                        <i class="fas fa-upload"></i>
                        استيراد
                    </button>
                    <button class="btn btn-ghost" onclick="customersModule.downloadTemplate()">
                        <i class="fas fa-download"></i>
                        تحميل نموذج
                    </button>
                    <button class="btn btn-ghost" onclick="modal.hide()">
                        إلغاء
                    </button>
                </div>
            </div>
        `;

        modal.show(content, {
            title: 'استيراد العملاء',
            size: 'medium'
        });
    }

    processImport() {
        const fileInput = $$('input[name="csvFile"]');
        if (!fileInput.files[0]) {
            toast.error('يرجى اختيار ملف CSV');
            return;
        }

        // Implementation for CSV import
        toast.info('استيراد العملاء قيد التطوير');
    }

    downloadTemplate() {
        const csvContent = 'الاسم,رقم الهاتف,البريد الإلكتروني,العنوان,المدينة\nأحمد محمد,0501234567,ahmed@example.com,شارع الملك فهد,الرياض';
        downloadFile(csvContent, 'customers_template.csv', 'text/csv');
        toast.success('تم تحميل النموذج بنجاح');
    }

    exportCustomers() {
        const csvContent = this.generateCustomersCSV();
        downloadFile(csvContent, 'customers.csv', 'text/csv');
        toast.success('تم تصدير البيانات بنجاح');
    }

    exportCustomerHistory(customerId) {
        // Implementation for exporting customer purchase history
        toast.info('تصدير سجل العميل قيد التطوير');
    }

    printCustomers() {
        const printContent = this.generateCustomersPrintContent();
        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    }

    // Helper methods
    getActiveCustomers() {
        return this.customers.filter(customer => customer.status === 'نشط').length;
    }

    getNewCustomers() {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        
        return this.customers.filter(customer => {
            const createdDate = new Date(customer.createdAt || Date.now());
            return createdDate >= oneMonthAgo;
        }).length;
    }

    getAveragePurchases() {
        if (this.customers.length === 0) return 0;
        const total = this.customers.reduce((sum, customer) => sum + (customer.totalPurchases || 0), 0);
        return total / this.customers.length;
    }

    generateCustomersCSV() {
        const headers = ['الكود', 'الاسم', 'الهاتف', 'البريد الإلكتروني', 'العنوان', 'المدينة', 'إجمالي المشتريات'];
        const rows = this.customers.map(customer => [
            customer.id,
            customer.name,
            customer.phone,
            customer.email || '',
            customer.address || '',
            customer.city || '',
            customer.totalPurchases || 0
        ]);

        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    generateCustomersPrintContent() {
        return `
            <html>
                <head>
                    <title>قائمة العملاء</title>
                    <style>
                        body { font-family: 'Cairo', Arial, sans-serif; direction: rtl; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
                        th { background-color: #f5f5f5; }
                        h1 { text-align: center; color: #333; }
                    </style>
                </head>
                <body>
                    <h1>قائمة العملاء</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>الكود</th>
                                <th>الاسم</th>
                                <th>الهاتف</th>
                                <th>البريد الإلكتروني</th>
                                <th>المدينة</th>
                                <th>إجمالي المشتريات</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.customers.map(customer => `
                                <tr>
                                    <td>#${customer.id}</td>
                                    <td>${customer.name}</td>
                                    <td>${customer.phone}</td>
                                    <td>${customer.email || '-'}</td>
                                    <td>${customer.city || '-'}</td>
                                    <td>${formatCurrency(customer.totalPurchases || 0)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
            </html>
        `;
    }
}

// Export customers module
window.customersModule = new Customers();

