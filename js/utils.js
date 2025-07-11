// Utility Functions
const Utils = {
    // Format currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('ar-EG', {
            style: 'currency',
            currency: 'EGP',
            minimumFractionDigits: 0
        }).format(amount);
    },

    // Format date
    formatDate(date) {
        return new Date(date).toLocaleDateString('ar-EG');
    },

    // Format date and time
    formatDateTime(date) {
        return new Date(date).toLocaleString('ar-EG');
    },

    // Get time ago
    getTimeAgo(date) {
        const now = new Date();
        const diffInMinutes = Math.floor((now - new Date(date)) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'الآن';
        if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 30) return `منذ ${diffInDays} يوم`;
        
        const diffInMonths = Math.floor(diffInDays / 30);
        if (diffInMonths < 12) return `منذ ${diffInMonths} شهر`;
        
        const diffInYears = Math.floor(diffInMonths / 12);
        return `منذ ${diffInYears} سنة`;
    },

    // Generate unique ID
    generateId(prefix = '') {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `${prefix}${timestamp}${random}`;
    },

    // Validate email
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Validate phone
    validatePhone(phone) {
        const re = /^01[0-9]{9}$/;
        return re.test(phone);
    },

    // Format phone number
    formatPhone(phone) {
        if (!phone) return '';
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 11) {
            return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3');
        }
        return phone;
    },

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle(func, limit) {
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
    },

    // Deep clone object
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (typeof obj === 'object') {
            const clonedObj = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    clonedObj[key] = this.deepClone(obj[key]);
                }
            }
            return clonedObj;
        }
    },

    // Check if object is empty
    isEmpty(obj) {
        if (obj == null) return true;
        if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
        return Object.keys(obj).length === 0;
    },

    // Capitalize first letter
    capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    // Truncate text
    truncate(text, length = 50) {
        if (!text) return '';
        if (text.length <= length) return text;
        return text.substring(0, length) + '...';
    },

    // Generate random color
    randomColor() {
        const colors = [
            '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
            '#8b5cf6', '#06b6d4', '#84cc16', '#f97316',
            '#ec4899', '#6366f1', '#14b8a6', '#eab308'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    },

    // Format file size
    formatFileSize(bytes) {
        if (bytes === 0) return '0 بايت';
        const k = 1024;
        const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    // Download file
    downloadFile(content, filename, contentType = 'text/plain') {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    // Copy to clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                return true;
            } catch (err) {
                return false;
            } finally {
                document.body.removeChild(textArea);
            }
        }
    },

    // Show loading
    showLoading(element, text = 'جاري التحميل...') {
        if (!element) return;
        
        element.classList.add('loading');
        element.setAttribute('data-original-text', element.textContent);
        element.textContent = text;
        element.disabled = true;
    },

    // Hide loading
    hideLoading(element) {
        if (!element) return;
        
        element.classList.remove('loading');
        const originalText = element.getAttribute('data-original-text');
        if (originalText) {
            element.textContent = originalText;
            element.removeAttribute('data-original-text');
        }
        element.disabled = false;
    },

    // Animate number
    animateNumber(element, start, end, duration = 1000) {
        if (!element) return;
        
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.round(current);
        }, 16);
    },

    // Smooth scroll to element
    scrollToElement(element, offset = 0) {
        if (!element) return;
        
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    },

    // Check if element is in viewport
    isInViewport(element) {
        if (!element) return false;
        
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Local storage helpers
    storage: {
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error('Error saving to localStorage:', e);
                return false;
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
                return true;
            } catch (e) {
                console.error('Error removing from localStorage:', e);
                return false;
            }
        },

        clear() {
            try {
                localStorage.clear();
                return true;
            } catch (e) {
                console.error('Error clearing localStorage:', e);
                return false;
            }
        }
    },

    // URL helpers
    url: {
        getParams() {
            const params = new URLSearchParams(window.location.search);
            const result = {};
            for (const [key, value] of params) {
                result[key] = value;
            }
            return result;
        },

        setParam(key, value) {
            const url = new URL(window.location);
            url.searchParams.set(key, value);
            window.history.pushState({}, '', url);
        },

        removeParam(key) {
            const url = new URL(window.location);
            url.searchParams.delete(key);
            window.history.pushState({}, '', url);
        }
    },

    // Date helpers
    date: {
        today() {
            return new Date().toISOString().split('T')[0];
        },

        addDays(date, days) {
            const result = new Date(date);
            result.setDate(result.getDate() + days);
            return result.toISOString().split('T')[0];
        },

        subtractDays(date, days) {
            return this.addDays(date, -days);
        },

        startOfMonth(date = new Date()) {
            const result = new Date(date);
            result.setDate(1);
            return result.toISOString().split('T')[0];
        },

        endOfMonth(date = new Date()) {
            const result = new Date(date);
            result.setMonth(result.getMonth() + 1, 0);
            return result.toISOString().split('T')[0];
        },

        isToday(date) {
            const today = new Date();
            const checkDate = new Date(date);
            return today.toDateString() === checkDate.toDateString();
        },

        daysBetween(date1, date2) {
            const oneDay = 24 * 60 * 60 * 1000;
            const firstDate = new Date(date1);
            const secondDate = new Date(date2);
            return Math.round(Math.abs((firstDate - secondDate) / oneDay));
        }
    }
};

// Make utilities available globally
window.Utils = Utils;