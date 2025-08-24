// Dynamic Image Cropping Tool for Nexus
class DynamicImageCropper {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            aspectRatio: options.aspectRatio || 1, // Square by default
            quality: options.quality || 0.8,
            maxWidth: options.maxWidth || 800,
            maxHeight: options.maxHeight || 800,
            ...options
        };
        
        this.canvas = null;
        this.ctx = null;
        this.image = null;
        this.cropArea = {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        };
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.scale = 1;
        this.imageOffset = { x: 0, y: 0 };
        
        this.init();
    }
    
    init() {
        this.createCropperInterface();
        this.bindEvents();
    }
    
    createCropperInterface() {
        this.container.innerHTML = `
            <div class="dynamic-cropper">
                <div class="cropper-canvas-container">
                    <canvas class="cropper-canvas"></canvas>
                    <div class="crop-overlay">
                        <div class="crop-area">
                            <div class="crop-handle top-left"></div>
                            <div class="crop-handle top-right"></div>
                            <div class="crop-handle bottom-left"></div>
                            <div class="crop-handle bottom-right"></div>
                        </div>
                    </div>
                </div>
                <div class="cropper-controls">
                    <div class="zoom-controls">
                        <button type="button" class="zoom-btn zoom-out">-</button>
                        <input type="range" class="zoom-slider" min="0.5" max="3" step="0.1" value="1">
                        <button type="button" class="zoom-btn zoom-in">+</button>
                    </div>
                    <div class="crop-actions">
                        <button type="button" class="crop-action-btn reset-btn">Reset</button>
                        <button type="button" class="crop-action-btn crop-btn">Crop Image</button>
                        <button type="button" class="crop-action-btn cancel-btn">Cancel</button>
                    </div>
                </div>
            </div>
        `;
        
        this.canvas = this.container.querySelector('.cropper-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.cropOverlay = this.container.querySelector('.crop-overlay');
        this.cropAreaElement = this.container.querySelector('.crop-area');
        
        // Add CSS styles
        this.addCropperStyles();
    }
    
    addCropperStyles() {
        if (document.getElementById('dynamic-cropper-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'dynamic-cropper-styles';
        styles.textContent = `
            .dynamic-cropper {
                background: var(--post-bg);
                border-radius: 15px;
                padding: 20px;
                border: 2px solid var(--post-border);
                margin: 20px 0;
            }
            
            .cropper-canvas-container {
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 400px;
                background: #f8f9fa;
                border-radius: 10px;
                overflow: hidden;
            }
            
            .cropper-canvas {
                max-width: 100%;
                max-height: 400px;
                cursor: move;
                border-radius: 8px;
            }
            
            .crop-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                pointer-events: none;
            }
            
            .crop-area {
                position: absolute;
                border: 2px solid var(--accent-highlight);
                background: rgba(198, 172, 143, 0.1);
                pointer-events: all;
                cursor: move;
                min-width: 50px;
                min-height: 50px;
            }
            
            .crop-handle {
                position: absolute;
                width: 12px;
                height: 12px;
                background: var(--accent-highlight);
                border: 2px solid white;
                border-radius: 50%;
                cursor: pointer;
            }
            
            .crop-handle.top-left {
                top: -6px;
                left: -6px;
                cursor: nw-resize;
            }
            
            .crop-handle.top-right {
                top: -6px;
                right: -6px;
                cursor: ne-resize;
            }
            
            .crop-handle.bottom-left {
                bottom: -6px;
                left: -6px;
                cursor: sw-resize;
            }
            
            .crop-handle.bottom-right {
                bottom: -6px;
                right: -6px;
                cursor: se-resize;
            }
            
            .cropper-controls {
                margin-top: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 15px;
            }
            
            .zoom-controls {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .zoom-btn {
                width: 35px;
                height: 35px;
                border: none;
                border-radius: 50%;
                background: var(--accent-highlight);
                color: white;
                font-size: 1.2rem;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .zoom-btn:hover {
                background: var(--subtle-accent);
                transform: scale(1.1);
            }
            
            .zoom-slider {
                width: 120px;
                height: 6px;
                border-radius: 3px;
                background: var(--post-border);
                outline: none;
                cursor: pointer;
            }
            
            .zoom-slider::-webkit-slider-thumb {
                appearance: none;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: var(--accent-highlight);
                cursor: pointer;
            }
            
            .crop-actions {
                display: flex;
                gap: 10px;
            }
            
            .crop-action-btn {
                padding: 10px 20px;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                font-family: 'Inter', sans-serif;
            }
            
            .reset-btn {
                background: var(--subtle-accent);
                color: white;
            }
            
            .crop-btn {
                background: var(--accent-highlight);
                color: white;
            }
            
            .cancel-btn {
                background: #e74c3c;
                color: white;
            }
            
            .crop-action-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            }
            
            @media (max-width: 768px) {
                .cropper-controls {
                    flex-direction: column;
                    align-items: stretch;
                }
                
                .zoom-controls {
                    justify-content: center;
                }
                
                .crop-actions {
                    justify-content: center;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }
    
    bindEvents() {
        const zoomSlider = this.container.querySelector('.zoom-slider');
        const zoomInBtn = this.container.querySelector('.zoom-in');
        const zoomOutBtn = this.container.querySelector('.zoom-out');
        const resetBtn = this.container.querySelector('.reset-btn');
        const cropBtn = this.container.querySelector('.crop-btn');
        const cancelBtn = this.container.querySelector('.cancel-btn');
        
        // Zoom controls
        zoomSlider.addEventListener('input', (e) => {
            this.scale = parseFloat(e.target.value);
            this.redraw();
        });
        
        zoomInBtn.addEventListener('click', () => {
            this.scale = Math.min(3, this.scale + 0.1);
            zoomSlider.value = this.scale;
            this.redraw();
        });
        
        zoomOutBtn.addEventListener('click', () => {
            this.scale = Math.max(0.5, this.scale - 0.1);
            zoomSlider.value = this.scale;
            this.redraw();
        });
        
        // Action buttons
        resetBtn.addEventListener('click', () => this.reset());
        cropBtn.addEventListener('click', () => this.cropImage());
        cancelBtn.addEventListener('click', () => this.cancel());
        
        // Canvas drag events
        this.canvas.addEventListener('mousedown', this.startDrag.bind(this));
        this.canvas.addEventListener('mousemove', this.drag.bind(this));
        this.canvas.addEventListener('mouseup', this.endDrag.bind(this));
        this.canvas.addEventListener('mouseleave', this.endDrag.bind(this));
        
        // Touch events for mobile
        this.canvas.addEventListener('touchstart', this.handleTouch.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouch.bind(this));
        this.canvas.addEventListener('touchend', this.endDrag.bind(this));
    }
    
    loadImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    this.image = img;
                    this.setupCanvas();
                    this.setupCropArea();
                    this.redraw();
                    resolve(img);
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
    
    setupCanvas() {
        const containerRect = this.container.querySelector('.cropper-canvas-container').getBoundingClientRect();
        const maxWidth = Math.min(containerRect.width - 40, this.options.maxWidth);
        const maxHeight = Math.min(containerRect.height - 40, this.options.maxHeight);
        
        let { width, height } = this.image;
        
        // Scale image to fit container
        if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
        }
        if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
        }
        
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
        
        this.imageOffset = { x: 0, y: 0 };
    }
    
    setupCropArea() {
        const canvasRect = this.canvas.getBoundingClientRect();
        const containerRect = this.container.querySelector('.cropper-canvas-container').getBoundingClientRect();
        
        const cropSize = Math.min(canvasRect.width, canvasRect.height) * 0.8;
        
        this.cropArea = {
            x: (canvasRect.width - cropSize) / 2,
            y: (canvasRect.height - cropSize) / 2,
            width: cropSize,
            height: cropSize
        };
        
        this.updateCropAreaElement();
    }
    
    updateCropAreaElement() {
        const canvasRect = this.canvas.getBoundingClientRect();
        const containerRect = this.container.querySelector('.cropper-canvas-container').getBoundingClientRect();
        
        const offsetX = canvasRect.left - containerRect.left;
        const offsetY = canvasRect.top - containerRect.top;
        
        this.cropAreaElement.style.left = (offsetX + this.cropArea.x) + 'px';
        this.cropAreaElement.style.top = (offsetY + this.cropArea.y) + 'px';
        this.cropAreaElement.style.width = this.cropArea.width + 'px';
        this.cropAreaElement.style.height = this.cropArea.height + 'px';
    }
    
    redraw() {
        if (!this.image) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const scaledWidth = this.image.width * this.scale;
        const scaledHeight = this.image.height * this.scale;
        
        const x = (this.canvas.width - scaledWidth) / 2 + this.imageOffset.x;
        const y = (this.canvas.height - scaledHeight) / 2 + this.imageOffset.y;
        
        this.ctx.drawImage(this.image, x, y, scaledWidth, scaledHeight);
        this.updateCropAreaElement();
    }
    
    startDrag(e) {
        this.isDragging = true;
        this.dragStart = {
            x: e.clientX - this.imageOffset.x,
            y: e.clientY - this.imageOffset.y
        };
    }
    
    drag(e) {
        if (!this.isDragging) return;
        
        this.imageOffset = {
            x: e.clientX - this.dragStart.x,
            y: e.clientY - this.dragStart.y
        };
        
        this.redraw();
    }
    
    endDrag() {
        this.isDragging = false;
    }
    
    handleTouch(e) {
        e.preventDefault();
        const touch = e.touches[0];
        if (touch) {
            const mouseEvent = new MouseEvent(e.type.replace('touch', 'mouse'), {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvas.dispatchEvent(mouseEvent);
        }
    }
    
    reset() {
        this.scale = 1;
        this.imageOffset = { x: 0, y: 0 };
        this.container.querySelector('.zoom-slider').value = 1;
        this.setupCropArea();
        this.redraw();
    }
    
    cropImage() {
        if (!this.image) return null;
        
        const cropCanvas = document.createElement('canvas');
        const cropCtx = cropCanvas.getContext('2d');
        
        cropCanvas.width = this.cropArea.width;
        cropCanvas.height = this.cropArea.height;
        
        const scaledWidth = this.image.width * this.scale;
        const scaledHeight = this.image.height * this.scale;
        
        const imageX = (this.canvas.width - scaledWidth) / 2 + this.imageOffset.x;
        const imageY = (this.canvas.height - scaledHeight) / 2 + this.imageOffset.y;
        
        const sourceX = (this.cropArea.x - imageX) / this.scale;
        const sourceY = (this.cropArea.y - imageY) / this.scale;
        const sourceWidth = this.cropArea.width / this.scale;
        const sourceHeight = this.cropArea.height / this.scale;
        
        cropCtx.drawImage(
            this.image,
            sourceX, sourceY, sourceWidth, sourceHeight,
            0, 0, this.cropArea.width, this.cropArea.height
        );
        
        return cropCanvas.toDataURL('image/jpeg', this.options.quality);
    }
    
    cancel() {
        if (this.onCancel) {
            this.onCancel();
        }
    }
    
    onCrop(callback) {
        this.container.querySelector('.crop-btn').addEventListener('click', () => {
            const croppedDataUrl = this.cropImage();
            if (croppedDataUrl && callback) {
                callback(croppedDataUrl);
            }
        });
    }
    
    onCancel(callback) {
        this.onCancel = callback;
    }
}

// Export for use in other files
window.DynamicImageCropper = DynamicImageCropper;