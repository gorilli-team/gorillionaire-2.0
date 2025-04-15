  source .env && forge create --rpc-url https://testnet-rpc.monad.xyz \
  --constructor-args "https://test.it" \
  --private-key $PRIVATE_KEY \
    src/EarlyGorillaNFT.sol:EarlyGorillaNFT \
  --verify \
  --verifier sourcify
  --verifier-url 'https://sourcify-api-monad.blockvision.org' 

  source .env && forge script ./script/EarlyGorillaNFT.s.sol --rpc-url https://testnet-rpc.monad.xyz --broadcast --private-key $PRIVATE_KEY