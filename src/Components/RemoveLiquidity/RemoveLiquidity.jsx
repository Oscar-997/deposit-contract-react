import React, { useState, useEffect } from 'react'
import { Button, Modal, InputGroup, FormControl } from 'react-bootstrap'
import { parseNearAmount, formatNearAmount } from 'near-api-js/lib/utils/format'

import { getGas, getAmount } from '../../utils/getFuntions'
import { formatShares } from '../../utils/getPoolPairStuff'
import { makeTokenReadable, amountWithSlippage } from '../../utils/Views'
export default function RemoveLiquidity({ poolId, pool, decimals }) {
    const contract = window.contract
    const [amountSharesRemove, setAmountSharesRemove] = useState(0)
    const [totalShares, _] = useState(pool.shares_total_supply)
    const [accountShares, setAccountShares] = useState(0)
    const [show, setShow] = useState(false);
    const [minTokenOut, setMinTokenOut] = useState([])
    const [slippage, setSlippage] = useState(1)

    const slippageTolerance = [
        0.1,
        0.5,
        1
    ]

    const handleShow = () => setShow(true);
    const handleClose = () => {
        setMinTokenOut([])
        setAmountSharesRemove(0)
        setShow(false);
    }


    const handleRemoveAmount = async (amount) => {
        handleMinAmountChange(amount, slippage)
        setAmountSharesRemove(amount)
        // if (!!amount && amount !== 0) {
        //     const remove_predict = await contract.predict_remove_liquidity({
        //         pool_id: poolId, shares: (parseNearAmount(amount)).toString()
        //     })

        //     const minTokenOut = Object.values({
        //         token1Amount: amountWithSlippage(makeTokenReadable(remove_predict[0], decimals[0]), slippage),
        //         token2Amount: amountWithSlippage(makeTokenReadable(remove_predict[1], decimals[1]), slippage),
        //     }).map(amount => amount.toString())
        //     // console.log(Object.values(minTokenOut))
        //     setMinTokenOut(minTokenOut)
        //     setAmountSharesRemove(amount)
        // } else {
        //     setAmountSharesRemove(0)
        // }
    }

    const handleMinAmountChange = async (amount, slippage) => {
        if (!!amount && amount !== 0) {
            const remove_predict = await contract.predict_remove_liquidity({
                pool_id: poolId, shares: (parseNearAmount(amount)).toString()
            })

            const minTokenOut = Object.values({
                token1Amount: amountWithSlippage(makeTokenReadable(remove_predict[0], decimals[0]), slippage),
                token2Amount: amountWithSlippage(makeTokenReadable(remove_predict[1], decimals[1]), slippage),
            }).map(amount => amount.toString())
            setMinTokenOut(minTokenOut)
        }
    }

    const handleRemoveLiquidity = async () => {
        await contract.remove_liquidity({
            "pool_id": poolId,
            shares: (amountSharesRemove * 10 ** 24).toLocaleString('fullwide', { useGrouping: false }),
            min_amounts: minTokenOut
        },
            getGas("300000000000000"),
            getAmount("0.000000000000000000000001")
        )
    }

    const handleRadio = (value) => {
        handleMinAmountChange(amountSharesRemove, value)
        setSlippage(value)
        // handleRemoveAmount(amountSharesRemove, +e.target.value)
    }

    useEffect(() => {
        const getAccountSharesInPool = async (poolId, accountId) => {
            const accountSharesInPool = await contract.get_account_shares_in_pool({
                pool_id: poolId,
                account_id: accountId
            })
            setAccountShares(accountSharesInPool)
        }

        getAccountSharesInPool(poolId, window.accountId)
    }, [])


    const style = {
        marginRight: 5
    }
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
                    {

                        amountSharesRemove > 0 ?
                            <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                                {
                                    minTokenOut.map((amount, index) => (
                                        <span key={index} style={style}>Token {index + 1}: {amount}</span>
                                    ))
                                }
                            </div> : null
                    }

                    <div style={{ display: 'flex', justifyContent: "space-evenly", alignContent: "center", width: "100%", }}>
                        {
                            slippageTolerance.map((row, index) => (
                                <div key={index}>
                                    <input checked={row === slippage} onChange={(e) => handleRadio(+e.target.value)} style={style} id={`slip${index + 1}`} type="radio" name="slip" value={row} />
                                    <label htmlFor={`slip${index + 1}`}>{row}%</label>
                                </div>
                            ))
                        }

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div>
                        <p style={{ color: "#FF4646" }}>Total shares: {formatShares(totalShares)}</p>
                        <p style={{ color: "#21209C" }}>Your shares: {formatShares(accountShares)}</p>
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
