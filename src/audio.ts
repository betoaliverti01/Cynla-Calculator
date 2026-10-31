/**
 * Sintetizador Web Audio API para simular o clique físico tátil
 * dos botões mecânicos das calculadoras eletrônicas vintage dos anos 70/80.
 */

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

export function isAudioEnabled(): boolean {
  return soundEnabled;
}

export function toggleAudio(): boolean {
  soundEnabled = !soundEnabled;
  return soundEnabled;
}

export function playVintageClick(type: 'num' | 'op' | 'equals' | 'clear' = 'num') {
  if (!soundEnabled) return;

  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    // Frequência e características do clique de acordo com o tipo da tecla
    let baseFreq = 800;
    let clickGain = 0.15;
    let decayTime = 0.025;

    if (type === 'op') {
      baseFreq = 650;
      clickGain = 0.2;
      decayTime = 0.035;
    } else if (type === 'equals') {
      baseFreq = 520;
      clickGain = 0.25;
      decayTime = 0.045;
    } else if (type === 'clear') {
      baseFreq = 950;
      clickGain = 0.18;
      decayTime = 0.03;
    }

    // Oscilador para o 'thud' mecânico da mola
    const osc = audioCtx.createOscillator();
    const oscGain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + decayTime);

    oscGain.gain.setValueAtTime(clickGain, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + decayTime);

    // Ruído filtrado para o estalinho tátil plástico
    const bufferSize = audioCtx.sampleRate * 0.015;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1500, now);

    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(clickGain * 0.8, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

    // Conexões
    osc.connect(oscGain);
    oscGain.connect(audioCtx.destination);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(audioCtx.destination);

    osc.start(now);
    noise.start(now);
    osc.stop(now + decayTime);
    noise.stop(now + 0.015);
  } catch {
    // Falha silenciosa caso o navegador restrinja áudio
  }
}
