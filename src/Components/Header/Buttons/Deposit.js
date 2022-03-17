import { Button, Modal, InputGroup, FormControl } from 'react-bootstrap';
import React, { useState } from 'react';
import { getConfig } from '../../../services/config';
import { functionCall, createTransaction } from 'near-api-js/lib/transaction';
import { baseDecode } from 'borsh';


const Deposit = ({ item }) => {
  const [show, setShow] = useState(false);
  const [amountDeposit, setAmountDeposit] = useState('');
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true)
  };
  

  const config = getConfig('testnet')
  const decimals = item.decimals;
  const near = window.near;
  const executeMultipleTransactions = async (transactions) => {
    console.log(transactions);
    const tokenTransactions = await Promise.all(

      transactions.map(async (t, i) => {
        console.log('t', window.accountId);
        let block = await near.connection.provider.block({ finality: 'final' });
        console.log('block', block);
        let blockHash = baseDecode(block.header.hash);
        return createTransaction(
          // receiverId: t.receiverId,
          // nonceOffset: i + 1,
          // actions: t.functionCalls.map((fc) => {
          //   functionCall(
          //     fc.methodName,
          //     fc.args,
          //     fc.gas,
          //     fc.amount
          //   )
          // })
          window.accountId,
          process.env.REACT_APP_PUBLIC_KEY,
          t.receiverId.tokenId,
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
    const account = await window.near.account(window.accountId);
    await account.signAndSendTransaction({receiverId: tokenTransactions[0].receiverId, actions});
    console.log(tokenTransactions);

  }


  const deposit = async (tokenId, amount, msg) => {
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

    return executeMultipleTransactions(transactions);
    // return transactio\ns;
  }

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
          <Button variant="primary" onClick={() => deposit({ tokenId: item.id, amountDeposit, msg: "" })}>
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