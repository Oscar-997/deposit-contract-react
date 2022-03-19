import { connect, keyStores, utils, WalletConnection } from 'near-api-js'
import { getConfig } from '../services/config'

const nearConfig = getConfig(process.env.NODE_ENV || 'development')

export const useNear = () => {
    const getNear = async () => {
        // const near = await connect(Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, config));
        // const walletConnection = new WalletConnection(near);
        // return walletConnection;

        const keyPair = utils.KeyPair.fromString(process.env.REACT_APP_PRIVATE_KEY);
        const keyStore = new keyStores.InMemoryKeyStore();
        keyStore.setKey('testnet','mick997.testnet',keyPair);

        const near = await connect(Object.assign({ deps: { keyStore } }, nearConfig))
        const walletConnection = new WalletConnection(near)


        return walletConnection
    }
    return { getNear }
}