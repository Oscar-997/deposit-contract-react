import { useEffect, useContext, useState } from 'react';
import { Table } from 'react-bootstrap'
import { BsFillArrowDownCircleFill, BsFillArrowUpCircleFill } from "react-icons/bs";
import { getConfig } from '../../services/config';
import {TokenResults, getBalanceOf2} from '../../context/TokenResultsContext'

const ViewPools = () => {

    const config = getConfig('testnet');

    const { result } = useContext(TokenResults)

    const parsePool = (pool, id, result) => {
        // console.log("Check result: " , result);
        // console.log("pool", pool);
        const allPools = [];
        let obj = {
            id: id >= 0 ? id : pool.id,
            tokenIds: pool.token_account_ids,
            supplies: pool.amounts.reduce
                ((acc, amount, i) => {
                    acc[pool.token_account_ids[i]] = amount;
                    return acc
                }, {})
            ,
            fee: pool.total_fee,
            shareSupply: pool.shares_total_supply,
            tvl: pool.tvl,
        }
            for (let i in result) {
                for (let i2 in pool.token_account_ids) {
                        if(i.id === i2){
                            obj.symbolToken = i.symbol;
                        }
                }
                allPools.push(obj)
            }


        return allPools;
    }

    const getAllPools = async (result) => {
        let page = 1;
        let perPage = 100;
        const index = (page - 1) * perPage;
        const poolData = await window.walletConnection.account().viewFunction(config.contractName, 'get_pools', { from_index: index, limit: perPage })
        return poolData.map((rawPool, i) =>  parsePool(rawPool, i + index, result)) 
    }

    useEffect(async() => {
        if (window.walletConnection.isSignedIn()) {
           
     
                const result = await getBalanceOf2();
                const allPools = await getAllPools(result);
                console.log(allPools);
        
        }
    }, [])

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Pair</th>
                    <th>Fee < BsFillArrowUpCircleFill /></th>
                    <th>TVL <BsFillArrowDownCircleFill /></th>
                    <th>Pools</th>
                </tr>
            </thead>
            <tbody>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
            </tbody>
        </Table>
    )
}

export default ViewPools