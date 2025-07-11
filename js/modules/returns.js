// Returns Module

class Returns {
    constructor() {
        this.returns = [];
        this.dataTable = null;
        this.currentReturn = null;
    }

    async init() {
        await this.loadData();
        this.render();
        this.bindEvents();
    }

    async loadData() {
        try {
            loading.show("returns");
            const response = await api.getReturns();
            if (response.success) {
                this.returns = response.data;
            }
        } catch (error) {
            console.error("Returns data loading error:", error);
            toast.error("حدث خطأ في تحميل بيانات المرتجعات");
        } finally {
            loading.hide("returns");
        }
    }

    render() {
        const content = `
            <div class="returns-container">
                <!-- Header Actions -->
                <div class="module-header">
                    <div class="module-title">
                        <h2>إدارة المرتجعات</h2>
                        <p>معالجة وإدارة جميع عمليات المرتجعات والاستبدالات</p>
                    </div>
                    <div class="module-actions">
                        <button class="btn btn-success" onclick="returnsModule.showAddReturnModal()">
                            <i class="fas fa-undo-alt"></i>
                            مرتجع جديد
                        </button>
                        <button class="btn btn-primary" onclick="returnsModule.importReturns()">
                            <i class="fas fa-upload"></i>
                            استيراد
                        </button>
                    </div>
                </div>

                <!-- Returns Stats -->
                <div class="returns-stats">
                    <div class="stats-grid">
                        <div class="stat-card primary">
                            <div class="stat-header">
                                <span class="stat-title">إجمالي المرتجعات</span>
                                <div class="stat-icon primary">
                                    <i class="fas fa-box-open"></i>
                                </div>
                            </div>
                            <div class="stat-value">${formatNumber(this.returns.length)}</div>
                            <div class="stat-change negative">
                                <i class="fas fa-arrow-down"></i>
                                -3.2% هذا الشهر
                            </div>
                        </div>
                        
                        <div class="stat-card success">
                            <div class="stat-header">
                                <span class="stat-title">مرتجعات معالجة</span>
                                <div class="stat-icon success">
                                    <i class="fas fa-check-double"></i>
                                </div>
                            </div>
                            <div class="stat-value">${formatCurrency(this.getProcessedReturnsTotal())}</div>
                            <div class="stat-change positive">
                                <i class="fas fa-arrow-up"></i>
                                +8.0%
                            </div>
                        </div>
                        
                        <div class="stat-card warning">
                            <div class="stat-header">
                                <span class="stat-title">مرتجعات معلقة</span>
                                <div class="stat-icon warning">
                                    <i class="fas fa-hourglass-half"></i>
                                </div>
                            </div>
                            <div class="stat-value">${formatCurrency(this.getPendingReturnsTotal())}</div>
                            <div class="stat-change negative">
                                <i class="fas fa-arrow-down"></i>
                                -1.5%
                            </div>
                        </div>
                        
                        <div class="stat-card info">
                            <div class="stat-header">
                                <span class="stat-title">متوسط قيمة المرتجع</span>
                                <div class="stat-icon info">
                                    <i class="fas fa-calculator"></i>
                                </div>
                            </div>
                            <div class="stat-value">${formatCurrency(this.getAverageReturnAmount())}</div>
                            <div class="stat-change positive">
                                <i class="fas fa-arrow-up"></i>
                                +0.8%
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Returns Table -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">قائمة المرتجعات</h3>
                        <div class="card-actions">
                            <button class="btn btn-ghost btn-sm" onclick="returnsModule.exportReturns()">
                                <i class="fas fa-download"></i>
                                تصدير
                            </button>
                            <button class="btn btn-ghost btn-sm" onclick="returnsModule.printReturns()">
                                <i class="fas fa-print"></i>
                                طباعة
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div id="returns-table"></div>
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
                title: "رقم المرتجع",
                render: (value) => `#${value}`,
            },
            {
                key: "customerName",
                title: "العميل",
            },
            {
                key: "invoiceId",
                title: "رقم الفاتورة",
                render: (value) => `#${value}`,
            },
            {
                key: "date",
                title: "التاريخ",
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
                    <span class="badge ${value === "معالج" ? "badge-success" : value === "معلق" ? "badge-warning" : "badge-danger"}">
                        ${value}
                    </span>
                `,
            },
            {
                key: "actions",
                title: "الإجراءات",
                render: (value, row) => `
                    <div class="table-actions">
                        <button class="btn btn-ghost btn-sm" onclick="returnsModule.viewReturn(${row.id})" title="عرض">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-ghost btn-sm" onclick="returnsModule.editReturn(${row.id})" title="تعديل">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-ghost btn-sm" onclick="returnsModule.markAsProcessed(${row.id})" title="وضع كمعالج">
                            <i class="fas fa-check-circle"></i>
                        </button>
                        <button class="btn btn-ghost btn-sm text-danger" onclick="returnsModule.deleteReturn(${row.id})" title="حذف">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `,
            },
        ];

        this.dataTable = new DataTable("#returns-table", {
            data: this.returns,
            columns: columns,
            searchable: true,
            sortable: true,
            pagination: true,
            pageSize: 15,
        });
    }

    showAddReturnModal() {
        this.currentReturn = null;
        const content = this.renderReturnForm();

        modal.show(content, {
            title: "إضافة مرتجع جديد",
            size: "large",
        });

        this.bindReturnFormEvents();
    }

    renderReturnForm() {
        const returnData = this.currentReturn || {};
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
            <form class="return-form">
                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label">العميل *</label>
                        <select class="form-select" name="customerId" required>
                            <option value="">اختر العميل</option>
                            ${customers.map(
                                (c) =>
                                    `<option value="${c.id}" ${returnData.customerId === c.id ? "selected" : ""}>${c.name}</option>`
                            ).join("")}
                        </select>
                    </div>
                    <div class="form-col">
                        <label class="form-label">رقم الفاتورة *</label>
                        <input type="text" class="form-input" name="invoiceId" value="${returnData.invoiceId || ""}" required>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label">تاريخ المرتجع *</label>
                        <input type="date" class="form-input" name="date" value="${returnData.date || new Date().toISOString().split("T")[0]}" required>
                    </div>
                    <div class="form-col">
                        <label class="form-label">الحالة</label>
                        <select class="form-select" name="status">
                            <option value="معلق" ${returnData.status === "معلق" ? "selected" : ""}>معلق</option>
                            <option value="معالج" ${returnData.status === "معالج" ? "selected" : ""}>معالج</option>
                            <option value="مرفوض" ${returnData.status === "مرفوض" ? "selected" : ""}>مرفوض</option>
                        </select>
                    </div>
                </div>

                <div class="return-items">
                    <h4>أصناف المرتجع</h4>
                    <div class="items-header">
                        <button type="button" class="btn btn-primary btn-sm" onclick="returnsModule.addReturnItem()">
                            <i class="fas fa-plus"></i>
                            إضافة صنف
                        </button>
                    </div>
                    <div id="return-items-list">
                        ${this.currentReturn && this.currentReturn.items && this.currentReturn.items.length > 0 ? this.renderReturnItemsTable(this.currentReturn.items) : 
                            `<p class="text-muted">لم يتم إضافة أي أصناف بعد</p>`
                        }
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">سبب المرتجع *</label>
                    <textarea class="form-textarea" name="reason" rows="3" placeholder="سبب المرتجع..." required>${returnData.reason || ""}</textarea>
                </div>

                <div class="return-summary">
                    <div class="total-row total-final">
                        <span>المبلغ الإجمالي للمرتجع:</span>
                        <span id="return-final-total">${formatCurrency(returnData.totalAmount || 0)}</span>
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-success" onclick="returnsModule.saveReturn()">
                        <i class="fas fa-save"></i>
                        ${this.currentReturn ? "تحديث" : "حفظ"}
                    </button>
                    <button type="button" class="btn btn-ghost" onclick="modal.hide()">
                        إلغاء
                    </button>
                </div>
            </form>
        `;
    }

    renderReturnItemsTable(items) {
        return `
            <div class="return-items-table">
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
                                    <button class="btn btn-ghost btn-sm text-danger" onclick="returnsModule.removeReturnItem(${index})">
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

    bindReturnFormEvents() {
        // No specific form events for now
    }

    addReturnItem() {
        const products = [
            { id: 1, name: "لابتوب ديل", price: 3500 },
            { id: 2, name: "شاشة سامسونج", price: 1200 },
            { id: 3, name: "كيبورد لوجيتك", price: 300 },
        ];

        const content = `
            <div class="add-return-item-form">
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
                    <button type="button" class="btn btn-primary" onclick="returnsModule.confirmAddReturnItem()">
                        إضافة
                    </button>
                    <button type="button" class="btn btn-ghost" onclick="modal.hide()">
                        إلغاء
                    </button>
                </div>
            </div>
        `;

        modal.show(content, {
            title: "إضافة صنف للمرتجع",
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

    confirmAddReturnItem() {
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

        if (!this.currentReturn) {
            this.currentReturn = { items: [] };
        }
        this.currentReturn.items.push(item);
        this.updateReturnItemsList();
        this.updateReturnTotals();
        modal.hide();
        toast.success("تم إضافة الصنف بنجاح");
    }

    updateReturnItemsList() {
        const itemsList = $("return-items-list");
        if (!itemsList) return;

        if (!this.currentReturn || !this.currentReturn.items || this.currentReturn.items.length === 0) {
            itemsList.innerHTML = `<p class="text-muted">لم يتم إضافة أي أصناف بعد</p>`;
            return;
        }

        itemsList.innerHTML = this.renderReturnItemsTable(this.currentReturn.items);
    }

    removeReturnItem(index) {
        this.currentReturn.items.splice(index, 1);
        this.updateReturnItemsList();
        this.updateReturnTotals();
    }

    updateReturnTotals() {
        const totalAmount = (this.currentReturn && this.currentReturn.items) ? this.currentReturn.items.reduce((sum, item) => sum + item.total, 0) : 0;

        // Update display
        const totalEl = $("return-final-total");
        if (totalEl) totalEl.textContent = formatCurrency(totalAmount);

        // Update currentReturn object
        if (this.currentReturn) {
            this.currentReturn.totalAmount = totalAmount;
        }
    }

    async saveReturn() {
        const form = $$(".return-form");
        const formData = new FormData(form);

        const returnData = {
            customerId: parseInt(formData.get("customerId")),
            invoiceId: parseInt(formData.get("invoiceId")),
            date: formData.get("date"),
            status: formData.get("status"),
            reason: formData.get("reason"),
            items: this.currentReturn ? this.currentReturn.items : [],
            totalAmount: this.currentReturn ? this.currentReturn.totalAmount : 0,
        };

        // Validation
        if (!returnData.customerId || !returnData.invoiceId || !returnData.date || !returnData.reason) {
            toast.error("يرجى ملء الحقول المطلوبة (العميل، رقم الفاتورة، التاريخ، السبب)");
            return;
        }

        if (returnData.items.length === 0) {
            toast.error("يرجى إضافة أصناف للمرتجع");
            return;
        }

        try {
            loading.show("save-return");

            let response;
            if (this.currentReturn && this.currentReturn.id) {
                response = await api.updateReturn(this.currentReturn.id, returnData);
            } else {
                response = await api.createReturn(returnData);
            }

            if (response.success) {
                toast.success(`تم ${this.currentReturn ? "تحديث" : "إضافة"} المرتجع بنجاح`);
                modal.hide();
                await this.loadData();
                this.dataTable.updateData(this.returns);
            } else {
                toast.error(`فشل في ${this.currentReturn ? "تحديث" : "إضافة"} المرتجع`);
            }
        } catch (error) {
            console.error("Save return error:", error);
            toast.error("حدث خطأ في حفظ المرتجع");
        } finally {
            loading.hide("save-return");
        }
    }

    viewReturn(id) {
        const returnData = this.returns.find((r) => r.id === id);
        if (!returnData) return;

        const content = `
            <div class="return-details">
                <div class="return-header">
                    <h3>مرتجع رقم #${returnData.id}</h3>
                    <span class="badge ${returnData.status === "معالج" ? "badge-success" : returnData.status === "معلق" ? "badge-warning" : "badge-danger"}">
                        ${returnData.status}
                    </span>
                </div>
                
                <div class="return-info-grid">
                    <div class="info-section">
                        <h4>معلومات المرتجع</h4>
                        <div class="info-item">
                            <label>العميل:</label>
                            <span>${returnData.customerName}</span>
                        </div>
                        <div class="info-item">
                            <label>رقم الفاتورة:</label>
                            <span>#${returnData.invoiceId}</span>
                        </div>
                        <div class="info-item">
                            <label>تاريخ المرتجع:</label>
                            <span>${formatDate(returnData.date)}</span>
                        </div>
                        <div class="info-item">
                            <label>سبب المرتجع:</label>
                            <span>${returnData.reason}</span>
                        </div>
                    </div>
                    
                    <div class="info-section">
                        <h4>المبالغ</h4>
                        <div class="info-item total-final">
                            <label>المبلغ الإجمالي للمرتجع:</label>
                            <span>${formatCurrency(returnData.totalAmount)}</span>
                        </div>
                    </div>
                </div>

                <div class="return-items-view">
                    <h4>أصناف المرتجع</h4>
                    ${this.renderReturnItemsTable(returnData.items)}
                </div>
                
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="returnsModule.editReturn(${returnData.id}); modal.hide();">
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
            title: "تفاصيل المرتجع",
            size: "large",
        });
    }

    editReturn(id) {
        this.currentReturn = this.returns.find((r) => r.id === id);
        if (!this.currentReturn) return;

        const content = this.renderReturnForm();

        modal.show(content, {
            title: "تعديل المرتجع",
            size: "large",
        });

        this.bindReturnFormEvents();
    }

    async markAsProcessed(id) {
        const returnData = this.returns.find((r) => r.id === id);
        if (!returnData) return;

        const confirmed = await modal.confirm(
            `هل أنت متأكد من وضع المرتجع رقم #${returnData.id} كمعالج؟`,
            "تأكيد المعالجة"
        );

        if (!confirmed) return;

        try {
            loading.show("mark-processed");
            const response = await api.updateReturn(id, { status: "معالج" });

            if (response.success) {
                toast.success("تم وضع المرتجع كمعالج بنجاح");
                await this.loadData();
                this.dataTable.updateData(this.returns);
            } else {
                toast.error("فشل في وضع المرتجع كمعالج");
            }
        } catch (error) {
            console.error("Mark as processed error:", error);
            toast.error("حدث خطأ في معالجة المرتجع");
        } finally {
            loading.hide("mark-processed");
        }
    }

    async deleteReturn(id) {
        const returnData = this.returns.find((r) => r.id === id);
        if (!returnData) return;

        const confirmed = await modal.confirm(
            `هل أنت متأكد من حذف المرتجع رقم #${returnData.id}؟`,
            "تأكيد الحذف"
        );

        if (!confirmed) return;

        try {
            loading.show("delete-return");
            const response = await api.deleteReturn(id);

            if (response.success) {
                toast.success("تم حذف المرتجع بنجاح");
                await this.loadData();
                this.dataTable.updateData(this.returns);
            } else {
                toast.error("فشل في حذف المرتجع");
            }
        } catch (error) {
            console.error("Delete return error:", error);
            toast.error("حدث خطأ في حذف المرتجع");
        } finally {
            loading.hide("delete-return");
        }
    }

    importReturns() {
        toast.info("استيراد المرتجعات قيد التطوير");
    }

    exportReturns() {
        const csvContent = this.generateReturnsCSV();
        downloadFile(csvContent, "returns.csv", "text/csv");
        toast.success("تم تصدير البيانات بنجاح");
    }

    printReturns() {
        const printContent = this.generateReturnsPrintContent();
        const printWindow = window.open("", "_blank");
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    }

    // Helper methods
    getProcessedReturnsTotal() {
        return this.returns.filter((r) => r.status === "معالج").reduce((sum, r) => sum + r.totalAmount, 0);
    }

    getPendingReturnsTotal() {
        return this.returns.filter((r) => r.status === "معلق").reduce((sum, r) => sum + r.totalAmount, 0);
    }

    getAverageReturnAmount() {
        if (this.returns.length === 0) return 0;
        const total = this.returns.reduce((sum, r) => sum + r.totalAmount, 0);
        return total / this.returns.length;
    }

    generateReturnsCSV() {
        const headers = [
            "رقم المرتجع",
            "العميل",
            "رقم الفاتورة",
            "التاريخ",
            "المبلغ الإجمالي",
            "الحالة",
            "السبب",
        ];
        const rows = this.returns.map((returnData) => [
            returnData.id,
            returnData.customerName,
            returnData.invoiceId,
            returnData.date,
            returnData.totalAmount,
            returnData.status,
            returnData.reason,
        ]);

        return [headers, ...rows].map((row) => row.join(",")).join("\n");
    }

    generateReturnsPrintContent() {
        return `
            <html>
                <head>
                    <title>قائمة المرتجعات</title>
                    <style>
                        body { font-family: 'Cairo', Arial, sans-serif; direction: rtl; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
                        th { background-color: #f5f5f5; }
                        h1 { text-align: center; color: #333; }
                    </style>
                </head>
                <body>
                    <h1>قائمة المرتجعات</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>رقم المرتجع</th>
                                <th>العميل</th>
                                <th>رقم الفاتورة</th>
                                <th>التاريخ</th>
                                <th>المبلغ الإجمالي</th>
                                <th>الحالة</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.returns.map(
                                (returnData) =>
                                    `
                                <tr>
                                    <td>#${returnData.id}</td>
                                    <td>${returnData.customerName}</td>
                                    <td>#${returnData.invoiceId}</td>
                                    <td>${formatDate(returnData.date)}</td>
                                    <td>${formatCurrency(returnData.totalAmount)}</td>
                                    <td>${returnData.status}</td>
                                </tr>
                            `
                            ).join("")}
                        </tbody>
                    </table>
                </body>
            </html>
        `;
    }
}

// Export returns module
window.returnsModule = new Returns();


