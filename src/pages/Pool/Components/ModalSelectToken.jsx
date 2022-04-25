import { Button, Modal, FormControl, InputGroup } from 'react-bootstrap';
import { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import ModalAddToken from './ModalAddToken';
import { TokenResults } from '../../../context/TokenResultsContext'

const ModalSelectToken = () => {
    const [show, setShow] = useState(false);
    const [depo, setDepo] = useState({});

    const { result } = useContext(TokenResults)

    console.log("result", result);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const getContractDepositToken = async() => {
        const contractDepositToken = await window.contract.get_deposits({account_id: window.accountId})
        return contractDepositToken
    }

    useEffect( async() => {
        setDepo(await getContractDepositToken())
    }, [])

    // const filterResultToken = result.filter((token) => {
    //     return token.id === Object.keys(depo)[0]
    // })

    // console.log("filter rusult", filterResultToken);

    console.log("token has deposit into contract", Object.keys(depo));

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
                    {Object.keys(depo).map((token, index) => {
                        return (
                            <>
                                <StyledToken>{token}</StyledToken>
                            </>
                        )
                    })}

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

const StyledToken = styled.div`

`

export default ModalSelectToken