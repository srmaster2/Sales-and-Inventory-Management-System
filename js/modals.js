// Modals Module
const Modals = {
    currentModal: null,

    // Open modal
    open(id, title, content, options = {}) {
        this.close(); // Close any existing modal

        const modal = this.createModal(id, title, content, options);
        document.getElementById('modalsContainer').appendChild(modal);
        
        // Show modal with animation
        setTimeout(() => {
            modal.classList.add('open');
        }, 10);

        this.currentModal = modal;
        
        // Focus first input
        const firstInput = modal.querySelector('input, select, textarea');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    },

    // Create modal element
    createModal(id, title, content, options) {
        const {
            size = 'medium',
            showSaveButton = true,
            showCancelButton = true,
            saveButtonText = 'حفظ',
            cancelButtonText = 'إلغاء',
            onSave = null,
            onCancel = null,
            additionalButtons = []
        } = options;

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = id;

        let buttonsHTML = '';
        
        // Additional buttons
        additionalButtons.forEach(button => {
            buttonsHTML += `
                <button type="button" class="btn ${button.class || 'btn-outline'}" onclick="${button.onclick || ''}">
                    ${button.text}
                </button>
            `;
        });

        // Cancel button
        if (showCancelButton) {
            buttonsHTML += `
                <button type="button" class="btn btn-outline" onclick="Modals.close()">
                    ${cancelButtonText}
                </button>
            `;
        }

        // Save button
        if (showSaveButton) {
            buttonsHTML += `
                <button type="button" class="btn btn-primary" onclick="Modals.save()">
                    ${saveButtonText}
                </button>
            `;
        }

        modal.innerHTML = `
            <div class="modal ${size}">
                <div class="modal-header">
                    <h3 class="modal-title">${title}</h3>
                    <button type="button" class="modal-close" onclick="Modals.close()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                ${buttonsHTML ? `
                    <div class="modal-footer">
                        ${buttonsHTML}
                    </div>
                ` : ''}
            </div>
        `;

        // Store callbacks
        modal._onSave = onSave;
        modal._onCancel = onCancel;

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.close();
            }
        });

        return modal;
    },

    // Close modal
    close() {
        if (this.currentModal) {
            this.currentModal.classList.remove('open');
            
            setTimeout(() => {
                if (this.currentModal && this.currentModal.parentElement) {
                    this.currentModal.remove();
                }
                this.currentModal = null;
            }, 300);
        }
    },

    // Save modal
    save() {
        if (this.currentModal && this.currentModal._onSave) {
            const result = this.currentModal._onSave();
            if (result !== false) {
                this.close();
            }
        } else {
            this.close();
        }
    },

    // Cancel modal
    cancel() {
        if (this.currentModal && this.currentModal._onCancel) {
            this.currentModal._onCancel();
        }
        this.close();
    },

    // Confirm dialog
    confirm(title, message, onConfirm, onCancel) {
        const content = `
            <div class="confirm-dialog">
                <div class="confirm-icon">
                    <i class="fas fa-question-circle"></i>
                </div>
                <div class="confirm-message">
                    <p>${message}</p>
                </div>
            </div>
        `;

        this.open('confirm-modal', title, content, {
            size: 'small',
            saveButtonText: 'تأكيد',
            cancelButtonText: 'إلغاء',
            onSave: onConfirm,
            onCancel: onCancel
        });
    },

    // Alert dialog
    alert(title, message, type = 'info') {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        const content = `
            <div class="alert-dialog ${type}">
                <div class="alert-icon">
                    <i class="${icons[type]}"></i>
                </div>
                <div class="alert-message">
                    <p>${message}</p>
                </div>
            </div>
        `;

        this.open('alert-modal', title, content, {
            size: 'small',
            showSaveButton: false,
            cancelButtonText: 'موافق'
        });
    }
};

// Add CSS for modals
const modalCSS = `
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
    transition: all var(--transition-normal);
}

.modal-overlay.open {
    opacity: 1;
    visibility: visible;
}

.modal {
    background: var(--bg-primary);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-xl);
    border: 1px solid var(--border-color);
    max-height: 90vh;
    overflow: hidden;
    transform: scale(0.9);
    transition: transform var(--transition-normal);
    display: flex;
    flex-direction: column;
}

.modal-overlay.open .modal {
    transform: scale(1);
}

.modal.small {
    width: 400px;
    max-width: 90vw;
}

.modal.medium {
    width: 600px;
    max-width: 90vw;
}

.modal.large {
    width: 800px;
    max-width: 90vw;
}

.modal.extra-large {
    width: 1000px;
    max-width: 95vw;
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-secondary);
}

.modal-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.modal-close {
    width: 36px;
    height: 36px;
    border: none;
    background: transparent;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all var(--transition-fast);
    color: var(--text-secondary);
}

.modal-close:hover {
    background: var(--hover-bg);
    color: var(--text-primary);
}

.modal-body {
    padding: 1.5rem;
    overflow-y: auto;
    flex: 1;
}

.modal-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.75rem;
    padding: 1.5rem;
    border-top: 1px solid var(--border-color);
    background: var(--bg-secondary);
}

/* Form Grid */
.form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
}

/* Confirm Dialog */
.confirm-dialog {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 0;
}

.confirm-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--warning-100);
    color: var(--warning-600);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    flex-shrink: 0;
}

.confirm-message p {
    font-size: 16px;
    color: var(--text-primary);
    margin: 0;
    line-height: 1.5;
}

/* Alert Dialog */
.alert-dialog {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 0;
}

.alert-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    flex-shrink: 0;
}

.alert-dialog.success .alert-icon {
    background: var(--success-100);
    color: var(--success-600);
}

.alert-dialog.error .alert-icon {
    background: var(--error-100);
    color: var(--error-600);
}

.alert-dialog.warning .alert-icon {
    background: var(--warning-100);
    color: var(--warning-600);
}

.alert-dialog.info .alert-icon {
    background: var(--primary-100);
    color: var(--primary-600);
}

.alert-message p {
    font-size: 16px;
    color: var(--text-primary);
    margin: 0;
    line-height: 1.5;
}

@media (max-width: 768px) {
    .modal {
        margin: 1rem;
        max-width: calc(100vw - 2rem);
        max-height: calc(100vh - 2rem);
    }
    
    .modal.small,
    .modal.medium,
    .modal.large,
    .modal.extra-large {
        width: 100%;
    }
    
    .form-grid {
        grid-template-columns: 1fr;
    }
    
    .confirm-dialog,
    .alert-dialog {
        flex-direction: column;
        text-align: center;
    }
}
`;

// Add CSS to document
const style = document.createElement('style');
style.textContent = modalCSS;
document.head.appendChild(style);

// Handle escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && Modals.currentModal) {
        Modals.close();
    }
});