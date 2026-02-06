// NutriSnap - Camera & Photo Module

class Camera {
  constructor() {
    this.stream = null;
    this.video = null;
    this.canvas = null;
    this.currentCallback = null;
  }

  init() {
    this.video = document.getElementById('camera-video');
    this.canvas = document.getElementById('camera-canvas');
  }

  async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      this.video.srcObject = this.stream;
      return true;
    } catch (error) {
      console.error('Camera access denied:', error);
      return false;
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.video) {
      this.video.srcObject = null;
    }
  }

  capturePhoto() {
    if (!this.video || !this.canvas) return null;

    const ctx = this.canvas.getContext('2d');
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;
    ctx.drawImage(this.video, 0, 0);

    return new Promise(resolve => {
      this.canvas.toBlob(blob => {
        resolve(blob);
      }, 'image/jpeg', 0.8);
    });
  }

  async openCamera(callback) {
    this.currentCallback = callback;
    const modal = document.getElementById('camera-modal');
    modal.classList.add('active');

    const success = await this.startCamera();
    if (!success) {
      // If camera fails, just show upload option
      this.video.style.display = 'none';
      document.getElementById('camera-capture').style.display = 'none';
    }
  }

  closeCamera() {
    this.stopCamera();
    document.getElementById('camera-modal').classList.remove('active');
    this.video.style.display = 'block';
    document.getElementById('camera-capture').style.display = 'inline-flex';
  }

  async handleCapture() {
    const blob = await this.capturePhoto();
    if (blob && this.currentCallback) {
      this.currentCallback(blob);
    }
    this.closeCamera();
  }

  handleUpload(file) {
    if (!file || !file.type.startsWith('image/')) return;

    // Compress image before storing
    this.compressImage(file).then(blob => {
      if (this.currentCallback) {
        this.currentCallback(blob);
      }
    });
    this.closeCamera();
  }

  // Compress image to reasonable size
  compressImage(file, maxWidth = 800, quality = 0.7) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
      };

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Scale down if needed
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(resolve, 'image/jpeg', quality);
      };

      img.onerror = reject;
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Create thumbnail from blob
  async createThumbnail(blob, size = 80) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(blob);

      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext('2d');

        // Crop to square from center
        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;

        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);

        canvas.toBlob(resolve, 'image/jpeg', 0.7);
      };

      img.onerror = reject;
      img.src = url;
    });
  }

  // Convert blob to data URL for display
  blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Setup event listeners
  setupListeners() {
    // Capture button
    document.getElementById('camera-capture').addEventListener('click', () => {
      this.handleCapture();
    });

    // Upload button & input
    document.getElementById('camera-upload').addEventListener('click', () => {
      document.getElementById('photo-upload').click();
    });

    document.getElementById('photo-upload').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        this.handleUpload(file);
        e.target.value = ''; // Reset for next upload
      }
    });

    // Close modal
    document.querySelector('#camera-modal .modal-close').addEventListener('click', () => {
      this.closeCamera();
    });
  }
}

// Global camera instance
const camera = new Camera();
