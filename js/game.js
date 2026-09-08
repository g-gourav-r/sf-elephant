/**
 * Anusha's Sunflower Meadow - Main Game Engine
 * Coordinates game loop, player physics, items, bubbles, collisions, mobile touch, and UI
 */

class GameEngine {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.gameState = 'welcome'; // 'welcome', 'playing', 'victory'
    this.seeds = 0;
    this.sunshine = 0;
    
    // Physics constants
    this.gravity = 0.45;
    this.groundY = this.height - 90;

    // Player (Mochi the Cat)
    this.player = {
      x: this.width * 0.25,
      y: this.groundY,
      vx: 0,
      vy: 0,
      width: 32,
      height: 28,
      speed: 5.5,
      jumpForce: -11.5,
      grounded: true,
      facing: 1,
      state: 'idle',
      animFrame: 0,
      isPet: false,
      petTimer: 0
    };

    // Companion (Ellie the Elephant)
    this.elephant = {
      x: this.width * 0.88,
      y: this.groundY - 32,
      scale: 0.95,
      isHappy: false,
      happyTimer: 0,
      sprayTimer: 0,
      bubbleTimer: 0
    };

    // Game Entities
    this.fallingItems = [];
    this.bubbles = [];
    this.itemSpawnTimer = 0;
    this.bubbleSpawnTimer = 0;

    // Key inputs & touch tracking
    this.keys = {
      left: false,
      right: false,
      jump: false,
      water: false
    };
    this.activeTouches = new Map(); // Touch ID -> Action ('left', 'right', 'jump', 'water', 'pet')

    // Auto seed generator for peaceful endless joy
    this.autoPetalTimer = 0;

    this.initCanvas();
    this.bindEvents();
    this.populateGardenModal();

    // Check touch device to ensure touch controls are active
    this.detectTouchDevice();

    // Start render loop
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.loop(t));
  }

  detectTouchDevice() {
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth <= 1024);
    const touchControls = document.getElementById('touch-controls');
    if (touchControls) {
      touchControls.style.display = isTouch ? 'flex' : 'none';
    }
  }

  initCanvas() {
    this.resize();
    window.addEventListener('resize', () => {
      this.resize();
      this.detectTouchDevice();
    });
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.resize();
        this.detectTouchDevice();
      }, 100);
    });
  }

  resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    // Dynamic ground position based on screen height
    this.groundY = Math.max(this.height - (this.width <= 600 ? 110 : 90), this.height * 0.7);

    // Responsive scaling
    const isMobile = this.width < 600;
    if (this.elephant) {
      this.elephant.scale = isMobile ? 0.78 : 0.95;
      this.elephant.x = Math.max(100, this.width - (isMobile ? 80 : 140));
      this.elephant.y = this.groundY - (isMobile ? 24 : 32);
    }
    if (this.player) {
      if (this.player.y > this.groundY) this.player.y = this.groundY;
      if (this.player.x > this.width - 40) this.player.x = this.width - 50;
    }
  }

  bindEvents() {
    // Unlock Audio Context on first touch / click anywhere on screen (Critical for iOS Safari & Android)
    const unlockAudio = () => {
      window.soundEngine.init();
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('pointerdown', unlockAudio);
    };
    window.addEventListener('touchstart', unlockAudio, { passive: true });
    window.addEventListener('pointerdown', unlockAudio, { passive: true });

    // Keyboard inputs
    window.addEventListener('keydown', (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.keys.left = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') this.keys.right = true;
      if (e.code === 'ArrowUp' || e.code === 'Space' || e.code === 'KeyW') {
        if (!this.keys.jump && this.player.grounded) {
          this.jumpPlayer();
        }
        this.keys.jump = true;
      }
      if (e.code === 'KeyE') {
        this.triggerElephantWater();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.keys.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') this.keys.right = false;
      if (e.code === 'ArrowUp' || e.code === 'Space' || e.code === 'KeyW') this.keys.jump = false;
    });

    // Multi-touch Control Buttons
    const setupTouchBtn = (elemId, action) => {
      const btn = document.getElementById(elemId);
      if (!btn) return;

      const handleTouchStart = (e) => {
        e.preventDefault();
        btn.classList.add('active-touch');
        if (action === 'left' || action === 'right') {
          this.keys[action] = true;
        } else if (action === 'jump') {
          this.keys.jump = true;
          if (this.player.grounded) this.jumpPlayer();
        } else if (action === 'water') {
          this.triggerElephantWater();
        } else if (action === 'pet') {
          this.petCat();
        }
      };

      const handleTouchEnd = (e) => {
        e.preventDefault();
        btn.classList.remove('active-touch');
        if (action === 'left' || action === 'right') {
          this.keys[action] = false;
        } else if (action === 'jump') {
          this.keys.jump = false;
        }
      };

      btn.addEventListener('touchstart', handleTouchStart, { passive: false });
      btn.addEventListener('touchend', handleTouchEnd, { passive: false });
      btn.addEventListener('touchcancel', handleTouchEnd, { passive: false });

      // Fallback for mouse click on the touch buttons (for testing)
      btn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        if (action === 'left' || action === 'right') this.keys[action] = true;
        if (action === 'jump' && this.player.grounded) this.jumpPlayer();
        if (action === 'water') this.triggerElephantWater();
        if (action === 'pet') this.petCat();
      });
      btn.addEventListener('mouseup', (e) => {
        e.preventDefault();
        if (action === 'left' || action === 'right') this.keys[action] = false;
        if (action === 'jump') this.keys.jump = false;
      });
      btn.addEventListener('mouseleave', (e) => {
        if (action === 'left' || action === 'right') this.keys[action] = false;
      });
    };

    setupTouchBtn('touch-left', 'left');
    setupTouchBtn('touch-right', 'right');
    setupTouchBtn('touch-jump', 'jump');
    setupTouchBtn('touch-water', 'water');
    setupTouchBtn('touch-pet', 'pet');

    // Direct Canvas Touch & Click Interactions
    const handleCanvasPointer = (clientX, clientY) => {
      const rect = this.canvas.getBoundingClientRect();
      const clickX = clientX - rect.left;
      const clickY = clientY - rect.top;

      // Tap on Cat
      const distToCat = Math.hypot(clickX - this.player.x, clickY - (this.player.y - 8));
      if (distToCat < 45) {
        this.petCat();
        return;
      }

      // Tap on Elephant
      const distToElephant = Math.hypot(clickX - this.elephant.x, clickY - (this.elephant.y - 10));
      if (distToElephant < 70) {
        this.triggerElephantWater();
        return;
      }

      // Tap on empty meadow: Move towards tap & jump if tapped high
      if (clickX < this.player.x - 20) {
        this.player.vx = -this.player.speed;
        this.player.facing = -1;
      } else if (clickX > this.player.x + 20) {
        this.player.vx = this.player.speed;
        this.player.facing = 1;
      }
      if (clickY < this.player.y - 45 && this.player.grounded) {
        this.jumpPlayer();
      }
    };

    this.canvas.addEventListener('pointerdown', (e) => {
      handleCanvasPointer(e.clientX, e.clientY);
    });

    // Prevent context menu on touch devices
    window.addEventListener('contextmenu', (e) => {
      if (e.target.tagName === 'CANVAS' || e.target.classList.contains('touch-btn')) {
        e.preventDefault();
      }
    });

    // Modal & HUD Button Bindings
    document.getElementById('btn-start-game').addEventListener('click', () => {
      this.closeModal('start-modal');
      this.gameState = 'playing';
      window.soundEngine.init();
      window.soundEngine.startMusic();
      window.soundEngine.playMeow();
    });

    document.getElementById('btn-audio').addEventListener('click', () => {
      const muted = window.soundEngine.toggleMute();
      document.getElementById('btn-audio').textContent = muted ? '🔇' : '🔊';
    });

    document.getElementById('btn-water').addEventListener('click', () => {
      this.triggerElephantWater();
    });

    document.getElementById('btn-garden').addEventListener('click', () => {
      this.openGardenModal();
    });

    document.getElementById('btn-close-garden').addEventListener('click', () => {
      this.closeModal('garden-modal');
    });

    document.getElementById('btn-help').addEventListener('click', () => {
      this.openModal('help-modal');
    });

    document.getElementById('btn-close-help').addEventListener('click', () => {
      this.closeModal('help-modal');
    });

    document.getElementById('btn-celebrate').addEventListener('click', () => {
      this.closeModal('victory-modal');
    });

    document.getElementById('btn-view-messages').addEventListener('click', () => {
      this.closeModal('victory-modal');
      this.openGardenModal();
    });
  }

  jumpPlayer() {
    this.player.vy = this.player.jumpForce;
    this.player.grounded = false;
    window.soundEngine.playJump();
    window.particleSystem.createSparkle(this.player.x, this.player.y + 10, '#38BDF8', 4);
  }

  petCat() {
    this.player.isPet = true;
    this.player.petTimer = 45;
    window.soundEngine.playPurr();
    window.soundEngine.playMeow();
    window.particleSystem.createHeart(this.player.x, this.player.y - 20, 5);
  }

  triggerElephantWater() {
    this.elephant.isHappy = true;
    this.elephant.happyTimer = 60;
    this.elephant.sprayTimer = 40;
    window.soundEngine.playTrumpet();
    window.soundEngine.playWaterSplash();

    // Splash water droplets from elephant trunk
    const trunkX = this.elephant.x + 20 * (this.elephant.scale || 1);
    const trunkY = this.elephant.y - 26 * (this.elephant.scale || 1);
    window.particleSystem.createWaterSplash(trunkX, trunkY, 20);

    // Spawn 2 extra bouncy bubbles
    for (let i = 0; i < 2; i++) {
      this.bubbles.push({
        x: trunkX + (Math.random() - 0.5) * 40,
        y: trunkY - 20 - i * 30,
        vx: (Math.random() - 0.5) * 1.5 - 1.2,
        vy: -1.2 - Math.random() * 1.5,
        radius: (this.width < 600 ? 16 : 20) + Math.random() * 10,
        wobble: Math.random() * 10
      });
    }

    // Water garden plots
    const newlyBloomed = window.gardenManager.waterAll(30);
    this.updateHUD();

    if (newlyBloomed.length > 0) {
      newlyBloomed.forEach(plot => {
        this.showMilestoneToast(plot);
        window.soundEngine.playBloomFanfare();
        window.particleSystem.createConfetti(this.width * plot.xRatio, this.groundY - 50, 30);
      });

      if (window.gardenManager.isAllBloomed()) {
        setTimeout(() => this.triggerVictory(), 1200);
      }
    }
  }

  showMilestoneToast(plot) {
    const toast = document.getElementById('milestone-toast');
    const title = document.getElementById('toast-title');
    const msg = document.getElementById('toast-message');

    title.textContent = `${plot.name} Bloomed! 🌻`;
    msg.textContent = plot.message;

    toast.classList.add('active');
    setTimeout(() => {
      toast.classList.remove('active');
    }, 4500);

    this.populateGardenModal();
  }

  triggerVictory() {
    this.gameState = 'victory';
    this.openModal('victory-modal');
    window.soundEngine.playBloomFanfare();
    window.particleSystem.createConfetti(this.width / 2, this.height / 2, 80);
  }

  openModal(id) {
    document.getElementById(id).classList.add('active');
  }

  closeModal(id) {
    document.getElementById(id).classList.remove('active');
  }

  openGardenModal() {
    this.populateGardenModal();
    this.openModal('garden-modal');
  }

  populateGardenModal() {
    const list = document.getElementById('garden-gallery-list');
    if (!list) return;
    list.innerHTML = '';

    window.gardenManager.plots.forEach(plot => {
      const isBloomed = plot.stage === 3;
      const card = document.createElement('div');
      card.className = `gallery-card ${isBloomed ? 'bloomed' : 'locked'}`;

      const icon = isBloomed ? '🌻' : (plot.stage > 0 ? '🌱' : '🔒');
      const text = isBloomed 
        ? plot.message 
        : `Plant ${plot.seedsRequired} seeds and water to unlock this message for Anusha! (Currently: ${plot.seedsPlanted}/${plot.seedsRequired} seeds)`;

      card.innerHTML = `
        <div class="gallery-card-icon">${icon}</div>
        <div>
          <div class="gallery-card-title">${plot.name}: ${plot.title}</div>
          <div class="gallery-card-text">${text}</div>
        </div>
      `;
      list.appendChild(card);
    });
  }

  updateHUD() {
    document.getElementById('seed-count').textContent = this.seeds;
    document.getElementById('sunshine-count').textContent = this.sunshine;
    const progress = window.gardenManager.getGardenProgress();
    document.getElementById('bloom-progress-bar').style.width = `${progress}%`;
    document.getElementById('bloom-percent').textContent = `${progress}%`;
  }

  updatePlayer(dt) {
    // Horizontal Movement
    if (this.keys.left) {
      this.player.vx = -this.player.speed;
      this.player.facing = -1;
      this.player.state = 'run';
    } else if (this.keys.right) {
      this.player.vx = this.player.speed;
      this.player.facing = 1;
      this.player.state = 'run';
    } else {
      this.player.vx *= 0.8;
      if (Math.abs(this.player.vx) < 0.2) this.player.vx = 0;
      this.player.state = 'idle';
    }

    if (!this.player.grounded) {
      this.player.state = 'jump';
    }

    // Apply Velocity
    this.player.x += this.player.vx * dt;
    this.player.y += this.player.vy * dt;
    this.player.vy += this.gravity * dt;

    // Ground Collision
    if (this.player.y >= this.groundY) {
      this.player.y = this.groundY;
      this.player.vy = 0;
      this.player.grounded = true;
    }

    // Screen Bounds
    if (this.player.x < 24) this.player.x = 24;
    if (this.player.x > this.width - 24) this.player.x = this.width - 24;

    // Petting cooldown
    if (this.player.petTimer > 0) {
      this.player.petTimer -= dt;
      if (this.player.petTimer <= 0) this.player.isPet = false;
    }

    this.player.animFrame += dt;
  }

  updateElephant(dt) {
    if (this.elephant.happyTimer > 0) {
      this.elephant.happyTimer -= dt;
      if (this.elephant.happyTimer <= 0) this.elephant.isHappy = false;
    }
    if (this.elephant.sprayTimer > 0) {
      this.elephant.sprayTimer -= dt;
    }

    // Periodic gentle bubble blowing
    this.bubbleSpawnTimer += dt;
    if (this.bubbleSpawnTimer > 180) { // Every ~3 seconds
      this.bubbleSpawnTimer = 0;
      const isMobile = this.width < 600;
      this.bubbles.push({
        x: this.elephant.x + 20 * (this.elephant.scale || 1),
        y: this.elephant.y - 20 * (this.elephant.scale || 1),
        vx: -1.2 - Math.random() * 0.8,
        vy: -0.8 - Math.random() * 0.8,
        radius: (isMobile ? 16 : 18) + Math.random() * 8,
        wobble: Math.random() * 10
      });
      window.soundEngine.playPop();
    }
  }

  updateEntities(dt) {
    // Spawn falling seeds & sunshine drops
    this.itemSpawnTimer += dt;
    if (this.itemSpawnTimer > 75) { // Spawn every ~1.2s
      this.itemSpawnTimer = 0;
      const isSunshine = Math.random() > 0.8;
      this.fallingItems.push({
        x: 30 + Math.random() * (this.width - 60),
        y: -20,
        vy: 1.4 + Math.random() * 1.2,
        type: isSunshine ? 'sunshine' : 'seed'
      });
    }

    // Update Items
    for (let i = this.fallingItems.length - 1; i >= 0; i--) {
      const item = this.fallingItems[i];
      item.y += item.vy * dt;

      // Check collision with Player
      const dist = Math.hypot(this.player.x - item.x, (this.player.y - 8) - item.y);
      if (dist < 32) {
        if (item.type === 'seed') {
          this.seeds++;
          window.soundEngine.playSeedCatch();
          window.particleSystem.createSparkle(item.x, item.y, '#FACC15', 6);
          // Auto plant into garden
          const used = window.gardenManager.plantSeeds(1);
          if (used > 0) {
            this.updateHUD();
          }
        } else {
          this.sunshine++;
          this.seeds += 2;
          window.soundEngine.playSeedCatch();
          window.particleSystem.createSparkle(item.x, item.y, '#F59E0B', 10);
          window.gardenManager.plantSeeds(2);
        }
        this.updateHUD();
        this.fallingItems.splice(i, 1);
        continue;
      }

      // Check ground contact (seed plants directly in soil)
      if (item.y >= this.groundY + 10) {
        window.particleSystem.createSparkle(item.x, this.groundY, '#FACC15', 3);
        window.gardenManager.plantSeeds(1);
        this.updateHUD();
        this.fallingItems.splice(i, 1);
      }
    }

    // Update Bubbles
    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const b = this.bubbles[i];
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.wobble += 0.05 * dt;

      // Bubble bounce collision with player
      const dist = Math.hypot(this.player.x - b.x, this.player.y - b.y);
      if (dist < b.radius + 20) {
        // High trampoline launch!
        this.player.vy = -14.5;
        this.player.grounded = false;
        window.soundEngine.playBounce();
        window.particleSystem.createWaterSplash(b.x, b.y, 14);
        window.particleSystem.createSparkle(b.x, b.y, '#38BDF8', 8);
        this.bubbles.splice(i, 1);
        continue;
      }

      // Screen removal
      if (b.x < -40 || b.y < -40) {
        this.bubbles.splice(i, 1);
      }
    }

    // Background drifting sunflower petals
    this.autoPetalTimer += dt;
    if (this.autoPetalTimer > 40) {
      this.autoPetalTimer = 0;
      window.particleSystem.createPetal();
    }
  }

  drawBackground() {
    // Rolling hills under blue twilight sky
    this.ctx.save();

    // Distant dark blue hill
    this.ctx.fillStyle = '#0f1c3f';
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.height);
    this.ctx.quadraticCurveTo(this.width * 0.35, this.groundY - 60, this.width * 0.7, this.height);
    this.ctx.fill();

    // Midground cerulean meadow hill
    const hillGrad = this.ctx.createLinearGradient(0, this.groundY - 40, 0, this.height);
    hillGrad.addColorStop(0, '#1e3a8a');
    hillGrad.addColorStop(0.5, '#172554');
    hillGrad.addColorStop(1, '#0f172a');
    this.ctx.fillStyle = hillGrad;

    this.ctx.beginPath();
    this.ctx.moveTo(0, this.height);
    this.ctx.lineTo(0, this.groundY + 10);
    this.ctx.quadraticCurveTo(this.width * 0.45, this.groundY - 30, this.width, this.groundY + 5);
    this.ctx.lineTo(this.width, this.height);
    this.ctx.fill();

    // Glowing Grass Line & Lush Meadow Surface
    const grassGrad = this.ctx.createLinearGradient(0, this.groundY, 0, this.groundY + 25);
    grassGrad.addColorStop(0, '#38bdf8');
    grassGrad.addColorStop(0.4, '#0284c7');
    grassGrad.addColorStop(1, '#1e3a8a');
    this.ctx.fillStyle = grassGrad;
    this.ctx.fillRect(0, this.groundY + 16, this.width, this.height - (this.groundY + 16));

    // Sparkling Pond by Ellie's feet
    const pondX = this.elephant.x - 10;
    const pondGrad = this.ctx.createRadialGradient(pondX, this.groundY + 22, 5, pondX, this.groundY + 22, 50);
    pondGrad.addColorStop(0, 'rgba(56, 189, 248, 0.8)');
    pondGrad.addColorStop(0.8, 'rgba(30, 58, 138, 0.4)');
    pondGrad.addColorStop(1, 'transparent');
    this.ctx.fillStyle = pondGrad;
    this.ctx.beginPath();
    this.ctx.ellipse(pondX, this.groundY + 22, 55, 14, 0, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
  }

  drawGardenPlots() {
    const isMobile = this.width < 600;
    // Draw the 5 Sunflower plots
    window.gardenManager.plots.forEach((plot, index) => {
      // Dynamic spacing for mobile viewports
      let plotX = this.width * plot.xRatio;
      if (isMobile) {
        // Even distribution on mobile
        plotX = 35 + (index * ((this.width - 90) / 4));
      }
      const plotY = this.groundY + 14;

      // Plot Soil Mound
      this.ctx.fillStyle = '#451a03';
      this.ctx.beginPath();
      this.ctx.ellipse(plotX, plotY, isMobile ? 20 : 26, 8, 0, 0, Math.PI * 2);
      this.ctx.fill();

      // Plot Sunflower
      const flowerScale = isMobile ? (plot.stage === 3 ? 0.95 : 0.85) : (plot.stage === 3 ? 1.15 : 1.0);
      window.spriteRenderer.drawGardenSunflower(
        this.ctx,
        plotX,
        plotY - 6,
        plot.stage,
        flowerScale
      );

      // Plot Label / Progress Indicator
      if (plot.stage < 3) {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        this.ctx.font = `600 ${isMobile ? 10 : 11}px Fredoka, sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
          `${plot.seedsPlanted}/${plot.seedsRequired} 🌱`,
          plotX,
          plotY + (isMobile ? 18 : 22)
        );
      }
    });
  }

  loop(timestamp) {
    const dt = Math.min(2.0, (timestamp - this.lastTime) / 16.666);
    this.lastTime = timestamp;

    // Scale canvas context for High-DPI screens
    this.ctx.save();
    this.ctx.scale(this.dpr, this.dpr);

    // Clear Canvas
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Update state
    window.spriteRenderer.update(dt);
    window.particleSystem.update(dt);

    if (this.gameState === 'playing' || this.gameState === 'victory') {
      this.updatePlayer(dt);
      this.updateElephant(dt);
      this.updateEntities(dt);
    }

    // Render Scene
    this.drawBackground();
    this.drawGardenPlots();

    // Render Elephant
    window.spriteRenderer.drawElephant(
      this.ctx,
      this.elephant.x,
      this.elephant.y,
      {
        trunkSpray: this.elephant.sprayTimer > 0,
        isHappy: this.elephant.isHappy,
        scale: this.elephant.scale
      }
    );

    // Render Bubbles
    for (let b of this.bubbles) {
      window.spriteRenderer.drawBubble(this.ctx, b.x, b.y, b.radius, b.wobble);
    }

    // Render Falling Items
    for (let item of this.fallingItems) {
      window.spriteRenderer.drawItem(this.ctx, item.x, item.y, item.type);
    }

    // Render Player Cat
    window.spriteRenderer.drawCat(
      this.ctx,
      this.player.x,
      this.player.y,
      {
        facing: this.player.facing,
        state: this.player.state,
        animFrame: this.player.animFrame,
        isPet: this.player.isPet
      }
    );

    // Render Particles on top
    window.particleSystem.draw(this.ctx);

    this.ctx.restore();

    requestAnimationFrame((t) => this.loop(t));
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.gameEngine = new GameEngine();
});
