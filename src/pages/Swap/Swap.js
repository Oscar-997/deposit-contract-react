import styled from 'styled-components';
import {Container, Form, Row, Col, Button, ButtonGroup} from 'react-bootstrap';
import { useContext, useState } from 'react';
import {TokenResults} from '../../context/TokenResultsContext'
import ModalSelectToken from '../Pool/Components/ModalSelectToken';
import { useEffect } from 'react';
import { getAllPools } from '../../utils/getPoolPairStuff';
import BN from "bn.js";
import {utils} from 'near-api-js';
import { getConfig } from '../../services/config';
import { executeMultipleTransactions } from '../../utils/executeMultipleTransactions';

const StyledContainer = styled(Container)`
    margin: 9%;
    max-width: 800px;
`

const StyledRow = styled(Row)`
    margin: 0 0 20px 0;
`

const SelectTokenButton = styled.div`
    border: 1px solid #333;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    border-radius: 10px;
    :hover {
        color: #fff;
        background-color: #333;
    }
`

const StyledIcon = styled.img`
    width: 20px;
    heigth: 20px;
`

const getGas = (gas) => gas ? new BN(gas) : new BN('100000000000000');

const getAmount = (amount) => amount ? new BN(utils.format.parseNearAmount(amount)) : new BN('0');

const Swap = () => {

    const [token1, setToken1] = useState()
    const [token2, setToken2] = useState()
    const [amountTokenIn, setAmountTokenIn] = useState('')
    const [tokenChoice, setTokenChoice] = useState()
    const [show, setShow] = useState(false)
    const [allPools, setAllPools] = useState([])
    const [poolForSwap, setPoolForSwap] = useState({})
    const config = getConfig('testnet')

    console.log("token1", token1);

    const handleClose = () => setShow(false);
    const handleOpenModal = (e, choice) => {
        e.preventDefault();
        setTokenChoice(choice);
        setShow(true)
    }

    const getAmountTokenContract = async() => {
        const amountToken = await window.contract.get_account_balance({
            account_id: window.accountId,
            token_id: 'dai.fakes.testnet',
        })
        return amountToken
    }

    useEffect(async() => {
        setAllPools(await getAllPools())
        console.log(" token dai ",await getAmountTokenContract())
    }, [])



    const swapToken = async(poolId) => {
        let transactions = []

        transactions.unshift({
            receiverId: config.contractName,
            functionCalls: [
                {
                    methodName: 'withdraw',
                    args: {
                        token_id: token2.id,
                        amount: "0"
                    }, 
                    amount: "0.000000000000000000000001",
                    gas: "100000000000000"
                }
            ]
        })

        transactions.unshift({
            receiverId: config.contractName,
            functionCalls: [
                {
                    methodName: 'swap',
                    args: {
                        actions: [
                            {
                                pool_id: Number(poolId), 
                                token_in: token1.id,
                                amount_in: (amountTokenIn * 10 ** token1.decimals).toString(),
                                token_out: token2.id,
                                min_amount_out: '1',
                            }
                        ]
                    }, 
                    amount: "0.000000000000000000000001",
                    gas: "300000000000000",
                }
            ]
        })

        transactions.unshift({
            receiverId: token1.id,
            functionCalls: [
              {
                methodName: 'ft_transfer_call',
                args: {
                  receiver_id: config.contractName,
                  amount: (amountTokenIn * 10 ** token1.decimals).toString(),
                  msg: "",
                },
                amount: "0.000000000000000000000001",
                gas: "100000000000000",
              },
            ],
          });

        return executeMultipleTransactions(transactions)
    }

    
    const handleSwap = (add_1, add_2) => {
        for(let i of allPools) {
            if ((i.token_account_ids[0] === add_1.id && i.token_account_ids[1] === add_2.id) ||  
            (i.token_account_ids[1] === add_1.id && i.token_account_ids[0] === add_2.id)){
                setPoolForSwap(i)
                swapToken(i.pool_id)
                return
            }
        }
    }

    console.log("pool for swap: ", poolForSwap);

    return (
        <>
            <StyledContainer>
                <Form>
                    <h1>SWAP</h1>
                    <StyledRow>
                        <Col>
                            <span>
                                Balance:  {token1 ? (token1.balanceAccount / 10 ** token1.decimals) : 0}&nbsp;
                                            {token1 ? token1.symbol : null}
                            </span>
                            <input style={{ width: '100%'}} onChange={(e) => setAmountTokenIn(e.target.value)}/>
                        </Col>
                        <Col>
                            <SelectTokenButton onClick={(e) => handleOpenModal(e, 'token1')}>
                                {token1 ?
                                    <>
                                        <StyledIcon src={token1.icon ? token1.icon : 'https://i.pinimg.com/736x/ec/14/7c/ec147c4c53abfe86df2bc7e70c0181ff.jpg'}/>
                                        <span style={{margin: '0 0 0 10px'}}>{token1.symbol}</span>
                                    </>
                                : 
                                    <span>Select token</span>
                                }
                            </SelectTokenButton>
                        </Col>
                    </StyledRow>
                    <StyledRow>
                        <Col>
                            <span>
                                Balance:  {token2 ? (token2.balanceAccount / 10 ** token2.decimals) : 0}&nbsp;
                                            {token2 ? token2.symbol : null}
                            </span>
                            <input style={{ width: '100%'}} />
                        </Col>
                        <Col>
                            <SelectTokenButton onClick={(e) => handleOpenModal(e, 'token2')}>
                            {token2 ?
                                    <>
                                        <StyledIcon src={token2.icon ? token2.icon : 'https://i.pinimg.com/736x/ec/14/7c/ec147c4c53abfe86df2bc7e70c0181ff.jpg'}/>
                                        <span style={{margin: '0 0 0 10px'}}>{token2.symbol}</span>
                                    </>
                                : 
                                    <span>Select token</span>
                                }
                            </SelectTokenButton>
                        </Col>
                    </StyledRow>
                </Form>
                <Button className="mt-4" onClick={() => handleSwap(token1, token2)}>Swap</Button>
                <ModalSelectToken
                    show={show}
                    handleClose={handleClose}
                    setToken1={setToken1}
                    setToken2={setToken2}
                    tokenChoice={tokenChoice}
                />
            </StyledContainer>
        </>
    )
}

export default Swap