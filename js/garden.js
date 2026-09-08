/**
 * Garden Sanctuary & Milestone Management System
 * Manages sunflower plots, watering progression, and personalized surprises for Anusha
 */

class GardenManager {
  constructor() {
    this.plots = [
      {
        id: 1,
        name: 'Morning Glow',
        seedsRequired: 5,
        seedsPlanted: 0,
        waterLevel: 0, // 0 to 100
        stage: 0, // 0: Seed, 1: Sprout, 2: Bud, 3: Full Bloom
        xRatio: 0.15, // Relative X on meadow
        title: '🌻 Golden Sunshine',
        message: 'Like a sunflower that always turns toward the light, your smile brightens up every room, Anusha!'
      },
      {
        id: 2,
        name: 'Kitten Meadow',
        seedsRequired: 10,
        seedsPlanted: 0,
        waterLevel: 0,
        stage: 0,
        xRatio: 0.32,
        title: '🐱 Playful Purrs',
        message: 'Sweet, curious, and playful like a fluffy kitten, bringing warmth and happiness to every moment!'
      },
      {
        id: 3,
        name: 'Ellie’s Sanctuary',
        seedsRequired: 15,
        seedsPlanted: 0,
        waterLevel: 0,
        stage: 0,
        xRatio: 0.50,
        title: '🐘 Gentle & Strong',
        message: 'As loyal, kind, and wonderful as an elephant! May your path always be filled with luck and peaceful strength.'
      },
      {
        id: 4,
        name: 'Twilight Cerulean',
        seedsRequired: 20,
        seedsPlanted: 0,
        waterLevel: 0,
        stage: 0,
        xRatio: 0.68,
        title: '💙 Dreamy Blue Sky',
        message: 'Under the calming midnight blue stars, your kindness and creativity shine brighter than all the rest!'
      },
      {
        id: 5,
        name: 'Anusha’s Celestial Bloom',
        seedsRequired: 25,
        seedsPlanted: 0,
        waterLevel: 0,
        stage: 0,
        xRatio: 0.85,
        title: '🌟 Grand Meadow Bloom',
        message: 'Happy blooming, Anusha! Sunflowers, kittens, gentle elephants, and blue skies celebrate you today! 🌻🐱🐘💙'
      }
    ];

    this.unlockedMilestones = [];
    this.totalBloomed = 0;
  }

  plantSeeds(availableSeeds) {
    let seedsUsed = 0;
    for (let plot of this.plots) {
      if (plot.stage < 3 && availableSeeds > seedsUsed) {
        const needed = plot.seedsRequired - plot.seedsPlanted;
        if (needed > 0) {
          const toAdd = Math.min(needed, availableSeeds - seedsUsed);
          plot.seedsPlanted += toAdd;
          seedsUsed += toAdd;

          // Update stage based on seeds
          if (plot.seedsPlanted >= plot.seedsRequired && plot.stage === 0) {
            plot.stage = 1; // Sprouted!
          }
        }
      }
    }
    return seedsUsed;
  }

  waterPlot(plotIndex, amount = 25) {
    if (plotIndex < 0 || plotIndex >= this.plots.length) return false;
    const plot = this.plots[plotIndex];

    if (plot.seedsPlanted >= plot.seedsRequired && plot.stage < 3) {
      plot.waterLevel = Math.min(100, plot.waterLevel + amount);

      if (plot.waterLevel >= 50 && plot.stage === 1) {
        plot.stage = 2; // Budding!
      }
      if (plot.waterLevel >= 100 && plot.stage === 2) {
        plot.stage = 3; // Full Bloom!
        this.totalBloomed++;
        if (!this.unlockedMilestones.includes(plot.id)) {
          this.unlockedMilestones.push(plot.id);
          return { newlyBloomed: true, plot };
        }
      }
      return { newlyBloomed: false, plot };
    }
    return false;
  }

  waterAll(amount = 25) {
    const bloomedPlots = [];
    for (let i = 0; i < this.plots.length; i++) {
      const res = this.waterPlot(i, amount);
      if (res && res.newlyBloomed) {
        bloomedPlots.push(res.plot);
      }
    }
    return bloomedPlots;
  }

  isAllBloomed() {
    return this.plots.every(p => p.stage === 3);
  }

  getGardenProgress() {
    let totalStages = this.plots.length * 3;
    let currentStages = 0;
    for (let p of this.plots) {
      currentStages += p.stage;
    }
    return Math.round((currentStages / totalStages) * 100);
  }
}

window.gardenManager = new GardenManager();
