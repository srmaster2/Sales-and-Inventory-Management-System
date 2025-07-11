// Customers Module - Placeholder
const Customers = {
    load() {
        const customersSection = document.getElementById('customers');
        customersSection.innerHTML = `
            <div class="page-header">
                <div class="page-title">
                    <h2>إدارة العملاء</h2>
                    <p>إدارة بيانات العملاء والحسابات</p>
                </div>
                <div class="page-actions">
                    <button class="btn btn-primary">
                        <i class="fas fa-plus"></i>
                        عميل جديد
                    </button>
                </div>
            </div>
            <div class="card">
                <div class="card-header">
                    <h3>قائمة العملاء</h3>
                </div>
                <div class="no-data">
                    <i class="fas fa-users"></i>
                    <p>سيتم تطوير هذا القسم قريباً</p>
                </div>
            </div>
        `;
    }
};

// Suppliers Module - Placeholder
const Suppliers = {
    load() {
        const suppliersSection = document.getElementById('suppliers');
        suppliersSection.innerHTML = `
            <div class="page-header">
                <div class="page-title">
                    <h2>إدارة الموردين</h2>
                    <p>إدارة بيانات الموردين والمشتريات</p>
                </div>
                <div class="page-actions">
                    <button class="btn btn-primary">
                        <i class="fas fa-plus"></i>
                        مورد جديد
                    </button>
                </div>
            </div>
            <div class="card">
                <div class="card-header">
                    <h3>قائمة الموردين</h3>
                </div>
                <div class="no-data">
                    <i class="fas fa-truck"></i>
                    <p>سيتم تطوير هذا القسم قريباً</p>
                </div>
            </div>
        `;
    }
};

// Expenses Module - Placeholder
const Expenses = {
    load() {
        const expensesSection = document.getElementById('expenses');
        expensesSection.innerHTML = `
            <div class="page-header">
                <div class="page-title">
                    <h2>إدارة المصروفات</h2>
                    <p>تسجيل ومتابعة جميع المصروفات</p>
                </div>
                <div class="page-actions">
                    <button class="btn btn-primary">
                        <i class="fas fa-plus"></i>
                        مصروف جديد
                    </button>
                </div>
            </div>
            <div class="card">
                <div class="card-header">
                    <h3>قائمة المصروفات</h3>
                </div>
                <div class="no-data">
                    <i class="fas fa-receipt"></i>
                    <p>سيتم تطوير هذا القسم قريباً</p>
                </div>
            </div>
        `;
    }
};

// Returns Module - Placeholder
const Returns = {
    load() {
        const returnsSection = document.getElementById('returns');
        returnsSection.innerHTML = `
            <div class="page-header">
                <div class="page-title">
                    <h2>إدارة المرتجعات</h2>
                    <p>تسجيل ومتابعة المرتجعات</p>
                </div>
                <div class="page-actions">
                    <button class="btn btn-primary">
                        <i class="fas fa-plus"></i>
                        مرتجع جديد
                    </button>
                </div>
            </div>
            <div class="card">
                <div class="card-header">
                    <h3>قائمة المرتجعات</h3>
                </div>
                <div class="no-data">
                    <i class="fas fa-undo"></i>
                    <p>سيتم تطوير هذا القسم قريباً</p>
                </div>
            </div>
        `;
    }
};

// Reports Module - Placeholder
const Reports = {
    load() {
        const reportsSection = document.getElementById('reports');
        reportsSection.innerHTML = `
            <div class="page-header">
                <div class="page-title">
                    <h2>التقارير المتقدمة</h2>
                    <p>تحليلات شاملة لأداء متجرك</p>
                </div>
                <div class="page-actions">
                    <button class="btn btn-primary">
                        <i class="fas fa-chart-bar"></i>
                        إنشاء تقرير
                    </button>
                </div>
            </div>
            <div class="card">
                <div class="card-header">
                    <h3>التقارير المتاحة</h3>
                </div>
                <div class="no-data">
                    <i class="fas fa-chart-line"></i>
                    <p>سيتم تطوير هذا القسم قريباً</p>
                </div>
            </div>
        `;
    }
};

// Invoices Module - Placeholder
const Invoices = {
    load() {
        const invoicesSection = document.getElementById('invoices');
        invoicesSection.innerHTML = `
            <div class="page-header">
                <div class="page-title">
                    <h2>إدارة الفواتير</h2>
                    <p>إنشاء وإدارة الفواتير</p>
                </div>
                <div class="page-actions">
                    <button class="btn btn-primary">
                        <i class="fas fa-plus"></i>
                        فاتورة جديدة
                    </button>
                </div>
            </div>
            <div class="card">
                <div class="card-header">
                    <h3>قائمة الفواتير</h3>
                </div>
                <div class="no-data">
                    <i class="fas fa-file-invoice"></i>
                    <p>سيتم تطوير هذا القسم قريباً</p>
                </div>
            </div>
        `;
    }
};

// Analytics Module - Placeholder
const Analytics = {
    load() {
        const analyticsSection = document.getElementById('analytics');
        analyticsSection.innerHTML = `
            <div class="page-header">
                <div class="page-title">
                    <h2>التحليلات الذكية</h2>
                    <p>تحليلات متقدمة باستخدام الذكاء الاصطناعي</p>
                </div>
                <div class="page-actions">
                    <button class="btn btn-primary">
                        <i class="fas fa-brain"></i>
                        تحليل جديد
                    </button>
                </div>
            </div>
            <div class="card">
                <div class="card-header">
                    <h3>التحليلات المتاحة</h3>
                </div>
                <div class="no-data">
                    <i class="fas fa-brain"></i>
                    <p>سيتم تطوير هذا القسم قريباً</p>
                </div>
            </div>
        `;
    }
};

// Calendar Module - Placeholder
const Calendar = {
    load() {
        const calendarSection = document.getElementById('calendar');
        calendarSection.innerHTML = `
            <div class="page-header">
                <div class="page-title">
                    <h2>التقويم</h2>
                    <p>جدولة المهام والمواعيد</p>
                </div>
                <div class="page-actions">
                    <button class="btn btn-primary">
                        <i class="fas fa-plus"></i>
                        موعد جديد
                    </button>
                </div>
            </div>
            <div class="card">
                <div class="card-header">
                    <h3>التقويم الشهري</h3>
                </div>
                <div class="no-data">
                    <i class="fas fa-calendar-alt"></i>
                    <p>سيتم تطوير هذا القسم قريباً</p>
                </div>
            </div>
        `;
    }
};

// Settings Module - Placeholder
const Settings = {
    load() {
        const settingsSection = document.getElementById('settings');
        settingsSection.innerHTML = `
            <div class="page-header">
                <div class="page-title">
                    <h2>الإعدادات</h2>
                    <p>إعدادات النظام والتخصيص</p>
                </div>
            </div>
            <div class="settings-grid">
                <div class="card">
                    <div class="card-header">
                        <h3>الإعدادات العامة</h3>
                    </div>
                    <div class="no-data">
                        <i class="fas fa-cog"></i>
                        <p>سيتم تطوير هذا القسم قريباً</p>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header">
                        <h3>إعدادات المتجر</h3>
                    </div>
                    <div class="no-data">
                        <i class="fas fa-store"></i>
                        <p>سيتم تطوير هذا القسم قريباً</p>
                    </div>
                </div>
            </div>
        `;
    }
};

// Add CSS for placeholder sections
const placeholderCSS = `
.no-data {
    text-align: center;
    padding: 3rem 1rem;
    color: var(--text-tertiary);
}

.no-data i {
    font-size: 48px;
    margin-bottom: 1rem;
    opacity: 0.5;
}

.no-data p {
    font-size: 16px;
    margin: 0;
}

.settings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
}
`;

// Add CSS to document
const style = document.createElement('style');
style.textContent = placeholderCSS;
document.head.appendChild(style);