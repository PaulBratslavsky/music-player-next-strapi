const NUM_PEAKS = 200;

/**
 * Compute waveform peaks from an audio file buffer.
 * Decodes the audio to PCM, then computes RMS (root mean square)
 * energy for each segment. RMS gives much better visual variation
 * than peak amplitude on mastered/compressed audio.
 */
export async function computePeaksFromBuffer(buffer: Buffer): Promise<number[]> {
  const { default: decode } = await import('audio-decode');

  const audioBuffer = await decode(buffer);
  const channelData = audioBuffer.getChannelData(0);
  const samples = channelData.length;

  if (samples === 0) return Array(NUM_PEAKS).fill(0);

  const samplesPerPeak = Math.max(1, Math.floor(samples / NUM_PEAKS));

  // First pass: compute RMS for each segment
  const rmsValues: number[] = [];
  for (let i = 0; i < NUM_PEAKS; i++) {
    let sumOfSquares = 0;
    const start = i * samplesPerPeak;
    const end = Math.min(start + samplesPerPeak, samples);
    const count = end - start;

    for (let j = start; j < end; j++) {
      sumOfSquares += channelData[j] * channelData[j];
    }

    rmsValues.push(Math.sqrt(sumOfSquares / count));
  }

  // Normalize to 0-1 range based on the max RMS value
  const maxRms = Math.max(...rmsValues);
  if (maxRms === 0) return Array(NUM_PEAKS).fill(0);

  return rmsValues.map((v) => Math.round((v / maxRms) * 1000) / 1000);
}
