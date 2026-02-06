// NutriSnap - Simple Canvas Charts Module

class SimpleChart {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.options = {
      lineColor: options.lineColor || '#4CAF50',
      fillColor: options.fillColor || 'rgba(76, 175, 80, 0.1)',
      gridColor: options.gridColor || '#e0e0e0',
      textColor: options.textColor || '#757575',
      pointColor: options.pointColor || '#4CAF50',
      targetColor: options.targetColor || '#e91e63',
      padding: options.padding || { top: 20, right: 20, bottom: 40, left: 50 },
      ...options
    };
    this.data = [];
    this.target = null;

    // Handle high DPI displays
    this.setupCanvas();
    window.addEventListener('resize', () => this.render());
  }

  setupCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);

    this.width = rect.width;
    this.height = rect.height;
  }

  setData(data, target = null) {
    this.data = data;
    this.target = target;
    this.render();
  }

  render() {
    this.setupCanvas();
    const { ctx, width, height, options, data } = this;
    const { padding } = options;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    if (!data || data.length === 0) {
      ctx.fillStyle = options.textColor;
      ctx.font = '14px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('No data yet', width / 2, height / 2);
      return;
    }

    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Calculate min/max values
    const values = data.map(d => d.value);
    let minVal = Math.min(...values);
    let maxVal = Math.max(...values);

    // Include target in range if set
    if (this.target !== null) {
      minVal = Math.min(minVal, this.target);
      maxVal = Math.max(maxVal, this.target);
    }

    // Add some padding to range
    const range = maxVal - minVal || 10;
    minVal = Math.floor(minVal - range * 0.1);
    maxVal = Math.ceil(maxVal + range * 0.1);

    // Draw grid lines
    ctx.strokeStyle = options.gridColor;
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + (chartHeight / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      // Y-axis labels
      const val = maxVal - ((maxVal - minVal) / gridLines) * i;
      ctx.fillStyle = options.textColor;
      ctx.font = '11px -apple-system, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(val.toFixed(1), padding.left - 8, y + 4);
    }

    ctx.setLineDash([]);

    // Draw target line
    if (this.target !== null) {
      const targetY = padding.top + chartHeight * (1 - (this.target - minVal) / (maxVal - minVal));
      ctx.strokeStyle = options.targetColor;
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 4]);
      ctx.beginPath();
      ctx.moveTo(padding.left, targetY);
      ctx.lineTo(width - padding.right, targetY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Target label
      ctx.fillStyle = options.targetColor;
      ctx.font = '10px -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Goal', width - padding.right + 4, targetY + 4);
    }

    // Map data points to coordinates
    const points = data.map((d, i) => ({
      x: padding.left + (chartWidth / (data.length - 1 || 1)) * i,
      y: padding.top + chartHeight * (1 - (d.value - minVal) / (maxVal - minVal)),
      label: d.label,
      value: d.value
    }));

    // Draw fill
    ctx.fillStyle = options.fillColor;
    ctx.beginPath();
    ctx.moveTo(points[0].x, padding.top + chartHeight);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, padding.top + chartHeight);
    ctx.closePath();
    ctx.fill();

    // Draw line
    ctx.strokeStyle = options.lineColor;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

    // Draw points
    points.forEach((p, i) => {
      ctx.fillStyle = options.pointColor;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fill();

      // X-axis labels (show every Nth label to avoid crowding)
      const showEvery = Math.ceil(points.length / 7);
      if (i % showEvery === 0 || i === points.length - 1) {
        ctx.fillStyle = options.textColor;
        ctx.font = '10px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(p.label, p.x, height - padding.bottom + 20);
      }
    });
  }
}

// Progress ring helpers
function updateProgressRing(ringId, percent) {
  const ring = document.getElementById(ringId);
  if (!ring) return;

  // Circumference = 2 * PI * radius (54)
  const circumference = 339.292;
  const offset = circumference * (1 - Math.min(percent, 1));
  ring.style.strokeDashoffset = offset;

  // Color based on progress
  if (percent >= 1) {
    ring.style.stroke = '#4CAF50'; // Green when goal met
  } else if (percent >= 0.75) {
    ring.style.stroke = '#8BC34A'; // Light green
  } else if (percent >= 0.5) {
    ring.style.stroke = '#FF9800'; // Orange
  } else {
    ring.style.stroke = '#2196F3'; // Blue
  }
}

function updateMacroBar(barId, percent) {
  const bar = document.getElementById(barId);
  if (!bar) return;

  const width = Math.min(percent * 100, 100);
  bar.style.width = width + '%';
}
