import { Table, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import Deposit from '../../Components/Header/Buttons/Deposit'
import { getConfig } from '../../services/config';
// import { useNear } from '../../hooks/useNear';



const config = getConfig('testnet')

const Account = () => {

    const [result, setResult] = useState([])
    let obj = {};
    const contract = window.contract;
    const accountId = window.accountId;
    


    const getBalanceOf = async () => {
        
        
        let depo = await contract.get_deposits({ account_id: accountId })

        const tokens = await fetch(
            `${config.helperUrl}/account/${accountId}/likelyTokens`
        )
            .then((response) => response.json())
            .then((tokens) => tokens);

        for (let i of tokens) {
            let balanceOfWallet = await window.walletConnection.account().viewFunction(i, "ft_balance_of", { account_id: accountId })
                .catch((err) => {
                    return {
                        isFailed: true
                    }
                });
            if (balanceOfWallet.isFailed) {
                continue
            }

            let metaData = await window.walletConnection.account().viewFunction(i, "ft_metadata")
            obj = {
                id: i,
                name: metaData.name,
                balanceAccount: balanceOfWallet,
                symbol: metaData.symbol,
                decimals: metaData.decimals,
            }

            let storageBalanceOf = await window.walletConnection.account().viewFunction(i, "storage_balance_of", {account_id: config.contractName })
            
            if (storageBalanceOf !== null) {
                obj.checkRegis = true
            }else {
                obj.checkRegis = false
            }

            for (let i2 in depo) {
                if (i === i2) {
                    obj.balanceContract = depo[i]
                }
            }
            setResult((data) => [...data, obj]);
        }

    }

    useEffect(() => {
        getBalanceOf()
    }, [])
    return (
        <Container fluid>
            <h1>Contract wallet</h1>
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
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </Container>
    )
}

export default Account