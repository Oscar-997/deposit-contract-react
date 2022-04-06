import React, { useState, useEffect } from 'react'
import { Button, Modal, InputGroup, FormControl } from 'react-bootstrap'

import { getGas, getAmount } from '../../utils/getFuntions'
export default function RemoveLiquidity({ poolId }) {
    const contract = window.contract
    const [amountSharesRemove, setAmountSharesRemove] = useState(0)
    const [totalShares, setTotalShares] = useState(0)
    const [accountShares, setAccountShares] = useState(0)
    const [show, setShow] = useState(false);


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleRemoveAmount = (amount) => {
        setAmountSharesRemove(amount)
    }

    const handleRemoveLiquidity = async () => {

        await contract.remove_liquidity({
            "pool_id": poolId,
            shares: amountSharesRemove.toString(),
            min_amounts: ["0", "0"]
        },
            getGas("300000000000000"),
            getAmount("0.000000000000000000000001")
        )
    }

    useEffect(() => {
        const getTotalShares = async (poolId) => {
            const totalShares = await contract.get_pool_total_shares({
                pool_id: poolId
            })
            setTotalShares(totalShares)
        }

        const getAccountSharesInPool = async (poolId, accountId) => {
            const accountSharesInPool = await contract.get_account_shares_in_pool({
                pool_id: poolId,
                account_id: accountId
            })
            setAccountShares(accountSharesInPool)
        }

        getTotalShares(poolId)
        getAccountSharesInPool(poolId, window.accountId)

    })
    return (
        <>
            <Button variant='danger' onClick={handleShow}>Remove liquidity</Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Remove liquidity</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup className="mb-3">
                        <InputGroup.Text id="inputGroup-sizing-default" >Share</InputGroup.Text>
                        <FormControl
                            aria-label="Default"
                            aria-describedby="inputGroup-sizing-default"
                            onChange={(e) => handleRemoveAmount(e.target.value)}
                        />
                    </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                    <div>
                        <p>Total shares: {totalShares}</p>
                        <p>Your shares: {accountShares}</p>
                    </div>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleRemoveLiquidity}>
                        Remove liquidity
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
