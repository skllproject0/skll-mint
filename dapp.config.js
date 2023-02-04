const RPC_URL = process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL

const config = {
  title: 'Dapp',
  description: 'minting Dapp',
  contractAddress: '0x0C2678c66A1A3Eb83786660628c3fF6b1D778cb9',
  etherscanLink:'https://etherscan.io/address/0x0C2678c66A1A3Eb83786660628c3fF6b1D778cb9#readContract',
  maxMintAmount: 5,
  publicSalePrice: 0.6
}

const onboardOptions = {
  dappId: process.env.NEXT_PUBLIC_DAPP_ID,
  networkId: 1, // MAINNET
  darkMode: true,
  walletSelect: {
    description:'Plaese select a wallet',
    wallets: [
      { walletName: 'metamask', preferred: true },
      { walletName: 'coinbase', preferred: true },
      {
        walletName: 'walletLink',
        preferred: true,
        rpcUrl: RPC_URL,
        appName: 'Dapp'
      },
      
      { walletName: 'trust', preferred: true, rpcUrl: RPC_URL },
      { walletName: 'gnosis'},
      { walletName: 'authereum' },

      {
        walletName: 'ledger',
        rpcUrl: RPC_URL
      },
      {
        walletName: 'lattice',
        rpcUrl: RPC_URL,
        appName: 'Dapp'
      },
      {
        walletName: 'keepkey',
        rpcUrl: RPC_URL
      }
    ]
  },
  walletCheck: [
    { checkName: 'derivationPath' },
    { checkName: 'accounts' },
    { checkName: 'connect' },
    { checkName: 'network' }
  ]
}

export { config, onboardOptions }
