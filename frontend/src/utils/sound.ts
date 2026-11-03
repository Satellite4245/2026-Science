// Audio synthesis using Web Audio API

class SoundManager {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playTone(freq: number, type: OscillatorType = 'sine', duration: number = 0.2, gainLevel: number = 0.15) {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainLevel, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // ignore
    }
  }

  public playClick() {
    this.playTone(560, 'sine', 0.06, 0.08);
  }

  public playDrop() {
    this.playTone(320, 'triangle', 0.1, 0.12);
  }

  public playCombo(comboCount: number) {
    if (!this.enabled) return;
    const baseFreq = 440;
    const pitchMultiplier = Math.pow(1.08, Math.min(comboCount, 15));
    const finalFreq = baseFreq * pitchMultiplier;

    this.playTone(finalFreq, 'sine', 0.18, 0.2);
    setTimeout(() => {
      this.playTone(finalFreq * 1.25, 'triangle', 0.2, 0.25);
    }, 70);
  }

  public playExplosion(intensity: 'small' | 'medium' | 'nuke') {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const duration = intensity === 'nuke' ? 3.5 : intensity === 'medium' ? 1.5 : 0.8;
      const bufSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      const initialCutoff = intensity === 'nuke' ? 1200 : intensity === 'medium' ? 800 : 500;
      filter.frequency.setValueAtTime(initialCutoff, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + duration);

      const gain = this.ctx.createGain();
      const initialGain = intensity === 'nuke' ? 0.95 : intensity === 'medium' ? 0.6 : 0.35;
      gain.gain.setValueAtTime(initialGain, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();

      // 저음 서브우퍼
      const subFreq = intensity === 'nuke' ? 45 : intensity === 'medium' ? 65 : 85;
      this.playTone(subFreq, 'sawtooth', duration * 0.8, 0.5);

      if (intensity === 'nuke') {
        for (let i = 0; i < 6; i++) {
          setTimeout(() => {
            this.playTone(i % 2 === 0 ? 880 : 660, 'sawtooth', 0.2, 0.2);
          }, 400 + i * 250);
        }
      }
    } catch {
      // ignore
    }
  }

  public playSuccess() {
    [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
      setTimeout(() => this.playTone(f, 'sine', 0.22, 0.15), i * 70);
    });
  }

  public playFail() {
    this.playTone(180, 'sawtooth', 0.3, 0.2);
    setTimeout(() => this.playTone(130, 'sawtooth', 0.35, 0.2), 120);
  }
}

export const sound = new SoundManager();

