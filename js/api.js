// API Management

class APIClient {
    constructor(baseURL = 'http://127.0.0.1:5000/api') {
        this.baseURL = baseURL;
        this.token = window.utils.storage.get("auth_token");
    }

    // Set authentication token
    setToken(token) {
        this.token = token;
        window.utils.storage.set("auth_token", token);
    }

    // Remove authentication token
    removeToken() {
        this.token = null;
        window.utils.storage.remove("auth_token");
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

