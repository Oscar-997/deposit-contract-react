import { Table } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { getMetaData, getPoolPairSymbols, getPoolPairDecimals, getAmountTokenFromShare,formatShares, formatSharesPercent } from '../../utils/getPoolPairStuff';
import loading from '../../assets/loading-gift.gif';
import { Link } from 'react-router-dom';

const YourLiquidity = () => {

    const contract = window.contract
    const accountId = window.accountId
    const [allPools, setAllPools] = useState([])
    const [liquidityInfo, setliquidityInfo] = useState([])

    const getAllPools = async() => {
        const allPools = await contract.get_pools({
            from_index: 0,
            limit: 100,
        })
        setAllPools(allPools)
    }

    useEffect(() => {
        getAllPools()
    }, [])

    
    useEffect(() => {
        const getYourLiquidityInfo = async() => {
            const uniqueMetadata = await getMetaData()
    
            let tempLiquidityInfo = []
    
            if (allPools.length > 0) {
                for (let i = 0; i < allPools.length; i++) {
                    const accountShareInPool = await contract.get_pool_shares({
                        pool_id: i,
                        account_id: accountId
                    })
    
                    if (accountShareInPool > 0) {
                        const symbolPair = getPoolPairSymbols(uniqueMetadata, allPools[i])
                        const decimalPair = getPoolPairDecimals(uniqueMetadata, allPools[i])
                        
                        const totalShareInPool = await contract.get_pool_total_shares({
                            pool_id: i
                        })
    
                        const yourToken1InPool = getAmountTokenFromShare(accountShareInPool, totalShareInPool, allPools[i].amounts[0]) 
                        const yourToken2InPool = getAmountTokenFromShare(accountShareInPool, totalShareInPool, allPools[i].amounts[1]) 
                    
                        const yourSharesInPool = formatShares(accountShareInPool)
                        const yourSharesPercentInPool = formatSharesPercent(accountShareInPool, totalShareInPool)
                        
                        tempLiquidityInfo.push({
                            id: i,
                            symbol: symbolPair,
                            amounts: [yourToken1InPool, yourToken2InPool ],
                            decimals: decimalPair,
                            shares: yourSharesInPool,
                            sharesPercent: yourSharesPercentInPool
                        })
                    }
                }
            }
            setliquidityInfo(tempLiquidityInfo)
            tempLiquidityInfo = []
        }

        getYourLiquidityInfo()

    }, [allPools]);

    return (
        <>
        {liquidityInfo.length > 0 ? 
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Pool id</th>
                        <th>Pair</th>
                        <th>Token amounts</th>
                        <th>Shares</th>
                        <th>--</th>
                    </tr>
                </thead>
                <tbody>
                    {liquidityInfo.map((item, index) => {
                        return (
                            <tr key={index}>
                                <td>{item.id}</td>
                                <td>
                                    <Link to={`/pool-detail/${item.id}`}>
                                        {item.symbol.token1Symbol} -- {item.symbol.token2Symbol}
                                    </Link>
                                </td>
                                <td>{item.amounts[0] / 10 ** item.decimals.token1Decimal} -- {item.amounts[1] / 10 ** item.decimals.token2Decimal}</td>
                                <td>{item.shares} ({item.sharesPercent}%)</td>
                                <td></td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table> 
            :
                <img src={loading} />}
        </>
    )
}

export default YourLiquidity