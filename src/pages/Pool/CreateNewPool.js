import { Form, Button, Container, Row, Col, ButtonGroup, ToggleButton } from 'react-bootstrap';
import styled from 'styled-components';
import { useState, useContext } from 'react';
import { TokenResults } from '../../context/TokenResultsContext'
import { getConfig } from '../../services/config';
import { executeMultipleTransactions } from '../../utils/executeMultipleTransactions'

const StyledContainer = styled(Container)`
    margin: 9%;
    max-width: 800px;
`

const CreateNewPool = () => {

    const [token1, setToken1] = useState()
    const [token2, setToken2] = useState()

    const contract = window.contract

    const config = getConfig('testnet')

    const { result } = useContext(TokenResults) || ''

    const [radioValue, setRadioValue] = useState(0.3);

    const radios = [
        { lable: '0.2%', value: 
    0.2 },
        { lable: '0.3%', value: 0.3 },
        { lable: '0.6%', value: 0.6},
    ];

    const storageDepositAction = (accountId, amount, registrationOnly = false) => ({
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

        console.log(storageBalances);

        const transactions = storageBalances
            .reduce((acc, sb, i) => {
                if (!sb || sb.total === '0') acc.push(tokenIds[i]);
                return acc
            }, [])
            .map((id) => {
                return {
                    receiverId: id,
                    functionCalls: [storageDepositAction(contract.contractId, '0.1')],
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

    const handleSubmit = (add_1, add_2, total_fee) => {
        // console.log("Log from handleSubmit!!!")
        // console.log("token1 infor: ", add_1)
        // console.log("token2 infor: ", add_2)


        addSimpleLiquidityPool([add_1, add_2], Number(total_fee * 100))
    }
    
    return (
        <>
        <StyledContainer>
            <Form>
                <h1>Create New Pool</h1>
                <Row className="justify-content-md-center">
                    <Col>
                        <select onChange={(e) => setToken1(e.target.value)} className="form-select">
                            <option value='null'>Select Token 1</option>
                            {result.map((item, index) => {
                                return (
                                    <option key={index} value={item.id}> {item.name}</option>
                                )
                            })}
                        </select>
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
        </StyledContainer>
        </>
    )
}

export default CreateNewPool