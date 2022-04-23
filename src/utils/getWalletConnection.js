import {connect, keyStores, WalletConnection} from 'near-api-js'

export const getWalletConnection = async (config) => {
    const near = await connect(Object.assign({deps: {keyStore: new keyStores.BrowserLocalStorageKeyStore()}}, config))
    return new WalletConnection(near);
}