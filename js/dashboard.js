// Dashboard Module
const Dashboard = {
    charts: {},

    // Load dashboard
    load() {
        this.render();
        this.loadStats();
        this.loadCharts();
        this.loadRecentActivities();
        this.loadAlerts();
    },

    // Render dashboard HTML
    render() {
        const dashboardSection = document.getElementById('dashboard');
        dashboardSection.innerHTML = `
            <div class="page-header">
                <div class="page-title">
                    <h2>لوحة التحكم</h2>
                    <p>نظرة شاملة على أداء متجرك</p>
                </div>
                <div class="page-actions">
                    <button class="btn btn-primary" onclick="Dashboard.refreshData()">
                        <i class="fas fa-sync"></i>
                        تحديث البيانات
                    </button>
                </div>
            </div>

            <!-- Quick Stats -->
            <div class="stats-grid">
                <div class="stat-card revenue">
                    <div class="stat-header">
                        <div class="stat-icon">
                            <i class="fas fa-money-bill-wave"></i>
                        </div>
                        <div class="stat-menu">
                            <i class="fas fa-ellipsis-v"></i>
                        </div>
                    </div>
                    <div class="stat-content">
                        <h3>إجمالي المبيعات</h3>
                        <p class="stat-value" id="totalSales">0 ج.م</p>
                        <div class="stat-change positive">
                            <i class="fas fa-arrow-up"></i>
                            <span id="salesChange">+0%</span>
                            <small>من الشهر الماضي</small>
                        </div>
                    </div>
                </div>

                <div class="stat-card profit">
                    <div class="stat-header">
                        <div class="stat-icon">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <div class="stat-menu">
                            <i class="fas fa-ellipsis-v"></i>
                        </div>
                    </div>
                    <div class="stat-content">
                        <h3>صافي الربح</h3>
                        <p class="stat-value" id="totalProfit">0 ج.م</p>
                        <div class="stat-change positive">
                            <i class="fas fa-arrow-up"></i>
                            <span id="profitChange">+0%</span>
                            <small>من الشهر الماضي</small>
                        </div>
                    </div>
                </div>

                <div class="stat-card expenses">
                    <div class="stat-header">
                        <div class="stat-icon">
                            <i class="fas fa-receipt"></i>
                        </div>
                        <div class="stat-menu">
                            <i class="fas fa-ellipsis-v"></i>
                        </div>
                    </div>
                    <div class="stat-content">
                        <h3>المصروفات</h3>
                        <p class="stat-value" id="totalExpenses">0 ج.م</p>
                        <div class="stat-change negative">
                            <i class="fas fa-arrow-down"></i>
                            <span id="expensesChange">-0%</span>
                            <small>من الشهر الماضي</small>
                        </div>
                    </div>
                </div>

                <div class="stat-card products">
                    <div class="stat-header">
                        <div class="stat-icon">
                            <i class="fas fa-boxes"></i>
                        </div>
                        <div class="stat-menu">
                            <i class="fas fa-ellipsis-v"></i>
                        </div>
                    </div>
                    <div class="stat-content">
                        <h3>المنتجات</h3>
                        <p class="stat-value" id="totalProducts">0</p>
                        <div class="stat-change neutral">
                            <i class="fas fa-plus"></i>
                            <span id="productsChange">+0</span>
                            <small>منتجات جديدة</small>
                        </div>
                    </div>
                    <div class="stat-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" id="stockProgress" style="width: 0%"></div>
                        </div>
                        <span id="stockPercentage">0% متوفر</span>
                    </div>
                </div>
            </div>

            <!-- Charts Section -->
            <div class="charts-section">
                <div class="chart-container main-chart">
                    <div class="chart-header">
                        <h3>تطور المبيعات والأرباح</h3>
                        <div class="chart-controls">
                            <div class="time-filter">
                                <button class="time-btn active" data-period="week">أسبوع</button>
                                <button class="time-btn" data-period="month">شهر</button>
                                <button class="time-btn" data-period="year">سنة</button>
                            </div>
                        </div>
                    </div>
                    <div class="chart-content">
                        <canvas id="mainChart"></canvas>
                    </div>
                </div>

                <div class="chart-container side-chart">
                    <div class="chart-header">
                        <h3>توزيع المبيعات</h3>
                        <div class="chart-legend">
                            <div class="legend-item">
                                <span class="legend-color" style="background: #3b82f6;"></span>
                                <span>تجزئة</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-color" style="background: #10b981;"></span>
                                <span>جملة</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-color" style="background: #f59e0b;"></span>
                                <span>نصف جملة</span>
                            </div>
                        </div>
                    </div>
                    <div class="chart-content">
                        <canvas id="distributionChart"></canvas>
                    </div>
                </div>
            </div>

            <!-- Recent Activities & Alerts -->
            <div class="dashboard-bottom">
                <div class="activity-panel">
                    <div class="panel-header">
                        <h3>الأنشطة الأخيرة</h3>
                        <button class="view-all" onclick="App.switchSection('sales')">عرض الكل</button>
                    </div>
                    <div class="activity-list" id="recentActivities">
                        <!-- Activities will be loaded here -->
                    </div>
                </div>

                <div class="alerts-panel">
                    <div class="panel-header">
                        <h3>التنبيهات المهمة</h3>
                        <span class="alert-count" id="alertCount">0</span>
                    </div>
                    <div class="alerts-list" id="alertsList">
                        <!-- Alerts will be loaded here -->
                    </div>
                </div>
            </div>
        `;

        // Setup chart controls
        this.setupChartControls();
    },

    // Setup chart controls
    setupChartControls() {
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.updateMainChart(btn.dataset.period);
            });
        });
    },

    // Load statistics
    loadStats() {
        const today = new Date();
        const thisMonth = today.getMonth();
        const thisYear = today.getFullYear();

        // Calculate totals
        const totalSales = App.data.sales
            .filter(sale => new Date(sale.date).getMonth() === thisMonth)
            .reduce((sum, sale) => sum + sale.totalAmount, 0);

        const totalExpenses = App.data.expenses
            .filter(expense => new Date(expense.date).getMonth() === thisMonth)
            .reduce((sum, expense) => sum + expense.amount, 0);

        const totalProfit = totalSales - totalExpenses;
        const totalProducts = App.data.products.length;

        // Calculate stock percentage
        const totalStock = App.data.products.reduce((sum, product) => sum + product.currentStock, 0);
        const totalCapacity = App.data.products.reduce((sum, product) => sum + (product.currentStock + product.minStock), 0);
        const stockPercentage = totalCapacity > 0 ? Math.round((totalStock / totalCapacity) * 100) : 0;

        // Update DOM
        document.getElementById('totalSales').textContent = App.formatCurrency(totalSales);
        document.getElementById('totalProfit').textContent = App.formatCurrency(totalProfit);
        document.getElementById('totalExpenses').textContent = App.formatCurrency(totalExpenses);
        document.getElementById('totalProducts').textContent = totalProducts;
        document.getElementById('stockProgress').style.width = `${stockPercentage}%`;
        document.getElementById('stockPercentage').textContent = `${stockPercentage}% متوفر`;

        // Calculate changes (mock data for now)
        document.getElementById('salesChange').textContent = '+12.5%';
        document.getElementById('profitChange').textContent = '+8.3%';
        document.getElementById('expensesChange').textContent = '-5.2%';
        document.getElementById('productsChange').textContent = '+3';
    },

    // Load charts
    loadCharts() {
        this.loadMainChart();
        this.loadDistributionChart();
    },

    // Load main chart
    loadMainChart() {
        const ctx = document.getElementById('mainChart');
        if (!ctx) return;

        if (this.charts.main) {
            this.charts.main.destroy();
        }

        const data = this.generateChartData('week');
        
        this.charts.main = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'المبيعات',
                        data: data.sales,
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'الأرباح',
                        data: data.profits,
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end',
                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            callback: function(value) {
                                return App.formatCurrency(value);
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    },

    // Load distribution chart
    loadDistributionChart() {
        const ctx = document.getElementById('distributionChart');
        if (!ctx) return;

        if (this.charts.distribution) {
            this.charts.distribution.destroy();
        }

        const customerTypes = ['retail', 'wholesale', 'semi-wholesale'];
        const typeLabels = ['تجزئة', 'جملة', 'نصف جملة'];
        const data = customerTypes.map(type => {
            return App.data.sales
                .filter(sale => {
                    const customer = App.data.customers.find(c => c.id === sale.customerId);
                    return customer && customer.type === type;
                })
                .reduce((sum, sale) => sum + sale.totalAmount, 0);
        });

        this.charts.distribution = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: typeLabels,
                datasets: [{
                    data: data,
                    backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
                    borderWidth: 0,
                    cutout: '60%'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    },

    // Update main chart
    updateMainChart(period) {
        if (!this.charts.main) return;

        const data = this.generateChartData(period);
        this.charts.main.data.labels = data.labels;
        this.charts.main.data.datasets[0].data = data.sales;
        this.charts.main.data.datasets[1].data = data.profits;
        this.charts.main.update();
    },

    // Generate chart data
    generateChartData(period) {
        const now = new Date();
        let labels = [];
        let salesData = [];
        let profitsData = [];

        switch(period) {
            case 'week':
                for (let i = 6; i >= 0; i--) {
                    const date = new Date(now);
                    date.setDate(date.getDate() - i);
                    labels.push(date.toLocaleDateString('ar-EG', { weekday: 'short' }));
                    
                    // Generate sample data based on actual sales
                    const dayStart = new Date(date);
                    dayStart.setHours(0, 0, 0, 0);
                    const dayEnd = new Date(date);
                    dayEnd.setHours(23, 59, 59, 999);
                    
                    const daySales = App.data.sales
                        .filter(sale => {
                            const saleDate = new Date(sale.date);
                            return saleDate >= dayStart && saleDate <= dayEnd;
                        })
                        .reduce((sum, sale) => sum + sale.totalAmount, 0);
                    
                    salesData.push(daySales || Math.floor(Math.random() * 2000) + 500);
                    profitsData.push((daySales || Math.floor(Math.random() * 2000) + 500) * 0.3);
                }
                break;
            case 'month':
                for (let i = 29; i >= 0; i--) {
                    const date = new Date(now);
                    date.setDate(date.getDate() - i);
                    labels.push(date.getDate().toString());
                    
                    salesData.push(Math.floor(Math.random() * 3000) + 1000);
                    profitsData.push(Math.floor(Math.random() * 1000) + 300);
                }
                break;
            case 'year':
                const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
                              'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
                labels = months;
                salesData = months.map(() => Math.floor(Math.random() * 30000) + 10000);
                profitsData = months.map(() => Math.floor(Math.random() * 10000) + 3000);
                break;
        }

        return { labels, sales: salesData, profits: profitsData };
    },

    // Load recent activities
    loadRecentActivities() {
        const activitiesContainer = document.getElementById('recentActivities');
        if (!activitiesContainer) return;

        const recentSales = App.data.sales
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        let activitiesHTML = '';
        
        if (recentSales.length === 0) {
            activitiesHTML = '<div class="no-data">لا توجد أنشطة حديثة</div>';
        } else {
            recentSales.forEach(sale => {
                const customer = App.data.customers.find(c => c.id === sale.customerId);
                const timeAgo = App.getTimeAgo(new Date(sale.date));
                
                activitiesHTML += `
                    <div class="activity-item">
                        <div class="activity-icon sale">
                            <i class="fas fa-shopping-cart"></i>
                        </div>
                        <div class="activity-content">
                            <h4>بيع جديد</h4>
                            <p>فاتورة #${sale.id} - ${customer?.name || 'عميل'} - ${App.formatCurrency(sale.totalAmount)}</p>
                            <span class="activity-time">${timeAgo}</span>
                        </div>
                    </div>
                `;
            });
        }

        activitiesContainer.innerHTML = activitiesHTML;
    },

    // Load alerts
    loadAlerts() {
        const alertsContainer = document.getElementById('alertsList');
        const alertCount = document.getElementById('alertCount');
        if (!alertsContainer) return;

        let alertsHTML = '';
        let totalAlerts = 0;
        
        // Low stock alerts
        const lowStockProducts = App.data.products.filter(p => p.currentStock <= p.minStock);
        if (lowStockProducts.length > 0) {
            totalAlerts++;
            alertsHTML += `
                <div class="alert-item critical">
                    <div class="alert-icon">
                        <i class="fas fa-exclamation-circle"></i>
                    </div>
                    <div class="alert-content">
                        <h4>منتجات قاربت على النفاد</h4>
                        <p>${lowStockProducts.length} منتجات تحتاج إعادة تموين</p>
                    </div>
                    <button class="alert-action" onclick="App.switchSection('inventory')">عرض</button>
                </div>
            `;
        }

        // Expiring products
        const expiringProducts = App.data.products.filter(p => {
            if (!p.expiryDate) return false;
            const daysUntilExpiry = Math.ceil((new Date(p.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
            return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
        });

        if (expiringProducts.length > 0) {
            totalAlerts++;
            alertsHTML += `
                <div class="alert-item warning">
                    <div class="alert-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="alert-content">
                        <h4>منتجات قاربت على الانتهاء</h4>
                        <p>${expiringProducts.length} منتجات تنتهي صلاحيتها خلال 30 يوم</p>
                    </div>
                    <button class="alert-action" onclick="App.switchSection('inventory')">متابعة</button>
                </div>
            `;
        }

        // Unpaid sales
        const unpaidSales = App.data.sales.filter(sale => !sale.paid);
        if (unpaidSales.length > 0) {
            totalAlerts++;
            const unpaidAmount = unpaidSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
            alertsHTML += `
                <div class="alert-item info">
                    <div class="alert-icon">
                        <i class="fas fa-money-bill"></i>
                    </div>
                    <div class="alert-content">
                        <h4>مبيعات غير مدفوعة</h4>
                        <p>${unpaidSales.length} فاتورة بقيمة ${App.formatCurrency(unpaidAmount)}</p>
                    </div>
                    <button class="alert-action" onclick="App.switchSection('sales')">متابعة</button>
                </div>
            `;
        }

        if (totalAlerts === 0) {
            alertsHTML = '<div class="no-data">لا توجد تنبيهات</div>';
        }

        alertsContainer.innerHTML = alertsHTML;
        alertCount.textContent = totalAlerts;
        
        if (totalAlerts === 0) {
            alertCount.style.display = 'none';
        } else {
            alertCount.style.display = 'block';
        }
    },

    // Refresh data
    refreshData() {
        this.loadStats();
        this.loadCharts();
        this.loadRecentActivities();
        this.loadAlerts();
        Navigation.updateBadges();
        
        // Show success message
        App.addNotification({
            type: 'success',
            title: 'تم التحديث',
            message: 'تم تحديث بيانات لوحة التحكم بنجاح'
        });
    }
};

// Add CSS for dashboard
const dashboardCSS = `
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.stat-card {
    background: var(--bg-primary);
    border-radius: var(--radius-xl);
    padding: 1.5rem;
    box-shadow: var(--shadow-md);
    border: 1px solid var(--border-color);
    position: relative;
    overflow: hidden;
    transition: all var(--transition-normal);
}

.stat-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
}

.stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 4px;
}

.stat-card.revenue::before {
    background: linear-gradient(90deg, var(--primary-500), var(--primary-600));
}

.stat-card.profit::before {
    background: linear-gradient(90deg, var(--success-500), var(--success-600));
}

.stat-card.expenses::before {
    background: linear-gradient(90deg, var(--error-500), var(--error-600));
}

.stat-card.products::before {
    background: linear-gradient(90deg, var(--warning-500), var(--warning-600));
}

.stat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.stat-icon {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: white;
}

.revenue .stat-icon {
    background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
}

.profit .stat-icon {
    background: linear-gradient(135deg, var(--success-500), var(--success-600));
}

.expenses .stat-icon {
    background: linear-gradient(135deg, var(--error-500), var(--error-600));
}

.products .stat-icon {
    background: linear-gradient(135deg, var(--warning-500), var(--warning-600));
}

.stat-menu {
    color: var(--text-tertiary);
    cursor: pointer;
    padding: 0.5rem;
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
}

.stat-menu:hover {
    background: var(--hover-bg);
    color: var(--text-primary);
}

.stat-content h3 {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-secondary);
    margin-bottom: 0.5rem;
}

.stat-value {
    font-size: 32px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0.75rem;
    line-height: 1;
}

.stat-change {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 14px;
    font-weight: 600;
}

.stat-change.positive {
    color: var(--success-600);
}

.stat-change.negative {
    color: var(--error-600);
}

.stat-change.neutral {
    color: var(--text-tertiary);
}

.stat-change small {
    font-weight: 400;
    color: var(--text-tertiary);
}

.stat-progress {
    margin-top: 1rem;
}

.progress-bar {
    width: 100%;
    height: 6px;
    background: var(--bg-secondary);
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 0.5rem;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--warning-500), var(--warning-600));
    border-radius: 3px;
    transition: width var(--transition-normal);
}

.stat-progress span {
    font-size: 12px;
    color: var(--text-tertiary);
}

.charts-section {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.chart-container {
    background: var(--bg-primary);
    border-radius: var(--radius-xl);
    padding: 1.5rem;
    box-shadow: var(--shadow-md);
    border: 1px solid var(--border-color);
}

.chart-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border-color);
}

.chart-header h3 {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
}

.chart-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.time-filter {
    display: flex;
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
    padding: 2px;
}

.time-btn {
    padding: 0.5rem 1rem;
    border: none;
    background: transparent;
    border-radius: var(--radius-md);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);
    color: var(--text-secondary);
}

.time-btn.active,
.time-btn:hover {
    background: var(--primary-500);
    color: white;
}

.chart-legend {
    display: flex;
    gap: 1rem;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 12px;
    color: var(--text-secondary);
}

.legend-color {
    width: 12px;
    height: 12px;
    border-radius: 2px;
}

.chart-content {
    height: 300px;
    position: relative;
}

.dashboard-bottom {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
}

.activity-panel,
.alerts-panel {
    background: var(--bg-primary);
    border-radius: var(--radius-xl);
    padding: 1.5rem;
    box-shadow: var(--shadow-md);
    border: 1px solid var(--border-color);
}

.panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border-color);
}

.panel-header h3 {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
}

.view-all {
    color: var(--primary-500);
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    transition: color var(--transition-fast);
}

.view-all:hover {
    color: var(--primary-600);
}

.alert-count {
    background: var(--error-500);
    color: white;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 8px;
    border-radius: var(--radius-md);
}

.activity-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
    border-radius: var(--radius-lg);
    margin-bottom: 0.75rem;
    transition: all var(--transition-fast);
}

.activity-item:hover {
    background: var(--hover-bg);
}

.activity-icon {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: white;
    flex-shrink: 0;
}

.activity-icon.sale {
    background: linear-gradient(135deg, var(--success-500), var(--success-600));
}

.activity-content h4 {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
}

.activity-content p {
    font-size: 13px;
    color: var(--text-secondary);
    margin-bottom: 0.25rem;
}

.activity-time {
    font-size: 12px;
    color: var(--text-tertiary);
}

.alert-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
    border-radius: var(--radius-lg);
    margin-bottom: 0.75rem;
    border: 1px solid transparent;
    transition: all var(--transition-fast);
}

.alert-item.critical {
    background: rgba(239, 68, 68, 0.05);
    border-color: rgba(239, 68, 68, 0.2);
}

.alert-item.warning {
    background: rgba(245, 158, 11, 0.05);
    border-color: rgba(245, 158, 11, 0.2);
}

.alert-item.info {
    background: rgba(59, 130, 246, 0.05);
    border-color: rgba(59, 130, 246, 0.2);
}

.alert-icon {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
}

.alert-item.critical .alert-icon {
    background: var(--error-100);
    color: var(--error-600);
}

.alert-item.warning .alert-icon {
    background: var(--warning-100);
    color: var(--warning-600);
}

.alert-item.info .alert-icon {
    background: var(--primary-100);
    color: var(--primary-600);
}

.alert-content {
    flex: 1;
}

.alert-content h4 {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
}

.alert-content p {
    font-size: 13px;
    color: var(--text-secondary);
}

.alert-action {
    padding: 0.5rem 1rem;
    border: 1px solid var(--border-color);
    background: var(--bg-primary);
    border-radius: var(--radius-md);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);
    color: var(--text-secondary);
}

.alert-action:hover {
    background: var(--hover-bg);
    color: var(--text-primary);
}

.no-data {
    text-align: center;
    color: var(--text-tertiary);
    padding: 2rem;
    font-style: italic;
}

@media (max-width: 1024px) {
    .charts-section {
        grid-template-columns: 1fr;
    }
    
    .dashboard-bottom {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .stats-grid {
        grid-template-columns: 1fr;
    }
}
`;

// Add CSS to document
const style = document.createElement('style');
style.textContent = dashboardCSS;
document.head.appendChild(style);