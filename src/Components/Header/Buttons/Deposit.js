import {Button, Modal, InputGroup, FormControl} from 'react-bootstrap';
import React, {useState} from 'react';

const Deposit = () => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
          <Button variant="success" onClick={handleShow}>
            Deposit
          </Button>
    
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Deposit tokens</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="inputGroup-sizing-default">Tokens</InputGroup.Text>
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