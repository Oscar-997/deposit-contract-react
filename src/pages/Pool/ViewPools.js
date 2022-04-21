import { useEffect, useState } from 'react';
import { NavItem, Table } from 'react-bootstrap'
import { BsFillArrowUpCircleFill } from "react-icons/bs";
import { getMetaData, getAllPools } from '../../utils/getPoolPairStuff';
import { Link } from 'react-router-dom';


const ViewPools = () => {
    const [allPools, setAllPools] = useState([])
    const [metaData, setMetaData] = useState({})

    useEffect(async() => {
        setMetaData(await getMetaData());
        setAllPools(await getAllPools());
    }, []);

    

    return (
    <>
        <h1>List pools</h1>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th style={{ minWidth: 250 }}>Pair</th>
                    <th>Fee < BsFillArrowUpCircleFill /></th>
                    <th>Amount</th>
                    <th>Pools</th>
                </tr>
            </thead>
            <tbody>
                    {allPools.map((item, index) => {
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td
                                    style={{textAlign: "center"}}
                                >
                                    <span style={{ color: 'green' }}>{metaData[item.token_account_ids[0]].symbol}</span> -- <span style={{ color: 'blue' }}>{metaData[item.token_account_ids[1]].symbol}</span> <br />
                                    <span style={{ color: 'green' }}>{item.token_account_ids[0]}</span> -- <span style={{ color: 'blue' }}>{item.token_account_ids[1]}</span>
                                </td>
                                <td
                                    style={{textAlign: "center"}}
                                >
                                    {[item][0].total_fee / 100}%
                                </td>
                                <td
                                    style={{textAlign: "center"}}
                                >{[item][0].amounts[0] / 10 ** metaData[item.token_account_ids[0]].decimals} -- {[item][0].amounts[1] / 10 ** metaData[item.token_account_ids[1]].decimals}</td>
                                <td
                                    style={{textAlign: "center"}}
                                >
                                    <Link to={`/pool-pair-list/${item.token_account_ids[0]},${item.token_account_ids[1]}`} style={{ textDecoration: 'none' }}>
                                        <span>
                                            {[item].length}
                                        </span>
                                    </Link>
                                </td>
                            </tr>
                        )
                    })}
            </tbody>
        </Table>
    </>
    )
}

export default ViewPools