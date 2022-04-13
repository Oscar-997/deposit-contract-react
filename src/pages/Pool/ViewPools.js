import { useState, useEffect } from "react"
import { Table, Container, Button } from 'react-bootstrap';

import { StyledLoading } from "../Account/Account";
import loading from '../../assets/loading-gift.gif'
import AddLiquidity from "../../Components/AddLiquidity/AddLiquidity";
import RemoveLiquidity from "../../Components/RemoveLiquidity/RemoveLiquidity";
import { formatShares, getMetadataOfAllTokens, getAllPools } from "../../utils/getPoolPairStuff";


const ViewPools = () => {
    const [pools, setPools] = useState([])
    const [metadata, setMetadata] = useState({})
    useEffect(async () => {
        const metadata = await getMetadataOfAllTokens()
        // console.log(metadata)
        const pools = await getAllPools()
        setMetadata(metadata)
        setPools(pools)
    }, [])
    return (
        <Container fluid>
            <h1>Pools</h1>
            {
                pools.length > 0 ?
                    <Table striped hover bordered responsive>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Pair</th>
                                <th>Fee</th>
                                <th>Token 1 amount</th>
                                <th>Token 2 amount</th>
                                <th>Pool ID</th>
                                <th>Total shares</th>
                                <th>-</th>
                                <th>-</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pools.map((pool, index) => {
                                // console.log(pool)
                                const symbol1 = metadata[pool.token_account_ids[0]].symbol
                                const symbol2 = metadata[pool.token_account_ids[1]].symbol
                                const decimals1 = metadata[pool.token_account_ids[0]].decimals
                                const decimals2 = metadata[pool.token_account_ids[1]].decimals
                                const token1Id = pool.token_account_ids[0]
                                const token2Id = pool.token_account_ids[1]

                                return (
                                    <tr key={index}>
                                        <td>{++index}</td>
                                        <td>
                                            <div>
                                                <span style={{ color: "#2666CF" }}>{symbol1}</span> - <span style={{ color: "#FFB72B" }}>{symbol2}</span>
                                            </div>
                                            <div><span style={{ color: "#2666CF" }}>{token1Id}</span> /// <span style={{ color: "#FFB72B" }}>{token2Id}</span></div>
                                        </td>
                                        <td>{pool.total_fee / 100}%</td>
                                        <td>{pool.amounts[0] / 10 ** decimals1}</td>
                                        <td>{pool.amounts[1] / 10 ** decimals2}</td>
                                        <td>{--index}</td>
                                        <td>{formatShares(pool.shares_total_supply)}</td>
                                        <td align="center">
                                            <AddLiquidity poolId={index} symbols={[symbol1, symbol2]} decimals={[decimals1, decimals2]}>Add liquidity</AddLiquidity>
                                        </td>
                                        <td align="center">
                                            <RemoveLiquidity poolId={index} pool={pool} decimals={[decimals1, decimals2]}></RemoveLiquidity>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table> : (
                        <StyledLoading>
                            <img src={loading} alt="loading..." />
                        </StyledLoading>
                    )
            }

        </Container >
    )
}

export default ViewPools