import { Table, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import Deposit from '../../Components/Header/Buttons/Deposit'


const Account = () => {
    const [result, setResult] = useState([])
    
    const contract = window.contract;
    const accountId = window.accountId;

    const getBalanceOf = async () => {
        const depo = await contract.get_deposits({ account_id: accountId })
        
        for (let i in depo) {

            let metaData = await window.walletConnection.account().viewFunction(i, "ft_metadata")
            const obj = {
                id: i,
                name: metaData.name,
                symbol: metaData.symbol,
                balance: depo[i]
            };
            setResult(data => [...data,obj]);
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
                        <th>Amount</th>
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
                                <td>{item.balance * 10 **-8}</td>
                                <td>
                                    <Deposit></Deposit>
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