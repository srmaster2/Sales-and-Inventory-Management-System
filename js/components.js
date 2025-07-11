// Shared Components

// Toast Notification System
class ToastManager {
    constructor() {
        this.container = window.utils.$("toast-container");
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

