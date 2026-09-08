/**
 * Particle System for Anusha's Sunflower Meadow
 * Handles floating petals, star dust, bubbles, water splashes, hearts, and confetti
 */

class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  createPetal(x, y) {
    this.particles.push({
      type: 'petal',
      x: x || Math.random() * window.innerWidth,
      y: y || -20,
      vx: (Math.random() - 0.5) * 1.5,
      vy: 1 + Math.random() * 1.8,
      rotation: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.05,
      scale: 0.7 + Math.random() * 0.6,
      opacity: 0.8 + Math.random() * 0.2,
      decay: 0.001 + Math.random() * 0.002,
      color: Math.random() > 0.3 ? '#FACC15' : '#F59E0B',
      swayOffset: Math.random() * 100,
      life: 1.0
    });
  }

  createSparkle(x, y, color = '#60A5FA', count = 5) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3.5;
      this.particles.push({
        type: 'sparkle',
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.8,
        size: 3 + Math.random() * 4,
        color,
        opacity: 1.0,
        decay: 0.02 + Math.random() * 0.03,
        life: 1.0
      });
    }
  }

  createWaterSplash(x, y, count = 12) {
    for (let i = 0; i < count; i++) {
      const angle = -Math.PI * 0.8 + Math.random() * Math.PI * 0.6; // Upward spray
      const speed = 2.5 + Math.random() * 5.0;
      this.particles.push({
        type: 'water',
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2.5 + Math.random() * 3,
        color: '#38BDF8',
        opacity: 0.85,
        decay: 0.025,
        gravity: 0.18,
        life: 1.0
      });
    }
  }

  createHeart(x, y, count = 3) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        type: 'heart',
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 1.2,
        vy: -1.5 - Math.random() * 1.5,
        scale: 0.6 + Math.random() * 0.5,
        color: Math.random() > 0.5 ? '#F43F5E' : '#EC4899',
        opacity: 1.0,
        decay: 0.015,
        life: 1.0
      });
    }
  }

  createConfetti(x, y, count = 40) {
    const colors = ['#38BDF8', '#818CF8', '#FACC15', '#34D399', '#F472B6', '#60A5FA', '#FFFFFF'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 7;
      this.particles.push({
        type: 'confetti',
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        w: 6 + Math.random() * 6,
        h: 4 + Math.random() * 4,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 1.0,
        decay: 0.008 + Math.random() * 0.008,
        gravity: 0.1,
        life: 1.0
      });
    }
  }

  update(dt = 1) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= p.decay * dt;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      if (p.type === 'petal') {
        p.swayOffset += 0.03 * dt;
        p.x += (p.vx + Math.sin(p.swayOffset) * 0.8) * dt;
        p.y += p.vy * dt;
        p.rotation += p.vRot * dt;
      } else if (p.type === 'sparkle') {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx *= 0.95;
        p.vy *= 0.95;
      } else if (p.type === 'water') {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += p.gravity * dt;
      } else if (p.type === 'heart') {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      } else if (p.type === 'confetti') {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += p.gravity * dt;
        p.rotation += p.vRot * dt;
      }
    }
  }

  draw(ctx) {
    ctx.save();
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      const alpha = Math.max(0, p.life * p.opacity);

      if (p.type === 'petal') {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.scale(p.scale, p.scale);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;

        // Draw curved sunflower petal
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.quadraticCurveTo(6, -2, 4, 10);
        ctx.quadraticCurveTo(0, 14, -4, 10);
        ctx.quadraticCurveTo(-6, -2, 0, -10);
        ctx.fill();

        // Subtle petal spine
        ctx.strokeStyle = 'rgba(217, 119, 6, 0.4)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(0, -8);
        ctx.lineTo(0, 8);
        ctx.stroke();

        ctx.restore();
      } else if (p.type === 'sparkle') {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;

        // 4-pointed star
        const s = p.size * p.life;
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.quadraticCurveTo(0, 0, s, 0);
        ctx.quadraticCurveTo(0, 0, 0, s);
        ctx.quadraticCurveTo(0, 0, -s, 0);
        ctx.quadraticCurveTo(0, 0, 0, -s);
        ctx.fill();
        ctx.restore();
      } else if (p.type === 'water') {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Highlight
        ctx.fillStyle = '#E0F2FE';
        ctx.beginPath();
        ctx.arc(p.x - p.radius * 0.3, p.y - p.radius * 0.3, p.radius * 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (p.type === 'heart') {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.scale(p.scale * p.life, p.scale * p.life);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;

        ctx.beginPath();
        const topCurveHeight = 6;
        ctx.moveTo(0, 3);
        ctx.bezierCurveTo(0, 0, -6, -topCurveHeight, -6, 2);
        ctx.bezierCurveTo(-6, 7, 0, 11, 0, 14);
        ctx.bezierCurveTo(0, 11, 6, 7, 6, 2);
        ctx.bezierCurveTo(6, -topCurveHeight, 0, 0, 0, 3);
        ctx.fill();
        ctx.restore();
      } else if (p.type === 'confetti') {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
    }
    ctx.restore();
  }
}

window.particleSystem = new ParticleSystem();
