import React, { useState, useEffect } from 'react'
import { Button, Modal, InputGroup, FormControl } from 'react-bootstrap'

import { getGas, getAmount } from '../../utils/getFuntions'
import { formatShares } from '../../utils/getPoolPairStuff'


export default function AddLiquidity({ poolId, symbols, decimals }) {
    const [token1Amount, setToken1Amount] = useState(0)
    const [token2Amount, setToken2Amount] = useState(0)
    const [show, setShow] = useState(false);
    const [totalShares, setTotalShares] = useState(0)
    const [accountShares, setAccountShares] = useState(0)

    const contract = window.contract
    const [token1Symbol, token2Symbol] = [...symbols]
    const [token1Decimal, token2Decimals] = [...decimals]

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    // console.log(typeof poolId)

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
    const handleAddLiquidity = async () => {

        await contract.add_liquidity({
            "pool_id": poolId,
            amounts: [
                (token1Amount * 10 ** token1Decimal).toString(),
                (token2Amount * 10 ** token2Decimals).toString()
            ],
        },
            getGas("300000000000000"),
            getAmount("0.00090")
        )
    }

    const handleSetTokenAmount = (e, token) => {
        if (token === 'token1') {
            setToken1Amount(e.target.value)
        }

        if (token === 'token2') {
            setToken2Amount(e.target.value)
        }
    }

    return (
        <>
            <Button variant="success" onClick={handleShow}>Add liquidity</Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add liquidity</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup className="mb-3">
                        <InputGroup.Text id="inputGroup-sizing-default" >{token1Symbol}</InputGroup.Text>
                        <FormControl
                            aria-label="Default"
                            aria-describedby="inputGroup-sizing-default"
                            onChange={(e) => handleSetTokenAmount(e, 'token1')}
                        />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Text id="inputGroup-sizing-default" >{token2Symbol}</InputGroup.Text>
                        <FormControl
                            aria-label="Default"
                            aria-describedby="inputGroup-sizing-default"
                            onChange={(e) => handleSetTokenAmount(e, 'token2')}
                        />
                    </InputGroup>
                </Modal.Body>
                <Modal.Footer style={{ justifyContent: "space-evenly" }}>
                    <div>
                        <p style={{ color: "#FF4646" }}>Total shares: {formatShares(totalShares)}</p>
                        <p style={{ color: "#21209C" }}>Your shares: {formatShares(accountShares)}</p>
                    </div>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAddLiquidity}>
                        Add liquidity
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
