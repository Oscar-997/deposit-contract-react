import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap'
import { BsFillArrowUpCircleFill } from "react-icons/bs";
import { Link } from 'react-router-dom';


const ViewPools = () => {
    const [allPools, setAllPools] = useState([])
    const [metaData, setMetaData] = useState({})

    const contract = window.contract;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async () => {
        const allPools = await contract.get_pools({ from_index: 0, limit: 100 })
        let nonDupTokenList = [];
        let metadata = {};

        let isInArr = false;
        allPools.map((pool) => {
            if (nonDupTokenList.length > 0) { 
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
    }, [contract])

   allPools.filter((pool, index) => {
    pool["pool_id"] = index
   })

   const getPoolPairList = (arr, prop) => {
        return arr.reduce(function (acc, obj) {
            let key = obj[[prop]]
            if(!acc[key]) {
            acc[key] = []
            }
            acc[key].push(obj)
            return acc
        }, {})
   }

   const poolPairList = getPoolPairList(allPools, "token_account_ids")
   console.log(poolPairList);

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
                                <td>
                                    <span style={{ color: 'green' }}>{metaData[keyPair[0]].symbol}</span> -- <span style={{ color: 'blue' }}>{metaData[keyPair[1]].symbol}</span> <br />
                                    <span style={{ color: 'green' }}>{keyPair[0]}</span> -- <span style={{ color: 'blue' }}>{keyPair[1]}</span>
                                </td>
                                <td></td>
                                <td>{poolPairList[key][0].amounts[0] / 10 ** metaData[keyPair[0]].decimals} -- {poolPairList[key][0].amounts[1] / 10 ** metaData[keyPair[1]].decimals}</td>
                                <td>{poolPairList[key].length}</td>
                            </tr>
                        )
                    })}
            </tbody>
        </Table>
    </>
    )
}

export default ViewPools