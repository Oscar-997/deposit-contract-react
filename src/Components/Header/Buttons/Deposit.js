import { Button, Modal, InputGroup, FormControl } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { getConfig, getConfigToken } from '../../../services/config';
import { useNear } from '../../../hooks/useNear';
import { Contract } from 'near-api-js';


const Deposit = ({ item }) => {
  const [show, setShow] = useState(false);
  const [amountDeposit, setAmountDeposit] = useState('');
  const handleClose = () => setShow(false);
  const { getNear } = useNear();
  const tokenContract = window.tokenContract
  const handleShow = () => {
    setShow(true)
  };

  const config = getConfig('testnet',)
  const configToken = getConfigToken('testnet', item.id);

  const configContract = 'dev-1646701624418-65193707375662'
  const ONE_YOCTO_NEAR = '0.000000000000000000000001';
  const decimals = item.decimals;
  // console.log(decimals);

  const ftViewFunction = async (
    tokenId,
    { methodName, args }
  ) => {

    // console.log('config contract', args);
    return await window.walletConnection.account(args.account_id).viewFunction(tokenId, methodName, args);
  };

  const ftGetStorageBalance = async (
    tokenId
    // accountId = configContract
  ) => {
    return await ftViewFunction(tokenId, {
      methodName: 'storage_balance_of',
      args: { account_id: configContract },
    });
  };


  // const transferCall = async () => {
  //   const walletConnection = await getNear(configToken);
  //   const tokenContractt = new Contract(walletConnection.account(), item.id, {
  //     viewMethods: ['ft_total_supply', 'ft_balance_of'],
  //     changeMethods: ['ft_transfer', 'ft_transfer_call']
  //   });
  //   await tokenContractt.ft_transfer_call({
  //     receiver_id: config.contractName,
  //     amount: `${amountDeposit}00000000`,
  //     msg: ""
  //   },
  //     "300000000000000",
  //     "1"
  //   ).then(rep => console.log(rep));
    
  // }

  const ftTransferCall = async () => {
    await tokenContract.ft_transfer_call({
      receiver_id: config.contractName,
      amount: (amountDeposit*10**decimals).toString(),
      msg: ""
    },
      "300000000000000",
      "1"
    )
  }

  const storageDeposit = async () => {
    await tokenContract.storage_deposit({
      account_id: config.contractName
    },
    "300000000000000",
    "12500000000000000000000",
    )
  }

  // const storageDeposit = async () => {
  //   const walletConnection = await getNear(configToken);
  //   const tokenContract = new Contract(walletConnection.account(), item.id, {
  //     viewMethods: ['ft_total_supply', 'ft_balance_of'],
  //     changeMethods: ['ft_transfer', 'ft_transfer_call', 'storage_deposit']
  //   });

  //   await tokenContract.storage_deposit({
  //     account_id: config.contractName,
  //   },
  //     "0.0125",
  //     "100000000000000"
  //   )

  // }



  const deposit = async ({ amount, id }) => {
    let transactions = [];

    transactions.unshift({
      receiverId: id,
      functionCalls: [
        {
          methodName: 'ft_transfer_call',
          args: {
            receiver_id: config.contractName,
            amount: (10 ** decimals * amount).toString(),
            msg: '',
          },
          amount: "1",
          gas: "100000000000000",
        },
      ],
    })
    // await transferCall()
    
    ftTransferCall();
    // const exchangeBalanceAtFt = await ftGetStorageBalance(
    //   id,
    // );

    // if (!exchangeBalanceAtFt) {}
      // transactions.unshift({
      //   receiverId: id,
      //   functionCalls: [
      //     {
      //       methodName: 'storage_deposit',
      //       args: {
      //         account_id: config.contractName
      //       },
      //       gas: "100000000000000",
      //       amount: "0.0125",
      //     },
      //   ]
      // })
      // await storageDeposit().then((da) => console.log(da))
      
  }

  const handleChange = (e) => {
    setAmountDeposit(e.target.value);
  }

  // useEffect(async () => {
  //   await testing();
  // }, []);

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
          <Button variant="primary" onClick={() => deposit({ id: item.id, amount: item.balance })}>
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