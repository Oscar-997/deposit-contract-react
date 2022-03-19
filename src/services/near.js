import { connect, Contract, keyStores, transactions, utils, WalletConnection } from 'near-api-js'
import { getConfig, getConfigToken } from './config'

const nearConfig = getConfig(process.env.NODE_ENV || 'development')
// Initialize contract & set global variables
export async function initContract() {
    // const keyPair = utils.KeyPair.fromString(process.env.REACT_APP_PRIVATE_KEY);
    // const keyStore = new keyStores.InMemoryKeyStore();
    // keyStore.setKey('testnet','mick997.testnet',keyPair);

    // Initialize connection to the NEAR testnet
    const near = await connect(Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearConfig))
    // const near = await connect(Object.assign({ deps: { keyStore } }, nearConfig))
    window.near = near;
    window.walletConnection = new WalletConnection(near)
    window.accountId = await window.walletConnection.getAccountId();
    window.contract = new Contract(window.walletConnection.account(), nearConfig.contractName, {
      viewMethods: ['get_deposits', "storage_balance_of"],
      changeMethods: ['new', 'create_new_pool', 'add_liquidity', 'storage_deposit'],
    })
}



