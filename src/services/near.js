import { connect, Contract, keyStores, WalletConnection } from 'near-api-js'
import { getConfig } from './config'

const nearConfig = getConfig(process.env.NODE_ENV || 'development')
export async function initContract() {
    const near = await connect(Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearConfig))
    window.near = near;
    window.walletConnection = new WalletConnection(near)
    window.accountId = await window.walletConnection.getAccountId();
    window.contract = new Contract(window.walletConnection.account(), nearConfig.contractName, {
      viewMethods: ['get_deposits', "storage_balance_of"],
      changeMethods: ['new', 'create_new_pool', 'add_liquidity', 'storage_deposit', 'withdraw'],
    })
}



