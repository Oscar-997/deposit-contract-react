import { Button, Modal, InputGroup, FormControl } from "react-bootstrap";
import { useState } from "react";

import { getGas, getAmount } from "../../../utils/getFuntions";



const Withdraw = ({ item }) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const contract = window.contract;

    const [amountWithdraw, setAmountWithdraw] = useState('');

    const withDraw = async () => {
        await contract.withdraw({
            token_id: item.id,
            amount: (amountWithdraw * 10 ** item.decimals).toString()
        },
            getGas("300000000000000"),
            getAmount("0.000000000000000000000001")
        )
    }

    const handleChange = (e) => {
        setAmountWithdraw(e.target.value);
    }

    return (
        <>
            <Button variant="danger" onClick={handleShow}>
                Withdraw
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Withdraw {item.symbol} exchange to account</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup className="mb-3">
                        <InputGroup.Text id="inputGroup-sizing-default">{item.symbol}</InputGroup.Text>
                        <FormControl
                            aria-describedby="inputGroup-sizing-default"
                            type="number"
                            onChange={handleChange}
                        />
                    </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={withDraw}>
                        Withdraw
                    </Button>
                    <Button variant="danger" onClick={handleClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Withdraw