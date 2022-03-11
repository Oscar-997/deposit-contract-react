import { Button, Modal, InputGroup, FormControl } from 'react-bootstrap';
import React, { useState } from 'react';
import { resultDeposit } from '../../../pages/Account/Account'

const Deposit = ({item}) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    console.log(item.name)
    setShow(true)
  };



  return (
    <>
      <Button variant="success" onClick={handleShow}>
        Deposit
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Deposit {item.symbol} token to exchange</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default">{item.symbol}</InputGroup.Text>
            <FormControl
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
            />

          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Deposit
          </Button>
          <Button variant="danger" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Deposit