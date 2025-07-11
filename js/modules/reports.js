// Reports Module

class Reports {
    constructor() {
        this.salesData = [];
        this.expensesData = [];
        this.inventoryData = [];
    }

    async init() {
        await this.loadData();
        this.render();
        this.bindEvents();
    }

    async loadData() {
        try {
            loading.show("reports");
            const salesResponse = await api.getSalesReports();
            if (salesResponse.success) {
                this.salesData = salesResponse.data;
            }

            const expensesResponse = await api.getExpensesReports();
            if (expensesResponse.success) {
                this.expensesData = expensesResponse.data;
            }

            const inventoryResponse = await api.getInventoryReports();
            if (inventoryResponse.success) {
                this.inventoryData = inventoryResponse.data;
            }

        } catch (error) {
            console.error("Reports data loading error:", error);
            toast.error("حدث خطأ في تحميل بيانات التقارير");
        } finally {
            loading.hide("reports");
        }
    }

    render() {
        const content = `
            <div class="reports-container">
                <!-- Header Actions -->
                <div class="module-header">
                    <div class="module-title">
                        <h2>التقارير والتحليلات</h2>
                        <p>تحليلات وإحصائيات شاملة لأداء الأعمال</p>
                    </div>
                    <div class="module-actions">
                        <button class="btn btn-primary" onclick="reportsModule.exportAllReports()">
                            <i class="fas fa-download"></i>
                            تصدير جميع التقارير
                        </button>
                    </div>
                </div>

                <!-- Sales Report -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h3 class="card-title">تقرير المبيعات</h3>
                    </div>
                    <div class="card-body">
                        <div class="chart-container">
                            <canvas id="salesChart"></canvas>
                        </div>
                        <div class="report-summary mt-3">
                            <p>إجمالي المبيعات: <strong>${formatCurrency(this.getTotalSales())}</strong></p>
                            <p>متوسط المبيعات اليومية: <strong>${formatCurrency(this.getAverageDailySales())}</strong></p>
                        </div>
                    </div>
                </div>

                <!-- Expenses Report -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h3 class="card-title">تقرير المصروفات</h3>
                    </div>
                    <div class="card-body">
                        <div class="chart-container">
                            <canvas id="expensesChart"></canvas>
                        </div>
                        <div class="report-summary mt-3">
                            <p>إجمالي المصروفات: <strong>${formatCurrency(this.getTotalExpenses())}</strong></p>
                            <p>أعلى فئة مصروفات: <strong>${this.getTopExpenseCategory()}</strong></p>
                        </div>
                    </div>
                </div>

                <!-- Inventory Report -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h3 class="card-title">تقرير المخزون</h3>
                    </div>
                    <div class="card-body">
                        <div class="chart-container">
                            <canvas id="inventoryChart"></canvas>
                        </div>
                        <div class="report-summary mt-3">
                            <p>إجمالي قيمة المخزون: <strong>${formatCurrency(this.getTotalInventoryValue())}</strong></p>
                            <p>عدد المنتجات منخفضة المخزون: <strong>${this.getLowStockProductsCount()}</strong></p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        $("page-content").innerHTML = content;
        this.renderCharts();
    }

    renderCharts() {
        // Sales Chart
        const salesCtx = $("salesChart").getContext("2d");
        new Chart(salesCtx, {
            type: "line",
            data: {
                labels: this.salesData.map(d => d.date),
                datasets: [{
                    label: "المبيعات اليومية",
                    data: this.salesData.map(d => d.amount),
                    borderColor: "#4CAF50",
                    backgroundColor: "rgba(76, 175, 80, 0.2)",
                    fill: true,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: "المبلغ" }
                    },
                    x: { title: { display: true, text: "التاريخ" } }
                }
            }
        });

        // Expenses Chart
        const expensesCtx = $("expensesChart").getContext("2d");
        const expenseCategories = {};
        this.expensesData.forEach(e => {
            expenseCategories[e.category] = (expenseCategories[e.category] || 0) + e.amount;
        });
        new Chart(expensesCtx, {
            type: "pie",
            data: {
                labels: Object.keys(expenseCategories),
                datasets: [{
                    data: Object.values(expenseCategories),
                    backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#4BC0C0",
                        "#9966FF",
                        "#FF9F40",
                        "#8A2BE2",
                    ],
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            }
        });

        // Inventory Chart
        const inventoryCtx = $("inventoryChart").getContext("2d");
        new Chart(inventoryCtx, {
            type: "bar",
            data: {
                labels: this.inventoryData.map(p => p.name),
                datasets: [{
                    label: "كمية المخزون",
                    data: this.inventoryData.map(p => p.stock),
                    backgroundColor: "#007bff",
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: "الكمية" }
                    },
                    x: { title: { display: true, text: "المنتج" } }
                }
            }
        });
    }

    bindEvents() {
        // No specific events for now
    }

    exportAllReports() {
        toast.info("تصدير جميع التقارير قيد التطوير");
    }

    // Helper methods for calculations
    getTotalSales() {
        return this.salesData.reduce((sum, s) => sum + s.amount, 0);
    }

    getAverageDailySales() {
        if (this.salesData.length === 0) return 0;
        return this.getTotalSales() / this.salesData.length;
    }

    getTotalExpenses() {
        return this.expensesData.reduce((sum, e) => sum + e.amount, 0);
    }

    getTopExpenseCategory() {
        const expenseCategories = {};
        this.expensesData.forEach(e => {
            expenseCategories[e.category] = (expenseCategories[e.category] || 0) + e.amount;
        });
        const sortedCategories = Object.entries(expenseCategories).sort(([, a], [, b]) => b - a);
        return sortedCategories.length > 0 ? sortedCategories[0][0] : "لا توجد بيانات";
    }

    getTotalInventoryValue() {
        return this.inventoryData.reduce((sum, p) => sum + (p.stock * p.price), 0);
    }

    getLowStockProductsCount() {
        return this.inventoryData.filter(p => p.stock < 10).length; // Assuming low stock is < 10
    }
}

// Export reports module
window.reportsModule = new Reports();


