import { Link, useParams} from 'react-router-dom';
import { NavItem, Table } from 'react-bootstrap';
import { getPoolPair, getMetaData, getAllPools } from '../../utils/getPoolPairStuff';
import { useState, useEffect } from 'react';
import AddLiquidity from '../../Components/Header/Buttons/AddLiquidity';
import RemoveLiquidity from '../../Components/Header/Buttons/RemoveLiquidity';

const PoolPairList = () => {

    const { tokenId1, tokenId2 } = useParams();
    const [allPools, setAllPools] = useState([])
    const [metaData, setMetaData] = useState({})

    useEffect(async() => {
        setMetaData(await getMetaData());
        setAllPools(await getAllPools());
    }, []);

    let poolPairList = getPoolPair(allPools, "token_account_ids");

    let poolPair = poolPairList[tokenId1.concat(",",tokenId2)];
    return (
        <>
        <h1>List Pool Pair</h1>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Pool id</th>
                    <th style={{ minWidth: 200, textAlign: "center" }}>Pair</th>
                    <th>Fee</th>
                    <th>Amount</th>
                    <th>--</th>
                </tr>
            </thead>
            <tbody>
                    {poolPair && poolPair.map((item, index) => {
                        return ( 
                            <tr key={index} >
                                <td>{item.pool_id}</td>
                                <td style={{ textAlign: "center" }}>
                                    <Link to={`/pool-detail/${item.pool_id}`} style={{ textDecoration: 'none' }}>
                                        <span style={{ color: 'green' }}>
                                            {metaData[item.token_account_ids[0]].symbol}
                                        </span> -- 
                                        <span style={{ color: 'blue' }}>
                                            {metaData[item.token_account_ids[1]].symbol}
                                        </span> <br />
                                        <span style={{ color: 'green' }}>
                                            {item.token_account_ids[0]}
                                        </span> -- 
                                        <span style={{ color: 'blue' }}>
                                            {item.token_account_ids[1]}
                                        </span>
                                    </Link>
                                </td>
                                <td>{item.total_fee / 100}%</td>
                                <td>
                                    {item.amounts[0] / 10 ** metaData[item.token_account_ids[0]].decimals} -- 
                                    {item.amounts[1] / 10 ** metaData[item.token_account_ids[1]].decimals}
                                </td>
                            </tr>
                        )
                    })}
            </tbody>
        </Table>
        </>
    )
}

export default PoolPairList