
const getInitContract = () => {

    const getToken = (tokenAddress) => {
        switch (env) {
            case 'production':
            case 'mainnet':
              return {
                networkId: 'mainnet',
                nodeUrl: 'https://rpc.mainnet.near.org',
                contractName: tokenAddress,
                walletUrl: 'https://wallet.near.org',
                helperUrl: 'https://helper.mainnet.near.org',
                explorerUrl: 'https://explorer.mainnet.near.org',
              }
            case 'development':
            case 'testnet':
              return {
                networkId: 'testnet',
                nodeUrl: 'https://rpc.testnet.near.org',
                contractName: tokenAddress,
                walletUrl: 'https://wallet.testnet.near.org',
                helperUrl: 'https://helper.testnet.near.org',
                explorerUrl: 'https://explorer.testnet.near.org',
              }
            case 'betanet':
              return {
                networkId: 'betanet',
                nodeUrl: 'https://rpc.betanet.near.org',
                contractName: tokenAddress,
                walletUrl: 'https://wallet.betanet.near.org',
                helperUrl: 'https://helper.betanet.near.org',
                explorerUrl: 'https://explorer.betanet.near.org',
              }
            case 'local':
              return {
                networkId: 'local',
                nodeUrl: 'http://localhost:2000',
                keyPath: `${process.env.HOME}/.near/validator_key.json`,
                walletUrl: 'http://localhost:2000/wallet',
                contractName: tokenAddress,
              }
            case 'test':
            case 'ci':
              return {
                networkId: 'shared-test',
                nodeUrl: 'https://rpc.ci-testnet.near.org',
                contractName: tokenAddress,
                masterAccount: 'test.near',
              }
            case 'ci-betanet':
              return {
                networkId: 'shared-test-staging',
                nodeUrl: 'https://rpc.ci-betanet.near.org',
                contractName: tokenAddress,
                masterAccount: 'test.near',
              }
            default:
              throw Error(`Unconfigured environment '${env}'. Can be configured in src/config.js.`)
            }
    }
}