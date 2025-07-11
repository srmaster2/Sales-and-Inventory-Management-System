// Dashboard Module - Fixed Version

class Dashboard {
    constructor() {
        this.charts = {};
        this.stats = {};
        this.refreshInterval = null;
    }

    async init() {
        await this.loadData();
        this.render();
        this.bindEvents();
        this.startAutoRefresh();
    }

    async loadData() {
        try {
            // التحقق من وجود loading module
            if (window.loading) {
                window.loading.show("dashboard");
            }

            // التحقق من وجود api module
            if (!window.api) {
                throw new Error('API module not found');
            }

            const response = await window.api.getDashboardStats();
            
            if (response && response.success) {
                this.stats = response.data.stats || {};
                this.recentSales = response.data.recentSales || [];
                this.lowStockProducts = response.data.lowStockProducts || [];
            } else {
                if (window.toast) {
                    window.toast.error('فشل في تحميل بيانات لوحة المعلومات');
                }
                console.error('Failed to load dashboard data');
            }
        } catch (error) {
            console.error('Dashboard data loading error:', error);
            if (window.toast) {
                window.toast.error('حدث خطأ في تحميل البيانات');
            }
        } finally {
            if (window.loading) {
                window.loading.hide('dashboard');
            }
        }
    }

    render() {
        const content = `
            <div class="dashboard-container">
                <!-- Stats Cards -->
                <div class="stats-grid stagger-animation">
                    ${this.renderStatsCards()}
                </div>

                <!-- Charts and Tables Row -->
                <div class="dashboard-row">
                    <div class="dashboard-col-8">
                        <div class="card">
                            <div class="card-header">
                                <h3 class="card-title">مخطط المبيعات</h3>
                                <div class="card-actions">
                                    <select id="sales-chart-period" class="form-select">
                                        <option value="week">هذا الأسبوع</option>
                                        <option value="month" selected>هذا الشهر</option>
                                        <option value="year">هذا العام</option>
                                    </select>
                                </div>
                            </div>
                            <div class="card-body">
                                <canvas id="sales-chart" width="400" height="200"></canvas>
                            </div>
                        </div>
                    </div>
                    
                    <div class="dashboard-col-4">
                        <div class="card">
                            <div class="card-header">
                                <h3 class="card-title">توزيع المبيعات</h3>
                            </div>
                            <div class="card-body">
                                <canvas id="sales-distribution-chart" width="300" height="300"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Recent Activities Row -->
                <div class="dashboard-row">
                    <div class="dashboard-col-6">
                        <div class="card">
                            <div class="card-header">
                                <h3 class="card-title">المبيعات الأخيرة</h3>
                                <a href="#" class="btn btn-ghost btn-sm" onclick="this.showSalesModule()">
                                    عرض الكل
                                </a>
                            </div>
                            <div class="card-body">
                                ${this.renderRecentSales()}
                            </div>
                        </div>
                    </div>
                    
                    <div class="dashboard-col-6">
                        <div class="card">
                            <div class="card-header">
                                <h3 class="card-title">تنبيهات المخزون</h3>
                                <a href="#" class="btn btn-ghost btn-sm" onclick="this.showInventoryModule()">
                                    عرض الكل
                                </a>
                            </div>
                            <div class="card-body">
                                ${this.renderLowStockAlerts()}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="quick-actions">
                    <h3>إجراءات سريعة</h3>
                    <div class="quick-actions-grid">
                        <button class="quick-action-btn" onclick="window.dashboardModule.showAddSale()">
                            <i class="fas fa-plus-circle"></i>
                            <span>بيع جديد</span>
                        </button>
                        <button class="quick-action-btn" onclick="window.dashboardModule.showAddProduct()">
                            <i class="fas fa-box"></i>
                            <span>منتج جديد</span>
                        </button>
                        <button class="quick-action-btn" onclick="window.dashboardModule.showAddCustomer()">
                            <i class="fas fa-user-plus"></i>
                            <span>عميل جديد</span>
                        </button>
                        <button class="quick-action-btn" onclick="window.dashboardModule.showReports()">
                            <i class="fas fa-chart-line"></i>
                            <span>التقارير</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // استخدام طريقة آمنة للوصول للعنصر
        const pageContent = document.getElementById('page-content');
        if (pageContent) {
            pageContent.innerHTML = content;
        } else {
            console.error('Page content element not found');
            return;
        }
        
        // Initialize charts after DOM is ready
        setTimeout(() => {
            this.initCharts();
        }, 100);
    }

    renderStatsCards() {
        const cards = [
            {
                title: 'إجمالي المبيعات',
                value: this.formatCurrency(this.stats.totalSales || 0),
                change: `+${this.stats.salesGrowth || 0}%`,
                changeType: 'positive',
                icon: 'fas fa-chart-line',
                color: 'primary'
            },
            {
                title: 'صافي الربح',
                value: this.formatCurrency(this.stats.totalProfit || 0),
                change: `${this.stats.profitMargin || 0}%`,
                changeType: 'positive',
                icon: 'fas fa-money-bill-wave',
                color: 'success'
            },
            {
                title: 'المنتجات المباعة',
                value: this.formatNumber(this.stats.totalProducts || 0),
                change: '+15 اليوم',
                changeType: 'positive',
                icon: 'fas fa-boxes',
                color: 'warning'
            },
            {
                title: 'العملاء الجدد',
                value: this.formatNumber(this.stats.newCustomers || 0),
                change: '+5 هذا الأسبوع',
                changeType: 'positive',
                icon: 'fas fa-users',
                color: 'info'
            }
        ];

        return cards.map(card => `
            <div class="stat-card ${card.color}">
                <div class="stat-header">
                    <span class="stat-title">${card.title}</span>
                    <div class="stat-icon ${card.color}">
                        <i class="${card.icon}"></i>
                    </div>
                </div>
                <div class="stat-value counter">${card.value}</div>
                <div class="stat-change ${card.changeType}">
                    <i class="fas fa-arrow-up"></i>
                    ${card.change}
                </div>
            </div>
        `).join('');
    }

    renderRecentSales() {
        if (!this.recentSales || this.recentSales.length === 0) {
            return '<p class="text-muted">لا توجد مبيعات حديثة</p>';
        }

        return `
            <div class="recent-sales-list">
                ${this.recentSales.map(sale => `
                    <div class="recent-sale-item">
                        <div class="sale-info">
                            <div class="sale-customer">${sale.customer || 'غير محدد'}</div>
                            <div class="sale-time">${this.formatRelativeTime(sale.date)}</div>
                        </div>
                        <div class="sale-amount">${this.formatCurrency(sale.amount || 0)}</div>
                        <div class="sale-status">
                            <span class="badge ${sale.status === 'مكتملة' ? 'badge-success' : 'badge-warning'}">
                                ${sale.status || 'غير محدد'}
                            </span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderLowStockAlerts() {
        if (!this.lowStockProducts || this.lowStockProducts.length === 0) {
            return '<p class="text-success">جميع المنتجات متوفرة بكميات كافية</p>';
        }

        return `
            <div class="low-stock-list">
                ${this.lowStockProducts.map(product => `
                    <div class="low-stock-item">
                        <div class="product-info">
                            <div class="product-name">${product.name || 'غير محدد'}</div>
                            <div class="stock-info">
                                <span class="current-stock">${product.currentStock || 0}</span>
                                /
                                <span class="min-stock">${product.minStock || 0}</span>
                            </div>
                        </div>
                        <div class="stock-progress">
                            <div class="progress">
                                <div class="progress-bar danger" 
                                     style="width: ${this.calculateProgressWidth(product.currentStock, product.minStock)}%">
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    initCharts() {
        // التحقق من وجود Chart.js
        if (typeof Chart === 'undefined') {
            console.error('Chart.js library not found');
            return;
        }

        this.initSalesChart();
        this.initSalesDistributionChart();
    }

    initSalesChart() {
        const ctx = document.getElementById('sales-chart');
        if (!ctx) {
            console.error('Sales chart canvas not found');
            return;
        }

        // Sample data - replace with real data
        const data = {
            labels: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
            datasets: [{
                label: 'المبيعات',
                data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true
            }]
        };

        this.charts.sales = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => {
                                return this.formatCurrency(value);
                            }
                        }
                    }
                },
                elements: {
                    point: {
                        radius: 6,
                        hoverRadius: 8
                    }
                }
            }
        });
    }

    initSalesDistributionChart() {
        const ctx = document.getElementById('sales-distribution-chart');
        if (!ctx) {
            console.error('Sales distribution chart canvas not found');
            return;
        }

        const data = {
            labels: ['أجهزة كمبيوتر', 'ملحقات', 'شاشات', 'أخرى'],
            datasets: [{
                data: [45, 25, 20, 10],
                backgroundColor: [
                    'rgb(59, 130, 246)',
                    'rgb(16, 185, 129)',
                    'rgb(245, 158, 11)',
                    'rgb(239, 68, 68)'
                ],
                borderWidth: 0
            }]
        };

        this.charts.distribution = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    bindEvents() {
        // Chart period change
        const periodSelect = document.getElementById('sales-chart-period');
        if (periodSelect) {
            periodSelect.addEventListener('change', () => {
                this.updateSalesChart(periodSelect.value);
            });
        }
    }

    updateSalesChart(period) {
        // Update chart data based on period
        // This would typically fetch new data from the API
        if (window.toast) {
            window.toast.info(`تم تحديث المخطط للفترة: ${period}`);
        }
    }

    startAutoRefresh() {
        // Refresh dashboard data every 5 minutes
        this.refreshInterval = setInterval(() => {
            this.loadData();
        }, 5 * 60 * 1000);
    }

    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }

    destroy() {
        this.stopAutoRefresh();
        
        // Destroy charts
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        this.charts = {};
    }

    // Helper Methods
    formatCurrency(amount) {
        if (window.utils && window.utils.formatCurrency) {
            return window.utils.formatCurrency(amount);
        }
        return new Intl.NumberFormat('ar-EG', {
            style: 'currency',
            currency: 'EGP'
        }).format(amount);
    }

    formatNumber(number) {
        if (window.utils && window.utils.formatNumber) {
            return window.utils.formatNumber(number);
        }
        return new Intl.NumberFormat('ar-EG').format(number);
    }

    formatRelativeTime(date) {
        if (window.utils && window.utils.formatRelativeTime) {
            return window.utils.formatRelativeTime(date);
        }
        // Simple fallback
        return new Date(date).toLocaleDateString('ar-EG');
    }

    calculateProgressWidth(current, min) {
        if (!min || min === 0) return 0;
        return Math.min((current / min) * 100, 100);
    }

    // Navigation methods
    showSalesModule() {
        if (window.app && window.app.showModule) {
            window.app.showModule('sales');
        }
    }

    showInventoryModule() {
        if (window.app && window.app.showModule) {
            window.app.showModule('inventory');
        }
    }

    showAddSale() {
        if (window.app && window.app.showModule) {
            window.app.showModule('sales');
            if (window.salesModule && window.salesModule.showAddSaleModal) {
                window.salesModule.showAddSaleModal();
            }
        }
    }

    showAddProduct() {
        if (window.app && window.app.showModule) {
            window.app.showModule('inventory');
            if (window.inventoryModule && window.inventoryModule.showAddProductModal) {
                window.inventoryModule.showAddProductModal();
            }
        }
    }

    showAddCustomer() {
        if (window.app && window.app.showModule) {
            window.app.showModule('customers');
            if (window.customersModule && window.customersModule.showAddCustomerModal) {
                window.customersModule.showAddCustomerModal();
            }
        }
    }

    showReports() {
        if (window.app && window.app.showModule) {
            window.app.showModule('reports');
        }
    }
}

// Export dashboard module
window.dashboardModule = new Dashboard();
