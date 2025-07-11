// Global Application State
const App = {
    currentSection: 'dashboard',
    isDarkMode: false,
    sidebarCollapsed: false,
    data: {
        customers: [],
        suppliers: [],
        products: [],
        sales: [],
        expenses: [],
        returns: [],
        notifications: []
    },
    charts: {},
    
    // Initialize the application
    init() {
        this.loadTheme();
        this.loadData();
        this.setupEventListeners();
        this.loadSection('dashboard');
        this.updateNotificationCount();
        console.log('تم تحميل النظام بنجاح');
    },

    // Load theme from localStorage
    loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.isDarkMode = savedTheme === 'dark';
            document.body.className = this.isDarkMode ? 'dark-theme' : 'light-theme';
            this.updateThemeIcon();
        }
    },

    // Load data from localStorage or create sample data
    loadData() {
        const savedData = localStorage.getItem('salesSystemData');
        if (savedData) {
            this.data = JSON.parse(savedData);
        } else {
            this.createSampleData();
            this.saveData();
        }
    },

    // Save data to localStorage
    saveData() {
        localStorage.setItem('salesSystemData', JSON.stringify(this.data));
    },

    // Create sample data
    createSampleData() {
        this.data = {
            customers: [
                {
                    id: 'CUST001',
                    name: 'أحمد محمد علي',
                    phone: '01234567890',
                    email: 'ahmed@example.com',
                    type: 'retail',
                    balance: 0,
                    createdAt: '2024-01-15'
                },
                {
                    id: 'CUST002',
                    name: 'فاطمة حسن',
                    phone: '01234567891',
                    email: 'fatma@example.com',
                    type: 'wholesale',
                    balance: -500,
                    createdAt: '2024-01-10'
                },
                {
                    id: 'CUST003',
                    name: 'محمد أحمد',
                    phone: '01234567892',
                    type: 'semi-wholesale',
                    balance: 200,
                    createdAt: '2024-01-20'
                }
            ],
            suppliers: [
                {
                    id: 'SUPP001',
                    name: 'شركة النور للمواد الغذائية',
                    phone: '01234567893',
                    email: 'info@alnoor.com',
                    rating: 5,
                    createdAt: '2024-01-01'
                },
                {
                    id: 'SUPP002',
                    name: 'مؤسسة الأمل التجارية',
                    phone: '01234567894',
                    email: 'contact@alamal.com',
                    rating: 4,
                    createdAt: '2024-01-05'
                }
            ],
            products: [
                {
                    id: 'PROD001',
                    name: 'شامبو هيد آند شولدرز',
                    category: 'العناية الشخصية',
                    barcode: '1234567890123',
                    purchasePrice: 30,
                    sellingPrice: 45,
                    currentStock: 25,
                    minStock: 10,
                    supplierId: 'SUPP001',
                    expiryDate: '2025-12-31',
                    createdAt: '2024-01-15'
                },
                {
                    id: 'PROD002',
                    name: 'معجون أسنان كولجيت',
                    category: 'العناية الشخصية',
                    barcode: '1234567890124',
                    purchasePrice: 20,
                    sellingPrice: 30,
                    currentStock: 50,
                    minStock: 15,
                    supplierId: 'SUPP001',
                    expiryDate: '2025-06-30',
                    createdAt: '2024-01-16'
                },
                {
                    id: 'PROD003',
                    name: 'صابون لوكس',
                    category: 'العناية الشخصية',
                    barcode: '1234567890125',
                    purchasePrice: 15,
                    sellingPrice: 25,
                    currentStock: 8,
                    minStock: 20,
                    supplierId: 'SUPP002',
                    expiryDate: '2025-03-15',
                    createdAt: '2024-01-17'
                }
            ],
            sales: [
                {
                    id: 'SALE001',
                    customerId: 'CUST001',
                    customerName: 'أحمد محمد علي',
                    items: [
                        {
                            productId: 'PROD001',
                            productName: 'شامبو هيد آند شولدرز',
                            quantity: 2,
                            price: 45,
                            total: 90
                        }
                    ],
                    totalAmount: 90,
                    date: '2024-01-20',
                    paid: true
                },
                {
                    id: 'SALE002',
                    customerId: 'CUST002',
                    customerName: 'فاطمة حسن',
                    items: [
                        {
                            productId: 'PROD002',
                            productName: 'معجون أسنان كولجيت',
                            quantity: 5,
                            price: 30,
                            total: 150
                        }
                    ],
                    totalAmount: 150,
                    date: '2024-01-21',
                    paid: false
                }
            ],
            expenses: [
                {
                    id: 'EXP001',
                    category: 'transport',
                    amount: 200,
                    description: 'نقل البضائع من المورد',
                    date: '2024-01-20'
                },
                {
                    id: 'EXP002',
                    category: 'packaging',
                    amount: 150,
                    description: 'أكياس وعلب تغليف',
                    date: '2024-01-19'
                }
            ],
            returns: [
                {
                    id: 'RET001',
                    saleId: 'SALE001',
                    productId: 'PROD001',
                    quantity: 1,
                    reason: 'منتج معيب',
                    date: '2024-01-22',
                    status: 'approved'
                }
            ],
            notifications: [
                {
                    id: 'NOT001',
                    type: 'warning',
                    title: 'تنبيه مخزون',
                    message: 'منتج "صابون لوكس" قارب على النفاد',
                    timestamp: new Date().toISOString(),
                    read: false
                },
                {
                    id: 'NOT002',
                    type: 'info',
                    title: 'بيع جديد',
                    message: 'تم إتمام بيع بقيمة 150 ج.م',
                    timestamp: new Date().toISOString(),
                    read: false
                },
                {
                    id: 'NOT003',
                    type: 'success',
                    title: 'تحديث المخزون',
                    message: 'تم إضافة 50 قطعة من شامبو هيد آند شولدرز',
                    timestamp: new Date().toISOString(),
                    read: true
                }
            ]
        };
    },

    // Setup event listeners
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const section = item.dataset.section;
                this.switchSection(section);
            });
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Sidebar toggle
        document.getElementById('sidebarToggle').addEventListener('click', () => {
            this.toggleSidebar();
        });

        // Notifications
        document.getElementById('notificationBtn').addEventListener('click', () => {
            Notifications.toggle();
        });

        // Global search
        document.getElementById('globalSearch').addEventListener('input', (e) => {
            this.globalSearch(e.target.value);
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    },

    // Switch between sections
    switchSection(sectionName) {
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Update content sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionName).classList.add('active');

        this.currentSection = sectionName;
        this.loadSection(sectionName);
    },

    // Load section content
    loadSection(section) {
        switch(section) {
            case 'dashboard':
                Dashboard.load();
                break;
            case 'sales':
                Sales.load();
                break;
            case 'inventory':
                Inventory.load();
                break;
            case 'customers':
                Customers.load();
                break;
            case 'suppliers':
                Suppliers.load();
                break;
            case 'expenses':
                Expenses.load();
                break;
            case 'returns':
                Returns.load();
                break;
            case 'reports':
                Reports.load();
                break;
            case 'invoices':
                Invoices.load();
                break;
            case 'analytics':
                Analytics.load();
                break;
            case 'calendar':
                Calendar.load();
                break;
            case 'settings':
                Settings.load();
                break;
        }
    },

    // Toggle theme
    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        document.body.className = this.isDarkMode ? 'dark-theme' : 'light-theme';
        localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
        this.updateThemeIcon();
    },

    // Update theme icon
    updateThemeIcon() {
        const icon = document.querySelector('#themeToggle i');
        icon.className = this.isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
    },

    // Toggle sidebar
    toggleSidebar() {
        this.sidebarCollapsed = !this.sidebarCollapsed;
        const sidebar = document.getElementById('sidebar');
        
        if (this.sidebarCollapsed) {
            sidebar.classList.add('collapsed');
        } else {
            sidebar.classList.remove('collapsed');
        }
    },

    // Global search
    globalSearch(query) {
        if (!query) return;
        
        // Search in products, customers, sales, etc.
        const results = [];
        
        // Search products
        this.data.products.forEach(product => {
            if (product.name.includes(query) || product.barcode.includes(query)) {
                results.push({
                    type: 'product',
                    item: product,
                    section: 'inventory'
                });
            }
        });

        // Search customers
        this.data.customers.forEach(customer => {
            if (customer.name.includes(query) || customer.phone.includes(query)) {
                results.push({
                    type: 'customer',
                    item: customer,
                    section: 'customers'
                });
            }
        });

        // Show search results
        this.showSearchResults(results);
    },

    // Show search results
    showSearchResults(results) {
        // Implementation for showing search results
        console.log('نتائج البحث:', results);
    },

    // Handle window resize
    handleResize() {
        const width = window.innerWidth;
        const sidebar = document.getElementById('sidebar');

        if (width <= 1024) {
            sidebar.classList.remove('open');
        }
    },

    // Update notification count
    updateNotificationCount() {
        const unreadCount = this.data.notifications.filter(n => !n.read).length;
        document.getElementById('notificationCount').textContent = unreadCount;
        
        if (unreadCount === 0) {
            document.getElementById('notificationCount').style.display = 'none';
        } else {
            document.getElementById('notificationCount').style.display = 'block';
        }
    },

    // Add notification
    addNotification(notification) {
        const newNotification = {
            id: `NOT${String(this.data.notifications.length + 1).padStart(3, '0')}`,
            timestamp: new Date().toISOString(),
            read: false,
            ...notification
        };
        
        this.data.notifications.unshift(newNotification);
        this.saveData();
        this.updateNotificationCount();
        Notifications.render();
    },

    // Utility functions
    formatCurrency(amount) {
        return new Intl.NumberFormat('ar-EG', {
            style: 'currency',
            currency: 'EGP',
            minimumFractionDigits: 0
        }).format(amount);
    },

    formatDate(date) {
        return new Date(date).toLocaleDateString('ar-EG');
    },

    getTimeAgo(date) {
        const now = new Date();
        const diffInMinutes = Math.floor((now - new Date(date)) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'الآن';
        if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        return `منذ ${diffInDays} يوم`;
    },

    // Generate unique ID
    generateId(prefix) {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `${prefix}${timestamp}${random}`;
    }
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});