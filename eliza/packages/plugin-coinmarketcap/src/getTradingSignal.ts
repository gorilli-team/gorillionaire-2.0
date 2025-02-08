type Signal = 'BUY' | 'SELL' | 'HOLD';

interface MarketMetrics {
  volatility1h: number;
  volatility24h: number;
  volumeTrend: 'Increasing' | 'Decreasing';
  avg1hChange: number;
  avg24hChange: number;
}

interface TradingResult {
  signal: Signal;
  confidence: number;
  metrics: MarketMetrics;
}

function analyzeMarketConditions(
  priceChange1h: number[],
  priceChange24h: number[],
  volume24h: number[],
  volumeChange24h: number[]
): [Signal, number] {
  // Calculate momentum using differences
  const priceMomentum1h = priceChange1h
    .slice(-5)
    .reduce((acc, curr, i, arr) => (i > 0 ? acc + (curr - arr[i - 1]) : 0), 0);

  const priceMomentum24h = priceChange24h
    .slice(-3)
    .reduce((acc, curr, i, arr) => (i > 0 ? acc + (curr - arr[i - 1]) : 0), 0);

  const volumeTrend = volume24h
    .slice(-5)
    .reduce((acc, curr, i, arr) => (i > 0 ? acc + (curr - arr[i - 1]) : 0), 0);

  // Volume health check
  const avgVolume = volume24h.reduce((a, b) => a + b, 0) / volume24h.length;
  const minVolumeThreshold = 1000000; // Adjust based on risk tolerance
  
  if (avgVolume < minVolumeThreshold) {
    return ['HOLD', 0.9];
  }

  // Initialize scoring components
  let momentumScore = 0;
  let volumeScore = 0;

  // Evaluate short-term momentum
  if (priceMomentum1h > 0.5) {
    momentumScore += 0.3;
  } else if (priceMomentum1h < -0.5) {
    momentumScore -= 0.3;
  }

  // Evaluate medium-term momentum
  if (priceMomentum24h > 0.2) {
    momentumScore += 0.2;
  } else if (priceMomentum24h < -0.2) {
    momentumScore -= 0.2;
  }

  // Volume analysis
  const avgVolumeChange = volumeChange24h.reduce((a, b) => a + b, 0) / volumeChange24h.length;
  if (volumeTrend > 0 && avgVolumeChange > -10) {
    volumeScore += 0.2;
  } else if (volumeTrend < 0 && avgVolumeChange < -20) {
    volumeScore -= 0.2;
  }

  // Combine scores
  const totalScore = momentumScore + volumeScore;

  // Define thresholds
  const buyThreshold = 0.3;
  const sellThreshold = -0.3;

  // Generate signal and confidence
  if (totalScore > buyThreshold) {
    const confidence = Math.min(Math.abs(totalScore), 1.0);
    return ['BUY', confidence];
  } else if (totalScore < sellThreshold) {
    const confidence = Math.min(Math.abs(totalScore), 1.0);
    return ['SELL', confidence];
  } else {
    const confidence = 0.5 + Math.min(Math.abs(totalScore), 0.5);
    return ['HOLD', confidence];
  }
}

export function getTradingSignal(
  priceChange1h: number[],
  priceChange24h: number[],
  volume24h: number[],
  volumeChange24h: number[]
): TradingResult {
  const [signal, confidence] = analyzeMarketConditions(
    priceChange1h,
    priceChange24h,
    volume24h,
    volumeChange24h
  );

  // Calculate volatility (standard deviation)
  const volatility1h = Math.sqrt(
    priceChange1h.reduce((acc, val) => acc + Math.pow(val - (priceChange1h.reduce((a, b) => a + b, 0) / priceChange1h.length), 2), 0) / priceChange1h.length
  );

  const volatility24h = Math.sqrt(
    priceChange24h.reduce((acc, val) => acc + Math.pow(val - (priceChange24h.reduce((a, b) => a + b, 0) / priceChange24h.length), 2), 0) / priceChange24h.length
  );

  // Calculate volume trend
  const volumeTrend = volume24h
    .slice(-5)
    .reduce((acc, curr, i, arr) => (i > 0 ? acc + (curr - arr[i - 1]) : 0), 0);

  return {
    signal,
    confidence: Number((confidence * 100).toFixed(2)),
    metrics: {
      volatility1h: Number(volatility1h.toFixed(4)),
      volatility24h: Number(volatility24h.toFixed(4)),
      volumeTrend: volumeTrend > 0 ? 'Increasing' : 'Decreasing',
      avg1hChange: Number((priceChange1h.reduce((a, b) => a + b, 0) / priceChange1h.length).toFixed(4)),
      avg24hChange: Number((priceChange24h.reduce((a, b) => a + b, 0) / priceChange24h.length).toFixed(4))
    }
  };
}