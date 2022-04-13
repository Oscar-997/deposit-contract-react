export const getAllPools = async () => {
    const exContract = window.contract
    return await exContract.get_pools({
        from: 0,
        limit: 600
    })
}
export const getMetadataOfAllTokens = async () => {
    let nonDupTokenList = []
    let metadata = {}
    const pools = await getAllPools()

    pools.map((pool, idx) => {
        nonDupTokenList.push(pool.token_account_ids[0], pool.token_account_ids[1])
        return pool //dont care return value
    })

    nonDupTokenList = [...new Set(nonDupTokenList)]

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

export const formatShares = (accountSharesInPool) => {
    // console.log(accountSharesInPool)
    const shares = ((accountSharesInPool) / 10 ** 24).toFixed(2)
    // console.log("Account shares: ", shares)
    return shares
}

export const formatSharesPercent = (accountSharesInPool, totalShares) => {
    const formatTotalShares = totalShares / 10 ** 24;
    const sharePercent = (accountSharesInPool / formatTotalShares) * 100
    return sharePercent === 100 ? sharePercent : sharePercent.toFixed(2);
}