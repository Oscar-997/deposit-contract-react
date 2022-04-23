import { Button, Modal, FormControl, InputGroup } from 'react-bootstrap';
import { useState } from 'react';
import styled from 'styled-components';
import ModalAddToken from './ModalAddToken';
import { useEffect } from 'react';


const ModalSelectToken = () => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const getContractDepositToken = async() => {
        const contractDepositToken = await window.contract.get_deposits({account_id: window.accountId})
        return contractDepositToken
    }

    console.log("contract deposit token", getContractDepositToken());

    return (
        <>
        <StyledTokenSelectButton variant="primary" onClick={handleShow}>
            Select token 1
        </StyledTokenSelectButton>

        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
            <Modal.Title>Select token</Modal.Title>
            </Modal.Header>
                <Modal.Body>
                <InputGroup className="mb-3">
                    <FormControl
                    aria-label="Example text with button addon"
                    aria-describedby="basic-addon1"
                    placeholder='Search token'
                    />&nbsp;&nbsp;&nbsp;
                    <ModalAddToken />
                </InputGroup>
                </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            <Button variant="primary">Approve</Button>
            </Modal.Footer>
        </Modal>
        </>
    );
}

const StyledTokenSelectButton = styled.div`
    border: 1px solid;
    border-radius: 5px;
    width: 100%; 
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    :hover {
        background-color: #333;
        color: #fff;
    }
`

export default ModalSelectToken