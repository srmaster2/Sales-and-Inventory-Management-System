// Utility Functions

// Format currency
function formatCurrency(amount, currency = 'EGP') {
    return new Intl.NumberFormat('ar-EG', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
    }).format(amount);
}

// Format number
function formatNumber(number) {
    return new Intl.NumberFormat('ar-EG').format(number);
}

// Format date
function formatDate(date, options = {}) {
    const defaultOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return new Intl.DateTimeFormat('ar-EG', { ...defaultOptions, ...options }).format(new Date(date));
}

// Format time
function formatTime(date) {
    return new Intl.DateTimeFormat('ar-EG', {
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
}

// Format relative time
function formatRelativeTime(date) {
    const now = new Date();
    const diff = now - new Date(date);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    if (days < 7) return `منذ ${days} يوم`;
    return formatDate(date);
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Deep clone object
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (typeof obj === 'object') {
        const clonedObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = deepClone(obj[key]);
            }
        }
        return clonedObj;
    }
}

// Validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validate phone
function validatePhone(phone) {
    const re = /^(\+20|0)?1[0-2,5]\d{8}$/;
    return re.test(phone);
}

// Sanitize HTML
function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

// Get element by ID safely
function $(id) {
    return document.getElementById(id);
}

// Query selector
function $$(selector) {
    return document.querySelector(selector);
}

// Query selector all
function $$$(selector) {
    return document.querySelectorAll(selector);
}

// Add event listener
function on(element, event, handler) {
    if (typeof element === 'string') {
        element = $$(element);
    }
    if (element) {
        element.addEventListener(event, handler);
    }
}

// Remove event listener
function off(element, event, handler) {
    if (typeof element === 'string') {
        element = $$(element);
    }
    if (element) {
        element.removeEventListener(event, handler);
    }
}

// Show element
function show(element) {
    if (typeof element === 'string') {
        element = $$(element);
    }
    if (element) {
        element.style.display = '';
        element.classList.remove('hidden');
    }
}

// Hide element
function hide(element) {
    if (typeof element === 'string') {
        element = $$(element);
    }
    if (element) {
        element.style.display = 'none';
        element.classList.add('hidden');
    }
}

// Toggle element visibility
function toggle(element) {
    if (typeof element === 'string') {
        element = $$(element);
    }
    if (element) {
        if (element.style.display === 'none' || element.classList.contains('hidden')) {
            show(element);
        } else {
            hide(element);
        }
    }
}

// Add class
function addClass(element, className) {
    if (typeof element === 'string') {
        element = $$(element);
    }
    if (element) {
        element.classList.add(className);
    }
}

// Remove class
function removeClass(element, className) {
    if (typeof element === 'string') {
        element = $$(element);
    }
    if (element) {
        element.classList.remove(className);
    }
}

// Toggle class
function toggleClass(element, className) {
    if (typeof element === 'string') {
        element = $$(element);
    }
    if (element) {
        element.classList.toggle(className);
    }
}

// Has class
function hasClass(element, className) {
    if (typeof element === 'string') {
        element = $$(element);
    }
    return element ? element.classList.contains(className) : false;
}

// Create element
function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    
    // Set attributes
    Object.keys(attributes).forEach(key => {
        if (key === 'className') {
            element.className = attributes[key];
        } else if (key === 'innerHTML') {
            element.innerHTML = attributes[key];
        } else if (key === 'textContent') {
            element.textContent = attributes[key];
        } else {
            element.setAttribute(key, attributes[key]);
        }
    });
    
    // Add children
    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else {
            element.appendChild(child);
        }
    });
    
    return element;
}

// Local storage helpers
const storage = {
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Error saving to localStorage:', e);
        }
    },
    
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return defaultValue;
        }
    },
    
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('Error removing from localStorage:', e);
        }
    },
    
    clear() {
        try {
            localStorage.clear();
        } catch (e) {
            console.error('Error clearing localStorage:', e);
        }
    }
};

// Session storage helpers
const sessionStorage = {
    set(key, value) {
        try {
            window.sessionStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Error saving to sessionStorage:', e);
        }
    },
    
    get(key, defaultValue = null) {
        try {
            const item = window.sessionStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Error reading from sessionStorage:', e);
            return defaultValue;
        }
    },
    
    remove(key) {
        try {
            window.sessionStorage.removeItem(key);
        } catch (e) {
            console.error('Error removing from sessionStorage:', e);
        }
    },
    
    clear() {
        try {
            window.sessionStorage.clear();
        } catch (e) {
            console.error('Error clearing sessionStorage:', e);
        }
    }
};

// Animation helpers
function fadeIn(element, duration = 300) {
    if (typeof element === 'string') {
        element = $$(element);
    }
    if (!element) return;
    
    element.style.opacity = '0';
    element.style.display = '';
    
    let start = null;
    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const opacity = Math.min(progress / duration, 1);
        
        element.style.opacity = opacity;
        
        if (progress < duration) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

function fadeOut(element, duration = 300) {
    if (typeof element === 'string') {
        element = $$(element);
    }
    if (!element) return;
    
    let start = null;
    const initialOpacity = parseFloat(getComputedStyle(element).opacity) || 1;
    
    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const opacity = Math.max(initialOpacity - (progress / duration), 0);
        
        element.style.opacity = opacity;
        
        if (progress < duration) {
            requestAnimationFrame(animate);
        } else {
            element.style.display = 'none';
        }
    }
    
    requestAnimationFrame(animate);
}

// Scroll to element
function scrollTo(element, offset = 0) {
    if (typeof element === 'string') {
        element = $$(element);
    }
    if (!element) return;
    
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;
    
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

// Check if element is in viewport
function isInViewport(element) {
    if (typeof element === 'string') {
        element = $$(element);
    }
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Copy to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        } catch (err) {
            document.body.removeChild(textArea);
            return false;
        }
    }
}

// Download file
function downloadFile(data, filename, type = 'text/plain') {
    const blob = new Blob([data], { type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Print element
function printElement(element) {
    if (typeof element === 'string') {
        element = $$(element);
    }
    if (!element) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>طباعة</title>
                <style>
                    body { font-family: 'Cairo', Arial, sans-serif; direction: rtl; }
                    @media print { body { margin: 0; } }
                </style>
            </head>
            <body>
                ${element.innerHTML}
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Export utilities
window.utils = {
    formatCurrency,
    formatNumber,
    formatDate,
    formatTime,
    formatRelativeTime,
    generateId,
    debounce,
    throttle,
    deepClone,
    validateEmail,
    validatePhone,
    sanitizeHTML,
    $,
    $$,
    $$$,
    on,
    off,
    show,
    hide,
    toggle,
    addClass,
    removeClass,
    toggleClass,
    hasClass,
    createElement,
    storage,
    sessionStorage,
    fadeIn,
    fadeOut,
    scrollTo,
    isInViewport,
    copyToClipboard,
    downloadFile,
    printElement
};

// API Management

class APIClient {
    constructor(baseURL = 'http://127.0.0.1:5000/api') {
        this.baseURL = baseURL;
        this.token = storage.get('auth_token');
    }

    // Set authentication token
    setToken(token) {
        this.token = token;
        storage.set('auth_token', token);
    }

    // Remove authentication token
    removeToken() {
        this.token = null;
        storage.remove('auth_token');
    }

    // Make HTTP request
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        // Add authentication token if available
        if (this.token) {
            config.headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.error('API request failed:', error);
            return { success: false, error: error.message };
        }
    }

    // GET request
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    // POST request
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // PUT request
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    // DELETE request
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    // Sales API methods
    async getSales() {
        return this.get('/sales');
    }

    async createSale(saleData) {
        return this.post('/sales', saleData);
    }

    async getSale(id) {
        return this.get(`/sales/${id}`);
    }

    async updateSale(id, saleData) {
        return this.put(`/sales/${id}`, saleData);
    }

    async deleteSale(id) {
        return this.delete(`/sales/${id}`);
    }

    // Inventory API methods
    async getProducts() {
        return this.get('/inventory/products');
    }

    async createProduct(productData) {
        return this.post('/inventory/products', productData);
    }

    async getProduct(id) {
        return this.get(`/inventory/products/${id}`);
    }

    async updateProduct(id, productData) {
        return this.put(`/inventory/products/${id}`, productData);
    }

    async deleteProduct(id) {
        return this.delete(`/inventory/products/${id}`);
    }

    async getCategories() {
        return this.get('/inventory/categories');
    }

    async getLowStockProducts() {
        return this.get('/inventory/low-stock');
    }

    // Customers API methods
    async getCustomers() {
        return this.get('/customers');
    }

    async createCustomer(customerData) {
        return this.post('/customers', customerData);
    }

    async getCustomer(id) {
        return this.get(`/customers/${id}`);
    }

    async updateCustomer(id, customerData) {
        return this.put(`/customers/${id}`, customerData);
    }

    async deleteCustomer(id) {
        return this.delete(`/customers/${id}`);
    }

    // Suppliers API methods
    async getSuppliers() {
        return this.get('/suppliers');
    }

    async createSupplier(supplierData) {
        return this.post('/suppliers', supplierData);
    }

    async getSupplier(id) {
        return this.get(`/suppliers/${id}`);
    }

    async updateSupplier(id, supplierData) {
        return this.put(`/suppliers/${id}`, supplierData);
    }

    async deleteSupplier(id) {
        return this.delete(`/suppliers/${id}`);
    }

    // Invoices API methods
    async getInvoices() {
        return this.get('/invoices');
    }

    async createInvoice(invoiceData) {
        return this.post('/invoices', invoiceData);
    }

    async getInvoice(id) {
        return this.get(`/invoices/${id}`);
    }

    async updateInvoice(id, invoiceData) {
        return this.put(`/invoices/${id}`, invoiceData);
    }

    async deleteInvoice(id) {
        return this.delete(`/invoices/${id}`);
    }

    async updateInvoiceStatus(id, status) {
        return this.put(`/invoices/${id}/status`, { status });
    }

    // Expenses API methods
    async getExpenses() {
        return this.get('/expenses');
    }

    async createExpense(expenseData) {
        return this.post('/expenses', expenseData);
    }

    async getExpense(id) {
        return this.get(`/expenses/${id}`);
    }

    async updateExpense(id, expenseData) {
        return this.put(`/expenses/${id}`, expenseData);
    }

    async deleteExpense(id) {
        return this.delete(`/expenses/${id}`);
    }

    // Returns API methods
    async getReturns() {
        return this.get('/returns');
    }

    async createReturn(returnData) {
        return this.post('/returns', returnData);
    }

    async getReturn(id) {
        return this.get(`/returns/${id}`);
    }

    async updateReturn(id, returnData) {
        return this.put(`/returns/${id}`, returnData);
    }

    async deleteReturn(id) {
        return this.delete(`/returns/${id}`);
    }

    async updateReturnStatus(id, status) {
        return this.put(`/returns/${id}/status`, { status });
    }

    // Reports API methods
    async getDashboardStats() {
        return this.get('/reports/dashboard');
    }

    async getSalesReport(period = 'month') {
        return this.get(`/reports/sales?period=${period}`);
    }

    async getInventoryReport() {
        return this.get('/reports/inventory');
    }

    async getFinancialReport(period = 'month') {
        return this.get(`/reports/financial?period=${period}`);
    }

    async getCustomerReport() {
        return this.get('/reports/customers');
    }

    async getSupplierReport() {
        return this.get('/reports/suppliers');
    }
}

// Mock data for development/testing
const mockData = {
    dashboard: {
        stats: {
            totalSales: 328000,
            totalProfit: 95000,
            totalProducts: 1247,
            newCustomers: 89,
            salesGrowth: 12.5,
            profitMargin: 29.0
        },
        recentSales: [
            { id: 1, customer: 'أحمد محمد', amount: 1500, date: new Date(), status: 'مكتملة' },
            { id: 2, customer: 'فاطمة علي', amount: 2300, date: new Date(Date.now() - 3600000), status: 'معلقة' },
            { id: 3, customer: 'محمد حسن', amount: 850, date: new Date(Date.now() - 7200000), status: 'مكتملة' }
        ],
        lowStockProducts: [
            { id: 1, name: 'لابتوب ديل', currentStock: 3, minStock: 10 },
            { id: 2, name: 'ماوس لوجيتك', currentStock: 5, minStock: 20 },
            { id: 3, name: 'كيبورد ميكانيكي', currentStock: 2, minStock: 15 }
        ]
    },
    
    products: [
        { id: 1, name: 'لابتوب ديل XPS 13', category: 'أجهزة كمبيوتر', price: 25000, stock: 15, minStock: 5 },
        { id: 2, name: 'ماوس لوجيتك MX Master', category: 'ملحقات', price: 1200, stock: 45, minStock: 20 },
        { id: 3, name: 'كيبورد ميكانيكي', category: 'ملحقات', price: 800, stock: 30, minStock: 15 },
        { id: 4, name: 'شاشة سامسونج 27 بوصة', category: 'شاشات', price: 8500, stock: 12, minStock: 8 }
    ],
    
    customers: [
        { id: 1, name: 'أحمد محمد علي', email: 'ahmed@example.com', phone: '01012345678', totalPurchases: 15000 },
        { id: 2, name: 'فاطمة حسن', email: 'fatma@example.com', phone: '01098765432', totalPurchases: 8500 },
        { id: 3, name: 'محمد عبدالله', email: 'mohamed@example.com', phone: '01155667788', totalPurchases: 12300 }
    ],
    
    sales: [
        { id: 1, customer: 'أحمد محمد', items: 3, total: 1500, date: new Date(), status: 'مكتملة' },
        { id: 2, customer: 'فاطمة علي', items: 2, total: 2300, date: new Date(Date.now() - 86400000), status: 'معلقة' },
        { id: 3, customer: 'محمد حسن', items: 1, total: 850, date: new Date(Date.now() - 172800000), status: 'مكتملة' }
    ]
};

// Mock API for development
class MockAPIClient extends APIClient {
    constructor() {
        super();
        this.mockDelay = 500; // Simulate network delay
    }

    async mockRequest(data) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({ success: true, data });
            }, this.mockDelay);
        });
    }

    async getDashboardStats() {
        return this.mockRequest(mockData.dashboard);
    }

    async getProducts() {
        return this.mockRequest(mockData.products);
    }

    async getCustomers() {
        return this.mockRequest(mockData.customers);
    }

    async getSales() {
        return this.mockRequest(mockData.sales);
    }

    async createProduct(productData) {
        const newProduct = {
            id: Date.now(),
            ...productData,
            createdAt: new Date()
        };
        mockData.products.push(newProduct);
        return this.mockRequest(newProduct);
    }

    async createCustomer(customerData) {
        const newCustomer = {
            id: Date.now(),
            ...customerData,
            totalPurchases: 0,
            createdAt: new Date()
        };
        mockData.customers.push(newCustomer);
        return this.mockRequest(newCustomer);
    }

    async createSale(saleData) {
        const newSale = {
            id: Date.now(),
            ...saleData,
            date: new Date(),
            status: 'مكتملة'
        };
        mockData.sales.push(newSale);
        return this.mockRequest(newSale);
    }
}

// Create API client instance
const api = new MockAPIClient(); // Use MockAPIClient for development
// const api = new APIClient(); // Use real APIClient for production

// Export API client
window.api = api;

// Shared Components

// Toast Notification System
class ToastManager {
    constructor() {
        this.container = $('toast-container');
        this.toasts = [];
    }

    show(message, type = 'info', duration = 5000) {
        const toast = this.createToast(message, type, duration);
        this.container.appendChild(toast);
        this.toasts.push(toast);

        // Animate in
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                this.remove(toast);
            }, duration);
        }

        return toast;
    }

    createToast(message, type, duration) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        const titles = {
            success: 'نجح',
            error: 'خطأ',
            warning: 'تحذير',
            info: 'معلومات'
        };

        const toast = createElement('div', {
            className: `toast ${type}`
        });

        toast.innerHTML = `
            <i class="toast-icon ${type} ${icons[type]}"></i>
            <div class="toast-content">
                <div class="toast-title">${titles[type]}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add close event
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            this.remove(toast);
        });

        return toast;
    }

    remove(toast) {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
            const index = this.toasts.indexOf(toast);
            if (index > -1) {
                this.toasts.splice(index, 1);
            }
        }, 300);
    }

    success(message, duration = 5000) {
        return this.show(message, 'success', duration);
    }

    error(message, duration = 7000) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration = 6000) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration = 5000) {
        return this.show(message, 'info', duration);
    }
}

// Modal System
class ModalManager {
    constructor() {
        this.container = $('modal-container');
        this.activeModal = null;
    }

    show(content, options = {}) {
        const modal = this.createModal(content, options);
        this.container.appendChild(modal);
        this.activeModal = modal;

        // Show modal
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);

        // Handle escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                this.hide(modal);
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);

        return modal;
    }

    createModal(content, options) {
        const {
            title = 'نافذة',
            size = 'medium',
            closable = true,
            backdrop = true
        } = options;

        const overlay = createElement('div', {
            className: 'modal-overlay'
        });

        const modal = createElement('div', {
            className: `modal modal-${size}`
        });

        modal.innerHTML = `
            <div class="modal-header">
                <h3 class="modal-title">${title}</h3>
                ${closable ? '<button class="modal-close"><i class="fas fa-times"></i></button>' : ''}
            </div>
            <div class="modal-body">
                ${typeof content === 'string' ? content : ''}
            </div>
        `;

        // Add content if it's an element
        if (typeof content !== 'string') {
            const body = modal.querySelector('.modal-body');
            body.appendChild(content);
        }

        overlay.appendChild(modal);

        // Add event listeners
        if (closable) {
            const closeBtn = modal.querySelector('.modal-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.hide(overlay);
                });
            }
        }

        if (backdrop) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.hide(overlay);
                }
            });
        }

        return overlay;
    }

    hide(modal = null) {
        const targetModal = modal || this.activeModal;
        if (!targetModal) return;

        targetModal.classList.remove('show');
        setTimeout(() => {
            if (targetModal.parentNode) {
                targetModal.parentNode.removeChild(targetModal);
            }
            if (targetModal === this.activeModal) {
                this.activeModal = null;
            }
        }, 300);
    }

    confirm(message, title = 'تأكيد') {
        return new Promise((resolve) => {
            const content = `
                <p style="margin-bottom: 20px;">${message}</p>
                <div class="modal-footer">
                    <button class="btn btn-danger" id="confirm-yes">نعم</button>
                    <button class="btn btn-ghost" id="confirm-no">لا</button>
                </div>
            `;

            const modal = this.show(content, { title, closable: false });

            const yesBtn = modal.querySelector('#confirm-yes');
            const noBtn = modal.querySelector('#confirm-no');

            yesBtn.addEventListener('click', () => {
                this.hide(modal);
                resolve(true);
            });

            noBtn.addEventListener('click', () => {
                this.hide(modal);
                resolve(false);
            });
        });
    }
}

// Loading Manager
class LoadingManager {
    constructor() {
        this.loadingScreen = $('loading-screen');
        this.activeLoaders = new Set();
    }

    show(id = 'default') {
        this.activeLoaders.add(id);
        if (this.loadingScreen) {
            this.loadingScreen.classList.remove('hidden');
        }
    }

    hide(id = 'default') {
        this.activeLoaders.delete(id);
        if (this.activeLoaders.size === 0 && this.loadingScreen) {
            this.loadingScreen.classList.add('hidden');
        }
    }

    showElement(element, text = 'جاري التحميل...') {
        if (typeof element === 'string') {
            element = $$(element);
        }
        if (!element) return;

        const loader = createElement('div', {
            className: 'element-loader',
            innerHTML: `
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p>${text}</p>
                </div>
            `
        });

        element.style.position = 'relative';
        element.appendChild(loader);
        return loader;
    }

    hideElement(element) {
        if (typeof element === 'string') {
            element = $$(element);
        }
        if (!element) return;

        const loader = element.querySelector('.element-loader');
        if (loader) {
            loader.remove();
        }
    }
}

// Data Table Component
class DataTable {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' ? $$(container) : container;
        this.options = {
            data: [],
            columns: [],
            searchable: true,
            sortable: true,
            pagination: true,
            pageSize: 10,
            ...options
        };
        this.currentPage = 1;
        this.sortColumn = null;
        this.sortDirection = 'asc';
        this.searchTerm = '';
        this.filteredData = [];
        
        this.init();
    }

    init() {
        this.render();
        this.bindEvents();
    }

    render() {
        this.filteredData = this.filterData();
        const paginatedData = this.paginateData();

        this.container.innerHTML = `
            ${this.options.searchable ? this.renderSearch() : ''}
            <div class="table-container">
                <table class="table">
                    <thead>
                        ${this.renderHeader()}
                    </thead>
                    <tbody>
                        ${this.renderBody(paginatedData)}
                    </tbody>
                </table>
            </div>
            ${this.options.pagination ? this.renderPagination() : ''}
        `;

        this.bindEvents();
    }

    renderSearch() {
        return `
            <div class="table-search" style="margin-bottom: 16px;">
                <div class="search-container">
                    <i class="fas fa-search"></i>
                    <input type="text" class="form-input" placeholder="البحث..." value="${this.searchTerm}">
                </div>
            </div>
        `;
    }

    renderHeader() {
        return `
            <tr>
                ${this.options.columns.map(column => `
                    <th ${this.options.sortable ? `class="sortable" data-column="${column.key}"` : ''}>
                        ${column.title}
                        ${this.options.sortable ? `
                            <i class="fas fa-sort${this.sortColumn === column.key ? 
                                (this.sortDirection === 'asc' ? '-up' : '-down') : ''}"></i>
                        ` : ''}
                    </th>
                `).join('')}
            </tr>
        `;
    }

    renderBody(data) {
        if (data.length === 0) {
            return `
                <tr>
                    <td colspan="${this.options.columns.length}" style="text-align: center; padding: 40px;">
                        لا توجد بيانات للعرض
                    </td>
                </tr>
            `;
        }

        return data.map(row => `
            <tr>
                ${this.options.columns.map(column => `
                    <td>
                        ${column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                `).join('')}
            </tr>
        `).join('');
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredData.length / this.options.pageSize);
        if (totalPages <= 1) return '';

        const pages = [];
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, this.currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return `
            <div class="pagination">
                <button class="pagination-btn" ${this.currentPage === 1 ? 'disabled' : ''} data-page="${this.currentPage - 1}">
                    <i class="fas fa-chevron-right"></i>
                </button>
                ${pages.map(page => `
                    <button class="pagination-btn ${page === this.currentPage ? 'active' : ''}" data-page="${page}">
                        ${page}
                    </button>
                `).join('')}
                <button class="pagination-btn" ${this.currentPage === totalPages ? 'disabled' : ''} data-page="${this.currentPage + 1}">
                    <i class="fas fa-chevron-left"></i>
                </button>
            </div>
        `;
    }

    bindEvents() {
        // Search
        if (this.options.searchable) {
            const searchInput = this.container.querySelector('.table-search input');
            if (searchInput) {
                searchInput.addEventListener('input', debounce((e) => {
                    this.searchTerm = e.target.value;
                    this.currentPage = 1;
                    this.render();
                }, 300));
            }
        }

        // Sort
        if (this.options.sortable) {
            const sortableHeaders = this.container.querySelectorAll('th.sortable');
            sortableHeaders.forEach(header => {
                header.addEventListener('click', () => {
                    const column = header.dataset.column;
                    if (this.sortColumn === column) {
                        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
                    } else {
                        this.sortColumn = column;
                        this.sortDirection = 'asc';
                    }
                    this.render();
                });
            });
        }

        // Pagination
        if (this.options.pagination) {
            const paginationBtns = this.container.querySelectorAll('.pagination-btn');
            paginationBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const page = parseInt(btn.dataset.page);
                    if (page && page !== this.currentPage) {
                        this.currentPage = page;
                        this.render();
                    }
                });
            });
        }
    }

    filterData() {
        let data = [...this.options.data];

        // Apply search filter
        if (this.searchTerm) {
            data = data.filter(row => {
                return this.options.columns.some(column => {
                    const value = row[column.key];
                    return value && value.toString().toLowerCase().includes(this.searchTerm.toLowerCase());
                });
            });
        }

        // Apply sort
        if (this.sortColumn) {
            data.sort((a, b) => {
                const aVal = a[this.sortColumn];
                const bVal = b[this.sortColumn];
                
                if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
                if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return data;
    }

    paginateData() {
        if (!this.options.pagination) return this.filteredData;

        const start = (this.currentPage - 1) * this.options.pageSize;
        const end = start + this.options.pageSize;
        return this.filteredData.slice(start, end);
    }

    updateData(newData) {
        this.options.data = newData;
        this.currentPage = 1;
        this.render();
    }

    refresh() {
        this.render();
    }
}

// Form Validator
class FormValidator {
    constructor(form, rules = {}) {
        this.form = typeof form === 'string' ? $$(form) : form;
        this.rules = rules;
        this.errors = {};
    }

    validate() {
        this.errors = {};
        let isValid = true;

        Object.keys(this.rules).forEach(fieldName => {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            if (!field) return;

            const fieldRules = this.rules[fieldName];
            const value = field.value.trim();

            fieldRules.forEach(rule => {
                if (!this.validateRule(value, rule, field)) {
                    if (!this.errors[fieldName]) {
                        this.errors[fieldName] = [];
                    }
                    this.errors[fieldName].push(rule.message);
                    isValid = false;
                }
            });
        });

        this.displayErrors();
        return isValid;
    }

    validateRule(value, rule, field) {
        switch (rule.type) {
            case 'required':
                return value.length > 0;
            case 'email':
                return validateEmail(value);
            case 'phone':
                return validatePhone(value);
            case 'min':
                return value.length >= rule.value;
            case 'max':
                return value.length <= rule.value;
            case 'number':
                return !isNaN(value) && value !== '';
            case 'positive':
                return parseFloat(value) > 0;
            case 'custom':
                return rule.validator(value, field);
            default:
                return true;
        }
    }

    displayErrors() {
        // Clear previous errors
        this.form.querySelectorAll('.form-error').forEach(error => {
            error.remove();
        });
        this.form.querySelectorAll('.error').forEach(field => {
            field.classList.remove('error');
        });

        // Display new errors
        Object.keys(this.errors).forEach(fieldName => {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            if (!field) return;

            field.classList.add('error');
            
            const errorDiv = createElement('div', {
                className: 'form-error',
                textContent: this.errors[fieldName][0]
            });

            field.parentNode.appendChild(errorDiv);
        });
    }

    clearErrors() {
        this.errors = {};
        this.displayErrors();
    }
}

// Initialize global components
const toast = new ToastManager();
const modal = new ModalManager();
const loading = new LoadingManager();

// Export components
window.components = {
    ToastManager,
    ModalManager,
    LoadingManager,
    DataTable,
    FormValidator,
    toast,
    modal,
    loading
};

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

// Dashboard Module

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
            loading.show('dashboard');
            const response = await api.getDashboardStats();
            
            if (response.success) {
                this.stats = response.data.stats;
                this.recentSales = response.data.recentSales;
                this.lowStockProducts = response.data.lowStockProducts;
            } else {
                toast.error('فشل في تحميل بيانات لوحة المعلومات');
            }
        } catch (error) {
            console.error('Dashboard data loading error:', error);
            toast.error('حدث خطأ في تحميل البيانات');
        } finally {
            loading.hide('dashboard');
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
                                <a href="#" class="btn btn-ghost btn-sm" onclick="app.showModule('sales')">
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
                                <a href="#" class="btn btn-ghost btn-sm" onclick="app.showModule('inventory')">
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
                        <button class="quick-action-btn" onclick="app.showModule('sales'); salesModule.showAddSaleModal();">
                            <i class="fas fa-plus-circle"></i>
                            <span>بيع جديد</span>
                        </button>
                        <button class="quick-action-btn" onclick="app.showModule('inventory'); inventoryModule.showAddProductModal();">
                            <i class="fas fa-box"></i>
                            <span>منتج جديد</span>
                        </button>
                        <button class="quick-action-btn" onclick="app.showModule('customers'); customersModule.showAddCustomerModal();">
                            <i class="fas fa-user-plus"></i>
                            <span>عميل جديد</span>
                        </button>
                        <button class="quick-action-btn" onclick="app.showModule('reports');">
                            <i class="fas fa-chart-line"></i>
                            <span>التقارير</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        $('page-content').innerHTML = content;
        
        // Initialize charts after DOM is ready
        setTimeout(() => {
            this.initCharts();
        }, 100);
    }

    renderStatsCards() {
        const cards = [
            {
                title: 'إجمالي المبيعات',
                value: formatCurrency(this.stats.totalSales || 0),
                change: `+${this.stats.salesGrowth || 0}%`,
                changeType: 'positive',
                icon: 'fas fa-chart-line',
                color: 'primary'
            },
            {
                title: 'صافي الربح',
                value: formatCurrency(this.stats.totalProfit || 0),
                change: `${this.stats.profitMargin || 0}%`,
                changeType: 'positive',
                icon: 'fas fa-money-bill-wave',
                color: 'success'
            },
            {
                title: 'المنتجات المباعة',
                value: formatNumber(this.stats.totalProducts || 0),
                change: '+15 اليوم',
                changeType: 'positive',
                icon: 'fas fa-boxes',
                color: 'warning'
            },
            {
                title: 'العملاء الجدد',
                value: formatNumber(this.stats.newCustomers || 0),
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
                            <div class="sale-customer">${sale.customer}</div>
                            <div class="sale-time">${formatRelativeTime(sale.date)}</div>
                        </div>
                        <div class="sale-amount">${formatCurrency(sale.amount)}</div>
                        <div class="sale-status">
                            <span class="badge ${sale.status === 'مكتملة' ? 'badge-success' : 'badge-warning'}">
                                ${sale.status}
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
                            <div class="product-name">${product.name}</div>
                            <div class="stock-info">
                                <span class="current-stock">${product.currentStock}</span>
                                /
                                <span class="min-stock">${product.minStock}</span>
                            </div>
                        </div>
                        <div class="stock-progress">
                            <div class="progress">
                                <div class="progress-bar danger" 
                                     style="width: ${(product.currentStock / product.minStock) * 100}%">
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    initCharts() {
        this.initSalesChart();
        this.initSalesDistributionChart();
    }

    initSalesChart() {
        const ctx = $('sales-chart');
        if (!ctx) return;

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
                            callback: function(value) {
                                return formatCurrency(value);
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
        const ctx = $('sales-distribution-chart');
        if (!ctx) return;

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
        const periodSelect = $('sales-chart-period');
        if (periodSelect) {
            periodSelect.addEventListener('change', () => {
                this.updateSalesChart(periodSelect.value);
            });
        }
    }

    updateSalesChart(period) {
        // Update chart data based on period
        // This would typically fetch new data from the API
        toast.info(`تم تحديث المخطط للفترة: ${period}`);
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
}

// Export dashboard module
window.dashboardModule = new Dashboard();

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

// Inventory Module

class Inventory {
    constructor() {
        this.products = [];
        this.categories = [];
        this.dataTable = null;
        this.currentProduct = null;
    }

    async init() {
        await this.loadData();
        this.render();
        this.bindEvents();
    }

    async loadData() {
        try {
            loading.show('inventory');
            
            const [productsResponse, categoriesResponse] = await Promise.all([
                api.getProducts(),
                api.getCategories()
            ]);

            if (productsResponse.success) {
                this.products = productsResponse.data;
            }
            
            if (categoriesResponse.success) {
                this.categories = categoriesResponse.data;
            }
        } catch (error) {
            console.error('Inventory data loading error:', error);
            toast.error('حدث خطأ في تحميل بيانات المخزون');
        } finally {
            loading.hide('inventory');
        }
    }

    render() {
        const content = `
            <div class="inventory-container">
                <!-- Header Actions -->
                <div class="module-header">
                    <div class="module-title">
                        <h2>إدارة المخزون</h2>
                        <p>إدارة وتتبع جميع المنتجات والمخزون</p>
                    </div>
                    <div class="module-actions">
                        <button class="btn btn-success" onclick="inventoryModule.showAddProductModal()">
                            <i class="fas fa-plus"></i>
                            منتج جديد
                        </button>
                        <button class="btn btn-primary" onclick="inventoryModule.showCategoriesModal()">
                            <i class="fas fa-tags"></i>
                            إدارة الفئات
                        </button>
                    </div>
                </div>

                <!-- Inventory Stats -->
                <div class="inventory-stats">
                    <div class="stats-grid">
                        <div class="stat-card primary">
                            <div class="stat-header">
                                <span class="stat-title">إجمالي المنتجات</span>
                                <div class="stat-icon primary">
                                    <i class="fas fa-boxes"></i>
                                </div>
                            </div>
                            <div class="stat-value">${formatNumber(this.products.length)}</div>
                            <div class="stat-change positive">
                                <i class="fas fa-arrow-up"></i>
                                +3 هذا الأسبوع
                            </div>
                        </div>
                        
                        <div class="stat-card success">
                            <div class="stat-header">
                                <span class="stat-title">قيمة المخزون</span>
                                <div class="stat-icon success">
                                    <i class="fas fa-dollar-sign"></i>
                                </div>
                            </div>
                            <div class="stat-value">${formatCurrency(this.getTotalInventoryValue())}</div>
                            <div class="stat-change positive">
                                <i class="fas fa-arrow-up"></i>
                                +5.2%
                            </div>
                        </div>
                        
                        <div class="stat-card warning">
                            <div class="stat-header">
                                <span class="stat-title">مخزون منخفض</span>
                                <div class="stat-icon warning">
                                    <i class="fas fa-exclamation-triangle"></i>
                                </div>
                            </div>
                            <div class="stat-value">${formatNumber(this.getLowStockCount())}</div>
                            <div class="stat-change negative">
                                <i class="fas fa-arrow-down"></i>
                                يحتاج متابعة
                            </div>
                        </div>
                        
                        <div class="stat-card info">
                            <div class="stat-header">
                                <span class="stat-title">الفئات</span>
                                <div class="stat-icon info">
                                    <i class="fas fa-tags"></i>
                                </div>
                            </div>
                            <div class="stat-value">${formatNumber(this.categories.length)}</div>
                            <div class="stat-change positive">
                                <i class="fas fa-arrow-up"></i>
                                +1 جديدة
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Filters -->
                <div class="inventory-filters">
                    <div class="filters-row">
                        <div class="filter-group">
                            <label>الفئة:</label>
                            <select id="category-filter" class="form-select">
                                <option value="">جميع الفئات</option>
                                ${this.categories.map(cat => `
                                    <option value="${cat.id}">${cat.name}</option>
                                `).join('')}
                            </select>
                        </div>
                        <div class="filter-group">
                            <label>حالة المخزون:</label>
                            <select id="stock-filter" class="form-select">
                                <option value="">جميع المنتجات</option>
                                <option value="in-stock">متوفر</option>
                                <option value="low-stock">مخزون منخفض</option>
                                <option value="out-of-stock">غير متوفر</option>
                            </select>
                        </div>
                        <div class="filter-group">
                            <button class="btn btn-ghost" onclick="inventoryModule.resetFilters()">
                                <i class="fas fa-undo"></i>
                                إعادة تعيين
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Products Table -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">قائمة المنتجات</h3>
                        <div class="card-actions">
                            <button class="btn btn-ghost btn-sm" onclick="inventoryModule.exportProducts()">
                                <i class="fas fa-download"></i>
                                تصدير
                            </button>
                            <button class="btn btn-ghost btn-sm" onclick="inventoryModule.printProducts()">
                                <i class="fas fa-print"></i>
                                طباعة
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div id="products-table"></div>
                    </div>
                </div>
            </div>
        `;

        $('page-content').innerHTML = content;
        this.initDataTable();
        this.bindFilterEvents();
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
                title: 'اسم المنتج'
            },
            {
                key: 'category',
                title: 'الفئة'
            },
            {
                key: 'price',
                title: 'السعر',
                render: (value) => formatCurrency(value)
            },
            {
                key: 'stock',
                title: 'المخزون',
                render: (value, row) => {
                    const status = this.getStockStatus(value, row.minStock);
                    const badgeClass = status === 'متوفر' ? 'badge-success' : 
                                     status === 'منخفض' ? 'badge-warning' : 'badge-danger';
                    return `
                        <div class="stock-info">
                            <span class="stock-quantity">${formatNumber(value)}</span>
                            <span class="badge ${badgeClass}">${status}</span>
                        </div>
                    `;
                }
            },
            {
                key: 'minStock',
                title: 'الحد الأدنى',
                render: (value) => formatNumber(value)
            },
            {
                key: 'actions',
                title: 'الإجراءات',
                render: (value, row) => `
                    <div class="table-actions">
                        <button class="btn btn-ghost btn-sm" onclick="inventoryModule.viewProduct(${row.id})" title="عرض">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-ghost btn-sm" onclick="inventoryModule.editProduct(${row.id})" title="تعديل">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-ghost btn-sm" onclick="inventoryModule.adjustStock(${row.id})" title="تعديل المخزون">
                            <i class="fas fa-warehouse"></i>
                        </button>
                        <button class="btn btn-ghost btn-sm text-danger" onclick="inventoryModule.deleteProduct(${row.id})" title="حذف">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `
            }
        ];

        this.dataTable = new DataTable('#products-table', {
            data: this.products,
            columns: columns,
            searchable: true,
            sortable: true,
            pagination: true,
            pageSize: 15
        });
    }

    bindEvents() {
        // Module-specific events
    }

    bindFilterEvents() {
        const categoryFilter = $('category-filter');
        const stockFilter = $('stock-filter');

        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.applyFilters());
        }

        if (stockFilter) {
            stockFilter.addEventListener('change', () => this.applyFilters());
        }
    }

    applyFilters() {
        let filteredProducts = [...this.products];

        const categoryFilter = $('category-filter').value;
        const stockFilter = $('stock-filter').value;

        if (categoryFilter) {
            filteredProducts = filteredProducts.filter(product => product.category === categoryFilter);
        }

        if (stockFilter) {
            filteredProducts = filteredProducts.filter(product => {
                const status = this.getStockStatus(product.stock, product.minStock);
                switch (stockFilter) {
                    case 'in-stock':
                        return status === 'متوفر';
                    case 'low-stock':
                        return status === 'منخفض';
                    case 'out-of-stock':
                        return status === 'غير متوفر';
                    default:
                        return true;
                }
            });
        }

        this.dataTable.updateData(filteredProducts);
    }

    resetFilters() {
        $('category-filter').value = '';
        $('stock-filter').value = '';
        this.dataTable.updateData(this.products);
    }

    showAddProductModal() {
        this.currentProduct = null;
        const content = this.renderProductForm();
        
        modal.show(content, {
            title: 'إضافة منتج جديد',
            size: 'large'
        });

        this.bindProductFormEvents();
    }

    showCategoriesModal() {
        const content = `
            <div class="categories-management">
                <div class="categories-header">
                    <button class="btn btn-primary btn-sm" onclick="inventoryModule.showAddCategoryForm()">
                        <i class="fas fa-plus"></i>
                        فئة جديدة
                    </button>
                </div>
                
                <div class="categories-list">
                    ${this.categories.map(category => `
                        <div class="category-item">
                            <div class="category-info">
                                <span class="category-name">${category.name}</span>
                                <span class="category-count">${this.getProductsInCategory(category.id)} منتج</span>
                            </div>
                            <div class="category-actions">
                                <button class="btn btn-ghost btn-sm" onclick="inventoryModule.editCategory(${category.id})">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-ghost btn-sm text-danger" onclick="inventoryModule.deleteCategory(${category.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="modal-footer">
                    <button class="btn btn-ghost" onclick="modal.hide()">
                        إغلاق
                    </button>
                </div>
            </div>
        `;

        modal.show(content, {
            title: 'إدارة الفئات',
            size: 'medium'
        });
    }

    renderProductForm() {
        const product = this.currentProduct || {};
        
        return `
            <form class="product-form">
                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label">اسم المنتج *</label>
                        <input type="text" class="form-input" name="name" value="${product.name || ''}" required>
                    </div>
                    <div class="form-col">
                        <label class="form-label">الفئة *</label>
                        <select class="form-select" name="category" required>
                            <option value="">اختر الفئة</option>
                            ${this.categories.map(cat => `
                                <option value="${cat.name}" ${product.category === cat.name ? 'selected' : ''}>
                                    ${cat.name}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label">السعر *</label>
                        <input type="number" class="form-input" name="price" step="0.01" min="0" value="${product.price || ''}" required>
                    </div>
                    <div class="form-col">
                        <label class="form-label">تكلفة الشراء</label>
                        <input type="number" class="form-input" name="cost" step="0.01" min="0" value="${product.cost || ''}">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label">الكمية الحالية *</label>
                        <input type="number" class="form-input" name="stock" min="0" value="${product.stock || 0}" required>
                    </div>
                    <div class="form-col">
                        <label class="form-label">الحد الأدنى للمخزون *</label>
                        <input type="number" class="form-input" name="minStock" min="0" value="${product.minStock || 5}" required>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label">الباركود</label>
                        <input type="text" class="form-input" name="barcode" value="${product.barcode || ''}">
                    </div>
                    <div class="form-col">
                        <label class="form-label">الوحدة</label>
                        <select class="form-select" name="unit">
                            <option value="قطعة" ${product.unit === 'قطعة' ? 'selected' : ''}>قطعة</option>
                            <option value="كيلو" ${product.unit === 'كيلو' ? 'selected' : ''}>كيلو</option>
                            <option value="متر" ${product.unit === 'متر' ? 'selected' : ''}>متر</option>
                            <option value="لتر" ${product.unit === 'لتر' ? 'selected' : ''}>لتر</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">الوصف</label>
                    <textarea class="form-textarea" name="description" rows="3" placeholder="وصف المنتج...">${product.description || ''}</textarea>
                </div>

                <div class="form-group">
                    <label class="form-label">ملاحظات</label>
                    <textarea class="form-textarea" name="notes" rows="2" placeholder="ملاحظات إضافية...">${product.notes || ''}</textarea>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-success" onclick="inventoryModule.saveProduct()">
                        <i class="fas fa-save"></i>
                        ${this.currentProduct ? 'تحديث' : 'حفظ'}
                    </button>
                    <button type="button" class="btn btn-ghost" onclick="modal.hide()">
                        إلغاء
                    </button>
                </div>
            </form>
        `;
    }

    bindProductFormEvents() {
        // Auto-generate barcode if empty
        const nameInput = $$('input[name="name"]');
        const barcodeInput = $$('input[name="barcode"]');
        
        if (nameInput && barcodeInput && !barcodeInput.value) {
            nameInput.addEventListener('blur', () => {
                if (!barcodeInput.value && nameInput.value) {
                    barcodeInput.value = this.generateBarcode();
                }
            });
        }
    }

    async saveProduct() {
        const form = $$('.product-form');
        const formData = new FormData(form);
        
        const productData = {
            name: formData.get('name'),
            category: formData.get('category'),
            price: parseFloat(formData.get('price')),
            cost: parseFloat(formData.get('cost')) || 0,
            stock: parseInt(formData.get('stock')),
            minStock: parseInt(formData.get('minStock')),
            barcode: formData.get('barcode'),
            unit: formData.get('unit'),
            description: formData.get('description'),
            notes: formData.get('notes')
        };

        // Validation
        if (!productData.name || !productData.category || !productData.price) {
            toast.error('يرجى ملء جميع الحقول المطلوبة');
            return;
        }

        try {
            loading.show('save-product');
            
            let response;
            if (this.currentProduct) {
                response = await api.updateProduct(this.currentProduct.id, productData);
            } else {
                response = await api.createProduct(productData);
            }
            
            if (response.success) {
                toast.success(`تم ${this.currentProduct ? 'تحديث' : 'إضافة'} المنتج بنجاح`);
                modal.hide();
                await this.loadData();
                this.dataTable.updateData(this.products);
            } else {
                toast.error(`فشل في ${this.currentProduct ? 'تحديث' : 'إضافة'} المنتج`);
            }
        } catch (error) {
            console.error('Save product error:', error);
            toast.error('حدث خطأ في حفظ المنتج');
        } finally {
            loading.hide('save-product');
        }
    }

    viewProduct(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) return;

        const content = `
            <div class="product-details">
                <div class="product-header">
                    <h3>${product.name}</h3>
                    <span class="badge badge-primary">${product.category}</span>
                </div>
                
                <div class="product-info-grid">
                    <div class="info-item">
                        <label>السعر:</label>
                        <span>${formatCurrency(product.price)}</span>
                    </div>
                    <div class="info-item">
                        <label>المخزون:</label>
                        <span>${formatNumber(product.stock)} ${product.unit || 'قطعة'}</span>
                    </div>
                    <div class="info-item">
                        <label>الحد الأدنى:</label>
                        <span>${formatNumber(product.minStock)}</span>
                    </div>
                    <div class="info-item">
                        <label>الباركود:</label>
                        <span>${product.barcode || 'غير محدد'}</span>
                    </div>
                </div>
                
                ${product.description ? `
                    <div class="product-description">
                        <label>الوصف:</label>
                        <p>${product.description}</p>
                    </div>
                ` : ''}
                
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="inventoryModule.editProduct(${product.id}); modal.hide();">
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
            title: 'تفاصيل المنتج',
            size: 'medium'
        });
    }

    editProduct(id) {
        this.currentProduct = this.products.find(p => p.id === id);
        if (!this.currentProduct) return;

        const content = this.renderProductForm();
        
        modal.show(content, {
            title: 'تعديل المنتج',
            size: 'large'
        });

        this.bindProductFormEvents();
    }

    adjustStock(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) return;

        const content = `
            <div class="stock-adjustment">
                <div class="current-stock">
                    <h4>المخزون الحالي: ${formatNumber(product.stock)} ${product.unit || 'قطعة'}</h4>
                </div>
                
                <div class="form-group">
                    <label class="form-label">نوع التعديل</label>
                    <select class="form-select" name="adjustmentType">
                        <option value="add">إضافة للمخزون</option>
                        <option value="subtract">خصم من المخزون</option>
                        <option value="set">تعيين كمية جديدة</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">الكمية</label>
                    <input type="number" class="form-input" name="quantity" min="0" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">سبب التعديل</label>
                    <select class="form-select" name="reason">
                        <option value="purchase">شراء جديد</option>
                        <option value="return">مرتجع</option>
                        <option value="damage">تلف</option>
                        <option value="theft">فقدان</option>
                        <option value="correction">تصحيح</option>
                        <option value="other">أخرى</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">ملاحظات</label>
                    <textarea class="form-textarea" name="notes" rows="2" placeholder="ملاحظات التعديل..."></textarea>
                </div>
                
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="inventoryModule.confirmStockAdjustment(${product.id})">
                        <i class="fas fa-check"></i>
                        تأكيد التعديل
                    </button>
                    <button class="btn btn-ghost" onclick="modal.hide()">
                        إلغاء
                    </button>
                </div>
            </div>
        `;

        modal.show(content, {
            title: `تعديل مخزون: ${product.name}`,
            size: 'medium'
        });
    }

    async confirmStockAdjustment(productId) {
        const adjustmentType = $$('select[name="adjustmentType"]').value;
        const quantity = parseInt($$('input[name="quantity"]').value);
        const reason = $$('select[name="reason"]').value;
        const notes = $$('textarea[name="notes"]').value;

        if (!quantity || quantity <= 0) {
            toast.error('يرجى إدخال كمية صحيحة');
            return;
        }

        const product = this.products.find(p => p.id === productId);
        let newStock = product.stock;

        switch (adjustmentType) {
            case 'add':
                newStock += quantity;
                break;
            case 'subtract':
                newStock = Math.max(0, newStock - quantity);
                break;
            case 'set':
                newStock = quantity;
                break;
        }

        try {
            loading.show('adjust-stock');
            
            const response = await api.updateProduct(productId, { stock: newStock });
            
            if (response.success) {
                toast.success('تم تعديل المخزون بنجاح');
                modal.hide();
                await this.loadData();
                this.dataTable.updateData(this.products);
            } else {
                toast.error('فشل في تعديل المخزون');
            }
        } catch (error) {
            console.error('Stock adjustment error:', error);
            toast.error('حدث خطأ في تعديل المخزون');
        } finally {
            loading.hide('adjust-stock');
        }
    }

    async deleteProduct(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) return;

        const confirmed = await modal.confirm(
            `هل أنت متأكد من حذف المنتج "${product.name}"؟`,
            'تأكيد الحذف'
        );
        
        if (!confirmed) return;

        try {
            loading.show('delete-product');
            const response = await api.deleteProduct(id);
            
            if (response.success) {
                toast.success('تم حذف المنتج بنجاح');
                await this.loadData();
                this.dataTable.updateData(this.products);
            } else {
                toast.error('فشل في حذف المنتج');
            }
        } catch (error) {
            console.error('Delete product error:', error);
            toast.error('حدث خطأ في حذف المنتج');
        } finally {
            loading.hide('delete-product');
        }
    }

    exportProducts() {
        const csvContent = this.generateProductsCSV();
        downloadFile(csvContent, 'products.csv', 'text/csv');
        toast.success('تم تصدير البيانات بنجاح');
    }

    printProducts() {
        const printContent = this.generateProductsPrintContent();
        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    }

    // Helper methods
    getStockStatus(stock, minStock) {
        if (stock <= 0) return 'غير متوفر';
        if (stock <= minStock) return 'منخفض';
        return 'متوفر';
    }

    getTotalInventoryValue() {
        return this.products.reduce((total, product) => {
            return total + (product.price * product.stock);
        }, 0);
    }

    getLowStockCount() {
        return this.products.filter(product => 
            product.stock <= product.minStock
        ).length;
    }

    getProductsInCategory(categoryId) {
        const category = this.categories.find(c => c.id === categoryId);
        if (!category) return 0;
        return this.products.filter(p => p.category === category.name).length;
    }

    generateBarcode() {
        return Date.now().toString() + Math.random().toString(36).substr(2, 5);
    }

    generateProductsCSV() {
        const headers = ['الكود', 'اسم المنتج', 'الفئة', 'السعر', 'المخزون', 'الحد الأدنى'];
        const rows = this.products.map(product => [
            product.id,
            product.name,
            product.category,
            product.price,
            product.stock,
            product.minStock
        ]);

        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    generateProductsPrintContent() {
        return `
            <html>
                <head>
                    <title>قائمة المنتجات</title>
                    <style>
                        body { font-family: 'Cairo', Arial, sans-serif; direction: rtl; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
                        th { background-color: #f5f5f5; }
                        h1 { text-align: center; color: #333; }
                    </style>
                </head>
                <body>
                    <h1>قائمة المنتجات</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>الكود</th>
                                <th>اسم المنتج</th>
                                <th>الفئة</th>
                                <th>السعر</th>
                                <th>المخزون</th>
                                <th>الحد الأدنى</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.products.map(product => `
                                <tr>
                                    <td>#${product.id}</td>
                                    <td>${product.name}</td>
                                    <td>${product.category}</td>
                                    <td>${formatCurrency(product.price)}</td>
                                    <td>${formatNumber(product.stock)}</td>
                                    <td>${formatNumber(product.minStock)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
            </html>
        `;
    }
}

// Export inventory module
window.inventoryModule = new Inventory();

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
        const discountInput = $$("input[name=\'discount\']");
        const taxInput = $$("input[name=\'tax\']");

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


// Sales Module

class Sales {
    constructor() {
        this.sales = [];
        this.products = [];
        this.customers = [];
        this.currentSale = {
            items: [],
            customer: null,
            discount: 0,
            tax: 14, // 14% VAT
            notes: ''
        };
        this.dataTable = null;
    }

    async init() {
        await this.loadData();
        this.render();
        this.bindEvents();
    }

    async loadData() {
        try {
            loading.show('sales');
            
            const [salesResponse, productsResponse, customersResponse] = await Promise.all([
                api.getSales(),
                api.getProducts(),
                api.getCustomers()
            ]);

            if (salesResponse.success) {
                this.sales = salesResponse.data;
            }
            
            if (productsResponse.success) {
                this.products = productsResponse.data;
            }
            
            if (customersResponse.success) {
                this.customers = customersResponse.data;
            }
        } catch (error) {
            console.error('Sales data loading error:', error);
            toast.error('حدث خطأ في تحميل بيانات المبيعات');
        } finally {
            loading.hide('sales');
        }
    }

    render() {
        const content = `
            <div class="sales-container">
                <!-- Header Actions -->
                <div class="module-header">
                    <div class="module-title">
                        <h2>إدارة المبيعات</h2>
                        <p>إدارة وتتبع جميع عمليات البيع</p>
                    </div>
                    <div class="module-actions">
                        <button class="btn btn-success" onclick="salesModule.showAddSaleModal()">
                            <i class="fas fa-plus"></i>
                            بيع جديد
                        </button>
                        <button class="btn btn-primary" onclick="salesModule.showQuickSaleModal()">
                            <i class="fas fa-bolt"></i>
                            بيع سريع
                        </button>
                    </div>
                </div>

                <!-- Sales Stats -->
                <div class="sales-stats">
                    <div class="stats-grid">
                        <div class="stat-card primary">
                            <div class="stat-header">
                                <span class="stat-title">مبيعات اليوم</span>
                                <div class="stat-icon primary">
                                    <i class="fas fa-calendar-day"></i>
                                </div>
                            </div>
                            <div class="stat-value">${formatCurrency(this.getTodaySales())}</div>
                            <div class="stat-change positive">
                                <i class="fas fa-arrow-up"></i>
                                +12.5%
                            </div>
                        </div>
                        
                        <div class="stat-card success">
                            <div class="stat-header">
                                <span class="stat-title">مبيعات الشهر</span>
                                <div class="stat-icon success">
                                    <i class="fas fa-calendar-alt"></i>
                                </div>
                            </div>
                            <div class="stat-value">${formatCurrency(this.getMonthSales())}</div>
                            <div class="stat-change positive">
                                <i class="fas fa-arrow-up"></i>
                                +8.3%
                            </div>
                        </div>
                        
                        <div class="stat-card warning">
                            <div class="stat-header">
                                <span class="stat-title">عدد المبيعات</span>
                                <div class="stat-icon warning">
                                    <i class="fas fa-shopping-cart"></i>
                                </div>
                            </div>
                            <div class="stat-value">${formatNumber(this.sales.length)}</div>
                            <div class="stat-change positive">
                                <i class="fas fa-arrow-up"></i>
                                +5 اليوم
                            </div>
                        </div>
                        
                        <div class="stat-card info">
                            <div class="stat-header">
                                <span class="stat-title">متوسط البيع</span>
                                <div class="stat-icon info">
                                    <i class="fas fa-chart-bar"></i>
                                </div>
                            </div>
                            <div class="stat-value">${formatCurrency(this.getAverageSale())}</div>
                            <div class="stat-change positive">
                                <i class="fas fa-arrow-up"></i>
                                +3.2%
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sales Table -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">قائمة المبيعات</h3>
                        <div class="card-actions">
                            <button class="btn btn-ghost btn-sm" onclick="salesModule.exportSales()">
                                <i class="fas fa-download"></i>
                                تصدير
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div id="sales-table"></div>
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
                title: 'رقم البيع',
                render: (value) => `#${value}`
            },
            {
                key: 'customer',
                title: 'العميل'
            },
            {
                key: 'items',
                title: 'عدد الأصناف',
                render: (value) => formatNumber(value)
            },
            {
                key: 'total',
                title: 'المبلغ الإجمالي',
                render: (value) => formatCurrency(value)
            },
            {
                key: 'date',
                title: 'التاريخ',
                render: (value) => formatDate(value)
            },
            {
                key: 'status',
                title: 'الحالة',
                render: (value) => `
                    <span class="badge ${value === 'مكتملة' ? 'badge-success' : 
                                       value === 'معلقة' ? 'badge-warning' : 'badge-danger'}">
                        ${value}
                    </span>
                `
            },
            {
                key: 'actions',
                title: 'الإجراءات',
                render: (value, row) => `
                    <div class="table-actions">
                        <button class="btn btn-ghost btn-sm" onclick="salesModule.viewSale(${row.id})" title="عرض">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-ghost btn-sm" onclick="salesModule.editSale(${row.id})" title="تعديل">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-ghost btn-sm" onclick="salesModule.printSale(${row.id})" title="طباعة">
                            <i class="fas fa-print"></i>
                        </button>
                        <button class="btn btn-ghost btn-sm text-danger" onclick="salesModule.deleteSale(${row.id})" title="حذف">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `
            }
        ];

        this.dataTable = new DataTable('#sales-table', {
            data: this.sales,
            columns: columns,
            searchable: true,
            sortable: true,
            pagination: true,
            pageSize: 10
        });
    }

    showAddSaleModal() {
        this.resetCurrentSale();
        const content = this.renderSaleForm();
        
        modal.show(content, {
            title: 'بيع جديد',
            size: 'large'
        });

        this.bindSaleFormEvents();
    }

    showQuickSaleModal() {
        const content = `
            <div class="quick-sale-form">
                <div class="form-group">
                    <label class="form-label">المنتج</label>
                    <select class="form-input" name="product" required>
                        <option value="">اختر المنتج</option>
                        ${this.products.map(product => `
                            <option value="${product.id}" data-price="${product.price}" data-stock="${product.stock}">
                                ${product.name} - ${formatCurrency(product.price)} (متوفر: ${product.stock})
                            </option>
                        `).join('')}
                    </select>
                </div>
                
                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label">الكمية</label>
                        <input type="number" class="form-input" name="quantity" min="1" value="1" required>
                    </div>
                    <div class="form-col">
                        <label class="form-label">السعر</label>
                        <input type="number" class="form-input" name="price" step="0.01" readonly>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">العميل (اختياري)</label>
                    <select class="form-input" name="customer">
                        <option value="">عميل عادي</option>
                        ${this.customers.map(customer => `
                            <option value="${customer.id}">${customer.name}</option>
                        `).join('')}
                    </select>
                </div>
                
                <div class="quick-sale-total">
                    <div class="total-row">
                        <span>المجموع الفرعي:</span>
                        <span id="quick-subtotal">${formatCurrency(0)}</span>
                    </div>
                    <div class="total-row">
                        <span>الضريبة (14%):</span>
                        <span id="quick-tax">${formatCurrency(0)}</span>
                    </div>
                    <div class="total-row total-final">
                        <span>المجموع النهائي:</span>
                        <span id="quick-total">${formatCurrency(0)}</span>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-success" onclick="salesModule.processQuickSale()">
                        <i class="fas fa-check"></i>
                        إتمام البيع
                    </button>
                    <button type="button" class="btn btn-ghost" onclick="modal.hide()">
                        إلغاء
                    </button>
                </div>
            </div>
        `;

        modal.show(content, {
            title: 'بيع سريع',
            size: 'medium'
        });

        this.bindQuickSaleEvents();
    }

    renderSaleForm() {
        return `
            <div class="sale-form">
                <div class="sale-form-header">
                    <div class="form-row">
                        <div class="form-col">
                            <label class="form-label">العميل</label>
                            <select class="form-input" name="customer">
                                <option value="">اختر العميل</option>
                                ${this.customers.map(customer => `
                                    <option value="${customer.id}">${customer.name}</option>
                                `).join('')}
                            </select>
                        </div>
                        <div class="form-col">
                            <label class="form-label">تاريخ البيع</label>
                            <input type="date" class="form-input" name="date" value="${new Date().toISOString().split('T')[0]}">
                        </div>
                    </div>
                </div>

                <div class="sale-items">
                    <h4>أصناف البيع</h4>
                    <div class="items-header">
                        <button type="button" class="btn btn-primary btn-sm" onclick="salesModule.addSaleItem()">
                            <i class="fas fa-plus"></i>
                            إضافة صنف
                        </button>
                    </div>
                    <div id="sale-items-list">
                        ${this.renderSaleItems()}
                    </div>
                </div>

                <div class="sale-summary">
                    <div class="form-row">
                        <div class="form-col">
                            <label class="form-label">خصم (%)</label>
                            <input type="number" class="form-input" name="discount" min="0" max="100" step="0.01" value="0">
                        </div>
                        <div class="form-col">
                            <label class="form-label">ضريبة (%)</label>
                            <input type="number" class="form-input" name="tax" min="0" max="100" step="0.01" value="14">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">ملاحظات</label>
                        <textarea class="form-textarea" name="notes" rows="3" placeholder="ملاحظات إضافية..."></textarea>
                    </div>
                    
                    <div class="sale-totals">
                        <div class="total-row">
                            <span>المجموع الفرعي:</span>
                            <span id="subtotal">${formatCurrency(0)}</span>
                        </div>
                        <div class="total-row">
                            <span>الخصم:</span>
                            <span id="discount-amount">${formatCurrency(0)}</span>
                        </div>
                        <div class="total-row">
                            <span>الضريبة:</span>
                            <span id="tax-amount">${formatCurrency(0)}</span>
                        </div>
                        <div class="total-row total-final">
                            <span>المجموع النهائي:</span>
                            <span id="final-total">${formatCurrency(0)}</span>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-success" onclick="salesModule.saveSale()">
                        <i class="fas fa-save"></i>
                        حفظ البيع
                    </button>
                    <button type="button" class="btn btn-primary" onclick="salesModule.saveSale(true)">
                        <i class="fas fa-print"></i>
                        حفظ وطباعة
                    </button>
                    <button type="button" class="btn btn-ghost" onclick="modal.hide()">
                        إلغاء
                    </button>
                </div>
            </div>
        `;
    }

    renderSaleItems() {
        if (this.currentSale.items.length === 0) {
            return '<p class="text-muted">لم يتم إضافة أي أصناف بعد</p>';
        }

        return `
            <div class="sale-items-table">
                <table class="table">
                    <thead>
                        <tr>
                            <th>المنتج</th>
                            <th>الكمية</th>
                            <th>السعر</th>
                            <th>المجموع</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.currentSale.items.map((item, index) => `
                            <tr>
                                <td>${item.productName}</td>
                                <td>${item.quantity}</td>
                                <td>${formatCurrency(item.price)}</td>
                                <td>${formatCurrency(item.quantity * item.price)}</td>
                                <td>
                                    <button class="btn btn-ghost btn-sm text-danger" onclick="salesModule.removeSaleItem(${index})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    bindEvents() {
        // Module-specific events
    }

    bindSaleFormEvents() {
        // Update totals when discount or tax changes
        const discountInput = $$('input[name="discount"]');
        const taxInput = $$('input[name="tax"]');
        
        if (discountInput) {
            discountInput.addEventListener('input', () => this.updateSaleTotals());
        }
        
        if (taxInput) {
            taxInput.addEventListener('input', () => this.updateSaleTotals());
        }
    }

    bindQuickSaleEvents() {
        const productSelect = $$('select[name="product"]');
        const quantityInput = $$('input[name="quantity"]');
        const priceInput = $$('input[name="price"]');

        if (productSelect) {
            productSelect.addEventListener('change', () => {
                const selectedOption = productSelect.selectedOptions[0];
                if (selectedOption) {
                    const price = selectedOption.dataset.price;
                    if (priceInput) {
                        priceInput.value = price;
                    }
                    this.updateQuickSaleTotal();
                }
            });
        }

        if (quantityInput) {
            quantityInput.addEventListener('input', () => {
                this.updateQuickSaleTotal();
            });
        }
    }

    addSaleItem() {
        const content = `
            <div class="add-item-form">
                <div class="form-group">
                    <label class="form-label">المنتج</label>
                    <select class="form-input" name="product" required>
                        <option value="">اختر المنتج</option>
                        ${this.products.map(product => `
                            <option value="${product.id}" data-price="${product.price}" data-stock="${product.stock}">
                                ${product.name} - ${formatCurrency(product.price)} (متوفر: ${product.stock})
                            </option>
                        `).join('')}
                    </select>
                </div>
                
                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label">الكمية</label>
                        <input type="number" class="form-input" name="quantity" min="1" value="1" required>
                    </div>
                    <div class="form-col">
                        <label class="form-label">السعر</label>
                        <input type="number" class="form-input" name="price" step="0.01" required>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" onclick="salesModule.confirmAddItem()">
                        إضافة
                    </button>
                    <button type="button" class="btn btn-ghost" onclick="modal.hide()">
                        إلغاء
                    </button>
                </div>
            </div>
        `;

        modal.show(content, {
            title: 'إضافة صنف',
            size: 'medium'
        });

        // Bind product selection event
        const productSelect = $$('select[name="product"]');
        const priceInput = $$('input[name="price"]');
        
        if (productSelect && priceInput) {
            productSelect.addEventListener('change', () => {
                const selectedOption = productSelect.selectedOptions[0];
                if (selectedOption) {
                    priceInput.value = selectedOption.dataset.price;
                }
            });
        }
    }

    confirmAddItem() {
        const productSelect = $$('select[name="product"]');
        const quantityInput = $$('input[name="quantity"]');
        const priceInput = $$('input[name="price"]');

        if (!productSelect.value || !quantityInput.value || !priceInput.value) {
            toast.error('يرجى ملء جميع الحقول المطلوبة');
            return;
        }

        const product = this.products.find(p => p.id == productSelect.value);
        const quantity = parseInt(quantityInput.value);
        const price = parseFloat(priceInput.value);

        if (quantity > product.stock) {
            toast.error('الكمية المطلوبة غير متوفرة في المخزون');
            return;
        }

        const item = {
            productId: product.id,
            productName: product.name,
            quantity: quantity,
            price: price
        };

        this.currentSale.items.push(item);
        this.updateSaleItemsList();
        this.updateSaleTotals();
        modal.hide();
        toast.success('تم إضافة الصنف بنجاح');
    }

    removeSaleItem(index) {
        this.currentSale.items.splice(index, 1);
        this.updateSaleItemsList();
        this.updateSaleTotals();
    }

    updateSaleItemsList() {
        const itemsList = $('sale-items-list');
        if (itemsList) {
            itemsList.innerHTML = this.renderSaleItems();
        }
    }

    updateSaleTotals() {
        const subtotal = this.currentSale.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        const discountPercent = parseFloat($$('input[name="discount"]')?.value || 0);
        const taxPercent = parseFloat($$('input[name="tax"]')?.value || 0);
        
        const discountAmount = subtotal * (discountPercent / 100);
        const taxableAmount = subtotal - discountAmount;
        const taxAmount = taxableAmount * (taxPercent / 100);
        const finalTotal = taxableAmount + taxAmount;

        // Update display
        const subtotalEl = $('subtotal');
        const discountEl = $('discount-amount');
        const taxEl = $('tax-amount');
        const totalEl = $('final-total');

        if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
        if (discountEl) discountEl.textContent = formatCurrency(discountAmount);
        if (taxEl) taxEl.textContent = formatCurrency(taxAmount);
        if (totalEl) totalEl.textContent = formatCurrency(finalTotal);
    }

    updateQuickSaleTotal() {
        const quantityInput = $$('input[name="quantity"]');
        const priceInput = $$('input[name="price"]');
        
        const quantity = parseInt(quantityInput?.value || 0);
        const price = parseFloat(priceInput?.value || 0);
        
        const subtotal = quantity * price;
        const tax = subtotal * 0.14; // 14% VAT
        const total = subtotal + tax;

        const subtotalEl = $('quick-subtotal');
        const taxEl = $('quick-tax');
        const totalEl = $('quick-total');

        if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
        if (taxEl) taxEl.textContent = formatCurrency(tax);
        if (totalEl) totalEl.textContent = formatCurrency(total);
    }

    async processQuickSale() {
        const productSelect = $$('select[name="product"]');
        const quantityInput = $$('input[name="quantity"]');
        const customerSelect = $$('select[name="customer"]');

        if (!productSelect.value || !quantityInput.value) {
            toast.error('يرجى اختيار المنتج والكمية');
            return;
        }

        const product = this.products.find(p => p.id == productSelect.value);
        const quantity = parseInt(quantityInput.value);

        if (quantity > product.stock) {
            toast.error('الكمية المطلوبة غير متوفرة في المخزون');
            return;
        }

        const saleData = {
            customer: customerSelect.value || 'عميل عادي',
            items: [{
                productId: product.id,
                productName: product.name,
                quantity: quantity,
                price: product.price
            }],
            discount: 0,
            tax: 14,
            notes: 'بيع سريع'
        };

        try {
            loading.show('quick-sale');
            const response = await api.createSale(saleData);
            
            if (response.success) {
                toast.success('تم إتمام البيع بنجاح');
                modal.hide();
                await this.loadData();
                this.dataTable.updateData(this.sales);
            } else {
                toast.error('فشل في إتمام البيع');
            }
        } catch (error) {
            console.error('Quick sale error:', error);
            toast.error('حدث خطأ في إتمام البيع');
        } finally {
            loading.hide('quick-sale');
        }
    }

    async saveSale(print = false) {
        if (this.currentSale.items.length === 0) {
            toast.error('يرجى إضافة أصناف للبيع');
            return;
        }

        const customerSelect = $$('select[name="customer"]');
        const dateInput = $$('input[name="date"]');
        const discountInput = $$('input[name="discount"]');
        const taxInput = $$('input[name="tax"]');
        const notesInput = $$('textarea[name="notes"]');

        const saleData = {
            customer: customerSelect.value || 'عميل عادي',
            date: dateInput.value,
            items: this.currentSale.items,
            discount: parseFloat(discountInput.value || 0),
            tax: parseFloat(taxInput.value || 0),
            notes: notesInput.value
        };

        try {
            loading.show('save-sale');
            const response = await api.createSale(saleData);
            
            if (response.success) {
                toast.success('تم حفظ البيع بنجاح');
                modal.hide();
                
                if (print) {
                    this.printSale(response.data.id);
                }
                
                await this.loadData();
                this.dataTable.updateData(this.sales);
            } else {
                toast.error('فشل في حفظ البيع');
            }
        } catch (error) {
            console.error('Save sale error:', error);
            toast.error('حدث خطأ في حفظ البيع');
        } finally {
            loading.hide('save-sale');
        }
    }

    resetCurrentSale() {
        this.currentSale = {
            items: [],
            customer: null,
            discount: 0,
            tax: 14,
            notes: ''
        };
    }

    viewSale(id) {
        const sale = this.sales.find(s => s.id === id);
        if (!sale) return;

        // Implementation for viewing sale details
        toast.info('عرض تفاصيل البيع قيد التطوير');
    }

    editSale(id) {
        const sale = this.sales.find(s => s.id === id);
        if (!sale) return;

        // Implementation for editing sale
        toast.info('تعديل البيع قيد التطوير');
    }

    printSale(id) {
        const sale = this.sales.find(s => s.id === id);
        if (!sale) return;

        // Implementation for printing sale
        toast.info('طباعة البيع قيد التطوير');
    }

    async deleteSale(id) {
        const confirmed = await modal.confirm('هل أنت متأكد من حذف هذا البيع؟', 'تأكيد الحذف');
        if (!confirmed) return;

        try {
            loading.show('delete-sale');
            const response = await api.deleteSale(id);
            
            if (response.success) {
                toast.success('تم حذف البيع بنجاح');
                await this.loadData();
                this.dataTable.updateData(this.sales);
            } else {
                toast.error('فشل في حذف البيع');
            }
        } catch (error) {
            console.error('Delete sale error:', error);
            toast.error('حدث خطأ في حذف البيع');
        } finally {
            loading.hide('delete-sale');
        }
    }

    exportSales() {
        // Implementation for exporting sales data
        toast.info('تصدير البيانات قيد التطوير');
    }

    // Helper methods
    getTodaySales() {
        const today = new Date().toDateString();
        return this.sales
            .filter(sale => new Date(sale.date).toDateString() === today)
            .reduce((sum, sale) => sum + sale.total, 0);
    }

    getMonthSales() {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        return this.sales
            .filter(sale => {
                const saleDate = new Date(sale.date);
                return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
            })
            .reduce((sum, sale) => sum + sale.total, 0);
    }

    getAverageSale() {
        if (this.sales.length === 0) return 0;
        const total = this.sales.reduce((sum, sale) => sum + sale.total, 0);
        return total / this.sales.length;
    }
}

// Export sales module
window.salesModule = new Sales();

// Suppliers Module

class Suppliers {
    constructor() {
        this.suppliers = [];
        this.dataTable = null;
        this.currentSupplier = null;
    }

    async init() {
        await this.loadData();
        this.render();
        this.bindEvents();
    }

    async loadData() {
        try {
            loading.show('suppliers');
            const response = await api.getSuppliers();
            
            if (response.success) {
                this.suppliers = response.data;
            }
        } catch (error) {
            console.error('Suppliers data loading error:', error);
            toast.error('حدث خطأ في تحميل بيانات الموردين');
        } finally {
            loading.hide('suppliers');
        }
    }

    render() {
        const content = `
            <div class="suppliers-container">
                <!-- Header Actions -->
                <div class="module-header">
                    <div class="module-title">
                        <h2>إدارة الموردين</h2>
                        <p>إدارة وتتبع جميع الموردين والمشتريات</p>
                    </div>
                    <div class="module-actions">
                        <button class="btn btn-success" onclick="suppliersModule.showAddSupplierModal()">
                            <i class="fas fa-plus"></i>
                            مورد جديد
                        </button>
                        <button class="btn btn-primary" onclick="suppliersModule.showAddPurchaseModal()">
                            <i class="fas fa-shopping-cart"></i>
                            شراء جديد
                        </button>
                    </div>
                </div>

                <!-- Suppliers Stats -->
                <div class="suppliers-stats">
                    <div class="stats-grid">
                        <div class="stat-card primary">
                            <div class="stat-header">
                                <span class="stat-title">إجمالي الموردين</span>
                                <div class="stat-icon primary">
                                    <i class="fas fa-truck"></i>
                                </div>
                            </div>
                            <div class="stat-value">${formatNumber(this.suppliers.length)}</div>
                            <div class="stat-change positive">
                                <i class="fas fa-arrow-up"></i>
                                +2 هذا الشهر
                            </div>
                        </div>
                        
                        <div class="stat-card success">
                            <div class="stat-header">
                                <span class="stat-title">إجمالي المشتريات</span>
                                <div class="stat-icon success">
                                    <i class="fas fa-dollar-sign"></i>
                                </div>
                            </div>
                            <div class="stat-value">${formatCurrency(this.getTotalPurchases())}</div>
                            <div class="stat-change positive">
                                <i class="fas fa-arrow-up"></i>
                                +15.2%
                            </div>
                        </div>
                        
                        <div class="stat-card warning">
                            <div class="stat-header">
                                <span class="stat-title">موردين نشطين</span>
                                <div class="stat-icon warning">
                                    <i class="fas fa-handshake"></i>
                                </div>
                            </div>
                            <div class="stat-value">${formatNumber(this.getActiveSuppliers())}</div>
                            <div class="stat-change positive">
                                <i class="fas fa-arrow-up"></i>
                                +3 جديد
                            </div>
                        </div>
                        
                        <div class="stat-card info">
                            <div class="stat-header">
                                <span class="stat-title">متوسط الشراء</span>
                                <div class="stat-icon info">
                                    <i class="fas fa-chart-line"></i>
                                </div>
                            </div>
                            <div class="stat-value">${formatCurrency(this.getAveragePurchase())}</div>
                            <div class="stat-change positive">
                                <i class="fas fa-arrow-up"></i>
                                +8.7%
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Suppliers Table -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">قائمة الموردين</h3>
                        <div class="card-actions">
                            <button class="btn btn-ghost btn-sm" onclick="suppliersModule.exportSuppliers()">
                                <i class="fas fa-download"></i>
                                تصدير
                            </button>
                            <button class="btn btn-ghost btn-sm" onclick="suppliersModule.printSuppliers()">
                                <i class="fas fa-print"></i>
                                طباعة
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div id="suppliers-table"></div>
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
                title: 'اسم المورد'
            },
            {
                key: 'company',
                title: 'الشركة'
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
                        <button class="btn btn-ghost btn-sm" onclick="suppliersModule.viewSupplier(${row.id})" title="عرض">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-ghost btn-sm" onclick="suppliersModule.editSupplier(${row.id})" title="تعديل">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-ghost btn-sm" onclick="suppliersModule.viewPurchaseHistory(${row.id})" title="سجل المشتريات">
                            <i class="fas fa-history"></i>
                        </button>
                        <button class="btn btn-ghost btn-sm text-danger" onclick="suppliersModule.deleteSupplier(${row.id})" title="حذف">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `
            }
        ];

        this.dataTable = new DataTable('#suppliers-table', {
            data: this.suppliers,
            columns: columns,
            searchable: true,
            sortable: true,
            pagination: true,
            pageSize: 15
        });
    }

    showAddSupplierModal() {
        this.currentSupplier = null;
        const content = this.renderSupplierForm();
        
        modal.show(content, {
            title: 'إضافة مورد جديد',
            size: 'large'
        });

        this.bindSupplierFormEvents();
    }

    renderSupplierForm() {
        const supplier = this.currentSupplier || {};
        
        return `
            <form class="supplier-form">
                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label">اسم المورد *</label>
                        <input type="text" class="form-input" name="name" value="${supplier.name || ''}" required>
                    </div>
                    <div class="form-col">
                        <label class="form-label">اسم الشركة</label>
                        <input type="text" class="form-input" name="company" value="${supplier.company || ''}">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label">رقم الهاتف *</label>
                        <input type="tel" class="form-input" name="phone" value="${supplier.phone || ''}" required>
                    </div>
                    <div class="form-col">
                        <label class="form-label">البريد الإلكتروني</label>
                        <input type="email" class="form-input" name="email" value="${supplier.email || ''}">
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">العنوان</label>
                    <textarea class="form-textarea" name="address" rows="2" placeholder="العنوان الكامل...">${supplier.address || ''}</textarea>
                </div>

                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label">المدينة</label>
                        <input type="text" class="form-input" name="city" value="${supplier.city || ''}">
                    </div>
                    <div class="form-col">
                        <label class="form-label">الرقم الضريبي</label>
                        <input type="text" class="form-input" name="taxNumber" value="${supplier.taxNumber || ''}">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label">فئة المنتجات</label>
                        <input type="text" class="form-input" name="productCategory" value="${supplier.productCategory || ''}" placeholder="مثل: أجهزة كمبيوتر، ملحقات، إلخ">
                    </div>
                    <div class="form-col">
                        <label class="form-label">مدة التوريد (يوم)</label>
                        <input type="number" class="form-input" name="deliveryTime" min="0" value="${supplier.deliveryTime || 7}">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label">شروط الدفع</label>
                        <select class="form-select" name="paymentTerms">
                            <option value="cash" ${supplier.paymentTerms === 'cash' ? 'selected' : ''}>نقدي</option>
                            <option value="30_days" ${supplier.paymentTerms === '30_days' ? 'selected' : ''}>30 يوم</option>
                            <option value="60_days" ${supplier.paymentTerms === '60_days' ? 'selected' : ''}>60 يوم</option>
                            <option value="90_days" ${supplier.paymentTerms === '90_days' ? 'selected' : ''}>90 يوم</option>
                        </select>
                    </div>
                    <div class="form-col">
                        <label class="form-label">تقييم المورد</label>
                        <select class="form-select" name="rating">
                            <option value="5" ${supplier.rating === 5 ? 'selected' : ''}>ممتاز (5 نجوم)</option>
                            <option value="4" ${supplier.rating === 4 ? 'selected' : ''}>جيد جداً (4 نجوم)</option>
                            <option value="3" ${supplier.rating === 3 ? 'selected' : ''}>جيد (3 نجوم)</option>
                            <option value="2" ${supplier.rating === 2 ? 'selected' : ''}>مقبول (2 نجمة)</option>
                            <option value="1" ${supplier.rating === 1 ? 'selected' : ''}>ضعيف (1 نجمة)</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">ملاحظات</label>
                    <textarea class="form-textarea" name="notes" rows="3" placeholder="ملاحظات إضافية...">${supplier.notes || ''}</textarea>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-success" onclick="suppliersModule.saveSupplier()">
                        <i class="fas fa-save"></i>
                        ${this.currentSupplier ? 'تحديث' : 'حفظ'}
                    </button>
                    <button type="button" class="btn btn-ghost" onclick="modal.hide()">
                        إلغاء
                    </button>
                </div>
            </form>
        `;
    }

    showAddPurchaseModal() {
        const content = `
            <div class="purchase-form">
                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label">المورد *</label>
                        <select class="form-select" name="supplier" required>
                            <option value="">اختر المورد</option>
                            ${this.suppliers.map(supplier => `
                                <option value="${supplier.id}">${supplier.name} - ${supplier.company || 'غير محدد'}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-col">
                        <label class="form-label">تاريخ الشراء</label>
                        <input type="date" class="form-input" name="date" value="${new Date().toISOString().split('T')[0]}">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label">رقم الفاتورة</label>
                        <input type="text" class="form-input" name="invoiceNumber" placeholder="رقم فاتورة المورد">
                    </div>
                    <div class="form-col">
                        <label class="form-label">طريقة الدفع</label>
                        <select class="form-select" name="paymentMethod">
                            <option value="cash">نقدي</option>
                            <option value="bank_transfer">تحويل بنكي</option>
                            <option value="check">شيك</option>
                            <option value="credit">آجل</option>
                        </select>
                    </div>
                </div>

                <div class="purchase-items">
                    <h4>أصناف الشراء</h4>
                    <div class="items-header">
                        <button type="button" class="btn btn-primary btn-sm" onclick="suppliersModule.addPurchaseItem()">
                            <i class="fas fa-plus"></i>
                            إضافة صنف
                        </button>
                    </div>
                    <div id="purchase-items-list">
                        <p class="text-muted">لم يتم إضافة أي أصناف بعد</p>
                    </div>
                </div>

                <div class="purchase-summary">
                    <div class="form-row">
                        <div class="form-col">
                            <label class="form-label">خصم (%)</label>
                            <input type="number" class="form-input" name="discount" min="0" max="100" step="0.01" value="0">
                        </div>
                        <div class="form-col">
                            <label class="form-label">ضريبة (%)</label>
                            <input type="number" class="form-input" name="tax" min="0" max="100" step="0.01" value="15">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">ملاحظات</label>
                        <textarea class="form-textarea" name="notes" rows="2" placeholder="ملاحظات الشراء..."></textarea>
                    </div>
                    
                    <div class="purchase-totals">
                        <div class="total-row">
                            <span>المجموع الفرعي:</span>
                            <span id="purchase-subtotal">${formatCurrency(0)}</span>
                        </div>
                        <div class="total-row">
                            <span>الخصم:</span>
                            <span id="purchase-discount-amount">${formatCurrency(0)}</span>
                        </div>
                        <div class="total-row">
                            <span>الضريبة:</span>
                            <span id="purchase-tax-amount">${formatCurrency(0)}</span>
                        </div>
                        <div class="total-row total-final">
                            <span>المجموع النهائي:</span>
                            <span id="purchase-final-total">${formatCurrency(0)}</span>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-success" onclick="suppliersModule.savePurchase()">
                        <i class="fas fa-save"></i>
                        حفظ الشراء
                    </button>
                    <button type="button" class="btn btn-ghost" onclick="modal.hide()">
                        إلغاء
                    </button>
                </div>
            </div>
        `;

        modal.show(content, {
            title: 'شراء جديد',
            size: 'large'
        });

        this.currentPurchase = { items: [] };
        this.bindPurchaseFormEvents();
    }

    bindEvents() {
        // Module-specific events
    }

    bindSupplierFormEvents() {
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

    bindPurchaseFormEvents() {
        const discountInput = $$('input[name="discount"]');
        const taxInput = $$('input[name="tax"]');
        
        if (discountInput) {
            discountInput.addEventListener('input', () => this.updatePurchaseTotals());
        }
        
        if (taxInput) {
            taxInput.addEventListener('input', () => this.updatePurchaseTotals());
        }
    }

    addPurchaseItem() {
        const content = `
            <div class="add-purchase-item-form">
                <div class="form-group">
                    <label class="form-label">اسم المنتج *</label>
                    <input type="text" class="form-input" name="productName" required placeholder="اسم المنتج">
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
                
                <div class="form-row">
                    <div class="form-col">
                        <label class="form-label">الوحدة</label>
                        <select class="form-select" name="unit">
                            <option value="قطعة">قطعة</option>
                            <option value="كيلو">كيلو</option>
                            <option value="متر">متر</option>
                            <option value="لتر">لتر</option>
                        </select>
                    </div>
                    <div class="form-col">
                        <label class="form-label">المجموع</label>
                        <input type="number" class="form-input" name="total" readonly>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" onclick="suppliersModule.confirmAddPurchaseItem()">
                        إضافة
                    </button>
                    <button type="button" class="btn btn-ghost" onclick="modal.hide()">
                        إلغاء
                    </button>
                </div>
            </div>
        `;

        modal.show(content, {
            title: 'إضافة صنف للشراء',
            size: 'medium'
        });

        // Auto calculate total
        const quantityInput = $$('input[name="quantity"]');
        const priceInput = $$('input[name="unitPrice"]');
        const totalInput = $$('input[name="total"]');

        const calculateTotal = () => {
            const quantity = parseFloat(quantityInput.value) || 0;
            const price = parseFloat(priceInput.value) || 0;
            totalInput.value = (quantity * price).toFixed(2);
        };

        if (quantityInput) quantityInput.addEventListener('input', calculateTotal);
        if (priceInput) priceInput.addEventListener('input', calculateTotal);
    }

    confirmAddPurchaseItem() {
        const productName = $$('input[name="productName"]').value;
        const quantity = parseFloat($$('input[name="quantity"]').value);
        const unitPrice = parseFloat($$('input[name="unitPrice"]').value);
        const unit = $$('select[name="unit"]').value;

        if (!productName || !quantity || !unitPrice) {
            toast.error('يرجى ملء جميع الحقول المطلوبة');
            return;
        }

        const item = {
            productName,
            quantity,
            unitPrice,
            unit,
            total: quantity * unitPrice
        };

        this.currentPurchase.items.push(item);
        this.updatePurchaseItemsList();
        this.updatePurchaseTotals();
        modal.hide();
        toast.success('تم إضافة الصنف بنجاح');
    }

    updatePurchaseItemsList() {
        const itemsList = $('purchase-items-list');
        if (!itemsList) return;

        if (this.currentPurchase.items.length === 0) {
            itemsList.innerHTML = '<p class="text-muted">لم يتم إضافة أي أصناف بعد</p>';
            return;
        }

        itemsList.innerHTML = `
            <div class="purchase-items-table">
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
                        ${this.currentPurchase.items.map((item, index) => `
                            <tr>
                                <td>${item.productName}</td>
                                <td>${item.quantity} ${item.unit}</td>
                                <td>${formatCurrency(item.unitPrice)}</td>
                                <td>${formatCurrency(item.total)}</td>
                                <td>
                                    <button class="btn btn-ghost btn-sm text-danger" onclick="suppliersModule.removePurchaseItem(${index})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    removePurchaseItem(index) {
        this.currentPurchase.items.splice(index, 1);
        this.updatePurchaseItemsList();
        this.updatePurchaseTotals();
    }

    updatePurchaseTotals() {
        const subtotal = this.currentPurchase.items.reduce((sum, item) => sum + item.total, 0);
        const discountPercent = parseFloat($$('input[name="discount"]')?.value || 0);
        const taxPercent = parseFloat($$('input[name="tax"]')?.value || 0);
        
        const discountAmount = subtotal * (discountPercent / 100);
        const taxableAmount = subtotal - discountAmount;
        const taxAmount = taxableAmount * (taxPercent / 100);
        const finalTotal = taxableAmount + taxAmount;

        // Update display
        const subtotalEl = $('purchase-subtotal');
        const discountEl = $('purchase-discount-amount');
        const taxEl = $('purchase-tax-amount');
        const totalEl = $('purchase-final-total');

        if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
        if (discountEl) discountEl.textContent = formatCurrency(discountAmount);
        if (taxEl) taxEl.textContent = formatCurrency(taxAmount);
        if (totalEl) totalEl.textContent = formatCurrency(finalTotal);
    }

    async saveSupplier() {
        const form = $$('.supplier-form');
        const formData = new FormData(form);
        
        const supplierData = {
            name: formData.get('name'),
            company: formData.get('company'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            address: formData.get('address'),
            city: formData.get('city'),
            taxNumber: formData.get('taxNumber'),
            productCategory: formData.get('productCategory'),
            deliveryTime: parseInt(formData.get('deliveryTime')) || 7,
            paymentTerms: formData.get('paymentTerms'),
            rating: parseInt(formData.get('rating')) || 5,
            notes: formData.get('notes')
        };

        // Validation
        if (!supplierData.name || !supplierData.phone) {
            toast.error('يرجى ملء الحقول المطلوبة (الاسم ورقم الهاتف)');
            return;
        }

        if (!validatePhone(supplierData.phone)) {
            toast.error('يرجى إدخال رقم هاتف صحيح');
            return;
        }

        if (supplierData.email && !validateEmail(supplierData.email)) {
            toast.error('يرجى إدخال بريد إلكتروني صحيح');
            return;
        }

        try {
            loading.show('save-supplier');
            
            let response;
            if (this.currentSupplier) {
                response = await api.updateSupplier(this.currentSupplier.id, supplierData);
            } else {
                response = await api.createSupplier(supplierData);
            }
            
            if (response.success) {
                toast.success(`تم ${this.currentSupplier ? 'تحديث' : 'إضافة'} المورد بنجاح`);
                modal.hide();
                await this.loadData();
                this.dataTable.updateData(this.suppliers);
            } else {
                toast.error(`فشل في ${this.currentSupplier ? 'تحديث' : 'إضافة'} المورد`);
            }
        } catch (error) {
            console.error('Save supplier error:', error);
            toast.error('حدث خطأ في حفظ المورد');
        } finally {
            loading.hide('save-supplier');
        }
    }

    async savePurchase() {
        if (this.currentPurchase.items.length === 0) {
            toast.error('يرجى إضافة أصناف للشراء');
            return;
        }

        const supplierSelect = $$('select[name="supplier"]');
        const dateInput = $$('input[name="date"]');
        const invoiceNumberInput = $$('input[name="invoiceNumber"]');
        const paymentMethodSelect = $$('select[name="paymentMethod"]');
        const discountInput = $$('input[name="discount"]');
        const taxInput = $$('input[name="tax"]');
        const notesInput = $$('textarea[name="notes"]');

        if (!supplierSelect.value) {
            toast.error('يرجى اختيار المورد');
            return;
        }

        const purchaseData = {
            supplierId: supplierSelect.value,
            date: dateInput.value,
            invoiceNumber: invoiceNumberInput.value,
            paymentMethod: paymentMethodSelect.value,
            items: this.currentPurchase.items,
            discount: parseFloat(discountInput.value || 0),
            tax: parseFloat(taxInput.value || 0),
            notes: notesInput.value
        };

        try {
            loading.show('save-purchase');
            const response = await api.createPurchase(purchaseData);
            
            if (response.success) {
                toast.success('تم حفظ الشراء بنجاح');
                modal.hide();
                // Refresh suppliers data to update purchase totals
                await this.loadData();
                this.dataTable.updateData(this.suppliers);
            } else {
                toast.error('فشل في حفظ الشراء');
            }
        } catch (error) {
            console.error('Save purchase error:', error);
            toast.error('حدث خطأ في حفظ الشراء');
        } finally {
            loading.hide('save-purchase');
        }
    }

    viewSupplier(id) {
        const supplier = this.suppliers.find(s => s.id === id);
        if (!supplier) return;

        const content = `
            <div class="supplier-details">
                <div class="supplier-header">
                    <h3>${supplier.name}</h3>
                    ${supplier.company ? `<p class="supplier-company">${supplier.company}</p>` : ''}
                    <div class="supplier-rating">
                        ${this.renderStars(supplier.rating || 5)}
                    </div>
                </div>
                
                <div class="supplier-info-grid">
                    <div class="info-section">
                        <h4>معلومات الاتصال</h4>
                        <div class="info-item">
                            <label>الهاتف:</label>
                            <span>${supplier.phone}</span>
                        </div>
                        <div class="info-item">
                            <label>البريد الإلكتروني:</label>
                            <span>${supplier.email || 'غير محدد'}</span>
                        </div>
                        <div class="info-item">
                            <label>العنوان:</label>
                            <span>${supplier.address || 'غير محدد'}</span>
                        </div>
                        <div class="info-item">
                            <label>المدينة:</label>
                            <span>${supplier.city || 'غير محدد'}</span>
                        </div>
                    </div>
                    
                    <div class="info-section">
                        <h4>معلومات التوريد</h4>
                        <div class="info-item">
                            <label>فئة المنتجات:</label>
                            <span>${supplier.productCategory || 'غير محدد'}</span>
                        </div>
                        <div class="info-item">
                            <label>مدة التوريد:</label>
                            <span>${supplier.deliveryTime || 7} يوم</span>
                        </div>
                        <div class="info-item">
                            <label>شروط الدفع:</label>
                            <span>${this.getPaymentTermsText(supplier.paymentTerms)}</span>
                        </div>
                        <div class="info-item">
                            <label>إجمالي المشتريات:</label>
                            <span>${formatCurrency(supplier.totalPurchases || 0)}</span>
                        </div>
                    </div>
                </div>
                
                ${supplier.notes ? `
                    <div class="supplier-notes">
                        <h4>ملاحظات:</h4>
                        <p>${supplier.notes}</p>
                    </div>
                ` : ''}
                
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="suppliersModule.editSupplier(${supplier.id}); modal.hide();">
                        <i class="fas fa-edit"></i>
                        تعديل
                    </button>
                    <button class="btn btn-info" onclick="suppliersModule.viewPurchaseHistory(${supplier.id}); modal.hide();">
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
            title: 'تفاصيل المورد',
            size: 'large'
        });
    }

    editSupplier(id) {
        this.currentSupplier = this.suppliers.find(s => s.id === id);
        if (!this.currentSupplier) return;

        const content = this.renderSupplierForm();
        
        modal.show(content, {
            title: 'تعديل المورد',
            size: 'large'
        });

        this.bindSupplierFormEvents();
    }

    viewPurchaseHistory(id) {
        const supplier = this.suppliers.find(s => s.id === id);
        if (!supplier) return;

        // Mock purchase history data
        const purchases = [
            { id: 1, date: '2024-01-15', amount: 15000, items: 5, status: 'مكتملة' },
            { id: 2, date: '2024-01-10', amount: 23000, items: 8, status: 'مكتملة' },
            { id: 3, date: '2024-01-05', amount: 8000, items: 3, status: 'مكتملة' }
        ];

        const content = `
            <div class="purchase-history">
                <div class="history-header">
                    <h4>سجل مشتريات: ${supplier.name}</h4>
                    <div class="history-stats">
                        <span>إجمالي المشتريات: ${formatCurrency(supplier.totalPurchases || 0)}</span>
                        <span>عدد العمليات: ${purchases.length}</span>
                    </div>
                </div>
                
                <div class="history-table">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>رقم الشراء</th>
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
                    <button class="btn btn-primary" onclick="suppliersModule.exportSupplierHistory(${supplier.id})">
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

    async deleteSupplier(id) {
        const supplier = this.suppliers.find(s => s.id === id);
        if (!supplier) return;

        const confirmed = await modal.confirm(
            `هل أنت متأكد من حذف المورد "${supplier.name}"؟`,
            'تأكيد الحذف'
        );
        
        if (!confirmed) return;

        try {
            loading.show('delete-supplier');
            const response = await api.deleteSupplier(id);
            
            if (response.success) {
                toast.success('تم حذف المورد بنجاح');
                await this.loadData();
                this.dataTable.updateData(this.suppliers);
            } else {
                toast.error('فشل في حذف المورد');
            }
        } catch (error) {
            console.error('Delete supplier error:', error);
            toast.error('حدث خطأ في حذف المورد');
        } finally {
            loading.hide('delete-supplier');
        }
    }

    exportSuppliers() {
        const csvContent = this.generateSuppliersCSV();
        downloadFile(csvContent, 'suppliers.csv', 'text/csv');
        toast.success('تم تصدير البيانات بنجاح');
    }

    exportSupplierHistory(supplierId) {
        // Implementation for exporting supplier purchase history
        toast.info('تصدير سجل المورد قيد التطوير');
    }

    printSuppliers() {
        const printContent = this.generateSuppliersPrintContent();
        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    }

    // Helper methods
    getTotalPurchases() {
        return this.suppliers.reduce((total, supplier) => total + (supplier.totalPurchases || 0), 0);
    }

    getActiveSuppliers() {
        return this.suppliers.filter(supplier => supplier.status === 'نشط').length;
    }

    getAveragePurchase() {
        if (this.suppliers.length === 0) return 0;
        const total = this.getTotalPurchases();
        return total / this.suppliers.length;
    }

    renderStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += `<i class="fas fa-star ${i <= rating ? 'text-warning' : 'text-muted'}"></i>`;
        }
        return stars;
    }

    getPaymentTermsText(terms) {
        const termsMap = {
            'cash': 'نقدي',
            '30_days': '30 يوم',
            '60_days': '60 يوم',
            '90_days': '90 يوم'
        };
        return termsMap[terms] || 'غير محدد';
    }

    generateSuppliersCSV() {
        const headers = ['الكود', 'الاسم', 'الشركة', 'الهاتف', 'البريد الإلكتروني', 'المدينة', 'إجمالي المشتريات'];
        const rows = this.suppliers.map(supplier => [
            supplier.id,
            supplier.name,
            supplier.company || '',
            supplier.phone,
            supplier.email || '',
            supplier.city || '',
            supplier.totalPurchases || 0
        ]);

        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    generateSuppliersPrintContent() {
        return `
            <html>
                <head>
                    <title>قائمة الموردين</title>
                    <style>
                        body { font-family: 'Cairo', Arial, sans-serif; direction: rtl; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
                        th { background-color: #f5f5f5; }
                        h1 { text-align: center; color: #333; }
                    </style>
                </head>
                <body>
                    <h1>قائمة الموردين</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>الكود</th>
                                <th>الاسم</th>
                                <th>الشركة</th>
                                <th>الهاتف</th>
                                <th>البريد الإلكتروني</th>
                                <th>المدينة</th>
                                <th>إجمالي المشتريات</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.suppliers.map(supplier => `
                                <tr>
                                    <td>#${supplier.id}</td>
                                    <td>${supplier.name}</td>
                                    <td>${supplier.company || '-'}</td>
                                    <td>${supplier.phone}</td>
                                    <td>${supplier.email || '-'}</td>
                                    <td>${supplier.city || '-'}</td>
                                    <td>${formatCurrency(supplier.totalPurchases || 0)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
            </html>
        `;
    }
}

// Export suppliers module
window.suppliersModule = new Suppliers();

// Main Application Logic

document.addEventListener("DOMContentLoaded", () => {
    // Global utility functions
    window.$ = (selector) => document.getElementById(selector);
    window.$$ = (selector) => document.querySelector(selector);
    window.$$$ = (selector) => document.querySelectorAll(selector);

    // Initialize shared components
    window.toast = new Toast();
    window.modal = new Modal();
    window.loading = new Loading();
    window.dataTable = DataTable; // Expose DataTable class globally

    // Initialize API client
    window.api = new APIClient();

    // Theme toggle
    const themeToggle = $("theme-toggle");
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
    const navLinks = $$$(".sidebar-nav a");
    const pageContent = $("page-content");

    const loadModule = async (moduleName) => {
        loading.show("page");
        try {
            // Initialize module if not already loaded
            const moduleInstance = window[`${moduleName.toLowerCase()}Module`];
            if (moduleInstance && typeof moduleInstance.init === "function") {
                await moduleInstance.init();
            } else {
                throw new Error(`Module ${moduleName} not found or doesn't have init method`);
            }
        } catch (error) {
            console.error(`Error loading module ${moduleName}:`, error);
            pageContent.innerHTML = `<div class="error-message">حدث خطأ أثناء تحميل ${moduleName}.</div>`;
            toast.error(`فشل تحميل ${moduleName}`);
        } finally {
            loading.hide("page");
        }
    };

    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const moduleName = e.target.closest("a").dataset.module;
            if (moduleName) {
                // Remove active from all links
                navLinks.forEach(nav => nav.classList.remove("active"));
                // Add active to clicked link
                e.target.closest("a").classList.add("active");
                loadModule(moduleName);
            }
        });
    });

    // Load dashboard by default
    loadModule("Dashboard");

    // Global search functionality (mock for now)
    const searchInput = $("global-search-input");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value;
            if (query.length > 2) {
                // Simulate search results
                console.log("Searching for:", query);
                // In a real app, you'd call an API here
            }
        });
    }

    // Notification dropdown (mock for now)
    const notificationBell = $("notification-bell");
    const notificationDropdown = $("notification-dropdown");
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

    // User dropdown (mock for now)
    const userAvatar = $("user-avatar");
    const userDropdown = $("user-dropdown");
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
    const fabButton = $("fab-button");
    if (fabButton) {
        fabButton.addEventListener("click", () => {
            // Assuming salesModule is loaded and has showQuickSaleModal
            if (window.salesModule && typeof window.salesModule.showQuickSaleModal === "function") {
                window.salesModule.showQuickSaleModal();
            } else {
                toast.info("وحدة المبيعات غير محملة أو لا تدعم البيع السريع");
            }
        });
    }

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.key === "q") { // Ctrl+Q for Quick Sale
            e.preventDefault();
            if (window.salesModule && typeof window.salesModule.showQuickSaleModal === "function") {
                window.salesModule.showQuickSaleModal();
            } else {
                toast.info("وحدة المبيعات غير محملة أو لا تدعم البيع السريع");
            }
        }
        if (e.ctrlKey && e.key === "t") { // Ctrl+T for Theme Toggle
            e.preventDefault();
            if (themeToggle) {
                themeToggle.click();
            }
        }
    });
});

// Global helper functions (can be moved to utils.js if preferred)
function formatCurrency(amount) {
    return new Intl.NumberFormat("ar-EG", {
        style: "currency",
        currency: "EGP",
        minimumFractionDigits: 2,
    }).format(amount);
}

function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("ar-EG", options);
}

function formatNumber(num) {
    return new Intl.NumberFormat("ar-EG").format(num);
}

function downloadFile(content, filename, contentType) {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
}


