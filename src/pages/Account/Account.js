import { Table, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';


const Account = () => {
    const [balanceOf, setBalanceOf] = useState([])
    

    const contract = window.contract;
    const accountId = window.accountId;

    const getBalanceOf = async () => {
        const depo = await contract.get_deposits({ account_id: accountId })
        for (let i in depo) {
            setBalanceOf(prev => [...prev, {[i]: depo[i]}])
        }
    }

    useEffect(() => {
        getBalanceOf()
    }, [])

    console.log(balanceOf)

    

    return (
        <Container fluid>
            <h1>Contract wallet</h1>
            <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Token ID</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {balanceOf.map((item, index) => (
                            <tr key={index}>
                                <td>{++index}</td>
                                <td>{Object.keys(item)[0]}</td>
                                <td>{item[Object.keys(item)[0]] * 10 ** -8}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
        </Container>
    )
}

export default Account