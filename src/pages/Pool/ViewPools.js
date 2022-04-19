import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap'
import { BsFillArrowUpCircleFill } from "react-icons/bs";
import { getMetaData, getPoolPair, getAllPools } from '../../utils/getPoolPairStuff';
import { Link } from 'react-router-dom';


const ViewPools = () => {
    const [allPools, setAllPools] = useState([])
    const [metaData, setMetaData] = useState({})

    useEffect(async() => {
        setMetaData(await getMetaData());
        setAllPools(await getAllPools());
    }, []);

    let poolPairList = getPoolPair(allPools, "token_account_ids")

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
                    {poolPairList && Object.keys(poolPairList).map((key, index) => {
                        const keyPair = key.split(",")
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td
                                    style={{textAlign: "center"}}
                                >
                                    <span style={{ color: 'green' }}>{metaData[keyPair[0]].symbol}</span> -- <span style={{ color: 'blue' }}>{metaData[keyPair[1]].symbol}</span> <br />
                                    <span style={{ color: 'green' }}>{keyPair[0]}</span> -- <span style={{ color: 'blue' }}>{keyPair[1]}</span>
                                </td>
                                <td
                                    style={{textAlign: "center"}}
                                >{poolPairList[key][0].total_fee / 100}%</td>
                                <td
                                    style={{textAlign: "center"}}
                                >{poolPairList[key][0].amounts[0] / 10 ** metaData[keyPair[0]].decimals} -- {poolPairList[key][0].amounts[1] / 10 ** metaData[keyPair[1]].decimals}</td>
                                <td
                                    style={{textAlign: "center"}}
                                >
                                    <Link to={`/pool-pair-list/${keyPair[0]},${keyPair[1]}`} style={{ textDecoration: 'none' }}>
                                        <span>
                                            {poolPairList[key].length}
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