import { Button, Modal, InputGroup, FormControl } from 'react-bootstrap';
import { useState } from 'react';
import { getConfig } from '../../../services/config';
import { executeMultipleTransactions } from '../../../utils/executeMultipleTransactions';


const ModalAddToken = () => {

  const [tokenId, setTokenId] = useState('')
  const [show, setShow] = useState(false)
  const config = getConfig('testnet')

  console.log("contract name", config.contractName);
  
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  const handleSetTokenId = (e) => {
    setTokenId(e.target.value)
  }

  const ftGetStorageBalance = async(tokenId, accountId) => {
      return await window.walletConnection.account().viewFunction(tokenId, 'storage_balance_of', {account_id: accountId});
  }

  const regisAndStorageDepo = async(tokenId) => {
    let transactions = []

    transactions.unshift({
        receiverId: config.contractName,
        functionCalls: [
            {
                methodName: 'register_tokens',
                args: {
                    token_ids: [tokenId.toString()]
                }
            }
        ]
    })

    if(await ftGetStorageBalance(tokenId, config.contractName) === null) {
      transactions.unshift({
        receiverId: tokenId,
        functionCalls: [
          {
            methodName: 'storage_deposit',
            args: {
              account_id: config.contractName,
              registration_only: true,
            },
            amount: "0.00125",
            gas: "100000000000000",
          },
        ],
      });
    }

    return executeMultipleTransactions(transactions)
    
  }

  return (
    <>
      <Button variant="outline-info" onClick={handleShow}>
        Add Token
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
            <InputGroup className="mb-3">
                <FormControl
                aria-label="Example text with button addon"
                aria-describedby="basic-addon1"
                placeholder='Enter token address'
                onChange={handleSetTokenId}
                />&nbsp;&nbsp;&nbsp;
                <Button variant="primary" onClick={() => regisAndStorageDepo(tokenId)}>
                    Save Changes
                </Button>
            </InputGroup>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ModalAddToken