const { ethers } = require('ethers');
const PriceData = require('../models/PriceData');

const UNISWAP_V2_PAIR_ABI = [
  'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
  'function token0() external view returns (address)',
  'function token1() external view returns (address)',
  'function price0CumulativeLast() external view returns (uint)',
  'function price1CumulativeLast() external view returns (uint)'
];

const TOKENS = [
  // {
  //   symbol: 'CHOG',
  //   pairAddress: '0xaD04207Ce0EF3c718a4Fd8cAA85c5297ED1d56B9',  // CHOG-USDC pair on Monad testnet
  //   isToken0: true
  // },
  {
    symbol: 'MOYAKI',
    pairAddress: '0x3aE6D8A282D67893e17AA70ebFFb33EE5aa65893',  // MOYAKI-USDC pair on Monad testnet
    isToken0: true
  },
  // {
  //   symbol: 'MOLANDAK',
  //   pairAddress: '0xf4d2888d29D722226FafA5d9B24F9164c092421E',  // MOLANDAK-USDC pair on Monad testnet
  //   isToken0: true
  // }
];

class PriceOracle {
  constructor(rpcUrl, timeWindow = 3600) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.timeWindow = timeWindow;
  }

  async getTWAP(pairAddress, isToken0) {
    console.log(`\nGetting TWAP for pair ${pairAddress} (isToken0: ${isToken0})`);
    
    const pair = new ethers.Contract(pairAddress, UNISWAP_V2_PAIR_ABI, this.provider);
    console.log('Contract instance created');

    // Validate that this is a valid pair contract
    try {
      const [reserve0, reserve1] = await pair.getReserves();
      console.log(`Pair reserves: ${reserve0}, ${reserve1}`);
      
      if (reserve0.toString() === '0' && reserve1.toString() === '0') {
        throw new Error('Pair has no liquidity');
      }

      const token0 = await pair.token0();
      const token1 = await pair.token1();
      console.log(`Pair tokens: ${token0} (token0), ${token1} (token1)`);
    } catch (error) {
      console.error('Failed to validate pair contract:', error);
      throw new Error(`Invalid or uninitialized pair contract: ${error.message}`);
    }
    
    const currentBlock = await this.provider.getBlockNumber();
    console.log(`Current block number: ${currentBlock}`);
    
    const currentCumulative = isToken0 
      ? await pair.price0CumulativeLast()
      : await pair.price1CumulativeLast();
    console.log(`Current cumulative price: ${currentCumulative}`);
    
    const pastBlock = await this.findBlockFromTime(currentBlock, this.timeWindow);
    console.log(`Past block number (${this.timeWindow} seconds ago): ${pastBlock}`);
    
    const pastCumulative = isToken0
      ? await pair.price0CumulativeLast({ blockTag: pastBlock })
      : await pair.price1CumulativeLast({ blockTag: pastBlock });
    console.log(`Past cumulative price: ${pastCumulative}`);
    
    const priceDiff = currentCumulative - pastCumulative;
    console.log(`Price difference: ${priceDiff}`);
    
    const timeElapsed = this.timeWindow;
    console.log(`Time elapsed: ${timeElapsed} seconds`);
    
    const price = priceDiff / timeElapsed / (10 ** 18);
    console.log(`Calculated TWAP price: ${price}`);

    return { price, blockNumber: currentBlock };
  }

  async findBlockFromTime(currentBlock, secondsAgo) {
    const currentBlockData = await this.provider.getBlock(currentBlock);
    if (!currentBlockData) throw new Error('Could not get current block');
    
    const targetTimestamp = currentBlockData.timestamp - secondsAgo;
    
    let left = 0;
    let right = currentBlock;
    
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      const midBlock = await this.provider.getBlock(mid);
      if (!midBlock) continue;
      
      if (midBlock.timestamp < targetTimestamp) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    
    return left;
  }

  async updatePrices() {
    for (const token of TOKENS) {
      try {
        const { price, blockNumber } = await this.getTWAP(token.pairAddress, token.isToken0);

        console.log(price, blockNumber);
        
        await PriceData.create({
          tokenSymbol: token.symbol,
          price,
          blockNumber,
          pairAddress: token.pairAddress,
          timeWindowSeconds: this.timeWindow
        });
        
        console.log(`Updated price for ${token.symbol}: $${price}`);
      } catch (error) {
        console.error(`Error updating price for ${token.symbol}:`, error);
      }
    }
  }
}

module.exports = PriceOracle; 