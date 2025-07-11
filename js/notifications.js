// Notifications Module
const Notifications = {
    isOpen: false,

    // Initialize notifications
    init() {
        this.render();
        this.setupEventListeners();
    },

    // Setup event listeners
    setupEventListeners() {
        // Close notifications button
        document.getElementById('closeNotifications').addEventListener('click', () => {
            this.close();
        });

        // Click outside to close
        document.addEventListener('click', (e) => {
            const panel = document.getElementById('notificationPanel');
            const btn = document.getElementById('notificationBtn');
            
            if (this.isOpen && !panel.contains(e.target) && !btn.contains(e.target)) {
                this.close();
            }
        });
    },

    // Toggle notification panel
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    },

    // Open notification panel
    open() {
        const panel = document.getElementById('notificationPanel');
        panel.classList.add('open');
        this.isOpen = true;
        this.render();
    },

    // Close notification panel
    close() {
        const panel = document.getElementById('notificationPanel');
        panel.classList.remove('open');
        this.isOpen = false;
    },

    // Render notifications
    render() {
        const notificationList = document.getElementById('notificationList');
        if (!notificationList) return;

        const notifications = App.data.notifications
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        let notificationsHTML = '';

        if (notifications.length === 0) {
            notificationsHTML = `
                <div class="no-notifications">
                    <i class="fas fa-bell-slash"></i>
                    <p>لا توجد إشعارات</p>
                </div>
            `;
        } else {
            notifications.forEach(notification => {
                const timeAgo = App.getTimeAgo(new Date(notification.timestamp));
                const unreadClass = notification.read ? '' : 'unread';
                
                notificationsHTML += `
                    <div class="notification-item ${unreadClass}" onclick="Notifications.markAsRead('${notification.id}')">
                        <div class="notification-icon ${notification.type}">
                            ${this.getNotificationIcon(notification.type)}
                        </div>
                        <div class="notification-content">
                            <h4>${notification.title}</h4>
                            <p>${notification.message}</p>
                            <span class="notification-time">${timeAgo}</span>
                        </div>
                        <button class="notification-remove" onclick="Notifications.remove('${notification.id}', event)">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
            });
        }

        notificationList.innerHTML = notificationsHTML;
    },

    // Get notification icon
    getNotificationIcon(type) {
        const icons = {
            success: '<i class="fas fa-check-circle"></i>',
            error: '<i class="fas fa-exclamation-circle"></i>',
            warning: '<i class="fas fa-exclamation-triangle"></i>',
            info: '<i class="fas fa-info-circle"></i>'
        };
        return icons[type] || icons.info;
    },

    // Mark notification as read
    markAsRead(id) {
        const notification = App.data.notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
            App.saveData();
            App.updateNotificationCount();
            this.render();
        }
    },

    // Mark all as read
    markAllAsRead() {
        App.data.notifications.forEach(notification => {
            notification.read = true;
        });
        App.saveData();
        App.updateNotificationCount();
        this.render();
    },

    // Remove notification
    remove(id, event) {
        if (event) {
            event.stopPropagation();
        }
        
        App.data.notifications = App.data.notifications.filter(n => n.id !== id);
        App.saveData();
        App.updateNotificationCount();
        this.render();
    },

    // Clear all notifications
    clearAll() {
        App.data.notifications = [];
        App.saveData();
        App.updateNotificationCount();
        this.render();
    },

    // Add notification
    add(notification) {
        App.addNotification(notification);
        
        // Show toast notification
        this.showToast(notification);
    },

    // Show toast notification
    showToast(notification) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${notification.type}`;
        toast.innerHTML = `
            <div class="toast-icon">
                ${this.getNotificationIcon(notification.type)}
            </div>
            <div class="toast-content">
                <h4>${notification.title}</h4>
                <p>${notification.message}</p>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add to page
        document.body.appendChild(toast);

        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.remove();
                }
            }, 300);
        }, 5000);
    }
};

// Add CSS for notifications
const notificationCSS = `
.no-notifications {
    text-align: center;
    padding: 3rem 1rem;
    color: var(--text-tertiary);
}

.no-notifications i {
    font-size: 48px;
    margin-bottom: 1rem;
    opacity: 0.5;
}

.no-notifications p {
    font-size: 16px;
}

.notification-item {
    position: relative;
    padding-left: 2rem;
}

.notification-remove {
    position: absolute;
    top: 1rem;
    left: 0.5rem;
    width: 24px;
    height: 24px;
    border: none;
    background: transparent;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    transition: all var(--transition-fast);
    color: var(--text-tertiary);
    font-size: 12px;
}

.notification-item:hover .notification-remove {
    opacity: 1;
}

.notification-remove:hover {
    background: var(--error-100);
    color: var(--error-600);
}

/* Toast Notifications */
.toast {
    position: fixed;
    top: 100px;
    left: 20px;
    width: 350px;
    background: var(--bg-primary);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-xl);
    border: 1px solid var(--border-color);
    z-index: 2001;
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
    transform: translateX(-100%);
    opacity: 0;
    transition: all var(--transition-normal);
}

.toast.show {
    transform: translateX(0);
    opacity: 1;
}

.toast-success {
    border-right: 4px solid var(--success-500);
}

.toast-error {
    border-right: 4px solid var(--error-500);
}

.toast-warning {
    border-right: 4px solid var(--warning-500);
}

.toast-info {
    border-right: 4px solid var(--primary-500);
}

.toast-icon {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
}

.toast-success .toast-icon {
    background: var(--success-100);
    color: var(--success-600);
}

.toast-error .toast-icon {
    background: var(--error-100);
    color: var(--error-600);
}

.toast-warning .toast-icon {
    background: var(--warning-100);
    color: var(--warning-600);
}

.toast-info .toast-icon {
    background: var(--primary-100);
    color: var(--primary-600);
}

.toast-content {
    flex: 1;
}

.toast-content h4 {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
}

.toast-content p {
    font-size: 13px;
    color: var(--text-secondary);
}

.toast-close {
    width: 24px;
    height: 24px;
    border: none;
    background: transparent;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all var(--transition-fast);
    color: var(--text-tertiary);
    font-size: 12px;
}

.toast-close:hover {
    background: var(--hover-bg);
    color: var(--text-primary);
}

@media (max-width: 768px) {
    .toast {
        width: calc(100vw - 40px);
        left: 20px;
        right: 20px;
    }
}
`;

// Add CSS to document
const style = document.createElement('style');
style.textContent = notificationCSS;
document.head.appendChild(style);

// Initialize notifications when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    Notifications.init();
});