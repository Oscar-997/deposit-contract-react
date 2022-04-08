
export const getMetadataOfAllTokens = async () => {
    const exContract = window.contract
    let isInArr = false
    let nonDupTokenList = []
    let metadata = {}
    const pools = await exContract.get_pools({
        from: 0,
        limit: 600
    })

    pools.map((pool, idx) => {
        if (nonDupTokenList.length > 0) {
            pool.token_account_ids.map((id) => {
                for (let i of nonDupTokenList) {
                    if (i === id) {
                        isInArr = true
                    }
                }

                if (!isInArr) {
                    nonDupTokenList.push(id)
                } else {
                    isInArr = false
                }
                return id //dont care return value
            })
        } else {
            nonDupTokenList.push(...pool.token_account_ids)
        }
        return pool //dont care return value
    })
    // console.log("Non-duplicate Token List: ", nonDupTokenList)

    for (let i of nonDupTokenList) {
        metadata[i] = await window.walletConnection.account().viewFunction(i, 'ft_metadata')
    }
    // console.log(metadata)
    return metadata
}

export const getPoolPairSymbols = async (allMetadata, pool) => {
    return {
        token1Symbol: allMetadata[pool.token_account_ids[0]].symbol,
        token2Symbol: allMetadata[pool.token_account_ids[1]].symbol
    }
}

export const getPoolPairDecimals = async (allMetadata, pool) => {
    return {
        token1Decimal: allMetadata[pool.token_account_ids[0]].decimals,
        token2Decimal: allMetadata[pool.token_account_ids[1]].decimals,
    }
}

export const getTokenAmountFromShares = (accountShares, totalShares, amountInPool) => {
    return accountShares / totalShares * amountInPool
}

export const formatShares = (shares) => {
    return shares === 1 ? shares : shares.toFixed(2)
}