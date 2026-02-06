// NutriSnap - Insights & Trends Module

class Insights {
  constructor() {
    this.calorieChart = null;
    this.macroChart = null;
  }

  // Get daily totals for the last N days
  async getDailyTotals(daysBack = 7) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack + 1);

    const startStr = ui.formatDate(startDate);
    const endStr = ui.formatDate(endDate);
    const entries = await nutriDB.getEntriesByDateRange(startStr, endStr);

    // Group by date
    const byDate = {};
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = ui.formatDate(d);
      byDate[dateStr] = { calories: 0, protein: 0, carbs: 0, fat: 0, count: 0 };
    }

    entries.forEach(e => {
      if (byDate[e.date]) {
        byDate[e.date].calories += e.calories || 0;
        byDate[e.date].protein += e.protein || 0;
        byDate[e.date].carbs += e.carbs || 0;
        byDate[e.date].fat += e.fat || 0;
        byDate[e.date].count++;
      }
    });

    return Object.entries(byDate).map(([date, totals]) => ({
      date,
      label: new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' }),
      ...totals
    }));
  }

  // Get weekly averages for the last N weeks
  async getWeeklyAverages(weeksBack = 4) {
    const dailyTotals = await this.getDailyTotals(weeksBack * 7);

    const weeks = [];
    for (let w = 0; w < weeksBack; w++) {
      const weekDays = dailyTotals.slice(w * 7, (w + 1) * 7);
      const daysWithData = weekDays.filter(d => d.count > 0);

      if (daysWithData.length === 0) {
        weeks.push({ label: `W${weeksBack - w}`, avgCalories: 0, avgProtein: 0, avgCarbs: 0, avgFat: 0, daysLogged: 0 });
        continue;
      }

      const totalCals = daysWithData.reduce((s, d) => s + d.calories, 0);
      weeks.push({
        label: `W${weeksBack - w}`,
        avgCalories: Math.round(totalCals / daysWithData.length),
        avgProtein: Math.round(daysWithData.reduce((s, d) => s + d.protein, 0) / daysWithData.length),
        avgCarbs: Math.round(daysWithData.reduce((s, d) => s + d.carbs, 0) / daysWithData.length),
        avgFat: Math.round(daysWithData.reduce((s, d) => s + d.fat, 0) / daysWithData.length),
        daysLogged: daysWithData.length
      });
    }

    return weeks;
  }

  // Get logging streak
  async getStreakCount() {
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = ui.formatDate(date);
      const entries = await nutriDB.getEntriesByDate(dateStr);
      if (entries.length > 0) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  // Get macro ratios over a period
  async getMacroRatios(daysBack = 7) {
    const dailyTotals = await this.getDailyTotals(daysBack);
    const daysWithData = dailyTotals.filter(d => d.count > 0);

    if (daysWithData.length === 0) {
      return { protein: 0, carbs: 0, fat: 0 };
    }

    const totals = daysWithData.reduce((acc, d) => ({
      protein: acc.protein + d.protein,
      carbs: acc.carbs + d.carbs,
      fat: acc.fat + d.fat
    }), { protein: 0, carbs: 0, fat: 0 });

    // Convert to calories
    const proteinCals = totals.protein * 4;
    const carbsCals = totals.carbs * 4;
    const fatCals = totals.fat * 9;
    const totalCals = proteinCals + carbsCals + fatCals;

    if (totalCals === 0) return { protein: 0, carbs: 0, fat: 0 };

    return {
      protein: Math.round(proteinCals / totalCals * 100),
      carbs: Math.round(carbsCals / totalCals * 100),
      fat: Math.round(fatCals / totalCals * 100)
    };
  }

  // Render the full insights view
  async render() {
    const settings = await nutriDB.getSettings();
    const goal = settings.dailyCalorieGoal || 1800;

    // Streak
    const streak = await this.getStreakCount();
    document.getElementById('streak-count').textContent = streak;
    document.getElementById('streak-label').textContent = streak === 1 ? 'day' : 'days';

    // Weekly calorie averages
    const weeks = await this.getWeeklyAverages(4);
    this.renderCalorieChart(weeks, goal);

    // Daily macro breakdown (last 7 days)
    const dailyTotals = await this.getDailyTotals(7);
    this.renderMacroChart(dailyTotals);

    // Macro ratios
    const ratios = await this.getMacroRatios(7);
    document.getElementById('ratio-protein').textContent = ratios.protein + '%';
    document.getElementById('ratio-carbs').textContent = ratios.carbs + '%';
    document.getElementById('ratio-fat').textContent = ratios.fat + '%';

    // Ratio bar
    document.getElementById('ratio-bar-protein').style.width = ratios.protein + '%';
    document.getElementById('ratio-bar-carbs').style.width = ratios.carbs + '%';
    document.getElementById('ratio-bar-fat').style.width = ratios.fat + '%';
  }

  renderCalorieChart(weeks, goal) {
    const canvas = document.getElementById('calorie-bar-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const padding = { top: 20, right: 20, bottom: 30, left: 50 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    ctx.clearRect(0, 0, w, h);

    const maxVal = Math.max(goal * 1.2, ...weeks.map(w => w.avgCalories)) || goal;
    const barWidth = chartW / weeks.length * 0.6;
    const gap = chartW / weeks.length;

    // Goal line
    const goalY = padding.top + chartH * (1 - goal / maxVal);
    ctx.strokeStyle = '#e91e63';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 3]);
    ctx.beginPath();
    ctx.moveTo(padding.left, goalY);
    ctx.lineTo(w - padding.right, goalY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#e91e63';
    ctx.font = '10px -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Goal', w - padding.right + 4, goalY + 3);

    // Bars
    weeks.forEach((week, i) => {
      const x = padding.left + gap * i + (gap - barWidth) / 2;
      const barH = (week.avgCalories / maxVal) * chartH;
      const y = padding.top + chartH - barH;

      // Color: green near goal, red if over
      const ratio = week.avgCalories / goal;
      if (ratio > 1.1) ctx.fillStyle = '#e91e63';
      else if (ratio > 0.9) ctx.fillStyle = '#4CAF50';
      else if (ratio > 0.7) ctx.fillStyle = '#FF9800';
      else ctx.fillStyle = '#2196F3';

      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barH, 4);
      ctx.fill();

      // Value label
      if (week.avgCalories > 0) {
        ctx.fillStyle = '#212121';
        ctx.font = '11px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(week.avgCalories, x + barWidth / 2, y - 6);
      }

      // X-axis label
      ctx.fillStyle = '#757575';
      ctx.font = '10px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(week.label, x + barWidth / 2, h - padding.bottom + 16);
    });
  }

  renderMacroChart(dailyTotals) {
    const canvas = document.getElementById('macro-stacked-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const padding = { top: 20, right: 20, bottom: 30, left: 10 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    ctx.clearRect(0, 0, w, h);

    const maxCals = Math.max(...dailyTotals.map(d => d.calories), 100);
    const barWidth = chartW / dailyTotals.length * 0.7;
    const gap = chartW / dailyTotals.length;

    const colors = { protein: '#e91e63', carbs: '#ff9800', fat: '#9c27b0' };

    dailyTotals.forEach((day, i) => {
      const x = padding.left + gap * i + (gap - barWidth) / 2;
      const totalCals = (day.protein * 4) + (day.carbs * 4) + (day.fat * 9);
      const totalH = (totalCals / maxCals) * chartH;

      // Stack: protein bottom, carbs middle, fat top
      let currentY = padding.top + chartH;

      [
        { key: 'protein', cals: day.protein * 4 },
        { key: 'carbs', cals: day.carbs * 4 },
        { key: 'fat', cals: day.fat * 9 }
      ].forEach(macro => {
        if (macro.cals <= 0) return;
        const segH = (macro.cals / maxCals) * chartH;
        currentY -= segH;
        ctx.fillStyle = colors[macro.key];
        ctx.fillRect(x, currentY, barWidth, segH);
      });

      // X-axis label
      ctx.fillStyle = '#757575';
      ctx.font = '10px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(day.label, x + barWidth / 2, h - padding.bottom + 16);
    });

    // Legend
    const legendY = 10;
    let legendX = padding.left;
    [
      { label: 'Protein', color: colors.protein },
      { label: 'Carbs', color: colors.carbs },
      { label: 'Fat', color: colors.fat }
    ].forEach(item => {
      ctx.fillStyle = item.color;
      ctx.fillRect(legendX, legendY, 10, 10);
      ctx.fillStyle = '#757575';
      ctx.font = '10px -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(item.label, legendX + 14, legendY + 9);
      legendX += ctx.measureText(item.label).width + 24;
    });
  }
}

// Global instance
const insights = new Insights();
