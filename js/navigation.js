// Navigation Module
const Navigation = {
    // Initialize navigation
    init() {
        this.setupEventListeners();
        this.updateActiveSection();
    },

    // Setup event listeners
    setupEventListeners() {
        // Navigation items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                this.navigateToSection(section);
            });
        });

        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            const sidebar = document.getElementById('sidebar');
            const sidebarToggle = document.getElementById('sidebarToggle');
            
            if (window.innerWidth <= 1024 && 
                !sidebar.contains(e.target) && 
                !sidebarToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    },

    // Navigate to section
    navigateToSection(sectionName) {
        // Update URL without page reload
        history.pushState({ section: sectionName }, '', `#${sectionName}`);
        
        // Update active navigation
        this.updateActiveNavigation(sectionName);
        
        // Load section content
        App.switchSection(sectionName);
        
        // Close mobile menu if open
        if (window.innerWidth <= 1024) {
            this.closeMobileMenu();
        }
    },

    // Update active navigation
    updateActiveNavigation(sectionName) {
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Add active class to current section
        const activeItem = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }

        // Update page title
        this.updatePageTitle(sectionName);
    },

    // Update page title
    updatePageTitle(sectionName) {
        const titles = {
            dashboard: 'لوحة التحكم',
            sales: 'المبيعات',
            inventory: 'المخزون',
            customers: 'العملاء',
            suppliers: 'الموردين',
            expenses: 'المصروفات',
            returns: 'المرتجعات',
            reports: 'التقارير',
            invoices: 'الفواتير',
            analytics: 'التحليلات الذكية',
            calendar: 'التقويم',
            settings: 'الإعدادات'
        };

        const title = titles[sectionName] || 'نظام إدارة المبيعات';
        document.title = `${title} - نظام إدارة المبيعات والمخزون`;
    },

    // Update active section based on URL
    updateActiveSection() {
        const hash = window.location.hash.substring(1);
        const section = hash || 'dashboard';
        this.navigateToSection(section);
    },

    // Toggle mobile menu
    toggleMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('open');
    },

    // Close mobile menu
    closeMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.remove('open');
    },

    // Update navigation badges
    updateBadges() {
        // Update sales badge
        const salesBadge = document.querySelector('[data-section="sales"] .nav-badge');
        if (salesBadge) {
            const pendingSales = App.data.sales.filter(sale => !sale.paid).length;
            salesBadge.textContent = pendingSales;
            salesBadge.style.display = pendingSales > 0 ? 'block' : 'none';
        }

        // Update inventory badge (low stock items)
        const inventoryBadge = document.querySelector('[data-section="inventory"] .nav-badge');
        if (inventoryBadge) {
            const lowStockItems = App.data.products.filter(product => 
                product.currentStock <= product.minStock
            ).length;
            inventoryBadge.textContent = lowStockItems;
            inventoryBadge.style.display = lowStockItems > 0 ? 'block' : 'none';
            
            // Add warning class if there are low stock items
            if (lowStockItems > 0) {
                inventoryBadge.classList.add('warning');
            } else {
                inventoryBadge.classList.remove('warning');
            }
        }
    },

    // Breadcrumb navigation
    updateBreadcrumb(items) {
        const breadcrumbContainer = document.getElementById('breadcrumb');
        if (!breadcrumbContainer) return;

        let breadcrumbHTML = '';
        items.forEach((item, index) => {
            if (index > 0) {
                breadcrumbHTML += '<span class="breadcrumb-separator">/</span>';
            }
            
            if (item.link && index < items.length - 1) {
                breadcrumbHTML += `<a href="${item.link}" class="breadcrumb-link">${item.text}</a>`;
            } else {
                breadcrumbHTML += `<span class="breadcrumb-current">${item.text}</span>`;
            }
        });

        breadcrumbContainer.innerHTML = breadcrumbHTML;
    },

    // Quick navigation shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Only trigger if no input is focused
            if (document.activeElement.tagName === 'INPUT' || 
                document.activeElement.tagName === 'TEXTAREA') {
                return;
            }

            // Alt + number keys for quick navigation
            if (e.altKey) {
                const shortcuts = {
                    '1': 'dashboard',
                    '2': 'sales',
                    '3': 'inventory',
                    '4': 'customers',
                    '5': 'suppliers',
                    '6': 'expenses',
                    '7': 'returns',
                    '8': 'reports',
                    '9': 'invoices',
                    '0': 'settings'
                };

                const section = shortcuts[e.key];
                if (section) {
                    e.preventDefault();
                    this.navigateToSection(section);
                }
            }

            // Escape key to close modals/panels
            if (e.key === 'Escape') {
                // Close notification panel
                const notificationPanel = document.getElementById('notificationPanel');
                if (notificationPanel && notificationPanel.classList.contains('open')) {
                    Notifications.close();
                }

                // Close any open modals
                const openModal = document.querySelector('.modal-overlay.open');
                if (openModal) {
                    Modals.close();
                }
            }
        });
    }
};

// Handle browser back/forward buttons
window.addEventListener('popstate', (e) => {
    if (e.state && e.state.section) {
        Navigation.updateActiveNavigation(e.state.section);
        App.loadSection(e.state.section);
    } else {
        Navigation.updateActiveSection();
    }
});

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    Navigation.init();
    Navigation.setupKeyboardShortcuts();
});