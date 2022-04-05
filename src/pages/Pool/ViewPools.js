import { useState, useEffect, useContext } from "react"
import { Table, Container } from 'react-bootstrap';

import { StyledLoading } from "../Account/Account";
import loading from '../../assets/loading-gift.gif'
import { TokenResults } from '../../context/TokenResultsContext';


const ViewPools = () => {
    const [pools, setPools] = useState([])
    const exContract = window.contract;
    const TokensDataObj = useContext(TokenResults)
    const TokensData = TokensDataObj[Object.keys(TokensDataObj)[0]] // unwrap context object to arr
    console.log("Token Data: ", TokensData)
    console.log("Excontract: ", exContract)
    useEffect(async () => {
        const pools = await exContract.get_pools({
            from_index: 0,
            limit: 600
        })
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
                                <th style={{
                                    minWidth: 300
                                }}>Pair</th>
                                <th>Fee</th>
                                <th>TVL</th>
                                {/* <th>Pools</th>
                                <th>Amount in Contract</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {pools.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{++index}</td>
                                        <td>{ } -{item.token_account_ids[1]}</td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table> : (
                        <StyledLoading>
                            <img src={loading} />
                        </StyledLoading>
                    )}

        </Container>
    )
}

export default ViewPools