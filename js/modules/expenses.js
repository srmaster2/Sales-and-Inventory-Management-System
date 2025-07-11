// Expenses Module

class Expenses {
    constructor() {
        this.expenses = [];
        this.dataTable = null;
        this.currentExpense = null;
    }

    async init() {
        await this.loadData();
        this.render();
        this.bindEvents();
    }

    async loadData() {
        try {
            loading.show("expenses");
            const response = await api.getExpenses();
            if (response.success) {
                this.expenses = response.data;
            }
        } catch (error) {
            console.error("Expenses data loading error:", error);
            toast.error("حدث خطأ في تحميل بيانات المصروفات");
        } finally {
            loading.hide("expenses");
        }
    }

    render() {
        const content = `
            <div class="expenses-container">
                <!-- Header Actions -->
                <div class="module-header">
                    <div class="module-title">
                        <h2>إدارة المصروفات</h2>
                        <p>تتبع وإدارة جميع المصروفات والتكاليف</p>
                    </div>
                    <div class="module-actions">
                        <button class="btn btn-success" onclick="expensesModule.showAddExpenseModal()">
                            <i class="fas fa-plus-circle"></i>
                            مصروف جديد
                        </button>
                        <button class="btn btn-primary" onclick="expensesModule.importExpenses()">
                            <i class="fas fa-upload"></i>
                            استيراد
                        </button>
                    </div>
                </div>

                <!-- Expenses Stats -->
                <div class="expenses-stats">
                    <div class="stats-grid">
                        <div class="stat-card primary">
                            <div class="stat-header">
                                <span class="stat-title">إجمالي المصروفات</span>
                                <div class="stat-icon primary">
                                    <i class="fas fa-money-bill-wave"></i>
                                </div>
                            </div>
                            <div class="stat-value">${formatCurrency(this.getTotalExpenses())}</div>
                            <div class="stat-change negative">
                                <i class="fas fa-arrow-down"></i>
                                -7.5% هذا الشهر
                            </div>
                        </div>
                        
                        <div class="stat-card success">
                            <div class="stat-header">
                                <span class="stat-title">مصروفات مدفوعة</span>
                                <div class="stat-icon success">
                                    <i class="fas fa-check-circle"></i>
                                </div>
                            </div>
                            <div class="stat-value">${formatCurrency(this.getPaidExpensesTotal())}</div>
                            <div class="stat-change positive">
                                <i class="fas fa-arrow-up"></i>
                                +10.0%
                            </div>
                        </div>
                        
                        <div class="stat-card warning">
                            <div class="stat-header">
                                <span class="stat-title">مصروفات مستحقة</span>
                                <div class="stat-icon warning">
                                    <i class="fas fa-calendar-times"></i>
                                </div>
                            </div>
                            <div class="stat-value">${formatCurrency(this.getDueExpensesTotal())}</div>
                            <div class="stat-change negative">
                                <i class="fas fa-arrow-down"></i>
                                -2.1%
                            </div>
                        </div>
                        
                        <div class="stat-card info">
                            <div class="stat-header">
                                <span class="stat-title">متوسط المصروف</span>
                                <div class="stat-icon info">
                                    <i class="fas fa-calculator"></i>
                                </div>
                            </div>
                            <div class="stat-value">${formatCurrency(this.getAverageExpenseAmount())}</div>
                            <div class="stat-change positive">
                                <i class="fas fa-arrow-up"></i>
                                +1.5%
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Expenses Table -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">قائمة المصروفات</h3>
                        <div class="card-actions">
                            <button class="btn btn-ghost btn-sm" onclick="expensesModule.exportExpenses()">
                                <i class="fas fa-download"></i>
                                تصدير
                            </button>
                            <button class="btn btn-ghost btn-sm" onclick="expensesModule.printExpenses()">
                                <i class="fas fa-print"></i>
                                طباعة
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div id="expenses-table"></div>
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
                title: "الكود",
                render: (value) => `#${value}`,
            },
            {
                key: "description",
                title: "الوصف",
            },
            {
                key: "category",
                title: "الفئة",
            },
            {
                key: "amount",
                title: "المبلغ",
                render: (value) => formatCurrency(value),
            },
            {
                key: "date",
                title: "التاريخ",
                render: (value) => formatDate(value),
            },
            {
                key: "paymentMethod",
                title: "طريقة الدفع",
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
                        <button class="btn btn-ghost btn-sm" onclick="expensesModule.viewExpense(${row.id})" title="عرض">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-ghost btn-sm" onclick="expensesModule.editExpense(${row.id})" title="تعديل">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-ghost btn-sm" onclick="expensesModule.markAsPaid(${row.id})" title="دفع المصروف">
                            <i class="fas fa-money-bill-wave"></i>
                        </button>
                        <button class="btn btn-ghost btn-sm text-danger" onclick="expensesModule.deleteExpense(${row.id})" title="حذف">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `,
            },
        ];

        this.dataTable = new DataTable("#expenses-table", {
            data: this.expenses,
            columns: columns,
            searchable: true,
            sortable: true,
            pagination: true,
            pageSize: 15,
        });
    }

    showAddExpenseModal() {
        this.currentExpense = null;
        const content = this.renderExpenseForm();

        modal.show(content, {
            title: "إضافة مصروف جديد",
            size: "medium",
        });

        this.bindExpenseFormEvents();
    }

    renderExpenseForm() {
        const expense = this.currentExpense || {};
        const categories = [
            "إيجار",
            "رواتب",
            "فواتير (كهرباء، ماء، إنترنت)",
            "مستلزمات مكتبية",
            "صيانة",
            "تسويق وإعلان",
            "نقل وشحن",
            "أخرى",
        ];

        return `
            <form class="expense-form">
                <div class="form-group">
                    <label class="form-label">الوصف *</label>
                    <input type="text" class="form-input" name="description" value="${expense.description || ""}" required>
                </div>

                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label">الفئة *</label>
                        <select class="form-select" name="category" required>
                            <option value="">اختر الفئة</option>
                            ${categories.map(
                                (cat) =>
                                    `<option value="${cat}" ${expense.category === cat ? "selected" : ""}>${cat}</option>`
                            ).join("")}
                        </select>
                    </div>
                    <div class="form-col">
                        <label class="form-label">المبلغ *</label>
                        <input type="number" class="form-input" name="amount" step="0.01" value="${expense.amount || ""}" required>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label">التاريخ *</label>
                        <input type="date" class="form-input" name="date" value="${expense.date || new Date().toISOString().split("T")[0]}" required>
                    </div>
                    <div class="form-col">
                        <label class="form-label">طريقة الدفع</label>
                        <select class="form-select" name="paymentMethod">
                            <option value="نقدي" ${expense.paymentMethod === "نقدي" ? "selected" : ""}>نقدي</option>
                            <option value="تحويل بنكي" ${expense.paymentMethod === "تحويل بنكي" ? "selected" : ""}>تحويل بنكي</option>
                            <option value="شيك" ${expense.paymentMethod === "شيك" ? "selected" : ""}>شيك</option>
                            <option value="بطاقة ائتمان" ${expense.paymentMethod === "بطاقة ائتمان" ? "selected" : ""}>بطاقة ائتمان</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">الحالة</label>
                    <select class="form-select" name="status">
                        <option value="مدفوعة" ${expense.status === "مدفوعة" ? "selected" : ""}>مدفوعة</option>
                        <option value="مستحقة" ${expense.status === "مستحقة" ? "selected" : ""}>مستحقة</option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">ملاحظات</label>
                    <textarea class="form-textarea" name="notes" rows="3" placeholder="ملاحظات إضافية...">${expense.notes || ""}</textarea>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-success" onclick="expensesModule.saveExpense()">
                        <i class="fas fa-save"></i>
                        ${this.currentExpense ? "تحديث" : "حفظ"}
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

    bindExpenseFormEvents() {
        // No specific form events for now
    }

    async saveExpense() {
        const form = $$(".expense-form");
        const formData = new FormData(form);

        const expenseData = {
            description: formData.get("description"),
            category: formData.get("category"),
            amount: parseFloat(formData.get("amount")) || 0,
            date: formData.get("date"),
            paymentMethod: formData.get("paymentMethod"),
            status: formData.get("status"),
            notes: formData.get("notes"),
        };

        // Validation
        if (!expenseData.description || !expenseData.category || !expenseData.amount || !expenseData.date) {
            toast.error("يرجى ملء جميع الحقول المطلوبة");
            return;
        }

        try {
            loading.show("save-expense");

            let response;
            if (this.currentExpense) {
                response = await api.updateExpense(this.currentExpense.id, expenseData);
            } else {
                response = await api.createExpense(expenseData);
            }

            if (response.success) {
                toast.success(`تم ${this.currentExpense ? "تحديث" : "إضافة"} المصروف بنجاح`);
                modal.hide();
                await this.loadData();
                this.dataTable.updateData(this.expenses);
            } else {
                toast.error(`فشل في ${this.currentExpense ? "تحديث" : "إضافة"} المصروف`);
            }
        } catch (error) {
            console.error("Save expense error:", error);
            toast.error("حدث خطأ في حفظ المصروف");
        } finally {
            loading.hide("save-expense");
        }
    }

    viewExpense(id) {
        const expense = this.expenses.find((e) => e.id === id);
        if (!expense) return;

        const content = `
            <div class="expense-details">
                <div class="expense-header">
                    <h3>مصروف رقم #${expense.id}</h3>
                    <span class="badge ${expense.status === "مدفوعة" ? "badge-success" : "badge-warning"}">
                        ${expense.status}
                    </span>
                </div>
                
                <div class="expense-info-grid">
                    <div class="info-section">
                        <h4>تفاصيل المصروف</h4>
                        <div class="info-item">
                            <label>الوصف:</label>
                            <span>${expense.description}</span>
                        </div>
                        <div class="info-item">
                            <label>الفئة:</label>
                            <span>${expense.category}</span>
                        </div>
                        <div class="info-item">
                            <label>المبلغ:</label>
                            <span>${formatCurrency(expense.amount)}</span>
                        </div>
                        <div class="info-item">
                            <label>التاريخ:</label>
                            <span>${formatDate(expense.date)}</span>
                        </div>
                        <div class="info-item">
                            <label>طريقة الدفع:</label>
                            <span>${expense.paymentMethod}</span>
                        </div>
                    </div>
                </div>
                
                ${expense.notes ? `
                    <div class="expense-notes">
                        <h4>ملاحظات:</h4>
                        <p>${expense.notes}</p>
                    </div>
                ` : ""}
                
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="expensesModule.editExpense(${expense.id}); modal.hide();">
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
            title: "تفاصيل المصروف",
            size: "medium",
        });
    }

    editExpense(id) {
        this.currentExpense = this.expenses.find((e) => e.id === id);
        if (!this.currentExpense) return;

        const content = this.renderExpenseForm();

        modal.show(content, {
            title: "تعديل المصروف",
            size: "medium",
        });

        this.bindExpenseFormEvents();
    }

    async markAsPaid(id) {
        const expense = this.expenses.find((e) => e.id === id);
        if (!expense) return;

        const confirmed = await modal.confirm(
            `هل أنت متأكد من وضع المصروف رقم #${expense.id} كمدفوع؟`,
            "تأكيد الدفع"
        );

        if (!confirmed) return;

        try {
            loading.show("mark-paid");
            const response = await api.updateExpense(id, { status: "مدفوعة" });

            if (response.success) {
                toast.success("تم وضع المصروف كمدفوع بنجاح");
                await this.loadData();
                this.dataTable.updateData(this.expenses);
            } else {
                toast.error("فشل في وضع المصروف كمدفوع");
            }
        } catch (error) {
            console.error("Mark as paid error:", error);
            toast.error("حدث خطأ في معالجة الدفع");
        } finally {
            loading.hide("mark-paid");
        }
    }

    async deleteExpense(id) {
        const expense = this.expenses.find((e) => e.id === id);
        if (!expense) return;

        const confirmed = await modal.confirm(
            `هل أنت متأكد من حذف المصروف رقم #${expense.id}؟`,
            "تأكيد الحذف"
        );

        if (!confirmed) return;

        try {
            loading.show("delete-expense");
            const response = await api.deleteExpense(id);

            if (response.success) {
                toast.success("تم حذف المصروف بنجاح");
                await this.loadData();
                this.dataTable.updateData(this.expenses);
            } else {
                toast.error("فشل في حذف المصروف");
            }
        } catch (error) {
            console.error("Delete expense error:", error);
            toast.error("حدث خطأ في حذف المصروف");
        } finally {
            loading.hide("delete-expense");
        }
    }

    importExpenses() {
        toast.info("استيراد المصروفات قيد التطوير");
    }

    exportExpenses() {
        const csvContent = this.generateExpensesCSV();
        downloadFile(csvContent, "expenses.csv", "text/csv");
        toast.success("تم تصدير البيانات بنجاح");
    }

    printExpenses() {
        const printContent = this.generateExpensesPrintContent();
        const printWindow = window.open("", "_blank");
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    }

    // Helper methods
    getTotalExpenses() {
        return this.expenses.reduce((sum, e) => sum + e.amount, 0);
    }

    getPaidExpensesTotal() {
        return this.expenses.filter((e) => e.status === "مدفوعة").reduce((sum, e) => sum + e.amount, 0);
    }

    getDueExpensesTotal() {
        return this.expenses.filter((e) => e.status === "مستحقة").reduce((sum, e) => sum + e.amount, 0);
    }

    getAverageExpenseAmount() {
        if (this.expenses.length === 0) return 0;
        const total = this.getTotalExpenses();
        return total / this.expenses.length;
    }

    generateExpensesCSV() {
        const headers = [
            "الكود",
            "الوصف",
            "الفئة",
            "المبلغ",
            "التاريخ",
            "طريقة الدفع",
            "الحالة",
        ];
        const rows = this.expenses.map((expense) => [
            expense.id,
            expense.description,
            expense.category,
            expense.amount,
            expense.date,
            expense.paymentMethod,
            expense.status,
        ]);

        return [headers, ...rows].map((row) => row.join(",")).join("\n");
    }

    generateExpensesPrintContent() {
        return `
            <html>
                <head>
                    <title>قائمة المصروفات</title>
                    <style>
                        body { font-family: 'Cairo', Arial, sans-serif; direction: rtl; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
                        th { background-color: #f5f5f5; }
                        h1 { text-align: center; color: #333; }
                    </style>
                </head>
                <body>
                    <h1>قائمة المصروفات</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>الكود</th>
                                <th>الوصف</th>
                                <th>الفئة</th>
                                <th>المبلغ</th>
                                <th>التاريخ</th>
                                <th>الحالة</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.expenses.map(
                                (expense) =>
                                    `
                                <tr>
                                    <td>#${expense.id}</td>
                                    <td>${expense.description}</td>
                                    <td>${expense.category}</td>
                                    <td>${formatCurrency(expense.amount)}</td>
                                    <td>${formatDate(expense.date)}</td>
                                    <td>${expense.status}</td>
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

// Export expenses module
window.expensesModule = new Expenses();

