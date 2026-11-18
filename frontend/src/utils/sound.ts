// Audio synthesis using Web Audio API

class SoundManager {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
  }

  public playTone(
    freq: number,
    type: OscillatorType = 'sine',
    duration: number = 0.2,
    gainLevel: number = 0.12,
  ) {
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
      // ignore audio context failures
    }
  }

  public playClick() {
    this.playTone(540, 'sine', 0.05, 0.06);
  }

  public playDrop() {
    this.playTone(320, 'triangle', 0.08, 0.09);
  }

  public playCombo(comboCount: number) {
    if (!this.enabled) return;
    const baseFreq = 440;
    const pitchMultiplier = Math.pow(1.06, Math.min(comboCount, 10));
    const finalFreq = baseFreq * pitchMultiplier;

    this.playTone(finalFreq, 'sine', 0.14, 0.12);
    setTimeout(() => {
      this.playTone(finalFreq * 1.25, 'triangle', 0.16, 0.14);
    }, 60);
  }

  public playExplosion(intensity: 'small' | 'medium' | 'nuke') {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const duration = intensity === 'nuke' ? 1.1 : intensity === 'medium' ? 0.65 : 0.35;
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
      const initialCutoff = intensity === 'nuke' ? 850 : intensity === 'medium' ? 650 : 450;
      filter.frequency.setValueAtTime(initialCutoff, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + duration);

      const gain = this.ctx.createGain();
      const initialGain = intensity === 'nuke' ? 0.42 : intensity === 'medium' ? 0.3 : 0.18;
      gain.gain.setValueAtTime(initialGain, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();

      const subFreq = intensity === 'nuke' ? 52 : intensity === 'medium' ? 68 : 85;
      this.playTone(subFreq, 'triangle', duration * 0.7, 0.25);
    } catch {
      // ignore audio context failures
    }
  }

  public playSuccess() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      setTimeout(() => this.playTone(f, 'sine', 0.18, 0.12), i * 65);
    });
  }

  public playFail() {
    this.playTone(190, 'triangle', 0.18, 0.12);
    setTimeout(() => this.playTone(145, 'triangle', 0.22, 0.12), 100);
  }
}

export const sound = new SoundManager();
