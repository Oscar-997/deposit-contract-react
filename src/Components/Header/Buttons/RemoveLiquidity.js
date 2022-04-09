import { Button, Modal, InputGroup, FormControl } from "react-bootstrap"
import { useState, useEffect } from "react";
import styled from "styled-components";
import BN from "bn.js";
import {utils} from 'near-api-js';

const getGas = (gas) => gas ? new BN(gas) : new BN('100000000000000');
const getAmount = (amount) => amount ? new BN(utils.format.parseNearAmount(amount)) : new BN('0');

const StyledShareTotal = styled.div`
  margin: 0 0 0 17px;
`

const RemoveLiquidity = ({poolId, item, metaData}) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [totalSharesInAcc, setTotalSharesInAcc] = useState('')
    const [shares, setShares] = useState(0)

    const contract = window.contract

    const handleSetSharesInAcc = (e) => {
        setTotalSharesInAcc(e.target.value)
    }

    const removeLiquidity = async() => {
        await contract.remove_liquidity({
            pool_id: poolId,
            shares: (totalSharesInAcc * 10 ** 24).toLocaleString('fullwide', {
              useGrouping: false
            }),
            min_amounts: ["0", "0"]
        },
            getGas("300000000000000"),
            getAmount('0.000000000000000000000001')
        )
    }

    const getShareInPool = async() => {
      const shares =  await contract.get_pool_shares({
        pool_id: poolId,
        account_id: window.accountId
      })
      setShares(shares) 
    }

    useEffect(() => {
        getShareInPool()
      }, [])

    return (
        <>
            <>
        <Button variant="danger" onClick={handleShow}>
          Remove liquidity
        </Button>
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Remove liquidity</Modal.Title>
          </Modal.Header>
            <Modal.Body>
            <InputGroup className="mb-3">
                <InputGroup.Text id="inputGroup-sizing-default">Shares</InputGroup.Text>
                <FormControl
                // aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                type="number"
                onChange={handleSetSharesInAcc}
                />
                </InputGroup>
            </Modal.Body>
            <StyledShareTotal>
              <span>Your Shares: {shares / 10 ** 24}</span> <br />
              <span style={{color: 'blue'}} >Total Shares: {item.shares_total_supply / 10 ** 24}</span>
            </StyledShareTotal>
          <Modal.Footer>
            <Button variant="primary" onClick={removeLiquidity}>
              Remove liquidity
            </Button>
            <Button variant="danger" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
        </>
    )
}

export default RemoveLiquidity