/**
 * Procedural Vector Graphics & Sprites Renderer
 * Renders Mochi the Kitten, Ellie the Blue Elephant, Sunflowers, Bubbles, and World Elements
 */

class SpriteRenderer {
  constructor() {
    this.time = 0;
  }

  update(dt = 1) {
    this.time += dt * 0.05;
  }

  /**
   * Draw Mochi the Kitten
   */
  drawCat(ctx, x, y, options = {}) {
    const {
      facing = 1, // 1 for right, -1 for left
      state = 'idle', // 'idle', 'run', 'jump'
      animFrame = 0,
      isPet = false
    } = options;

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(facing, 1);

    const breathing = Math.sin(this.time * 2) * 1.5;
    const tailWag = Math.sin(this.time * 4) * 0.25;
    const runLegOffset = state === 'run' ? Math.sin(animFrame * 0.3) * 6 : 0;

    // Shadow
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(0, 16, 18, 5, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
    ctx.fill();
    ctx.restore();

    // Tail (Behind body)
    ctx.save();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 5.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-10, 5);
    ctx.quadraticCurveTo(-22 + Math.sin(this.time * 3) * 4, -4 + tailWag * 10, -18, -14);
    ctx.stroke();
    // Tail tip (Pastel Orange/Calico patch)
    ctx.strokeStyle = '#FDBA74';
    ctx.lineWidth = 5.5;
    ctx.beginPath();
    ctx.moveTo(-19, -10);
    ctx.lineTo(-18, -14);
    ctx.stroke();
    ctx.restore();

    // Back Legs
    ctx.fillStyle = '#E2E8F0';
    ctx.beginPath();
    ctx.ellipse(-8 - runLegOffset, 12 + (state === 'jump' ? -4 : 0), 4.5, 6, 0.1, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(8 + runLegOffset, 12 + (state === 'jump' ? -4 : 0), 4.5, 6, -0.1, 0, Math.PI * 2);
    ctx.fill();

    // Cat Body (Fluffy round white body with calico patch)
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(0, 4 + breathing * 0.5, 14, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Calico spot on body
    ctx.fillStyle = '#FDBA74'; // Soft Peach Orange
    ctx.beginPath();
    ctx.ellipse(5, 2, 6, 7, 0.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#94A3B8'; // Soft Grey patch
    ctx.beginPath();
    ctx.ellipse(-6, 3, 4, 5, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Front Legs
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(-6 + runLegOffset, 13 + (state === 'jump' ? -6 : 0), 4, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(6 - runLegOffset, 13 + (state === 'jump' ? -6 : 0), 4, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cute Blue Ribbon Collar
    ctx.fillStyle = '#38BDF8';
    ctx.beginPath();
    ctx.roundRect(-10, -3 + breathing * 0.5, 20, 4, 2);
    ctx.fill();

    // Golden Bell on Collar
    ctx.fillStyle = '#FACC15';
    ctx.beginPath();
    ctx.arc(0, 0 + breathing * 0.5, 2.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#CA8A04';
    ctx.beginPath();
    ctx.arc(0, 1 + breathing * 0.5, 0.8, 0, Math.PI * 2);
    ctx.fill();

    // Cat Head
    const headY = -8 + breathing;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(0, headY, 13, 11, 0, 0, Math.PI * 2);
    ctx.fill();

    // Calico patch on head
    ctx.fillStyle = '#FDBA74';
    ctx.beginPath();
    ctx.ellipse(6, headY - 4, 5, 5, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    // Left Ear
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(-11, headY - 4);
    ctx.lineTo(-14, headY - 16);
    ctx.lineTo(-4, headY - 9);
    ctx.closePath();
    ctx.fill();
    // Left Inner Pink Ear
    ctx.fillStyle = '#FDA4AF';
    ctx.beginPath();
    ctx.moveTo(-10, headY - 5);
    ctx.lineTo(-12.5, headY - 13);
    ctx.lineTo(-5.5, headY - 8.5);
    ctx.closePath();
    ctx.fill();

    // Right Ear
    ctx.fillStyle = '#FDBA74'; // Calico right ear
    ctx.beginPath();
    ctx.moveTo(4, headY - 9);
    ctx.lineTo(14, headY - 16);
    ctx.lineTo(11, headY - 4);
    ctx.closePath();
    ctx.fill();
    // Right Inner Pink Ear
    ctx.fillStyle = '#FDA4AF';
    ctx.beginPath();
    ctx.moveTo(5.5, headY - 8.5);
    ctx.lineTo(12.5, headY - 13);
    ctx.lineTo(10, headY - 5);
    ctx.closePath();
    ctx.fill();

    // Eyes
    const blink = Math.sin(this.time * 1.5) > 0.96 || isPet;
    if (blink) {
      // Happy / Purr sleeping curves `^ ^`
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(-4.5, headY - 1, 2.5, Math.PI, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(4.5, headY - 1, 2.5, Math.PI, 0);
      ctx.stroke();
    } else {
      // Big Twinkling Blue / Indigo Eyes
      ctx.fillStyle = '#1E3A8A';
      ctx.beginPath();
      ctx.ellipse(-4.5, headY - 1, 2.8, 3.5, 0, 0, Math.PI * 2);
      ctx.ellipse(4.5, headY - 1, 2.8, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Eye Highlights
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(-5.2, headY - 2.5, 1.2, 0, Math.PI * 2);
      ctx.arc(3.8, headY - 2.5, 1.2, 0, Math.PI * 2);
      ctx.arc(-3.8, headY - 0.2, 0.6, 0, Math.PI * 2);
      ctx.arc(5.2, headY - 0.2, 0.6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Cute Pink Nose & Mouth
    ctx.fillStyle = '#F472B6';
    ctx.beginPath();
    ctx.moveTo(0, headY + 2);
    ctx.lineTo(-1.5, headY + 0.8);
    ctx.lineTo(1.5, headY + 0.8);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, headY + 2);
    ctx.lineTo(0, headY + 3.2);
    ctx.arc(-1.8, headY + 3.2, 1.8, 0, Math.PI * 0.7);
    ctx.moveTo(0, headY + 3.2);
    ctx.arc(1.8, headY + 3.2, 1.8, Math.PI, Math.PI * 0.3, true);
    ctx.stroke();

    // Rosy Cheeks
    ctx.fillStyle = 'rgba(251, 113, 133, 0.35)';
    ctx.beginPath();
    ctx.ellipse(-8, headY + 2, 2.8, 1.6, 0, 0, Math.PI * 2);
    ctx.ellipse(8, headY + 2, 2.8, 1.6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Whiskers
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1;
    // Left whiskers
    ctx.beginPath();
    ctx.moveTo(-7, headY + 2);
    ctx.lineTo(-15, headY);
    ctx.moveTo(-7, headY + 3.5);
    ctx.lineTo(-14, headY + 4.5);
    // Right whiskers
    ctx.moveTo(7, headY + 2);
    ctx.lineTo(15, headY);
    ctx.moveTo(7, headY + 3.5);
    ctx.lineTo(14, headY + 4.5);
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Draw Ellie the Blue Elephant
   */
  drawElephant(ctx, x, y, options = {}) {
    const {
      trunkSpray = false,
      isHappy = false,
      scale = 1
    } = options;

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    const earFlap = Math.sin(this.time * 2.5) * 3;
    const bodyBob = Math.sin(this.time * 1.8) * 1.5;

    // Shadow
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(0, 36, 42, 10, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.28)';
    ctx.fill();
    ctx.restore();

    // Tail
    ctx.save();
    ctx.strokeStyle = '#60A5FA';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-28, 18);
    ctx.quadraticCurveTo(-38 + Math.sin(this.time * 3) * 3, 20, -36, 28);
    ctx.stroke();
    // Tail tuft
    ctx.fillStyle = '#38BDF8';
    ctx.beginPath();
    ctx.arc(-36, 28, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Back Foot (Far side)
    ctx.fillStyle = '#60A5FA';
    ctx.beginPath();
    ctx.roundRect(-24, 20, 14, 16, [0, 0, 7, 7]);
    ctx.fill();

    // Front Foot (Far side)
    ctx.beginPath();
    ctx.roundRect(8, 20, 14, 16, [0, 0, 7, 7]);
    ctx.fill();

    // Main Elephant Body (Pastel Sky / Royal Blue)
    const bodyGrad = ctx.createLinearGradient(-30, -10, 30, 30);
    bodyGrad.addColorStop(0, '#93C5FD');
    bodyGrad.addColorStop(1, '#60A5FA');
    ctx.fillStyle = bodyGrad;

    ctx.beginPath();
    ctx.ellipse(0, 10 + bodyBob, 32, 24, 0, 0, Math.PI * 2);
    ctx.fill();

    // Near Feet
    ctx.fillStyle = '#93C5FD';
    // Back near foot
    ctx.beginPath();
    ctx.roundRect(-16, 22 + bodyBob * 0.3, 14, 15, [0, 0, 7, 7]);
    ctx.fill();
    // Front near foot
    ctx.beginPath();
    ctx.roundRect(16, 22 + bodyBob * 0.3, 14, 15, [0, 0, 7, 7]);
    ctx.fill();

    // Toenails
    ctx.fillStyle = '#DBEAFE';
    for (let f of [-14, -10, -6, 18, 22, 26]) {
      ctx.beginPath();
      ctx.arc(f, 36, 2, Math.PI, 0);
      ctx.fill();
    }

    // Head
    const headX = 18;
    const headY = -4 + bodyBob;
    ctx.fillStyle = '#93C5FD';
    ctx.beginPath();
    ctx.arc(headX, headY, 20, 0, Math.PI * 2);
    ctx.fill();

    // Big Cute Ear
    ctx.save();
    ctx.translate(headX - 10, headY - 4);
    ctx.rotate((earFlap * Math.PI) / 180);
    ctx.fillStyle = '#93C5FD';
    ctx.beginPath();
    ctx.ellipse(0, 4, 14, 18, -0.2, 0, Math.PI * 2);
    ctx.fill();
    // Inner Pink Ear
    ctx.fillStyle = '#FBCFE8';
    ctx.beginPath();
    ctx.ellipse(0, 4, 9, 13, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Elephant Trunk (Curving up playfully)
    ctx.save();
    ctx.strokeStyle = '#93C5FD';
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(headX + 12, headY + 6);
    if (trunkSpray || isHappy) {
      // Trunk curled high up spraying bubbles!
      ctx.quadraticCurveTo(headX + 28, headY + 8, headX + 28, headY - 18);
      ctx.quadraticCurveTo(headX + 28, headY - 26, headX + 20, headY - 26);
    } else {
      // Gentle cheerful wave
      const trunkSway = Math.sin(this.time * 3) * 4;
      ctx.quadraticCurveTo(headX + 24, headY + 12, headX + 26 + trunkSway, headY + 2);
      ctx.quadraticCurveTo(headX + 28 + trunkSway, headY - 8, headX + 22, headY - 10);
    }
    ctx.stroke();

    // Water droplet spray tip highlight
    if (trunkSpray) {
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(headX + 19, headY - 26, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Eyes
    ctx.fillStyle = '#0F172A';
    if (isHappy) {
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(headX + 4, headY - 3, 4, Math.PI, 0);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(headX + 4, headY - 3, 3.5, 0, Math.PI * 2);
      ctx.fill();
      // Sparkle
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(headX + 3, headY - 4.5, 1.4, 0, Math.PI * 2);
      ctx.arc(headX + 5.5, headY - 2, 0.7, 0, Math.PI * 2);
      ctx.fill();
    }

    // Cute Cheeks
    ctx.fillStyle = 'rgba(244, 114, 182, 0.4)';
    ctx.beginPath();
    ctx.ellipse(headX + 2, headY + 5, 4.5, 2.8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tiny Sunflower on Ellie's head! 🌻
    ctx.save();
    ctx.translate(headX - 6, headY - 18);
    this.drawMiniSunflower(ctx, 0, 0, 0.45);
    ctx.restore();

    ctx.restore();
  }

  /**
   * Draw Tiny Sunflower Icon / Accessory
   */
  drawMiniSunflower(ctx, x, y, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    const petalCount = 10;
    const rotSpeed = this.time * 0.5;

    // Petals
    ctx.fillStyle = '#FACC15';
    for (let i = 0; i < petalCount; i++) {
      const angle = (i / petalCount) * Math.PI * 2 + rotSpeed;
      ctx.save();
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(0, -10, 3.5, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Center disk
    ctx.fillStyle = '#78350F';
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#92400E';
    ctx.beginPath();
    ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * Draw Full Bloom Radiant Sunflower
   */
  drawGardenSunflower(ctx, x, y, stage = 3, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    if (stage === 0) {
      // Seed in soil with sparkle
      ctx.fillStyle = '#92400E';
      ctx.beginPath();
      ctx.ellipse(0, 8, 5, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FACC15';
      ctx.beginPath();
      ctx.arc(0, 7, 1.2, 0, Math.PI * 2);
      ctx.fill();
    } else if (stage === 1) {
      // Little Sprout with 2 leaves
      ctx.strokeStyle = '#22C55E';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(0, 10);
      ctx.quadraticCurveTo(2, 2, 0, -4);
      ctx.stroke();

      // Leaves
      ctx.fillStyle = '#4ADE80';
      ctx.beginPath();
      ctx.ellipse(-6, -2, 5, 2.5, -0.4, 0, Math.PI * 2);
      ctx.ellipse(6, -2, 5, 2.5, 0.4, 0, Math.PI * 2);
      ctx.fill();
    } else if (stage === 2) {
      // Tall Stem with Flower Bud
      ctx.strokeStyle = '#16A34A';
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(0, 12);
      ctx.quadraticCurveTo(-3, -10, 0, -26);
      ctx.stroke();

      // Large Leaves
      ctx.fillStyle = '#22C55E';
      ctx.beginPath();
      ctx.ellipse(-12, -8, 10, 4.5, -0.3, 0, Math.PI * 2);
      ctx.ellipse(12, -14, 10, 4.5, 0.3, 0, Math.PI * 2);
      ctx.fill();

      // Golden Bud
      ctx.fillStyle = '#CA8A04';
      ctx.beginPath();
      ctx.arc(0, -28, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FACC15';
      ctx.beginPath();
      ctx.arc(0, -28, 6, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Stage 3: Magnificent Blooming Giant Sunflower!
      const stemSway = Math.sin(this.time * 2 + x * 0.05) * 2;

      // Stem
      ctx.strokeStyle = '#16A34A';
      ctx.lineWidth = 5.5;
      ctx.beginPath();
      ctx.moveTo(0, 15);
      ctx.quadraticCurveTo(stemSway * 1.5, -15, stemSway, -42);
      ctx.stroke();

      // Leaves
      ctx.fillStyle = '#22C55E';
      ctx.beginPath();
      ctx.ellipse(-15 + stemSway * 0.5, -12, 13, 6, -0.3, 0, Math.PI * 2);
      ctx.ellipse(15 + stemSway * 0.5, -24, 13, 6, 0.3, 0, Math.PI * 2);
      ctx.fill();

      // Flower Head
      ctx.save();
      ctx.translate(stemSway, -42);

      const petalCount = 16;
      const spinAngle = this.time * 0.4;

      // Golden Aura / Glow
      const glowGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 38);
      glowGrad.addColorStop(0, 'rgba(250, 204, 21, 0.4)');
      glowGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 38, 0, Math.PI * 2);
      ctx.fill();

      // Dual layer of Golden Petals
      for (let layer = 0; layer < 2; layer++) {
        const offset = layer * (Math.PI / petalCount);
        ctx.fillStyle = layer === 0 ? '#F59E0B' : '#FACC15';
        for (let i = 0; i < petalCount; i++) {
          const angle = (i / petalCount) * Math.PI * 2 + spinAngle + offset;
          ctx.save();
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.ellipse(0, -20, 5.5, 12, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // Rich Brown Center Disk
      ctx.fillStyle = '#78350F';
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#92400E';
      ctx.beginPath();
      ctx.arc(0, 0, 11, 0, Math.PI * 2);
      ctx.fill();

      // Happy Sunflower Face
      // Eyes
      ctx.fillStyle = '#FDE68A';
      ctx.beginPath();
      ctx.arc(-4, -2, 1.8, 0, Math.PI * 2);
      ctx.arc(4, -2, 1.8, 0, Math.PI * 2);
      ctx.fill();
      // Smile
      ctx.strokeStyle = '#FDE68A';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(0, 1, 3.5, 0.2, Math.PI - 0.2);
      ctx.stroke();

      ctx.restore();
    }

    ctx.restore();
  }

  /**
   * Draw Floating Iridescent Bubble
   */
  drawBubble(ctx, x, y, radius = 22, wobble = 0) {
    ctx.save();
    ctx.translate(x, y);

    const stretchX = 1 + Math.sin(this.time * 5 + wobble) * 0.08;
    const stretchY = 1 - Math.sin(this.time * 5 + wobble) * 0.08;
    ctx.scale(stretchX, stretchY);

    // Translucent Bubble Body
    const grad = ctx.createRadialGradient(-radius * 0.3, -radius * 0.3, 2, 0, 0, radius);
    grad.addColorStop(0, 'rgba(224, 242, 254, 0.6)');
    grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.25)');
    grad.addColorStop(0.85, 'rgba(129, 140, 248, 0.35)');
    grad.addColorStop(1, 'rgba(56, 189, 248, 0.65)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(186, 230, 253, 0.8)';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // Specular Reflection Highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.beginPath();
    ctx.ellipse(-radius * 0.42, -radius * 0.42, radius * 0.32, radius * 0.18, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    // Secondary smaller highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.arc(radius * 0.45, radius * 0.45, radius * 0.12, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * Draw Falling Golden Sunflower Seed / Sunshine Drop
   */
  drawItem(ctx, x, y, type = 'seed') {
    ctx.save();
    ctx.translate(x, y);

    const bob = Math.sin(this.time * 4 + x) * 3;
    ctx.translate(0, bob);

    if (type === 'seed') {
      // Golden glowing seed with soft mini wings
      ctx.save();
      // Glow
      ctx.shadowColor = '#FACC15';
      ctx.shadowBlur = 10;

      // Tiny flutter wings
      ctx.fillStyle = 'rgba(254, 240, 138, 0.6)';
      const wingFlap = Math.sin(this.time * 12) * 4;
      ctx.beginPath();
      ctx.ellipse(-8, -4 + wingFlap * 0.5, 6, 3, -0.4, 0, Math.PI * 2);
      ctx.ellipse(8, -4 - wingFlap * 0.5, 6, 3, 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Seed body
      ctx.fillStyle = '#92400E';
      ctx.beginPath();
      ctx.ellipse(0, 0, 7, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // Golden stripes
      ctx.fillStyle = '#FACC15';
      ctx.beginPath();
      ctx.ellipse(0, 0, 3, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    } else if (type === 'sunshine') {
      // Radiant Sunshine Star Orb (Bonus / High-Value)
      ctx.save();
      ctx.shadowColor = '#F59E0B';
      ctx.shadowBlur = 15;

      const orbGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 14);
      orbGrad.addColorStop(0, '#FFFFFF');
      orbGrad.addColorStop(0.4, '#FDE047');
      orbGrad.addColorStop(1, '#F59E0B');

      ctx.fillStyle = orbGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.fill();

      // Orbiting rays
      ctx.fillStyle = '#FACC15';
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + this.time * 2;
        const rx = Math.cos(angle) * 16;
        const ry = Math.sin(angle) * 16;
        ctx.beginPath();
        ctx.arc(rx, ry, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    ctx.restore();
  }
}

window.spriteRenderer = new SpriteRenderer();
