// Main Application Logic

document.addEventListener("DOMContentLoaded", () => {
    // Initialize shared components
    window.toast = new window.components.ToastManager();
    window.modal = new window.components.ModalManager();
    window.loading = new window.components.LoadingManager();
    window.dataTable = window.components.DataTable; // Expose DataTable class globally

    // Initialize API client
    window.api = new MockAPIClient();

    // Theme toggle
    const themeToggle = window.utils.$("theme-toggle");
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            const isDarkMode = document.body.classList.contains("dark-mode");
            localStorage.setItem("theme", isDarkMode ? "dark" : "light");
            toast.info(`تم التبديل إلى الوضع ${isDarkMode ? "المظلم" : "الفاتح"}`);
        });
    }

    // Apply saved theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }

    // Navigation handling
    const navItems = window.utils.$$$(".nav-item");
    const pageContent = window.utils.$("page-content");

    const loadModule = async (moduleName) => {
        loading.show("page");
        try {
            // Initialize module if not already loaded
            const moduleInstance = window[`${moduleName.toLowerCase()}Module`];
            if (moduleInstance && typeof moduleInstance.init === "function") {
                await moduleInstance.init();
            } else {
                // Load default dashboard content if module not found
                if (moduleName.toLowerCase() === 'dashboard') {
                    await loadDashboard();
                } else {
                    throw new Error(`Module ${moduleName} not found or doesn't have init method`);
                }
            }
        } catch (error) {
            console.error(`Error loading module ${moduleName}:`, error);
            pageContent.innerHTML = `<div class="error-message">حدث خطأ أثناء تحميل ${moduleName}.</div>`;
            toast.error(`فشل تحميل ${moduleName}`);
        } finally {
            loading.hide("page");
        }
    };

    // Load dashboard function
    const loadDashboard = async () => {
        try {
            const response = await api.getDashboardStats();
            if (response.success) {
                const { stats, recentSales, lowStockProducts } = response.data;
                
                pageContent.innerHTML = `
                    <div class="dashboard-container">
                        <!-- Stats Cards -->
                        <div class="stats-grid">
                            <div class="stat-card">
                                <div class="stat-icon">
                                    <i class="fas fa-chart-line"></i>
                                </div>
                                <div class="stat-content">
                                    <h3>${window.utils.formatCurrency(stats.totalSales)}</h3>
                                    <p>إجمالي المبيعات</p>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon">
                                    <i class="fas fa-money-bill-wave"></i>
                                </div>
                                <div class="stat-content">
                                    <h3>${window.utils.formatCurrency(stats.totalProfit)}</h3>
                                    <p>إجمالي الأرباح</p>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon">
                                    <i class="fas fa-boxes"></i>
                                </div>
                                <div class="stat-content">
                                    <h3>${window.utils.formatNumber(stats.totalProducts)}</h3>
                                    <p>إجمالي المنتجات</p>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon">
                                    <i class="fas fa-users"></i>
                                </div>
                                <div class="stat-content">
                                    <h3>${window.utils.formatNumber(stats.newCustomers)}</h3>
                                    <p>عملاء جدد</p>
                                </div>
                            </div>
                        </div>

                        <!-- Recent Sales -->
                        <div class="dashboard-section">
                            <h3>المبيعات الأخيرة</h3>
                            <div class="table-container">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th>العميل</th>
                                            <th>المبلغ</th>
                                            <th>التاريخ</th>
                                            <th>الحالة</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${recentSales.map(sale => `
                                            <tr>
                                                <td>${sale.customer}</td>
                                                <td>${window.utils.formatCurrency(sale.amount)}</td>
                                                <td>${window.utils.formatDate(sale.date)}</td>
                                                <td><span class="status ${sale.status === 'مكتملة' ? 'success' : 'warning'}">${sale.status}</span></td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- Low Stock Alert -->
                        <div class="dashboard-section">
                            <h3>تنبيهات المخزون</h3>
                            <div class="alert-list">
                                ${lowStockProducts.map(product => `
                                    <div class="alert-item warning">
                                        <i class="fas fa-exclamation-triangle"></i>
                                        <span>مخزون ${product.name} منخفض (${product.currentStock} متبقي)</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error loading dashboard:', error);
            pageContent.innerHTML = '<div class="error-message">حدث خطأ في تحميل لوحة المعلومات</div>';
        }
    };

    navItems.forEach((navItem) => {
        navItem.addEventListener("click", (e) => {
            e.preventDefault();
            const moduleName = navItem.dataset.module;
            if (moduleName) {
                // Remove active from all nav items
                navItems.forEach(item => item.classList.remove("active"));
                // Add active to clicked nav item
                navItem.classList.add("active");
                loadModule(moduleName);
            }
        });
    });

    // Load dashboard by default
    loadModule("dashboard");

    // Global search functionality
    const searchInput = window.utils.$("global-search-input");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value;
            if (query.length > 2) {
                console.log("Searching for:", query);
                // In a real app, you'd call an API here
            }
        });
    }

    // Notification dropdown
    const notificationBell = window.utils.$("notification-bell");
    const notificationDropdown = window.utils.$("notification-dropdown");
    if (notificationBell && notificationDropdown) {
        notificationBell.addEventListener("click", () => {
            notificationDropdown.classList.toggle("show");
        });
        document.addEventListener("click", (e) => {
            if (!notificationBell.contains(e.target) && !notificationDropdown.contains(e.target)) {
                notificationDropdown.classList.remove("show");
            }
        });
    }

    // User dropdown
    const userAvatar = window.utils.$("user-avatar");
    const userDropdown = window.utils.$("user-dropdown");
    if (userAvatar && userDropdown) {
        userAvatar.addEventListener("click", () => {
            userDropdown.classList.toggle("show");
        });
        document.addEventListener("click", (e) => {
            if (!userAvatar.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.remove("show");
            }
        });
    }

    // FAB (Floating Action Button) - Quick Sale
    const fabButton = window.utils.$("fab-button");
    if (fabButton) {
        fabButton.addEventListener("click", () => {
            toast.info("ميزة البيع السريع ستكون متاحة قريباً");
        });
    }

    // Sidebar toggle
    const sidebarToggle = window.utils.$("sidebar-toggle");
    const sidebar = window.utils.$("sidebar");
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener("click", () => {
            sidebar.classList.toggle("collapsed");
        });
    }

    // Hide loading screen after initialization
    setTimeout(() => {
        loading.hide();
    }, 1000);

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.key === "q") { // Ctrl+Q for Quick Sale
            e.preventDefault();
            toast.info("ميزة البيع السريع ستكون متاحة قريباً");
        }
        if (e.ctrlKey && e.key === "t") { // Ctrl+T for Theme Toggle
            e.preventDefault();
            if (themeToggle) {
                themeToggle.click();
            }
        }
    });
});

