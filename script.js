// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const contentSections = document.querySelectorAll('.content-section');
const quickAddBtn = document.getElementById('quickAddBtn');
const quickAddModal = document.getElementById('quickAddModal');
const closeModals = document.querySelectorAll('.close');
const searchInput = document.getElementById('searchInput');
const themeToggle = document.getElementById('themeToggle');
const notificationsBtn = document.getElementById('notificationsBtn');
const notificationsDropdown = document.getElementById('notificationsDropdown');
const notificationsList = document.getElementById('notificationsList');
const notificationBadge = document.getElementById('notificationBadge');
const markAllRead = document.getElementById('markAllRead');
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');

// Sample Data
const sampleData = {
    sales: [
        { id: 'ORD-001', customer: 'أحمد محمد', date: '2024-01-15', products: 'لابتوب Dell XPS 13', amount: 1250, status: 'completed' },
        { id: 'ORD-002', customer: 'فاطمة علي', date: '2024-01-14', products: 'هاتف iPhone 15', amount: 850, status: 'pending' },
        { id: 'ORD-003', customer: 'محمد سالم', date: '2024-01-13', products: 'ساعة Apple Watch', amount: 2100, status: 'completed' },
        { id: 'ORD-004', customer: 'نورا أحمد', date: '2024-01-12', products: 'تابلت iPad Pro', amount: 1800, status: 'pending' },
        { id: 'ORD-005', customer: 'خالد محمود', date: '2024-01-11', products: 'سماعات AirPods', amount: 650, status: 'cancelled' }
    ],
    inventory: [
        { code: 'PROD-001', name: 'لابتوب Dell XPS 13', category: 'electronics', quantity: 25, price: 1500, status: 'in-stock' },
        { code: 'PROD-002', name: 'هاتف iPhone 15', category: 'electronics', quantity: 5, price: 4500, status: 'low-stock' },
        { code: 'PROD-003', name: 'ساعة Apple Watch', category: 'accessories', quantity: 0, price: 1500, status: 'out-of-stock' },
        { code: 'PROD-004', name: 'تابلت iPad Pro', category: 'electronics', quantity: 15, price: 2400, status: 'in-stock' },
        { code: 'PROD-005', name: 'سماعات AirPods', category: 'accessories', quantity: 8, price: 650, status: 'low-stock' }
    ],
    customers: [
        { id: 'CUST-001', name: 'أحمد محمد', email: 'ahmed@example.com', phone: '0501234567', totalPurchases: 5250, lastPurchase: '2024-01-15', status: 'active' },
        { id: 'CUST-002', name: 'فاطمة علي', email: 'fatima@example.com', phone: '0507654321', totalPurchases: 3200, lastPurchase: '2024-01-14', status: 'active' },
        { id: 'CUST-003', name: 'محمد سالم', email: 'mohammed@example.com', phone: '0509876543', totalPurchases: 8900, lastPurchase: '2024-01-13', status: 'active' },
        { id: 'CUST-004', name: 'نورا أحمد', email: 'nora@example.com', phone: '0502468135', totalPurchases: 1800, lastPurchase: '2024-01-12', status: 'inactive' }
    ],
    suppliers: [
        { id: 'SUPP-001', name: 'شركة التقنية المتقدمة', products: 'إلكترونيات', phone: '0112345678', totalPurchases: 125000, status: 'active' },
        { id: 'SUPP-002', name: 'مؤسسة الأجهزة الذكية', products: 'هواتف وأجهزة لوحية', phone: '0118765432', totalPurchases: 89000, status: 'active' },
        { id: 'SUPP-003', name: 'شركة الإكسسوارات الحديثة', products: 'إكسسوارات', phone: '0119876543', totalPurchases: 45000, status: 'inactive' }
    ],
    invoices: [
        { id: 'INV-001', customer: 'أحمد محمد', date: '2024-01-15', amount: 1250, status: 'paid' },
        { id: 'INV-002', customer: 'فاطمة علي', date: '2024-01-14', amount: 850, status: 'pending' },
        { id: 'INV-003', customer: 'محمد سالم', date: '2024-01-13', amount: 2100, status: 'paid' }
    ],
    expenses: [
        { id: 'EXP-001', description: 'إيجار المكتب', category: 'إيجار', amount: 5000, date: '2024-01-01' },
        { id: 'EXP-002', description: 'فواتير الكهرباء', category: 'مرافق', amount: 800, date: '2024-01-05' },
        { id: 'EXP-003', description: 'رواتب الموظفين', category: 'رواتب', amount: 25000, date: '2024-01-01' }
    ],
    returns: [
        { id: 'RET-001', originalOrder: 'ORD-001', customer: 'أحمد محمد', product: 'لابتوب Dell XPS 13', reason: 'عيب في التصنيع', status: 'approved' },
        { id: 'RET-002', originalOrder: 'ORD-002', customer: 'فاطمة علي', product: 'هاتف iPhone 15', reason: 'لا يناسب الاحتياجات', status: 'pending' }
    ]
};

// Notifications Data
let notifications = [
    {
        id: 1,
        type: 'warning',
        title: 'مخزون منخفض',
        message: 'هاتف iPhone 15 أصبح أقل من الحد الأدنى',
        time: 'منذ 5 دقائق',
        unread: true
    },
    {
        id: 2,
        type: 'error',
        title: 'نفاد المخزون',
        message: 'ساعة Apple Watch نفدت من المخزون',
        time: 'منذ 15 دقيقة',
        unread: true
    },
    {
        id: 3,
        type: 'success',
        title: 'طلب جديد',
        message: 'تم استلام طلب جديد من أحمد محمد',
        time: 'منذ 30 دقيقة',
        unread: true
    },
    {
        id: 4,
        type: 'info',
        title: 'تقرير شهري',
        message: 'تقرير المبيعات الشهري جاهز للمراجعة',
        time: 'منذ ساعة',
        unread: false
    }
];

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Navigation functionality
function switchSection(targetSection) {
    navItems.forEach(item => item.classList.remove('active'));
    contentSections.forEach(section => section.classList.remove('active'));
    
    const targetNavItem = document.querySelector(`[data-section="${targetSection}"]`);
    const targetContentSection = document.getElementById(targetSection);
    
    if (targetNavItem && targetContentSection) {
        targetNavItem.classList.add('active');
        targetContentSection.classList.add('active');
        
        // Load section-specific data
        loadSectionData(targetSection);
    }
}

function loadSectionData(section) {
    switch(section) {
        case 'sales':
            populateSalesTable();
            break;
        case 'inventory':
            populateInventoryTable();
            break;
        case 'customers':
            populateCustomersTable();
            break;
        case 'suppliers':
            populateSuppliersTable();
            break;
        case 'invoices':
            populateInvoicesTable();
            break;
        case 'expenses':
            populateExpensesTable();
            break;
        case 'returns':
            populateReturnsTable();
            break;
        case 'dashboard':
            initializeDashboardChart();
            animateStats();
            break;
    }
}

// Table Population Functions
function populateSalesTable() {
    const tbody = document.getElementById('salesTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = sampleData.sales.map(sale => `
        <tr>
            <td>${sale.id}</td>
            <td>${sale.customer}</td>
            <td>${sale.date}</td>
            <td>${sale.products}</td>
            <td>${sale.amount.toLocaleString()} ر.س</td>
            <td><span class="status ${sale.status}">${getStatusText(sale.status)}</span></td>
            <td>
                <button class="btn-icon" onclick="viewItem('${sale.id}')"><i class="fas fa-eye"></i></button>
                <button class="btn-icon" onclick="editItem('${sale.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn-icon" onclick="deleteItem('${sale.id}', this)"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function populateInventoryTable() {
    const tbody = document.getElementById('inventoryTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = sampleData.inventory.map(item => `
        <tr>
            <td>${item.code}</td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>${item.quantity}</td>
            <td>${item.price.toLocaleString()} ر.س</td>
            <td><span class="status ${item.status}">${getStatusText(item.status)}</span></td>
            <td>
                <button class="btn-icon" onclick="viewItem('${item.code}')"><i class="fas fa-eye"></i></button>
                <button class="btn-icon" onclick="editItem('${item.code}')"><i class="fas fa-edit"></i></button>
                <button class="btn-icon" onclick="deleteItem('${item.code}', this)"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function populateCustomersTable() {
    const tbody = document.getElementById('customersTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = sampleData.customers.map(customer => `
        <tr>
            <td>${customer.id}</td>
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>${customer.totalPurchases.toLocaleString()} ر.س</td>
            <td>${customer.lastPurchase}</td>
            <td>
                <button class="btn-icon" onclick="viewItem('${customer.id}')"><i class="fas fa-eye"></i></button>
                <button class="btn-icon" onclick="editItem('${customer.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn-icon" onclick="deleteItem('${customer.id}', this)"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function populateSuppliersTable() {
    const tbody = document.getElementById('suppliersTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = sampleData.suppliers.map(supplier => `
        <tr>
            <td>${supplier.id}</td>
            <td>${supplier.name}</td>
            <td>${supplier.products}</td>
            <td>${supplier.phone}</td>
            <td>${supplier.totalPurchases.toLocaleString()} ر.س</td>
            <td><span class="status ${supplier.status}">${getStatusText(supplier.status)}</span></td>
            <td>
                <button class="btn-icon" onclick="viewItem('${supplier.id}')"><i class="fas fa-eye"></i></button>
                <button class="btn-icon" onclick="editItem('${supplier.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn-icon" onclick="deleteItem('${supplier.id}', this)"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function populateInvoicesTable() {
    const tbody = document.getElementById('invoicesTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = sampleData.invoices.map(invoice => `
        <tr>
            <td>${invoice.id}</td>
            <td>${invoice.customer}</td>
            <td>${invoice.date}</td>
            <td>${invoice.amount.toLocaleString()} ر.س</td>
            <td><span class="status ${invoice.status}">${getStatusText(invoice.status)}</span></td>
            <td>
                <button class="btn-icon" onclick="viewItem('${invoice.id}')"><i class="fas fa-eye"></i></button>
                <button class="btn-icon" onclick="editItem('${invoice.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn-icon" onclick="deleteItem('${invoice.id}', this)"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function populateExpensesTable() {
    const tbody = document.getElementById('expensesTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = sampleData.expenses.map(expense => `
        <tr>
            <td>${expense.id}</td>
            <td>${expense.description}</td>
            <td>${expense.category}</td>
            <td>${expense.amount.toLocaleString()} ر.س</td>
            <td>${expense.date}</td>
            <td>
                <button class="btn-icon" onclick="viewItem('${expense.id}')"><i class="fas fa-eye"></i></button>
                <button class="btn-icon" onclick="editItem('${expense.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn-icon" onclick="deleteItem('${expense.id}', this)"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function populateReturnsTable() {
    const tbody = document.getElementById('returnsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = sampleData.returns.map(returnItem => `
        <tr>
            <td>${returnItem.id}</td>
            <td>${returnItem.originalOrder}</td>
            <td>${returnItem.customer}</td>
            <td>${returnItem.product}</td>
            <td>${returnItem.reason}</td>
            <td><span class="status ${returnItem.status}">${getStatusText(returnItem.status)}</span></td>
            <td>
                <button class="btn-icon" onclick="viewItem('${returnItem.id}')"><i class="fas fa-eye"></i></button>
                <button class="btn-icon" onclick="editItem('${returnItem.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn-icon" onclick="deleteItem('${returnItem.id}', this)"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function getStatusText(status) {
    const statusMap = {
        'completed': 'مكتمل',
        'pending': 'قيد المعالجة',
        'cancelled': 'ملغي',
        'active': 'نشط',
        'inactive': 'غير نشط',
        'in-stock': 'متوفر',
        'low-stock': 'مخزون منخفض',
        'out-of-stock': 'نفد من المخزون',
        'paid': 'مدفوع',
        'approved': 'موافق عليه'
    };
    return statusMap[status] || status;
}

// Notifications Management
function renderNotifications() {
    const unreadCount = notifications.filter(n => n.unread).length;
    notificationBadge.textContent = unreadCount;
    notificationBadge.style.display = unreadCount > 0 ? 'flex' : 'none';
    
    notificationsList.innerHTML = notifications.map(notification => `
        <div class="notification-item ${notification.unread ? 'unread' : ''}" onclick="markAsRead(${notification.id})">
            <div class="notification-icon ${notification.type}">
                <i class="fas fa-${getNotificationIcon(notification.type)}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${notification.title}</div>
                <div class="notification-message">${notification.message}</div>
                <div class="notification-time">${notification.time}</div>
            </div>
        </div>
    `).join('');
}

function getNotificationIcon(type) {
    const iconMap = {
        'info': 'info-circle',
        'warning': 'exclamation-triangle',
        'error': 'times-circle',
        'success': 'check-circle'
    };
    return iconMap[type] || 'bell';
}

function markAsRead(notificationId) {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
        notification.unread = false;
        renderNotifications();
    }
}

function markAllAsRead() {
    notifications.forEach(n => n.unread = false);
    renderNotifications();
}

// Dashboard Chart
function initializeDashboardChart() {
    const canvas = document.getElementById('salesChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;
    
    // Sample data for the chart
    const data = [120, 190, 300, 500, 200, 300, 450];
    const labels = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
    
    const barWidth = (canvas.width - 40) / data.length - 20;
    const maxValue = Math.max(...data);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw bars
    ctx.fillStyle = '#667eea';
    data.forEach((value, index) => {
        const barHeight = (value / maxValue) * (canvas.height - 80);
        const x = index * (barWidth + 20) + 20;
        const y = canvas.height - barHeight - 40;
        
        // Draw bar with rounded corners
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 4);
        ctx.fill();
        
        // Draw value on top
        ctx.fillStyle = '#334155';
        ctx.font = '12px Cairo';
        ctx.textAlign = 'center';
        ctx.fillText(value + 'K', x + barWidth/2, y - 10);
        
        // Draw label at bottom
        ctx.fillText(labels[index], x + barWidth/2, canvas.height - 15);
        
        ctx.fillStyle = '#667eea';
    });
}

// Add rounded rectangle method to canvas context
CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
    this.beginPath();
    this.moveTo(x + radius, y);
    this.lineTo(x + width - radius, y);
    this.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.lineTo(x + width, y + height - radius);
    this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this.lineTo(x + radius, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.lineTo(x, y + radius);
    this.quadraticCurveTo(x, y, x + radius, y);
    this.closePath();
};

// Animate stats
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const finalValue = stat.textContent;
        const numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
        
        if (numericValue) {
            let currentValue = 0;
            const increment = numericValue / 50;
            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= numericValue) {
                    currentValue = numericValue;
                    clearInterval(timer);
                }
                
                const formattedValue = Math.floor(currentValue).toLocaleString('ar-SA');
                if (finalValue.includes('ر.س')) {
                    stat.textContent = `${formattedValue} ر.س`;
                } else {
                    stat.textContent = formattedValue;
                }
            }, 20);
        }
    });
}

// Modal Management
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// CRUD Operations
function viewItem(id) {
    // Create and show detailed view modal
    const modal = createDetailModal(id);
    document.body.appendChild(modal);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function editItem(id) {
    // Create and show edit modal
    const modal = createEditModal(id);
    document.body.appendChild(modal);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function deleteItem(id, element) {
    if (confirm(`هل أنت متأكد من حذف العنصر ${id}؟`)) {
        const row = element.closest('tr');
        row.classList.add('fade-out');
        setTimeout(() => {
            row.remove();
            showNotification('success', 'تم الحذف بنجاح', `تم حذف العنصر ${id} بنجاح`);
        }, 300);
    }
}

// Create detailed view modal
function createDetailModal(id) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = `detailModal-${id}`;
    
    // Get item details based on current section
    const currentSection = document.querySelector('.content-section.active').id;
    const itemDetails = getItemDetails(id, currentSection);
    
    modal.innerHTML = `
        <div class="modal-content large">
            <div class="modal-header">
                <h3>تفاصيل ${itemDetails.title}</h3>
                <span class="close" onclick="closeDetailModal('${id}')">&times;</span>
            </div>
            <div class="modal-body">
                <div class="detail-grid">
                    ${itemDetails.content}
                </div>
                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="editItem('${id}')">
                        <i class="fas fa-edit"></i>
                        تعديل
                    </button>
                    <button class="btn btn-secondary" onclick="closeDetailModal('${id}')">
                        إغلاق
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return modal;
}

// Create edit modal
function createEditModal(id) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = `editModal-${id}`;
    
    // Get item details based on current section
    const currentSection = document.querySelector('.content-section.active').id;
    const editForm = getEditForm(id, currentSection);
    
    modal.innerHTML = `
        <div class="modal-content large">
            <div class="modal-header">
                <h3>تعديل ${editForm.title}</h3>
                <span class="close" onclick="closeEditModal('${id}')">&times;</span>
            </div>
            <div class="modal-body">
                <form id="editForm-${id}" class="form-grid" onsubmit="saveEdit('${id}', event)">
                    ${editForm.content}
                    <div class="form-actions full-width">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i>
                            حفظ التغييرات
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="closeEditModal('${id}')">
                            إلغاء
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    return modal;
}

// Get item details for view modal
function getItemDetails(id, section) {
    let item, title, content;
    
    switch(section) {
        case 'sales':
            item = sampleData.sales.find(s => s.id === id);
            title = `الطلب ${id}`;
            content = `
                <div class="detail-item">
                    <label>رقم الطلب:</label>
                    <span>${item.id}</span>
                </div>
                <div class="detail-item">
                    <label>العميل:</label>
                    <span>${item.customer}</span>
                </div>
                <div class="detail-item">
                    <label>التاريخ:</label>
                    <span>${item.date}</span>
                </div>
                <div class="detail-item">
                    <label>المنتجات:</label>
                    <span>${item.products}</span>
                </div>
                <div class="detail-item">
                    <label>المبلغ:</label>
                    <span>${item.amount.toLocaleString()} ر.س</span>
                </div>
                <div class="detail-item">
                    <label>الحالة:</label>
                    <span class="status ${item.status}">${getStatusText(item.status)}</span>
                </div>
            `;
            break;
            
        case 'inventory':
            item = sampleData.inventory.find(i => i.code === id);
            title = `المنتج ${id}`;
            content = `
                <div class="detail-item">
                    <label>كود المنتج:</label>
                    <span>${item.code}</span>
                </div>
                <div class="detail-item">
                    <label>اسم المنتج:</label>
                    <span>${item.name}</span>
                </div>
                <div class="detail-item">
                    <label>الفئة:</label>
                    <span>${item.category}</span>
                </div>
                <div class="detail-item">
                    <label>الكمية المتوفرة:</label>
                    <span>${item.quantity}</span>
                </div>
                <div class="detail-item">
                    <label>السعر:</label>
                    <span>${item.price.toLocaleString()} ر.س</span>
                </div>
                <div class="detail-item">
                    <label>حالة المخزون:</label>
                    <span class="status ${item.status}">${getStatusText(item.status)}</span>
                </div>
            `;
            break;
            
        case 'customers':
            item = sampleData.customers.find(c => c.id === id);
            title = `العميل ${id}`;
            content = `
                <div class="detail-item">
                    <label>رقم العميل:</label>
                    <span>${item.id}</span>
                </div>
                <div class="detail-item">
                    <label>الاسم:</label>
                    <span>${item.name}</span>
                </div>
                <div class="detail-item">
                    <label>البريد الإلكتروني:</label>
                    <span>${item.email}</span>
                </div>
                <div class="detail-item">
                    <label>الهاتف:</label>
                    <span>${item.phone}</span>
                </div>
                <div class="detail-item">
                    <label>إجمالي المشتريات:</label>
                    <span>${item.totalPurchases.toLocaleString()} ر.س</span>
                </div>
                <div class="detail-item">
                    <label>آخر شراء:</label>
                    <span>${item.lastPurchase}</span>
                </div>
                <div class="detail-item">
                    <label>الحالة:</label>
                    <span class="status ${item.status}">${getStatusText(item.status)}</span>
                </div>
            `;
            break;
            
        default:
            title = `العنصر ${id}`;
            content = `<div class="detail-item"><span>تفاصيل العنصر ${id}</span></div>`;
    }
    
    return { title, content };
}

// Get edit form for edit modal
function getEditForm(id, section) {
    let item, title, content;
    
    switch(section) {
        case 'sales':
            item = sampleData.sales.find(s => s.id === id);
            title = `الطلب ${id}`;
            content = `
                <div class="form-group">
                    <label>العميل</label>
                    <input type="text" name="customer" value="${item.customer}" required>
                </div>
                <div class="form-group">
                    <label>التاريخ</label>
                    <input type="date" name="date" value="${item.date}" required>
                </div>
                <div class="form-group full-width">
                    <label>المنتجات</label>
                    <input type="text" name="products" value="${item.products}" required>
                </div>
                <div class="form-group">
                    <label>المبلغ</label>
                    <input type="number" name="amount" value="${item.amount}" required>
                </div>
                <div class="form-group">
                    <label>الحالة</label>
                    <select name="status" required>
                        <option value="completed" ${item.status === 'completed' ? 'selected' : ''}>مكتمل</option>
                        <option value="pending" ${item.status === 'pending' ? 'selected' : ''}>قيد المعالجة</option>
                        <option value="cancelled" ${item.status === 'cancelled' ? 'selected' : ''}>ملغي</option>
                    </select>
                </div>
            `;
            break;
            
        case 'inventory':
            item = sampleData.inventory.find(i => i.code === id);
            title = `المنتج ${id}`;
            content = `
                <div class="form-group">
                    <label>اسم المنتج</label>
                    <input type="text" name="name" value="${item.name}" required>
                </div>
                <div class="form-group">
                    <label>الفئة</label>
                    <select name="category" required>
                        <option value="electronics" ${item.category === 'electronics' ? 'selected' : ''}>إلكترونيات</option>
                        <option value="clothing" ${item.category === 'clothing' ? 'selected' : ''}>ملابس</option>
                        <option value="accessories" ${item.category === 'accessories' ? 'selected' : ''}>إكسسوارات</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>الكمية</label>
                    <input type="number" name="quantity" value="${item.quantity}" required min="0">
                </div>
                <div class="form-group">
                    <label>السعر</label>
                    <input type="number" name="price" value="${item.price}" required min="0" step="0.01">
                </div>
            `;
            break;
            
        case 'customers':
            item = sampleData.customers.find(c => c.id === id);
            title = `العميل ${id}`;
            content = `
                <div class="form-group">
                    <label>الاسم</label>
                    <input type="text" name="name" value="${item.name}" required>
                </div>
                <div class="form-group">
                    <label>البريد الإلكتروني</label>
                    <input type="email" name="email" value="${item.email}" required>
                </div>
                <div class="form-group">
                    <label>الهاتف</label>
                    <input type="tel" name="phone" value="${item.phone}" required>
                </div>
                <div class="form-group">
                    <label>الحالة</label>
                    <select name="status" required>
                        <option value="active" ${item.status === 'active' ? 'selected' : ''}>نشط</option>
                        <option value="inactive" ${item.status === 'inactive' ? 'selected' : ''}>غير نشط</option>
                    </select>
                </div>
            `;
            break;
            
        default:
            title = `العنصر ${id}`;
            content = `<div class="form-group full-width"><label>معرف العنصر</label><input type="text" value="${id}" readonly></div>`;
    }
    
    return { title, content };
}

// Close detail modal
function closeDetailModal(id) {
    const modal = document.getElementById(`detailModal-${id}`);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        modal.remove();
    }
}

// Close edit modal
function closeEditModal(id) {
    const modal = document.getElementById(`editModal-${id}`);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        modal.remove();
    }
}

// Save edit changes
function saveEdit(id, event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const currentSection = document.querySelector('.content-section.active').id;
    
    // Update the data based on section
    switch(currentSection) {
        case 'sales':
            const saleIndex = sampleData.sales.findIndex(s => s.id === id);
            if (saleIndex !== -1) {
                sampleData.sales[saleIndex] = {
                    ...sampleData.sales[saleIndex],
                    customer: formData.get('customer'),
                    date: formData.get('date'),
                    products: formData.get('products'),
                    amount: parseInt(formData.get('amount')),
                    status: formData.get('status')
                };
                populateSalesTable();
            }
            break;
            
        case 'inventory':
            const inventoryIndex = sampleData.inventory.findIndex(i => i.code === id);
            if (inventoryIndex !== -1) {
                const quantity = parseInt(formData.get('quantity'));
                let status = 'in-stock';
                if (quantity === 0) status = 'out-of-stock';
                else if (quantity < 10) status = 'low-stock';
                
                sampleData.inventory[inventoryIndex] = {
                    ...sampleData.inventory[inventoryIndex],
                    name: formData.get('name'),
                    category: formData.get('category'),
                    quantity: quantity,
                    price: parseFloat(formData.get('price')),
                    status: status
                };
                populateInventoryTable();
            }
            break;
            
        case 'customers':
            const customerIndex = sampleData.customers.findIndex(c => c.id === id);
            if (customerIndex !== -1) {
                sampleData.customers[customerIndex] = {
                    ...sampleData.customers[customerIndex],
                    name: formData.get('name'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    status: formData.get('status')
                };
                populateCustomersTable();
            }
            break;
    }
    
    closeEditModal(id);
    showNotification('success', 'تم التحديث بنجاح', `تم تحديث العنصر ${id} بنجاح`);
}

// Add new item functions
function addNewSale() {
    openModal('addSaleModal');
}

function addNewProduct() {
    const modal = createAddModal('product');
    document.body.appendChild(modal);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function addNewCustomer() {
    const modal = createAddModal('customer');
    document.body.appendChild(modal);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function addNewSupplier() {
    const modal = createAddModal('supplier');
    document.body.appendChild(modal);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function addNewInvoice() {
    const modal = createAddModal('invoice');
    document.body.appendChild(modal);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function addNewExpense() {
    const modal = createAddModal('expense');
    document.body.appendChild(modal);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function addNewReturn() {
    const modal = createAddModal('return');
    document.body.appendChild(modal);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Create add modal for different types
function createAddModal(type) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = `addModal-${type}`;
    
    const forms = {
        product: {
            title: 'إضافة منتج جديد',
            content: `
                <div class="form-group">
                    <label>كود المنتج</label>
                    <input type="text" name="code" required placeholder="PROD-XXX">
                </div>
                <div class="form-group">
                    <label>اسم المنتج</label>
                    <input type="text" name="name" required>
                </div>
                <div class="form-group">
                    <label>الفئة</label>
                    <select name="category" required>
                        <option value="">اختر الفئة</option>
                        <option value="electronics">إلكترونيات</option>
                        <option value="clothing">ملابس</option>
                        <option value="accessories">إكسسوارات</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>الكمية الأولية</label>
                    <input type="number" name="quantity" required min="0" value="0">
                </div>
                <div class="form-group">
                    <label>السعر</label>
                    <input type="number" name="price" required min="0" step="0.01">
                </div>
            `
        },
        customer: {
            title: 'إضافة عميل جديد',
            content: `
                <div class="form-group">
                    <label>الاسم</label>
                    <input type="text" name="name" required>
                </div>
                <div class="form-group">
                    <label>البريد الإلكتروني</label>
                    <input type="email" name="email" required>
                </div>
                <div class="form-group">
                    <label>الهاتف</label>
                    <input type="tel" name="phone" required>
                </div>
                <div class="form-group">
                    <label>العنوان</label>
                    <input type="text" name="address">
                </div>
            `
        },
        supplier: {
            title: 'إضافة مورد جديد',
            content: `
                <div class="form-group">
                    <label>اسم المورد</label>
                    <input type="text" name="name" required>
                </div>
                <div class="form-group">
                    <label>نوع المنتجات</label>
                    <input type="text" name="products" required>
                </div>
                <div class="form-group">
                    <label>الهاتف</label>
                    <input type="tel" name="phone" required>
                </div>
                <div class="form-group">
                    <label>البريد الإلكتروني</label>
                    <input type="email" name="email">
                </div>
            `
        },
        invoice: {
            title: 'إنشاء فاتورة جديدة',
            content: `
                <div class="form-group">
                    <label>العميل</label>
                    <select name="customer" required>
                        <option value="">اختر العميل</option>
                        ${sampleData.customers.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>تاريخ الفاتورة</label>
                    <input type="date" name="date" required value="${new Date().toISOString().split('T')[0]}">
                </div>
                <div class="form-group">
                    <label>المبلغ</label>
                    <input type="number" name="amount" required min="0" step="0.01">
                </div>
                <div class="form-group">
                    <label>طريقة الدفع</label>
                    <select name="paymentMethod" required>
                        <option value="">اختر طريقة الدفع</option>
                        <option value="cash">نقدي</option>
                        <option value="card">بطاقة ائتمان</option>
                        <option value="transfer">تحويل بنكي</option>
                    </select>
                </div>
            `
        },
        expense: {
            title: 'إضافة مصروف جديد',
            content: `
                <div class="form-group">
                    <label>وصف المصروف</label>
                    <input type="text" name="description" required>
                </div>
                <div class="form-group">
                    <label>الفئة</label>
                    <select name="category" required>
                        <option value="">اختر الفئة</option>
                        <option value="إيجار">إيجار</option>
                        <option value="مرافق">مرافق</option>
                        <option value="رواتب">رواتب</option>
                        <option value="تسويق">تسويق</option>
                        <option value="صيانة">صيانة</option>
                        <option value="أخرى">أخرى</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>المبلغ</label>
                    <input type="number" name="amount" required min="0" step="0.01">
                </div>
                <div class="form-group">
                    <label>التاريخ</label>
                    <input type="date" name="date" required value="${new Date().toISOString().split('T')[0]}">
                </div>
            `
        },
        return: {
            title: 'تسجيل مرتجع جديد',
            content: `
                <div class="form-group">
                    <label>رقم الطلب الأصلي</label>
                    <select name="originalOrder" required>
                        <option value="">اختر الطلب</option>
                        ${sampleData.sales.map(s => `<option value="${s.id}">${s.id} - ${s.customer}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>المنتج</label>
                    <input type="text" name="product" required>
                </div>
                <div class="form-group full-width">
                    <label>سبب الإرجاع</label>
                    <textarea name="reason" required rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label>الكمية المرتجعة</label>
                    <input type="number" name="quantity" required min="1" value="1">
                </div>
            `
        }
    };
    
    const formData = forms[type];
    
    modal.innerHTML = `
        <div class="modal-content large">
            <div class="modal-header">
                <h3>${formData.title}</h3>
                <span class="close" onclick="closeAddModal('${type}')">&times;</span>
            </div>
            <div class="modal-body">
                <form id="addForm-${type}" class="form-grid" onsubmit="saveNewItem('${type}', event)">
                    ${formData.content}
                    <div class="form-actions full-width">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i>
                            حفظ
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="closeAddModal('${type}')">
                            إلغاء
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    return modal;
}

// Close add modal
function closeAddModal(type) {
    const modal = document.getElementById(`addModal-${type}`);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        modal.remove();
    }
}

// Save new item
function saveNewItem(type, event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    switch(type) {
        case 'product':
            const quantity = parseInt(formData.get('quantity'));
            let status = 'in-stock';
            if (quantity === 0) status = 'out-of-stock';
            else if (quantity < 10) status = 'low-stock';
            
            const newProduct = {
                code: formData.get('code'),
                name: formData.get('name'),
                category: formData.get('category'),
                quantity: quantity,
                price: parseFloat(formData.get('price')),
                status: status
            };
            sampleData.inventory.push(newProduct);
            populateInventoryTable();
            break;
            
        case 'customer':
            const newCustomer = {
                id: `CUST-${String(sampleData.customers.length + 1).padStart(3, '0')}`,
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                totalPurchases: 0,
                lastPurchase: '-',
                status: 'active'
            };
            sampleData.customers.push(newCustomer);
            populateCustomersTable();
            break;
            
        case 'supplier':
            const newSupplier = {
                id: `SUPP-${String(sampleData.suppliers.length + 1).padStart(3, '0')}`,
                name: formData.get('name'),
                products: formData.get('products'),
                phone: formData.get('phone'),
                totalPurchases: 0,
                status: 'active'
            };
            sampleData.suppliers.push(newSupplier);
            populateSuppliersTable();
            break;
            
        case 'invoice':
            const newInvoice = {
                id: `INV-${String(sampleData.invoices.length + 1).padStart(3, '0')}`,
                customer: formData.get('customer'),
                date: formData.get('date'),
                amount: parseFloat(formData.get('amount')),
                status: 'pending'
            };
            sampleData.invoices.push(newInvoice);
            populateInvoicesTable();
            break;
            
        case 'expense':
            const newExpense = {
                id: `EXP-${String(sampleData.expenses.length + 1).padStart(3, '0')}`,
                description: formData.get('description'),
                category: formData.get('category'),
                amount: parseFloat(formData.get('amount')),
                date: formData.get('date')
            };
            sampleData.expenses.push(newExpense);
            populateExpensesTable();
            break;
            
        case 'return':
            const newReturn = {
                id: `RET-${String(sampleData.returns.length + 1).padStart(3, '0')}`,
                originalOrder: formData.get('originalOrder'),
                customer: sampleData.sales.find(s => s.id === formData.get('originalOrder'))?.customer || 'غير محدد',
                product: formData.get('product'),
                reason: formData.get('reason'),
                status: 'pending'
            };
            sampleData.returns.push(newReturn);
            populateReturnsTable();
            break;
    }
    
    closeAddModal(type);
    showNotification('success', 'تم الإضافة بنجاح', `تم إضافة العنصر الجديد بنجاح`);
}

// Show notification
function showNotification(type, title, message) {
    const newNotification = {
        id: Date.now(),
        type: type,
        title: title,
        message: message,
        time: 'الآن',
        unread: true
    };
    
    notifications.unshift(newNotification);
    renderNotifications();
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notifications = notifications.filter(n => n.id !== newNotification.id);
        renderNotifications();
    }, 5000);
}

// Search functionality
function handleSearch(searchTerm) {
    if (searchTerm.length > 2) {
        console.log(`البحث عن: ${searchTerm}`);
        // Implement actual search logic here
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    initTheme();
    
    // Load saved section
    const savedSection = localStorage.getItem('currentSection') || 'dashboard';
    switchSection(savedSection);
    
    // Render notifications
    renderNotifications();
    
    // Initialize dashboard
    setTimeout(() => {
        initializeDashboardChart();
        animateStats();
    }, 500);
});

// Navigation event listeners
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSection = item.getAttribute('data-section');
        switchSection(targetSection);
        localStorage.setItem('currentSection', targetSection);
        
        // Close sidebar on mobile
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('open');
            mainContent.classList.remove('expanded');
        }
    });
});

// Theme toggle
themeToggle.addEventListener('click', toggleTheme);

// Menu toggle for mobile
menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    mainContent.classList.toggle('expanded');
});

// Notifications
notificationsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    notificationsDropdown.classList.toggle('show');
});

markAllRead.addEventListener('click', markAllAsRead);

// Close notifications when clicking outside
document.addEventListener('click', (e) => {
    if (!notificationsBtn.contains(e.target) && !notificationsDropdown.contains(e.target)) {
        notificationsDropdown.classList.remove('show');
    }
});

// Quick Add Modal
quickAddBtn.addEventListener('click', () => openModal('quickAddModal'));

// Close modals
closeModals.forEach(closeBtn => {
    closeBtn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        if (modal) {
            closeModal(modal.id);
        }
    });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeModal(e.target.id);
    }
});

// Quick add options
document.addEventListener('click', (e) => {
    if (e.target.closest('.quick-option')) {
        const option = e.target.closest('.quick-option');
        const action = option.getAttribute('data-action');
        
        closeModal('quickAddModal');
        
        switch(action) {
            case 'sale':
                addNewSale();
                break;
            case 'product':
                addNewProduct();
                break;
            case 'customer':
                addNewCustomer();
                break;
            case 'invoice':
                addNewInvoice();
                break;
        }
    }
});

// Add button event listeners for all sections
document.addEventListener('click', (e) => {
    // Sales section
    if (e.target.id === 'addSaleBtn' || e.target.closest('#addSaleBtn')) {
        addNewSale();
    }
    
    // Inventory section
    if (e.target.id === 'addProductBtn' || e.target.closest('#addProductBtn')) {
        addNewProduct();
    }
    
    // Customers section
    if (e.target.id === 'addCustomerBtn' || e.target.closest('#addCustomerBtn')) {
        addNewCustomer();
    }
    
    // Other sections - add buttons
    if (e.target.closest('.btn-primary')) {
        const button = e.target.closest('.btn-primary');
        const section = button.closest('.content-section');
        
        if (section) {
            const sectionId = section.id;
            const buttonText = button.textContent.trim();
            
            if (buttonText.includes('إضافة مورد جديد')) {
                addNewSupplier();
            } else if (buttonText.includes('إنشاء فاتورة جديدة')) {
                addNewInvoice();
            } else if (buttonText.includes('إضافة مصروف جديد')) {
                addNewExpense();
            } else if (buttonText.includes('تسجيل مرتجع جديد')) {
                addNewReturn();
            }
        }
    }
});

// Search functionality
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    handleSearch(searchTerm);
});

// Chart controls
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('chart-btn')) {
        const chartBtns = document.querySelectorAll('.chart-btn');
        chartBtns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        // Update chart based on selection
        initializeDashboardChart();
    }
});

// Table search and filter
document.addEventListener('input', (e) => {
    if (e.target.classList.contains('table-search')) {
        const searchTerm = e.target.value.toLowerCase();
        const table = e.target.closest('.table-container').querySelector('table');
        const rows = table.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    }
});

document.addEventListener('change', (e) => {
    if (e.target.classList.contains('table-filter')) {
        const filterValue = e.target.value;
        const table = e.target.closest('.table-container').querySelector('table');
        const rows = table.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            if (filterValue === 'all') {
                row.style.display = '';
            } else {
                const statusCell = row.querySelector('.status');
                if (statusCell && statusCell.classList.contains(filterValue)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            }
        });
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl + K to focus search
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
    
    // Ctrl + N for quick add
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        quickAddBtn.click();
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal[style*="block"]');
        if (openModal) {
            closeModal(openModal.id);
        }
        notificationsDropdown.classList.remove('show');
    }
});

// Button loading states
function addLoadingState(button, duration = 2000) {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner loading"></i> جاري التحميل...';
    button.disabled = true;
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
    }, duration);
}

// Add click handlers for action buttons
document.addEventListener('click', (e) => {
    if (e.target.closest('.btn-primary, .btn-secondary')) {
        const button = e.target.closest('.btn-primary, .btn-secondary');
        if (!button.disabled) {
            addLoadingState(button);
        }
    }
});

// Resize handler for chart
window.addEventListener('resize', () => {
    setTimeout(initializeDashboardChart, 100);
});

// Add some sample notifications periodically
setInterval(() => {
    const sampleNotifications = [
        { type: 'info', title: 'طلب جديد', message: 'تم استلام طلب جديد من عميل' },
        { type: 'warning', title: 'مخزون منخفض', message: 'منتج يحتاج إعادة تموين' },
        { type: 'success', title: 'عملية مكتملة', message: 'تم إتمام عملية بيع بنجاح' }
    ];
    
    const randomNotification = sampleNotifications[Math.floor(Math.random() * sampleNotifications.length)];
    
    if (Math.random() > 0.7) { // 30% chance every 30 seconds
        showNotification(
            randomNotification.type,
            randomNotification.title,
            randomNotification.message
        );
    }
}, 30000);

console.log('نظام إدارة المبيعات والمخزون المطور تم تحميله بنجاح!');
