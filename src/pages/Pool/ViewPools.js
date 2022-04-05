import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap'
import { BsFillArrowDownCircleFill, BsFillArrowUpCircleFill } from "react-icons/bs";
const ViewPools = () => {
    const [allPools, setAllPools] = useState([])
    const [metaData, setMetaData] = useState({})

    const contract = window.contract;

    useEffect(async () => {
        const allPools = await contract.get_pools({ from_index: 0, limit: 100 })
        let nonDupTokenList = [];
        let metadata = {};

        let isInArr = false;
        allPools.map((pool, i) => {
            // arr = pool.token_account_ids
            if (nonDupTokenList.length > 0) { // convert to non-duplicate token_id's array
                pool.token_account_ids.map((id) => {
                    for (let i of nonDupTokenList) {
                        if (id === i) {
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
        setMetaData(metadata)
        setAllPools(allPools)
    }, [])
    console.log(allPools);
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
                    <th>Pool ids</th>
                </tr>
            </thead>
            <tbody>
                {allPools.length > 0 ?
                    allPools.map((item, index) => {
                        return (
                            <tr key={index}>
                                <td>{++index}</td>
                                <td>
                                    <span>{metaData[item.token_account_ids[0]].symbol}</span> -- <span>{metaData[item.token_account_ids[1]].symbol}</span>
                                </td>
                                <td>{item.total_fee / 100 }%</td>
                                <td>{item.amounts[0]} -- {item.amounts[1]}</td>
                                <td>{index - 1}</td>
                            </tr>
                        )
                    }) :
                    <tr>
                        <td>Loading...</td>
                    </tr>
                }
            </tbody>
        </Table>
    </>
    )
}

export default ViewPools