// Utility Functions

// DOM Helper Functions
function $(id) {
    return document.getElementById(id);
}

function $$(selector) {
    return document.querySelector(selector);
}

function $$$(selector) {
    return document.querySelectorAll(selector);
}

function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    
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
    
    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else {
            element.appendChild(child);
        }
    });
    
    return element;
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

// Validation functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

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
    formatCurrency: (amount, currency = 'EGP') => new Intl.NumberFormat('ar-EG', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
    }).format(amount),
    formatNumber: (number) => new Intl.NumberFormat('ar-EG').format(number),
    formatDate: (date, options = {}) => {
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return new Intl.DateTimeFormat('ar-EG', { ...defaultOptions, ...options }).format(new Date(date));
    },
    formatTime: (date) => new Intl.DateTimeFormat('ar-EG', {
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date)),
    formatRelativeTime: (date) => {
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
        return window.utils.formatDate(date);
    },
    generateId: () => Date.now().toString(36) + Math.random().toString(36).substr(2),
    debounce,
    throttle,
    deepClone: (obj) => {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => window.utils.deepClone(item));
        if (typeof obj === 'object') {
            const clonedObj = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    clonedObj[key] = window.utils.deepClone(obj[key]);
                }
            }
            return clonedObj;
        }
    },
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
    downloadFile: (content, filename, contentType) => {
        const a = document.createElement("a");
        const file = new Blob([content], { type: contentType });
        a.href = URL.createObjectURL(file);
        a.download = filename;
        a.click();
        URL.revokeObjectURL(a.href);
    },
    printElement
};

