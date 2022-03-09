import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


const Account = () => {

    const contract = window.contract;
    console.log(contract);
    const accountId = window.accountId;
    const account = contract.get_deposits({ account_id: accountId })
    .then((res) => {
        console.log(res)
    })

    return (
        <div>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Token</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Mark</td>
                        <td>Otto</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Jacob</td>
                        <td>Thornton</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>Bird</td>
                        <td> Bird</td>
                    </tr>
                </tbody>
            </Table>
        </div>
    )
}

export default Account