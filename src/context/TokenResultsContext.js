import { createContext, useEffect, useState } from "react";
import { getConfig } from "../services/config";

export const TokenResults = createContext()

const TokenDataContext = ({ children }) => {

    const [result, setResult] = useState([])
    const config = getConfig('testnet')

    const getBalanceOf = async () => {
        let tokenResults = []

        let depo = await window.contract.get_deposited_tokens({ account_id: window.accountId }).catch(err => {
            console.log("ERR: ", err)
            return []
        })

        const tokens = await fetch(
            `${config.helperUrl}/account/${window.accountId}/likelyTokens`
        )
            .then((response) => response.json())
            .then((tokens) => tokens)

        for (let i of tokens) {
            let balanceOfWallet = await window.walletConnection.account().viewFunction(i, "ft_balance_of", { account_id: window.accountId })
                .catch((err) => {
                    return {
                        isFailed: true
                    }
                });
            if (balanceOfWallet.isFailed) {
                continue
            }

            let metaData = await window.walletConnection.account().viewFunction(i, "ft_metadata")
            let obj = {
                id: i,
                name: metaData.name,
                balanceAccount: balanceOfWallet,
                symbol: metaData.symbol,
                decimals: metaData.decimals,
            }

            let storageBalanceOf = await window.walletConnection.account().viewFunction(i, "storage_balance_of", { account_id: config.contractName })

            if (storageBalanceOf !== null) {
                obj.checkRegis = true
            } else {
                obj.checkRegis = false
            }

            for (let i2 in depo) {
                if (i === i2) {
                    obj.balanceContract = depo[i]
                }
            }
            tokenResults.push(obj)
        }
        // console.log(tokenResults);
        setResult(tokenResults);
    }

    useEffect(() => {
        if (window.walletConnection.isSignedIn()) {
            getBalanceOf()
        }
    }, [])

    return (
        <TokenResults.Provider value={{ result }}>
            {children}
        </TokenResults.Provider>
    )

}

export default TokenDataContext;
