import { Table, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';


const Account = () => {
    const [account, setAccount] = useState({})
    const [balanceOf, setBalanceOf] = useState([])

    const contract = window.contract;
    console.log(contract);
    const accountId = window.accountId;
    let i = 1

    const testfunc = async () => {
        const depo = await contract.get_deposits({ account_id: accountId })
        setBalanceOf([depo])
    }

    useEffect(() => {
        testfunc()
    }, [])

    useEffect(() => {
        console.log(balanceOf)
    }, [balanceOf])

    return (
        <Container fluid>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Token ID</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {balanceOf.map(item => (
                        <tr key={Object.keys(item)}>
                            <td>{i++}</td>
                            <td>{Object.keys(item)[0]}</td>
                            <td>{item[Object.keys(item)[0]]}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    )
}

export default Account