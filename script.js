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
    alert(`عرض تفاصيل العنصر: ${id}`);
}

function editItem(id) {
    alert(`تعديل العنصر: ${id}`);
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
                openModal('addSaleModal');
                break;
            case 'product':
                alert('سيتم فتح نموذج إضافة منتج جديد');
                break;
            case 'customer':
                alert('سيتم فتح نموذج إضافة عميل جديد');
                break;
            case 'invoice':
                alert('سيتم فتح نموذج إنشاء فاتورة جديدة');
                break;
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