

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(
  frequency: number,
  type: OscillatorType,
  duration: number,
  volume = 0.25,
  decay = 0.3
) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + decay);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {
    
  }
}


export function playReveal() {
  playTone(440, "sine", 0.08, 0.15, 0.08);
}


export function playFloodReveal() {
  playTone(660, "triangle", 0.12, 0.1, 0.1);
}


export function playFlag() {
  playTone(880, "square", 0.1, 0.08, 0.09);
  setTimeout(() => playTone(1100, "square", 0.08, 0.06, 0.07), 60);
}


export function playUnflag() {
  playTone(550, "square", 0.1, 0.08, 0.09);
}


export function playExplosion() {
  try {
    const ctx = getCtx();
    
    const bufSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.6, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(80, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.4);
    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.4, ctx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    noise.connect(gain);
    osc.connect(oscGain);
    gain.connect(ctx.destination);
    oscGain.connect(ctx.destination);

    noise.start(ctx.currentTime);
    osc.start(ctx.currentTime);
    noise.stop(ctx.currentTime + 0.5);
    osc.stop(ctx.currentTime + 0.4);
  } catch {
    
  }
}


export function playWin() {
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, "triangle", 0.25, 0.3, 0.22), i * 110);
  });
}


export function playRestart() {
  playTone(330, "sine", 0.12, 0.15, 0.1);
  setTimeout(() => playTone(440, "sine", 0.12, 0.15, 0.1), 80);
}
