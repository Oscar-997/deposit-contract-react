import { Button, Modal, InputGroup, FormControl } from 'react-bootstrap';
import React, { useState } from 'react';
import { getConfig } from '../../../services/config';
import { functionCall, createTransaction } from 'near-api-js/lib/transaction';
import { baseDecode } from 'borsh';
import { PublicKey } from 'near-api-js/lib/utils';


const Deposit = ({ item }) => {
  const [show, setShow] = useState(false);
  const [amountDeposit, setAmountDeposit] = useState('');
  const [state, setState] = useState(null)
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true)
  };
  const wallet = window.walletConnection
  const config = getConfig('testnet')
  const decimals = item.decimals;
  const near = window.near;

  // check Account for contract
  const checkAccToContract = async() => {
    let checkAcc = await window.walletConnection.account().viewFunction(config.contractName, "storage_balance_of", {account_id: window.accountId})
    console.log(checkAcc);
    setState(checkAcc)
  }

  // get localKey
  const getAccessKey = async () =>{
    const accountInfor = JSON.parse(localStorage.getItem("undefined_wallet_auth_key"));
    const localKey = accountInfor.allKeys[0];
      console.log(localKey);
    return localKey
  }


  const executeMultipleTransactions = async function (transactions){
   // get public key
   const publicKeyGet = await getAccessKey();
   const pubKey = PublicKey.from(publicKeyGet)
    const tokenTransactions = await Promise.all(
      transactions.map(async (t, i) => {
        // get block hash
        let block = await near.connection.provider.block({ finality: 'final' });
        let blockHash = baseDecode(block.header.hash);
        console.log(t.receiverId);
        return createTransaction(
          window.accountId,
          pubKey,
          t.receiverId,
          i + 1,
          t.functionCalls.map((fc) => {
            return functionCall(fc.methodName, fc.args, fc.gas, fc.amount);
          }),
          blockHash
        )
      })
    )
    let actions = [];
    tokenTransactions.map(item => {
        actions.push(item.actions[0]);
    })
    console.log(tokenTransactions);
    return wallet.requestSignTransactions({transactions: tokenTransactions});
  }


  const deposit = async (tokenId) => {
    let transactions = [];

    transactions.unshift({
      receiverId: tokenId,
      functionCalls: [
        {
          methodName: 'ft_transfer_call',
          args: {
            receiver_id: config.contractName,
            amount: (amountDeposit * 10 ** decimals).toString(),
            msg: "",
          },
          amount: "1",
          gas: "100000000000000",
        },
      ],
    });

    if (!item.checkRegis) {
      transactions.unshift({
        receiverId: tokenId,
        functionCalls: [
          {
            methodName: 'storage_deposit',
            args: {
              account_id: config.contractName,
              registration_only: true,
            },
            amount: "12500000000000000000000",
            gas: "100000000000000",
          },
        ],
      });
    }

    if (state === null) {
      transactions.unshift({
        receiverId: config.contractName,
        functionCalls: [
          {
            methodName: 'storage_deposit',
            args: {
              registration_only: true,
            },
            amount: "12500000000000000000000",
            gas: "100000000000000",
          }
        ]
      })
    }

    
    return executeMultipleTransactions(transactions)
  }

  // const sendTransactions = async (transactions) => {
  //   const account = await near.account(config.contractName)
  //   const result = await account.signAndSendTransaction({
  //     receiverId: config.contractName,
  //     actions: [
  //       transactions.functionCall(
  //         "ft_transfer_call",

  //       )
  //     ]
  //   })
  // }

  // const handleSubmit = async (id, msg) => {
  //   deposit(id, amountDeposit, msg);
  //   // console.log(await deposit(id, amountDeposit, msg));
  // }

  const handleChange = (e) => {
    setAmountDeposit(e.target.value);
  }

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
              // aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              type="number"
              // value={amount}
              // onChange={e => setAmount(e.target.value)}
              onChange={handleChange}
            />

          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => deposit(item.id)}>
            Deposit
          </Button>
          <Button variant="danger" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => checkAccToContract()}>
            check account 
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Deposit