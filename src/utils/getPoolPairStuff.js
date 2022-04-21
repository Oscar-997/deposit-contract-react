
export const getMetaData = async() => {
    const contract = window.contract
    let isInArr = false 
    let nonDupTokenList = []
    let metadata = {}
    
    const allPools =  await contract.get_pools({
        from_index: 0,
        limit: 100
    })

    allPools.map(pool => {
        if (nonDupTokenList.length > 0) {
            pool.token_account_ids.map(id => {
                for (let i of nonDupTokenList) {
                    if (id == i) {
                        isInArr = true
                    }
                }
                if (!isInArr) {
                    nonDupTokenList.push(id)
                } else {
                    isInArr = false
                }
            })
        } else {
            nonDupTokenList.push(...pool.token_account_ids)
        }
    })
    
    for (let i of nonDupTokenList) {
        metadata[i] = await window.walletConnection.account().viewFunction(i, 'ft_metadata')
    }
    return metadata
}

export const getAllPools = async() => {
    const allPools = await window.contract.get_pools({
        from_index: 0,
        limit: 100,
    })
    allPools.filter((pool, index) => {
        pool["pool_id"] = index
    })
    return allPools
}

export const getPoolPairSymbols = (allMetadata, pool) => {
    return {
        token1Symbol: allMetadata[pool.token_account_ids[0]].symbol,
        token2Symbol: allMetadata[pool.token_account_ids[1]].symbol,
    }
}

export const getPoolPairDecimals = (allMetadata, pool) => {
    return {
        token1Decimal: allMetadata[pool.token_account_ids[0]].decimals,
        token2Decimal: allMetadata[pool.token_account_ids[1]].decimals,
    }
}

export const getAmountTokenFromShare = (accountShares, totalShares, amountInPool) => {
    return accountShares / totalShares * amountInPool 
}

export const formatShares = (accountSharesInPool) => {
    const shares = (accountSharesInPool) / 10 ** 24

    return shares === 1 ? shares : shares.toFixed(2)
}

export const formatSharesPercent = (accountShares, totalShares) => {
    return accountShares / totalShares * 100
}