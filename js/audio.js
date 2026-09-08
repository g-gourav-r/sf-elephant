/**
 * Web Audio API procedural sound synthesizer
 * Zero external audio files required, instant latency, full offline support
 */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.musicPlaying = false;
    this.musicTimer = null;
    this.currentNoteIndex = 0;
    
    // Melodic pentatonic blue-sky dream scale (C Major Pentatonic across 2 octaves)
    this.melody = [
      523.25, 587.33, 659.25, 783.99, 880.00, // C5, D5, E5, G5, A5
      659.25, 783.99, 1046.50, 880.00, 783.99, // E5, G5, C6, A5, G5
      587.33, 659.25, 523.25, 440.00, 523.25  // D5, E5, C5, A4, C5
    ];
    this.chords = [
      [261.63, 329.63, 392.00], // C
      [220.00, 261.63, 329.63], // Am
      [174.61, 220.00, 261.63], // F
      [196.00, 246.94, 293.66]  // G
    ];
    this.chordIndex = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.musicPlaying) {
      this.stopMusic();
    } else if (!this.isMuted && !this.musicPlaying) {
      this.startMusic();
    }
    return this.isMuted;
  }

  playPop() {
    if (this.isMuted || !this.ctx) return;
    this.init();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  playSeedCatch() {
    if (this.isMuted || !this.ctx) return;
    this.init();

    const now = this.ctx.currentTime;
    // Pleasant two-tone bell chime
    const notes = [880, 1318.5]; // A5, E6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + (idx * 0.05);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.36);
    });
  }

  playJump() {
    if (this.isMuted || !this.ctx) return;
    this.init();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(640, now + 0.15);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  playBounce() {
    if (this.isMuted || !this.ctx) return;
    this.init();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.25);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.26);
  }

  playMeow() {
    if (this.isMuted || !this.ctx) return;
    this.init();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    // Classic meow frequency curve: rise, sustain with slight vibrato, then gentle dip
    osc.frequency.setValueAtTime(580, now);
    osc.frequency.exponentialRampToValueAtTime(840, now + 0.12);
    osc.frequency.linearRampToValueAtTime(780, now + 0.28);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.45);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.08);
    gain.gain.setValueAtTime(0.22, now + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.46);
  }

  playPurr() {
    if (this.isMuted || !this.ctx) return;
    this.init();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(90, now);

    // LFO modulation for rumbling purr
    lfo.type = 'sawtooth';
    lfo.frequency.setValueAtTime(24, now);
    lfoGain.gain.setValueAtTime(40, now);
    lfo.connect(osc.frequency);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    lfo.start(now);
    osc.start(now);
    lfo.stop(now + 0.6);
    osc.stop(now + 0.6);
  }

  playTrumpet() {
    if (this.isMuted || !this.ctx) return;
    this.init();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    // Cheerful baby elephant trumpet
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(700, now + 0.1);
    osc.frequency.setValueAtTime(700, now + 0.2);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.35);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.05);
    gain.gain.setValueAtTime(0.18, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.46);
  }

  playWaterSplash() {
    if (this.isMuted || !this.ctx) return;
    this.init();

    const now = this.ctx.currentTime;
    for (let i = 0; i < 4; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const st = now + (i * 0.04);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600 + Math.random() * 400, st);
      osc.frequency.exponentialRampToValueAtTime(200, st + 0.1);

      gain.gain.setValueAtTime(0.15, st);
      gain.gain.exponentialRampToValueAtTime(0.01, st + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(st);
      osc.stop(st + 0.11);
    }
  }

  playBloomFanfare() {
    if (this.isMuted || !this.ctx) return;
    this.init();

    const now = this.ctx.currentTime;
    // Radiant chord progression: C, E, G, B, high C, high E
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.5];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const st = now + (idx * 0.09);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, st);

      gain.gain.setValueAtTime(0.2, st);
      gain.gain.exponentialRampToValueAtTime(0.001, st + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(st);
      osc.stop(st + 0.65);
    });
  }

  startMusic() {
    if (this.musicPlaying || this.isMuted) return;
    this.init();
    this.musicPlaying = true;
    this.scheduleNextNote();
  }

  stopMusic() {
    this.musicPlaying = false;
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }

  scheduleNextNote() {
    if (!this.musicPlaying || this.isMuted || !this.ctx) return;

    const now = this.ctx.currentTime;
    const noteFreq = this.melody[this.currentNoteIndex];
    this.currentNoteIndex = (this.currentNoteIndex + 1) % this.melody.length;

    // Lead gentle bell note
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(noteFreq, now);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.46);

    // Warm sub-bass / pad chord every 4 notes
    if (this.currentNoteIndex % 4 === 0) {
      const chord = this.chords[this.chordIndex];
      this.chordIndex = (this.chordIndex + 1) % this.chords.length;

      chord.forEach(cFreq => {
        const cOsc = this.ctx.createOscillator();
        const cGain = this.ctx.createGain();
        cOsc.type = 'triangle';
        cOsc.frequency.setValueAtTime(cFreq * 0.5, now);

        cGain.gain.setValueAtTime(0.04, now);
        cGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        cOsc.connect(cGain);
        cGain.connect(this.ctx.destination);

        cOsc.start(now);
        cOsc.stop(now + 1.25);
      });
    }

    this.musicTimer = setTimeout(() => {
      this.scheduleNextNote();
    }, 320); // Steady relaxing ~185 BPM eighth note flow
  }
}

window.soundEngine = new SoundEngine();
