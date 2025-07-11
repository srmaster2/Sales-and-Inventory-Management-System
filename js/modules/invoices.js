// Invoices Module

class Invoices {
    constructor() {
        this.invoices = [];
        this.dataTable = null;
        this.currentInvoice = null;
    }

    async init() {
        await this.loadData();
        this.render();
        this.bindEvents();
    }

    async loadData() {
        try {
            loading.show("invoices");
            const response = await api.getInvoices();
            if (response.success) {
                this.invoices = response.data;
            }
        } catch (error) {
            console.error("Invoices data loading error:", error);
            toast.error("حدث خطأ في تحميل بيانات الفواتير");
        } finally {
            loading.hide("invoices");
        }
    }

    render() {
        const content = `
            <div class="invoices-container">
                <!-- Header Actions -->
                <div class="module-header">
                    <div class="module-title">
                        <h2>إدارة الفواتير</h2>
                        <p>إنشاء وإدارة الفواتير وعمليات الدفع</p>
                    </div>
                    <div class="module-actions">
                        <button class="btn btn-success" onclick="invoicesModule.showCreateInvoiceModal()">
                            <i class="fas fa-file-invoice"></i>
                            فاتورة جديدة
                        </button>
                        <button class="btn btn-primary" onclick="invoicesModule.importInvoices()">
                            <i class="fas fa-upload"></i>
                            استيراد
                        </button>
                    </div>
                </div>

                <!-- Invoices Stats -->
                <div class="invoices-stats">
                    <div class="stats-grid">
                        <div class="stat-card primary">
                            <div class="stat-header">
                                <span class="stat-title">إجمالي الفواتير</span>
                                <div class="stat-icon primary">
                                    <i class="fas fa-file-alt"></i>
                                </div>
                            </div>
                            <div class="stat-value">${formatNumber(this.invoices.length)}</div>
                            <div class="stat-change positive">
                                <i class="fas fa-arrow-up"></i>
                                +10 هذا الشهر
                            </div>
                        </div>
                        
                        <div class="stat-card success">
                            <div class="stat-header">
                                <span class="stat-title">فواتير مدفوعة</span>
                                <div class="stat-icon success">
                                    <i class="fas fa-check-circle"></i>
                                </div>
                            </div>
                            <div class="stat-value">${formatCurrency(this.getPaidInvoicesTotal())}</div>
                            <div class="stat-change positive">
                                <i class="fas fa-arrow-up"></i>
                                +15.2%
                            </div>
                        </div>
                        
                        <div class="stat-card warning">
                            <div class="stat-header">
                                <span class="stat-title">فواتير مستحقة</span>
                                <div class="stat-icon warning">
                                    <i class="fas fa-exclamation-triangle"></i>
                                </div>
                            </div>
                            <div class="stat-value">${formatCurrency(this.getDueInvoicesTotal())}</div>
                            <div class="stat-change negative">
                                <i class="fas fa-arrow-down"></i>
                                -5.3%
                            </div>
                        </div>
                        
                        <div class="stat-card info">
                            <div class="stat-header">
                                <span class="stat-title">متوسط الفاتورة</span>
                                <div class="stat-icon info">
                                    <i class="fas fa-calculator"></i>
                                </div>
                            </div>
                            <div class="stat-value">${formatCurrency(this.getAverageInvoiceAmount())}</div>
                            <div class="stat-change positive">
                                <i class="fas fa-arrow-up"></i>
                                +2.1%
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Invoices Table -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">قائمة الفواتير</h3>
                        <div class="card-actions">
                            <button class="btn btn-ghost btn-sm" onclick="invoicesModule.exportInvoices()">
                                <i class="fas fa-download"></i>
                                تصدير
                            </button>
                            <button class="btn btn-ghost btn-sm" onclick="invoicesModule.printInvoices()">
                                <i class="fas fa-print"></i>
                                طباعة
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div id="invoices-table"></div>
                    </div>
                </div>
            </div>
        `;

        $("page-content").innerHTML = content;
        this.initDataTable();
    }

    initDataTable() {
        const columns = [
            {
                key: "id",
                title: "رقم الفاتورة",
                render: (value) => `#${value}`,
            },
            {
                key: "customerName",
                title: "العميل",
            },
            {
                key: "date",
                title: "التاريخ",
                render: (value) => formatDate(value),
            },
            {
                key: "dueDate",
                title: "تاريخ الاستحقاق",
                render: (value) => formatDate(value),
            },
            {
                key: "totalAmount",
                title: "المبلغ الإجمالي",
                render: (value) => formatCurrency(value),
            },
            {
                key: "status",
                title: "الحالة",
                render: (value) => `
                    <span class="badge ${value === "مدفوعة" ? "badge-success" : value === "مستحقة" ? "badge-warning" : "badge-danger"}">
                        ${value}
                    </span>
                `,
            },
            {
                key: "actions",
                title: "الإجراءات",
                render: (value, row) => `
                    <div class="table-actions">
                        <button class="btn btn-ghost btn-sm" onclick="invoicesModule.viewInvoice(${row.id})" title="عرض">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-ghost btn-sm" onclick="invoicesModule.editInvoice(${row.id})" title="تعديل">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-ghost btn-sm" onclick="invoicesModule.markAsPaid(${row.id})" title="دفع الفاتورة">
                            <i class="fas fa-money-bill-wave"></i>
                        </button>
                        <button class="btn btn-ghost btn-sm text-danger" onclick="invoicesModule.deleteInvoice(${row.id})" title="حذف">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `,
            },
        ];

        this.dataTable = new DataTable("#invoices-table", {
            data: this.invoices,
            columns: columns,
            searchable: true,
            sortable: true,
            pagination: true,
            pageSize: 15,
        });
    }

    showCreateInvoiceModal() {
        this.currentInvoice = null;
        const content = this.renderInvoiceForm();

        modal.show(content, {
            title: "إنشاء فاتورة جديدة",
            size: "large",
        });

        this.bindInvoiceFormEvents();
    }

    renderInvoiceForm() {
        const invoice = this.currentInvoice || {};
        // Mock customers and products for dropdowns
        const customers = [
            { id: 1, name: "أحمد محمد" },
            { id: 2, name: "شركة النور" },
        ];
        const products = [
            { id: 1, name: "لابتوب ديل", price: 3500 },
            { id: 2, name: "شاشة سامسونج", price: 1200 },
        ];

        return `
            <form class="invoice-form">
                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label">العميل *</label>
                        <select class="form-select" name="customerId" required>
                            <option value="">اختر العميل</option>
                            ${customers.map(
                                (c) =>
                                    `<option value="${c.id}" ${invoice.customerId === c.id ? "selected" : ""}>${c.name}</option>`
                            ).join("")}
                        </select>
                    </div>
                    <div class="form-col">
                        <label class="form-label">تاريخ الفاتورة *</label>
                        <input type="date" class="form-input" name="date" value="${invoice.date || new Date().toISOString().split("T")[0]}" required>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label">تاريخ الاستحقاق *</label>
                        <input type="date" class="form-input" name="dueDate" value="${invoice.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}" required>
                    </div>
                    <div class="form-col">
                        <label class="form-label">حالة الفاتورة</label>
                        <select class="form-select" name="status">
                            <option value="مستحقة" ${invoice.status === "مستحقة" ? "selected" : ""}>مستحقة</option>
                            <option value="مدفوعة" ${invoice.status === "مدفوعة" ? "selected" : ""}>مدفوعة</option>
                            <option value="ملغاة" ${invoice.status === "ملغاة" ? "selected" : ""}>ملغاة</option>
                        </select>
                    </div>
                </div>

                <div class="invoice-items">
                    <h4>أصناف الفاتورة</h4>
                    <div class="items-header">
                        <button type="button" class="btn btn-primary btn-sm" onclick="invoicesModule.addInvoiceItem()">
                            <i class="fas fa-plus"></i>
                            إضافة صنف
                        </button>
                    </div>
                    <div id="invoice-items-list">
                        ${this.currentInvoice && this.currentInvoice.items && this.currentInvoice.items.length > 0 ? this.renderInvoiceItemsTable(this.currentInvoice.items) : 
                            `<p class="text-muted">لم يتم إضافة أي أصناف بعد</p>`
                        }
                    </div>
                </div>

                <div class="invoice-summary">
                    <div class="form-row">
                        <div class="form-col">
                            <label class="form-label">خصم (%)</label>
                            <input type="number" class="form-input" name="discount" min="0" max="100" step="0.01" value="${invoice.discount || 0}">
                        </div>
                        <div class="form-col">
                            <label class="form-label">ضريبة (%)</label>
                            <input type="number" class="form-input" name="tax" min="0" max="100" step="0.01" value="${invoice.tax || 15}">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">ملاحظات</label>
                        <textarea class="form-textarea" name="notes" rows="2" placeholder="ملاحظات الفاتورة...">${invoice.notes || ""}</textarea>
                    </div>
                    
                    <div class="invoice-totals">
                        <div class="total-row">
                            <span>المجموع الفرعي:</span>
                            <span id="invoice-subtotal">${formatCurrency(invoice.subtotal || 0)}</span>
                        </div>
                        <div class="total-row">
                            <span>الخصم:</span>
                            <span id="invoice-discount-amount">${formatCurrency(invoice.discountAmount || 0)}</span>
                        </div>
                        <div class="total-row">
                            <span>الضريبة:</span>
                            <span id="invoice-tax-amount">${formatCurrency(invoice.taxAmount || 0)}</span>
                        </div>
                        <div class="total-row total-final">
                            <span>المجموع النهائي:</span>
                            <span id="invoice-final-total">${formatCurrency(invoice.totalAmount || 0)}</span>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-success" onclick="invoicesModule.saveInvoice()">
                        <i class="fas fa-save"></i>
                        ${this.currentInvoice ? "تحديث" : "حفظ"}
                    </button>
                    <button type="button" class="btn btn-ghost" onclick="modal.hide()">
                        إلغاء
                    </button>
                </div>
            </form>
        `;
    }

    renderInvoiceItemsTable(items) {
        return `
            <div class="invoice-items-table">
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
                        ${items.map((item, index) => `
                            <tr>
                                <td>${item.productName}</td>
                                <td>${item.quantity}</td>
                                <td>${formatCurrency(item.unitPrice)}</td>
                                <td>${formatCurrency(item.total)}</td>
                                <td>
                                    <button class="btn btn-ghost btn-sm text-danger" onclick="invoicesModule.removeInvoiceItem(${index})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        `;
    }

    bindEvents() {
        // Module-specific events
    }

    bindInvoiceFormEvents() {
        const discountInput = $$("input[name="discount"]");
        const taxInput = $$("input[name="tax"]");

        if (discountInput) {
            discountInput.addEventListener("input", () => this.updateInvoiceTotals());
        }

        if (taxInput) {
            taxInput.addEventListener("input", () => this.updateInvoiceTotals());
        }

        // Initial total calculation if editing an existing invoice
        if (this.currentInvoice) {
            this.updateInvoiceTotals();
        }
    }

    addInvoiceItem() {
        const products = [
            { id: 1, name: "لابتوب ديل", price: 3500 },
            { id: 2, name: "شاشة سامسونج", price: 1200 },
            { id: 3, name: "كيبورد لوجيتك", price: 300 },
        ];

        const content = `
            <div class="add-invoice-item-form">
                <div class="form-group">
                    <label class="form-label">المنتج *</label>
                    <select class="form-select" name="productId" required>
                        <option value="">اختر المنتج</option>
                        ${products.map(p => `<option value="${p.id}" data-price="${p.price}">${p.name} (${formatCurrency(p.price)})</option>`).join("")}
                    </select>
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
                
                <div class="form-group">
                    <label class="form-label">المجموع</label>
                    <input type="number" class="form-input" name="total" readonly>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" onclick="invoicesModule.confirmAddInvoiceItem()">
                        إضافة
                    </button>
                    <button type="button" class="btn btn-ghost" onclick="modal.hide()">
                        إلغاء
                    </button>
                </div>
            </div>
        `;

        modal.show(content, {
            title: "إضافة صنف للفاتورة",
            size: "medium",
        });

        const productSelect = $$("select[name="productId"]");
        const quantityInput = $$("input[name="quantity"]");
        const unitPriceInput = $$("input[name="unitPrice"]");
        const totalInput = $$("input[name="total"]");

        const calculateTotal = () => {
            const quantity = parseFloat(quantityInput.value) || 0;
            const unitPrice = parseFloat(unitPriceInput.value) || 0;
            totalInput.value = (quantity * unitPrice).toFixed(2);
        };

        if (productSelect) {
            productSelect.addEventListener("change", () => {
                const selectedOption = productSelect.options[productSelect.selectedIndex];
                const price = parseFloat(selectedOption.dataset.price);
                if (!isNaN(price)) {
                    unitPriceInput.value = price.toFixed(2);
                    calculateTotal();
                }
            });
        }
        if (quantityInput) quantityInput.addEventListener("input", calculateTotal);
        if (unitPriceInput) unitPriceInput.addEventListener("input", calculateTotal);
    }

    confirmAddInvoiceItem() {
        const productId = $$("select[name="productId"]").value;
        const productName = $$("select[name="productId"]").options[$$("select[name="productId"]").selectedIndex].text.split(" (")[0];
        const quantity = parseFloat($$("input[name="quantity"]").value);
        const unitPrice = parseFloat($$("input[name="unitPrice"]").value);

        if (!productId || !quantity || !unitPrice) {
            toast.error("يرجى ملء جميع الحقول المطلوبة");
            return;
        }

        const item = {
            productId,
            productName,
            quantity,
            unitPrice,
            total: quantity * unitPrice,
        };

        if (!this.currentInvoice) {
            this.currentInvoice = { items: [] };
        }
        this.currentInvoice.items.push(item);
        this.updateInvoiceItemsList();
        this.updateInvoiceTotals();
        modal.hide();
        toast.success("تم إضافة الصنف بنجاح");
    }

    updateInvoiceItemsList() {
        const itemsList = $("invoice-items-list");
        if (!itemsList) return;

        if (!this.currentInvoice || !this.currentInvoice.items || this.currentInvoice.items.length === 0) {
            itemsList.innerHTML = `<p class="text-muted">لم يتم إضافة أي أصناف بعد</p>`;
            return;
        }

        itemsList.innerHTML = this.renderInvoiceItemsTable(this.currentInvoice.items);
    }

    removeInvoiceItem(index) {
        this.currentInvoice.items.splice(index, 1);
        this.updateInvoiceItemsList();
        this.updateInvoiceTotals();
    }

    updateInvoiceTotals() {
        const subtotal = (this.currentInvoice && this.currentInvoice.items) ? this.currentInvoice.items.reduce((sum, item) => sum + item.total, 0) : 0;
        const discountPercent = parseFloat($$("input[name="discount"]").value || 0);
        const taxPercent = parseFloat($$("input[name="tax"]").value || 0);

        const discountAmount = subtotal * (discountPercent / 100);
        const taxableAmount = subtotal - discountAmount;
        const taxAmount = taxableAmount * (taxPercent / 100);
        const finalTotal = taxableAmount + taxAmount;

        // Update display
        const subtotalEl = $("invoice-subtotal");
        const discountEl = $("invoice-discount-amount");
        const taxEl = $("invoice-tax-amount");
        const totalEl = $("invoice-final-total");

        if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
        if (discountEl) discountEl.textContent = formatCurrency(discountAmount);
        if (taxEl) taxEl.textContent = formatCurrency(taxAmount);
        if (totalEl) totalEl.textContent = formatCurrency(finalTotal);

        // Update currentInvoice object
        if (this.currentInvoice) {
            this.currentInvoice.subtotal = subtotal;
            this.currentInvoice.discountAmount = discountAmount;
            this.currentInvoice.taxAmount = taxAmount;
            this.currentInvoice.totalAmount = finalTotal;
        }
    }

    async saveInvoice() {
        const form = $$(".invoice-form");
        const formData = new FormData(form);

        const invoiceData = {
            customerId: parseInt(formData.get("customerId")),
            date: formData.get("date"),
            dueDate: formData.get("dueDate"),
            status: formData.get("status"),
            items: this.currentInvoice ? this.currentInvoice.items : [],
            discount: parseFloat(formData.get("discount")) || 0,
            tax: parseFloat(formData.get("tax")) || 0,
            notes: formData.get("notes"),
            subtotal: this.currentInvoice ? this.currentInvoice.subtotal : 0,
            discountAmount: this.currentInvoice ? this.currentInvoice.discountAmount : 0,
            taxAmount: this.currentInvoice ? this.currentInvoice.taxAmount : 0,
            totalAmount: this.currentInvoice ? this.currentInvoice.totalAmount : 0,
        };

        // Validation
        if (!invoiceData.customerId || !invoiceData.date || !invoiceData.dueDate) {
            toast.error("يرجى ملء الحقول المطلوبة (العميل، تاريخ الفاتورة، تاريخ الاستحقاق)");
            return;
        }

        if (invoiceData.items.length === 0) {
            toast.error("يرجى إضافة أصناف للفاتورة");
            return;
        }

        try {
            loading.show("save-invoice");

            let response;
            if (this.currentInvoice && this.currentInvoice.id) {
                response = await api.updateInvoice(this.currentInvoice.id, invoiceData);
            } else {
                response = await api.createInvoice(invoiceData);
            }

            if (response.success) {
                toast.success(`تم ${this.currentInvoice ? "تحديث" : "إضافة"} الفاتورة بنجاح`);
                modal.hide();
                await this.loadData();
                this.dataTable.updateData(this.invoices);
            } else {
                toast.error(`فشل في ${this.currentInvoice ? "تحديث" : "إضافة"} الفاتورة`);
            }
        } catch (error) {
            console.error("Save invoice error:", error);
            toast.error("حدث خطأ في حفظ الفاتورة");
        } finally {
            loading.hide("save-invoice");
        }
    }

    viewInvoice(id) {
        const invoice = this.invoices.find((i) => i.id === id);
        if (!invoice) return;

        const content = `
            <div class="invoice-details">
                <div class="invoice-header">
                    <h3>فاتورة رقم #${invoice.id}</h3>
                    <span class="badge ${invoice.status === "مدفوعة" ? "badge-success" : invoice.status === "مستحقة" ? "badge-warning" : "badge-danger"}">
                        ${invoice.status}
                    </span>
                </div>
                
                <div class="invoice-info-grid">
                    <div class="info-section">
                        <h4>معلومات الفاتورة</h4>
                        <div class="info-item">
                            <label>العميل:</label>
                            <span>${invoice.customerName}</span>
                        </div>
                        <div class="info-item">
                            <label>تاريخ الفاتورة:</label>
                            <span>${formatDate(invoice.date)}</span>
                        </div>
                        <div class="info-item">
                            <label>تاريخ الاستحقاق:</label>
                            <span>${formatDate(invoice.dueDate)}</span>
                        </div>
                    </div>
                    
                    <div class="info-section">
                        <h4>المبالغ</h4>
                        <div class="info-item">
                            <label>المجموع الفرعي:</label>
                            <span>${formatCurrency(invoice.subtotal)}</span>
                        </div>
                        <div class="info-item">
                            <label>الخصم (${invoice.discount}%):</label>
                            <span>${formatCurrency(invoice.discountAmount)}</span>
                        </div>
                        <div class="info-item">
                            <label>الضريبة (${invoice.tax}%):</label>
                            <span>${formatCurrency(invoice.taxAmount)}</span>
                        </div>
                        <div class="info-item total-final">
                            <label>المبلغ الإجمالي:</label>
                            <span>${formatCurrency(invoice.totalAmount)}</span>
                        </div>
                    </div>
                </div>

                <div class="invoice-items-view">
                    <h4>أصناف الفاتورة</h4>
                    ${this.renderInvoiceItemsTable(invoice.items)}
                </div>
                
                ${invoice.notes ? `
                    <div class="invoice-notes">
                        <h4>ملاحظات:</h4>
                        <p>${invoice.notes}</p>
                    </div>
                ` : ""}
                
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="invoicesModule.editInvoice(${invoice.id}); modal.hide();">
                        <i class="fas fa-edit"></i>
                        تعديل
                    </button>
                    <button class="btn btn-info" onclick="invoicesModule.printInvoice(${invoice.id});">
                        <i class="fas fa-print"></i>
                        طباعة
                    </button>
                    <button class="btn btn-ghost" onclick="modal.hide()">
                        إغلاق
                    </button>
                </div>
            </div>
        `;

        modal.show(content, {
            title: "تفاصيل الفاتورة",
            size: "large",
        });
    }

    editInvoice(id) {
        this.currentInvoice = this.invoices.find((i) => i.id === id);
        if (!this.currentInvoice) return;

        const content = this.renderInvoiceForm();

        modal.show(content, {
            title: "تعديل الفاتورة",
            size: "large",
        });

        this.bindInvoiceFormEvents();
    }

    async markAsPaid(id) {
        const invoice = this.invoices.find((i) => i.id === id);
        if (!invoice) return;

        const confirmed = await modal.confirm(
            `هل أنت متأكد من وضع الفاتورة رقم #${invoice.id} كمدفوعة؟`,
            "تأكيد الدفع"
        );

        if (!confirmed) return;

        try {
            loading.show("mark-paid");
            const response = await api.updateInvoice(id, { status: "مدفوعة" });

            if (response.success) {
                toast.success("تم وضع الفاتورة كمدفوعة بنجاح");
                await this.loadData();
                this.dataTable.updateData(this.invoices);
            } else {
                toast.error("فشل في وضع الفاتورة كمدفوعة");
            }
        } catch (error) {
            console.error("Mark as paid error:", error);
            toast.error("حدث خطأ في معالجة الدفع");
        } finally {
            loading.hide("mark-paid");
        }
    }

    async deleteInvoice(id) {
        const invoice = this.invoices.find((i) => i.id === id);
        if (!invoice) return;

        const confirmed = await modal.confirm(
            `هل أنت متأكد من حذف الفاتورة رقم #${invoice.id}؟`,
            "تأكيد الحذف"
        );

        if (!confirmed) return;

        try {
            loading.show("delete-invoice");
            const response = await api.deleteInvoice(id);

            if (response.success) {
                toast.success("تم حذف الفاتورة بنجاح");
                await this.loadData();
                this.dataTable.updateData(this.invoices);
            } else {
                toast.error("فشل في حذف الفاتورة");
            }
        } catch (error) {
            console.error("Delete invoice error:", error);
            toast.error("حدث خطأ في حذف الفاتورة");
        } finally {
            loading.hide("delete-invoice");
        }
    }

    importInvoices() {
        toast.info("استيراد الفواتير قيد التطوير");
    }

    exportInvoices() {
        const csvContent = this.generateInvoicesCSV();
        downloadFile(csvContent, "invoices.csv", "text/csv");
        toast.success("تم تصدير البيانات بنجاح");
    }

    printInvoices() {
        const printContent = this.generateInvoicesPrintContent();
        const printWindow = window.open("", "_blank");
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    }

    printInvoice(id) {
        const invoice = this.invoices.find((i) => i.id === id);
        if (!invoice) return;

        const printContent = this.generateSingleInvoicePrintContent(invoice);
        const printWindow = window.open("", "_blank");
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    }

    // Helper methods
    getPaidInvoicesTotal() {
        return this.invoices.filter((i) => i.status === "مدفوعة").reduce((sum, i) => sum + i.totalAmount, 0);
    }

    getDueInvoicesTotal() {
        return this.invoices.filter((i) => i.status === "مستحقة").reduce((sum, i) => sum + i.totalAmount, 0);
    }

    getAverageInvoiceAmount() {
        if (this.invoices.length === 0) return 0;
        const total = this.invoices.reduce((sum, i) => sum + i.totalAmount, 0);
        return total / this.invoices.length;
    }

    generateInvoicesCSV() {
        const headers = [
            "رقم الفاتورة",
            "العميل",
            "التاريخ",
            "تاريخ الاستحقاق",
            "المبلغ الإجمالي",
            "الحالة",
        ];
        const rows = this.invoices.map((invoice) => [
            invoice.id,
            invoice.customerName,
            invoice.date,
            invoice.dueDate,
            invoice.totalAmount,
            invoice.status,
        ]);

        return [headers, ...rows].map((row) => row.join(",")).join("\n");
    }

    generateInvoicesPrintContent() {
        return `
            <html>
                <head>
                    <title>قائمة الفواتير</title>
                    <style>
                        body { font-family: 'Cairo', Arial, sans-serif; direction: rtl; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
                        th { background-color: #f5f5f5; }
                        h1 { text-align: center; color: #333; }
                    </style>
                </head>
                <body>
                    <h1>قائمة الفواتير</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>رقم الفاتورة</th>
                                <th>العميل</th>
                                <th>التاريخ</th>
                                <th>تاريخ الاستحقاق</th>
                                <th>المبلغ الإجمالي</th>
                                <th>الحالة</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.invoices.map(
                                (invoice) =>
                                    `
                                <tr>
                                    <td>#${invoice.id}</td>
                                    <td>${invoice.customerName}</td>
                                    <td>${formatDate(invoice.date)}</td>
                                    <td>${formatDate(invoice.dueDate)}</td>
                                    <td>${formatCurrency(invoice.totalAmount)}</td>
                                    <td>${invoice.status}</td>
                                </tr>
                            `
                            ).join("")}
                        </tbody>
                    </table>
                </body>
            </html>
        `;
    }

    generateSingleInvoicePrintContent(invoice) {
        return `
            <html>
                <head>
                    <title>فاتورة رقم #${invoice.id}</title>
                    <style>
                        body { font-family: 'Cairo', Arial, sans-serif; direction: rtl; margin: 20px; }
                        .invoice-header { text-align: center; margin-bottom: 30px; }
                        .invoice-header h1 { color: #333; }
                        .invoice-details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; border: 1px solid #eee; padding: 15px; }
                        .invoice-details-grid div { padding: 5px 0; }
                        .invoice-details-grid label { font-weight: bold; margin-left: 10px; }
                        .invoice-items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                        .invoice-items-table th, .invoice-items-table td { border: 1px solid #ddd; padding: 8px; text-align: right; }
                        .invoice-items-table th { background-color: #f5f5f5; }
                        .invoice-summary-print { text-align: left; width: 300px; margin-left: auto; border: 1px solid #eee; padding: 15px; }
                        .invoice-summary-print div { display: flex; justify-content: space-between; padding: 5px 0; }
                        .invoice-summary-print .total-final { font-weight: bold; border-top: 1px solid #eee; padding-top: 10px; margin-top: 10px; }
                        .invoice-notes { margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px; }
                    </style>
                </head>
                <body>
                    <div class="invoice-header">
                        <h1>فاتورة ضريبية</h1>
                        <p>رقم الفاتورة: #${invoice.id}</p>
                        <p>تاريخ الفاتورة: ${formatDate(invoice.date)}</p>
                    </div>

                    <div class="invoice-details-grid">
                        <div>
                            <label>العميل:</label><span>${invoice.customerName}</span>
                        </div>
                        <div>
                            <label>تاريخ الاستحقاق:</label><span>${formatDate(invoice.dueDate)}</span>
                        </div>
                        <div>
                            <label>الحالة:</label><span>${invoice.status}</span>
                        </div>
                    </div>

                    <h4>تفاصيل الأصناف:</h4>
                    <table class="invoice-items-table">
                        <thead>
                            <tr>
                                <th>المنتج</th>
                                <th>الكمية</th>
                                <th>سعر الوحدة</th>
                                <th>المجموع</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${invoice.items.map(item => `
                                <tr>
                                    <td>${item.productName}</td>
                                    <td>${item.quantity}</td>
                                    <td>${formatCurrency(item.unitPrice)}</td>
                                    <td>${formatCurrency(item.total)}</td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>

                    <div class="invoice-summary-print">
                        <div>
                            <span>المجموع الفرعي:</span>
                            <span>${formatCurrency(invoice.subtotal)}</span>
                        </div>
                        <div>
                            <span>الخصم (${invoice.discount}%):</span>
                            <span>${formatCurrency(invoice.discountAmount)}</span>
                        </div>
                        <div>
                            <span>الضريبة (${invoice.tax}%):</span>
                            <span>${formatCurrency(invoice.taxAmount)}</span>
                        </div>
                        <div class="total-row total-final">
                            <span>المبلغ الإجمالي:</span>
                            <span>${formatCurrency(invoice.totalAmount)}</span>
                        </div>
                    </div>

                    ${invoice.notes ? `
                        <div class="invoice-notes">
                            <h4>ملاحظات:</h4>
                            <p>${invoice.notes}</p>
                        </div>
                    ` : ""}
                </body>
            </html>
        `;
    }
}

// Export invoices module
window.invoicesModule = new Invoices();

