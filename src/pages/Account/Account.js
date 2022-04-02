import { Table, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext } from 'react';
import Deposit from '../../Components/Header/Buttons/Deposit'
import Withdraw from '../../Components/Header/Buttons/Withdraw';
import styled from 'styled-components';
import loading from '../../assets/loading-gift.gif'
import { TokenResults } from '../../context/TokenResultsContext';

const StyledLoading = styled.div`
    position: relative;
    margin: 0 auto;
    left: 45%;
`

const Account = () => {

    const {result} = useContext(TokenResults)

    console.log('result', result);

    // const [result, setResult] = useState([])
    // let tokenResults = []
    // const contract = window.contract;
    // const accountId = window.accountId;
    
    // const getBalanceOf = async () => {
        
    //     let depo = await contract.get_deposits({ account_id: accountId })

    //     const tokens = await fetch(
    //         `${config.helperUrl}/account/${accountId}/likelyTokens`
    //     )
    //         .then((response) => response.json())
    //         .then((tokens) => tokens)

    //     for (let i of tokens) {
    //         let balanceOfWallet = await window.walletConnection.account().viewFunction(i, "ft_balance_of", { account_id: accountId })
    //             .catch((err) => {
    //                 return {
    //                     isFailed: true
    //                 }
    //             });
    //         if (balanceOfWallet.isFailed) {
    //             continue
    //         }

    //         let metaData = await window.walletConnection.account().viewFunction(i, "ft_metadata")
    //         let obj = {
    //             id: i,
    //             name: metaData.name,
    //             balanceAccount: balanceOfWallet,
    //             symbol: metaData.symbol,
    //             decimals: metaData.decimals,
    //         }

    //         let storageBalanceOf = await window.walletConnection.account().viewFunction(i, "storage_balance_of", {account_id: config.contractName })
            
    //         if (storageBalanceOf !== null) {
    //             obj.checkRegis = true
    //         }else {
    //             obj.checkRegis = false
    //         }

    //         for (let i2 in depo) {
    //             if (i === i2) {
    //                 obj.balanceContract = depo[i]
    //             }
    //         }
    //         tokenResults.push(obj)
    //     }
    //     console.log(tokenResults);
    //     setResult(tokenResults);
    // }

    
    return (
        <Container fluid>
            <h1>Contract wallet</h1>
            {result 
            ? result.length > 0 ? 
            <Table striped hover bordered responsive>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Symbol</th>
                        <th>Token name</th>
                        <th>Token ID</th>
                        <th>Amount in wallet Account</th>
                        <th>Amount in Contract</th>
                        <th>Decimals</th>
                        <th>Deposit</th>
                        <th>Withdraw</th>
                    </tr>
                </thead>
                <tbody>
                    {result.map((item, index) => {
                        return (
                            <tr key={index}>
                                <td>{++index}</td>
                                <td>{item.symbol}</td>
                                <td>{item.name}</td>
                                <td>{item.id}</td>
                                <td>{item.balanceAccount * (10 ** -item.decimals) ? item.balanceAccount * (10 ** -item.decimals) : 0}</td>
                                <td>{item.balanceContract * (10 ** -item.decimals) ? item.balanceContract * (10 ** -item.decimals) : 0}</td>
                                <td>{item.decimals}</td>
                                <td>
                                    <Deposit item={item}/>
                                </td>
                                <td>
                                    <Withdraw item={item}/>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>: (
                <StyledLoading>
                    <img src={loading}/>
                </StyledLoading>
            ) : null}
            
        </Container>
    )
}

export default Account