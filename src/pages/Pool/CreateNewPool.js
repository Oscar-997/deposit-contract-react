import { Form, Button, Container, Row, Col, ButtonGroup, ToggleButton } from 'react-bootstrap';
import styled from 'styled-components';
import { useState, useContext, useEffect } from 'react';
import { TokenResults } from '../../context/TokenResultsContext'
import { getConfig } from '../../services/config';
import { executeMultipleTransactions } from '../../utils/executeMultipleTransactions'
import { getAllPools, getMetaData } from '../../utils/getPoolPairStuff';
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import AddLiquidity from '../../Components/Header/Buttons/AddLiquidity';
import RemoveLiquidity from '../../Components/Header/Buttons/RemoveLiquidity';
import ModalSelectToken from './Components/ModalSelectToken';

const StyledContainer = styled(Container)`
    margin: 9%;
    max-width: 800px;
`

const StyledRow = styled(Row)`
    margin-bottom: 20px;
    justify-content: space-between;
    align-items: center;
`

const StyledCol = styled(Col)`
    display: flex ;
    justify-content: flex-end;
    align-items: center;
`

const StyledColToken = styled(Col)`
    flex-grow: 3;
`

const WrapButtonLiquidity = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
`

const StyledTitle = styled.div`
    text-align: center;
    margin-top: 10px;
`

const StyledTokenId = styled.span`
    font-size: 0.7rem;
`

const CreateNewPool = () => {

    const [token1, setToken1] = useState()
    const [token2, setToken2] = useState()
    const [allPools, setAllPools] = useState([])
    const [poolDuplicate, setPoolDuplicate] = useState([])
    const [metadata, setMetadata] = useState([])
    const [shares, setShares] = useState()

    const contract = window.contract

    const config = getConfig('testnet')

    const { result } = useContext(TokenResults) || ''

    const [radioValue, setRadioValue] = useState(0.3);

    const radios = [
        { lable: '0.2%', value: 0.2 },
        { lable: '0.3%', value: 0.3 },
        { lable: '0.6%', value: 0.6},
    ];

    const storageDepositAction = (accountId, amount, registrationOnly = true) => ({
        methodName: 'storage_deposit',
        args: {
            account_id: accountId,
            registration_only: registrationOnly,
        },
        amount,
    })

    const ftGetStorageBalance = async(tokenId, accountId) => {
        return await window.walletConnection.account().viewFunction(tokenId, 'storage_balance_of', {account_id: accountId});
    }

    const addSimpleLiquidityPool = async (tokenIds, fee) => {
        const storageBalances = await Promise.all(
            tokenIds.map((id) => ftGetStorageBalance(id, config.contractName))
        )

        const transactions = storageBalances
            .reduce((acc, sb, i) => {
                if (!sb || sb.total === '0') acc.push(tokenIds[i]);
                return acc
            }, [])
            .map((id) => {
                return {
                    receiverId: id,
                    functionCalls: [storageDepositAction(contract.contractId, '0.00125')],
                }
            })
        
        transactions.push({
            receiverId: config.contractName,
            functionCalls: [
                {
                    methodName: 'add_simple_pool',
                    args: {tokens: tokenIds, fee},
                    amount: '0.05'
                }
            ]
        })

        console.log(transactions)

        return executeMultipleTransactions(transactions)
        
    }

    
    const formatToken = (token) => {
        return token == 1 ? token : token.toFixed(2)
    }

    const handleSubmit = (add_1, add_2, total_fee) => {
        for (let i of allPools) {
            if ((i.token_account_ids[0] === add_1 && i.token_account_ids[1] === add_2) ||  
            (i.token_account_ids[1] === add_1 && i.token_account_ids[0] === add_2)){
                setPoolDuplicate(i)
                return alert("Pool pair has exist")
            }
        }
        addSimpleLiquidityPool([add_1, add_2], Number(total_fee * 100))
    }

    // get shares
    const getShareInPool = async() => {
        const shares = await window.contract.get_pool_shares({
            pool_id: Number(poolDuplicate.pool_id),
            account_id: window.accountId,
        })

        setShares(shares);
    }

    useEffect(async() => {
        setAllPools(await getAllPools())
        setMetadata(await getMetaData())
        await getShareInPool();
    },[])

    console.log(poolDuplicate);


    return (
        <>
        <StyledContainer>
            <Form>
                <h1>Create New Pool</h1>
                <Row className="justify-content-md-center">
                    <Col>
                        {/* <select onChange={(e) => setToken1(e.target.value)} className="form-select">
                            <option value='null'>Select Token 1</option>
                            {result.map((item, index) => {
                                return (
                                    <option key={index} value={item.id}> {item.name}</option>
                                )
                            })}
                        </select> */}
                        <ModalSelectToken />
                    </Col>
                    <Col>
                        <select onChange={(e) => setToken2(e.target.value)} className="form-select">
                            <option value='null'>Select Token 2</option>
                            {result.map((item, index) => {
                                return (
                                    <option key={index} value={item.id} >{item.name}</option>
                                )
                            })}
                        </select>
                    </Col>
                </Row>
                <Row className="mt-4">
                    <Col>
                        <div>
                            <span>Total fee</span>
                        </div>
                    </Col>
                    <Col>
                        <ButtonGroup>
                            {radios.map((radio, idx) => (
                                <ToggleButton
                                    key={idx}
                                    id={`radio-${idx}`}
                                    type="radio"
                                    variant={idx % 2 ? 'outline-info' : 'outline-info'}
                                    name="radio"
                                    value={radio.value}
                                    checked={radioValue === radio.value}
                                    onChange={(e) => setRadioValue(e.currentTarget.value)}
                                >
                                    {radio.lable}
                                </ToggleButton>
                            ))}
                            <input value={radioValue}/>
                        </ButtonGroup>
                    </Col>
                </Row>
                <Button className="mt-4" onClick={() => handleSubmit(token1, token2, radioValue)}>Create</Button>
            </Form>
            { poolDuplicate.amounts ? <Card style={{ width: '18rem', margin: '9%' }}>
                <StyledTitle>
                    <h3>Pool Details</h3>
                </StyledTitle>
                { poolDuplicate.amounts && 
                    <><Card.Body>
                            <StyledRow>
                                <StyledColToken>
                                    <span style={{ color: 'green' }}>{metadata[poolDuplicate.token_account_ids[0]].symbol}</span><br />
                                    <StyledTokenId>{poolDuplicate.token_account_ids[0]}</StyledTokenId>
                                </StyledColToken>
                                <StyledCol style={{ color: 'green' }}>{poolDuplicate.amounts[0] / 10 ** metadata[poolDuplicate.token_account_ids[0]].decimals}</StyledCol>
                            </StyledRow>
                            <StyledRow>
                                <StyledColToken>
                                    <span style={{ color: 'blue' }}>{metadata[poolDuplicate.token_account_ids[1]].symbol}</span><br />
                                    <StyledTokenId>{poolDuplicate.token_account_ids[1]}</StyledTokenId>
                                </StyledColToken>
                                <StyledCol style={{ color: 'blue' }}>{poolDuplicate.amounts[1] / 10 ** metadata[poolDuplicate.token_account_ids[1]].decimals}</StyledCol>
                            </StyledRow>
                            <StyledRow>
                                <Col style={{ alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.7rem' }}>
                                    {formatToken(poolDuplicate.amounts[0] / poolDuplicate.amounts[0])} {metadata[poolDuplicate.token_account_ids[0]].symbol} = {formatToken(poolDuplicate.amounts[1] / poolDuplicate.amounts[0])} {metadata[poolDuplicate.token_account_ids[1]].symbol}
                                    </span>
                                </Col>
                                <StyledCol>
                                    <span style={{ fontSize: '0.7rem' }}>
                                    {formatToken(poolDuplicate.amounts[1] / poolDuplicate.amounts[1])} {metadata[poolDuplicate.token_account_ids[1]].symbol} = {formatToken(poolDuplicate.amounts[0] / poolDuplicate.amounts[1])} {metadata[poolDuplicate.token_account_ids[0]].symbol}
                                    </span>
                                </StyledCol>
                            </StyledRow>
                        </Card.Body><ListGroup className="list-group-flush">
                                <ListGroupItem>Fee: { poolDuplicate.total_fee / 100}%</ListGroupItem>
                                <ListGroupItem>Total shares: { poolDuplicate.shares_total_supply / 10 ** 24}</ListGroupItem>
                                {/* <ListGroupItem>Shares: {shares ? shares / 10 ** 24 : 0}</ListGroupItem>  */}
                            </ListGroup><WrapButtonLiquidity>
                                    <AddLiquidity poolId={poolDuplicate.pool_id} metaData={metadata} poolInfo={poolDuplicate}/>
                                    <RemoveLiquidity poolId={poolDuplicate.pool_id} metaData={metadata} poolInfo={poolDuplicate}/>
                            </WrapButtonLiquidity></>
                    
                }
            </Card>  : null
        }
        </StyledContainer>
        </>
    )
}

export default CreateNewPool