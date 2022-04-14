import { Button, Modal, InputGroup, FormControl } from "react-bootstrap";
import { useEffect, useState } from "react";
import BN from "bn.js";
import {utils} from 'near-api-js';
import styled from "styled-components";

const getGas = (gas) => gas ? new BN(gas) : new BN('100000000000000');
const getAmount = (amount) => amount ? new BN(utils.format.parseNearAmount(amount)) : new BN('0');

const StyledShareTotal = styled.div`
  margin: 0 0 0 17px;
`

const AddLiquidity = ({ poolId, poolInfo, metaData}) => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [amountToken1, setAmountToken1] = useState('')
    const [amountToken2, setAmountToken2] = useState('')
    const [shares, setShares] = useState(0)

    // useState get token amount in contract
    const [token1, setToken1] = useState(0)
    const [token2, setToken2] = useState(0)

    const contract = window.contract

    const handleSetToken1 = (e) => {
        setAmountToken1(e.target.value)
    }

    const handleSetToken2 = (e) => {
        setAmountToken2(e.target.value)
    }

    const addLiquidity = async() => {
        await contract.add_liquidity({
            pool_id: Number(poolId),
            amounts: [(amountToken1 * 10 ** metaData[poolInfo.token_account_ids[0]].decimals).toString() ,
                     (amountToken2 * 10 ** metaData[poolInfo.token_account_ids[1]].decimals).toString()]
        }, 
            getGas("300000000000000"),
            getAmount('0.0009')
        )
    }

    const getShareInPool = async() => {
      const shares =  await contract.get_pool_shares({
        pool_id: Number(poolId),
        account_id: window.accountId
      })
      setShares(shares) 
    }

    const getToken1InContract = async() => {
      const tokenAmount = await contract.get_token_balance({
        account_id: window.accountId,
        token_id: poolInfo.token_account_ids[0],
      })
      setToken1(tokenAmount);
    }

    const getToken2InContract = async() => {
      const tokenAmount = await contract.get_token_balance({
        account_id: window.accountId,
        token_id: poolInfo.token_account_ids[1],
      })
      setToken2(tokenAmount);
    }

    useEffect(() => {
      getShareInPool();
      getToken1InContract();
      getToken2InContract();
    }, [])


    return (
      <>
        <Button variant="primary" onClick={handleShow}>
          Add liquidity
        </Button>
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add liquidity</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <span>Balance : {token1 ? token1 / 10 ** metaData[poolInfo.token_account_ids[0]].decimals : 0}</span>
            <InputGroup className="mb-3">
                <InputGroup.Text id="inputGroup-sizing-default">{metaData[poolInfo.token_account_ids[0]].symbol}</InputGroup.Text>
                <FormControl
                // aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                type="number"
                onChange={handleSetToken1}
                />
                </InputGroup>
            </Modal.Body>
            <Modal.Body>
            <span>Balance : {token2 ? token2 / 10 ** metaData[poolInfo.token_account_ids[1]].decimals : 0}</span>
            <InputGroup className="mb-3">
                <InputGroup.Text id="inputGroup-sizing-default">{metaData[poolInfo.token_account_ids[1]].symbol}</InputGroup.Text>
                <FormControl
                // aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                type="number"
                onChange={handleSetToken2}
                />
                </InputGroup>
            </Modal.Body>
            <StyledShareTotal>
              <span>Your Shares: {shares / 10 ** 24}</span> <br />
              <span style={{color: 'blue'}} >Total Shares: {poolInfo.shares_total_supply / 10 ** 24}</span>
            </StyledShareTotal>
          <Modal.Footer>
            <Button variant="primary" onClick={addLiquidity}>
              Add liquidity
            </Button>
            <Button variant="danger" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
}

export default AddLiquidity