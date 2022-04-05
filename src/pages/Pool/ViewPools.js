import { useEffect, useContext, useState } from 'react';
import { Table } from 'react-bootstrap'
import { BsFillArrowDownCircleFill, BsFillArrowUpCircleFill } from "react-icons/bs";
import { getConfig } from '../../services/config';
import { TokenResults, getBalanceOf2 } from '../../context/TokenResultsContext'
import loading from '../../assets/loading-gift.gif'
import { getAllByPlaceholderText } from '@testing-library/react';
const ViewPools = () => {
    const [allPools, setAllPools] = useState([])
    const [allMetadata, setAllMetadata] = useState([])

    const config = getConfig('testnet');
    const contract = window.contract;
    
    useEffect(async () => {
        const allPools = await contract.get_pools({ from_index: 0, limit: 100 })
        console.log("All pools: ", allPools)
        let nonDupTokenList = [];
        let tempArr = []

        let isInArr = false;
        allPools.map((pool, i) => {
            // arr = pool.token_account_ids
            if (nonDupTokenList.length > 0) { // convert to non-duplicate token_id's array
                pool.token_account_ids.map((id) => {
                    for (let i of nonDupTokenList) {
                        if (id === i){
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
        nonDupTokenList.map(async(token_id) => {
            const metadata = await window.walletConnection.account().viewFunction(token_id, "ft_metadata")
            tempArr.push(metadata)
            console.log(tempArr)
            return metadata
        })
        console.log(tempArr)
        setAllPools(allPools)
    }, [])

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th style={{ minWidth: 250 }}>Pair</th>
                    <th>Fee < BsFillArrowUpCircleFill /></th>
                    <th>TVL <BsFillArrowDownCircleFill /></th>
                    <th>Pools</th>
                </tr>
            </thead>
            <tbody>
                
            </tbody>
        </Table>
    )
}

export default ViewPools