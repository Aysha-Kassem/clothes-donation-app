/**
 * Image Preview Script
 * سكريبت معاينة الصور
 */

class ImagePreview {
    constructor(inputId, previewId, options = {}) {
        this.input = document.getElementById(inputId);
        this.preview = document.getElementById(previewId);
        this.options = {
            maxWidth: 800,
            maxHeight: 800,
            quality: 0.8,
            allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
            maxSize: 5 * 1024 * 1024, // 5MB
            ...options
        };

        this.init();
    }

    init() {
        if (!this.input || !this.preview) return;

        this.input.addEventListener('change', (e) => this.handleFileSelect(e));
    }

    handleFileSelect(event) {
        const file = event.target.files[0];

        if (!file) return;

        // Validate file type
        if (!this.options.allowedTypes.includes(file.type)) {
            this.showError('Please select a valid image file (JPG, PNG, WebP)');
            this.input.value = '';
            return;
        }

        // Validate file size
        if (file.size > this.options.maxSize) {
            this.showError(`File size must be less than ${this.options.maxSize / 1024 / 1024}MB`);
            this.input.value = '';
            return;
        }

        // Read and display preview
        const reader = new FileReader();
        reader.onload = (e) => {
            this.preview.src = e.target.result;
            this.preview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }

    showError(message) {
        // Create error notification
        const notification = document.createElement('div');
        notification.className = 'bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded animate-fade-in';
        notification.innerHTML = `
            <div class="flex">
                <div class="flex-shrink-0">
                    <i class="fas fa-exclamation-circle text-red-500"></i>
                </div>
                <div class="ml-3">
                    <p class="text-sm text-red-700">${message}</p>
                </div>
            </div>
        `;

        // Insert before form
        const form = this.input.closest('form');
        if (form) {
            form.insertBefore(notification, form.firstChild);

            // Auto remove after 5 seconds
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transition = 'opacity 0.5s';
                setTimeout(() => notification.remove(), 500);
            }, 5000);
        }
    }

    // Compress image before upload (client-side)
    compressImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Calculate new dimensions
                    if (width > this.options.maxWidth) {
                        height *= this.options.maxWidth / width;
                        width = this.options.maxWidth;
                    }
                    if (height > this.options.maxHeight) {
                        width *= this.options.maxHeight / height;
                        height = this.options.maxHeight;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob(
                        (blob) => resolve(blob),
                        file.type,
                        this.options.quality
                    );
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if elements exist and initialize
    if (document.getElementById('image') && document.getElementById('imagePreview')) {
        new ImagePreview('image', 'imagePreview');
    }
});
