import { useState } from 'react';
import { useEffect } from 'react';
import { Table } from 'react-bootstrap';


import { getPoolPairDecimals, getPoolPairSymbols, getMetadataOfAllTokens, formatShares, getTokenAmountFromShares } from '../../utils/getPoolPairStuff';
import loading from '../../assets/loading-gift.gif'

const YourLiquidity = () => {
    // user account id
    const accountId = window.accountId
    // exchange contract
    const contract = window.contract

    const [allPool, setAllPools] = useState([])
    const [liquidityInfo, setLiquidityInfo] = useState([])


    useEffect(() => {
        const getAllPools = async () => {
            const allPool = await contract.get_pools({
                from: 0,
                limit: 100
            })
            // console.log("All pools: ", allPool)
            setAllPools(allPool)
        }

        getAllPools()
    }, [])

    useEffect(() => {
        const getYourLiquidityPools = async () => {
            const uniqueMetadata = await getMetadataOfAllTokens()
            // console.log("unique metadata: ", uniqueMetadata) 
            let temp_liquidityInfo = []

            if (allPool.length > 0) {
                for (let i = 0; i < allPool.length; i++) { // i === pool id
                    // console.log(symbolPair) 
                    const accountSharesInPool = await contract.get_account_shares_in_pool({
                        pool_id: i,
                        account_id: accountId
                    })

                    if (accountSharesInPool > 0) {
                        const symbolPair = await getPoolPairSymbols(uniqueMetadata, allPool[i])
                        const yourTokenDecimals = await getPoolPairDecimals(uniqueMetadata, allPool[i])

                        const totalSharesInPool = await contract.get_pool_total_shares({
                            pool_id: i
                        })

                        // amount of [tokenA, tokenB] deposited in pool based on shares
                        const yourTokenAInPool = getTokenAmountFromShares(accountSharesInPool, totalSharesInPool, allPool[i].amounts[0])
                        const yourTokenBInPool = getTokenAmountFromShares(accountSharesInPool, totalSharesInPool, allPool[i].amounts[1])

                        const rawShares = accountSharesInPool / totalSharesInPool
                        const youSharesInPool = formatShares(rawShares)
                        const yourSharesPercentInPool = (accountSharesInPool / totalSharesInPool + accountSharesInPool % totalSharesInPool) * 100

                        // console.log(`Your Shares In Pool as Percent ${yourSharesPercentInPool}%`)
                        // console.log("Your Shares In Pool: ", youSharesInPool)
                        // console.log("Your Token A Amount In Pool: ", yourTokenAInPool)
                        // console.log("Your Token B Amount In Pool: ", yourTokenBInPool)

                        temp_liquidityInfo.push({
                            id: i,
                            symbols: symbolPair,
                            amounts: [yourTokenAInPool, yourTokenBInPool],
                            decimals: yourTokenDecimals,
                            shares: youSharesInPool,
                            sharesPercent: yourSharesPercentInPool
                        })
                        // console.log("temp_liquidity infor: ", temp_liquidityInfo)
                        // console.log(`Account shares in pool [${i}]\t: ${accountSharesInPool}`)
                        // console.log(`Total shares in pool[${i}]\t: ${totalSharesInPool}`)
                    }
                }
                setLiquidityInfo(temp_liquidityInfo)
                temp_liquidityInfo = []
            }
        }

        getYourLiquidityPools()
    }, [allPool])
    console.log(liquidityInfo)
    return (
        <>
            {liquidityInfo.length > 0 ?
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Pool ID</th>
                            <th>Token</th>
                            <th></th>
                            <th>Shares</th>
                        </tr>
                    </thead>
                    <tbody>
                        {liquidityInfo.map((poolInfo, index) => {
                            return (
                                <tr key={index}>
                                    <td>{poolInfo.id}</td>
                                    <td>{poolInfo.symbols.token1Symbol} - {poolInfo.symbols.token2Symbol}</td>
                                    <td>{poolInfo.amounts[0] / 10 ** poolInfo.decimals.token1Decimal} - {poolInfo.amounts[1] / 10 ** poolInfo.decimals.token1Decimal}</td>
                                    <td>{`${poolInfo.shares} (${poolInfo.sharesPercent}%)`}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
                :
                <img src={loading} style={{ alignSelf: "center" }} alt='loading...'></img>
            }
        </>
    )
}

export default YourLiquidity