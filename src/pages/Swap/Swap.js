import styled from 'styled-components';
import {Container, Form, Row, Col, Button, ButtonGroup} from 'react-bootstrap';
import { useContext, useState } from 'react';
import {TokenResults} from '../../context/TokenResultsContext'


const StyledContainer = styled(Container)`
    margin: 9%;
    max-width: 800px;
`

const StyledRow = styled(Row)`
    margin: 0 0 20px 0;
`

const Swap = () => {

    const [balanceToken1, setBalanceToken1] = useState(0)
    const [decimalsToken1, setDecimalsToken1] = useState(0)
    const [symbolToken1, setSymbolToken1] = useState('')

    const [balanceToken2, setBalanceToken2] = useState(0)
    const [decimalsToken2, setDecimalsToken2] = useState(0)
    const [symbolToken2, setSymbolToken2] = useState('')

    const { result } = useContext(TokenResults) || ''

    console.log("result: ", result);

    const getInfoToken1 = (e) => { 
        const selectedToken1 = result.filter(token => token.symbol === e.target.value)[0]
        setBalanceToken1(selectedToken1.balanceAccount)
        setDecimalsToken1(selectedToken1.decimals)
        setSymbolToken1(selectedToken1.symbol)
    }

    const getInfoToken2 = (e) => {
        const selectedToken2 = result.filter(token => token.symbol === e.target.value)[0]

        setBalanceToken2(selectedToken2.balanceAccount)
        setDecimalsToken2(selectedToken2.decimals)
        setSymbolToken2(selectedToken2.symbol)
    }

    const handleSwap = () => {
        
    }

    return (
        <>
            <StyledContainer>
                <Form>
                    <h1>SWAP</h1>
                    <StyledRow>
                        <Col>
                            <span>
                                Balance:  {balanceToken1 / 10 ** decimalsToken1 ? balanceToken1 / 10 ** decimalsToken1 : 0}&nbsp;
                                        {symbolToken1}
                            </span>
                            <input style={{ width: '100%'}}/>
                        </Col>
                        <Col>
                            <select style={{ width: '100%', height: '100%'}} onChange={getInfoToken1}>
                                <option >Select token 1</option>
                                {result.map((item, index) => {
                                    return (
                                        <option key={index} value={item.symbol}>{item.symbol}</option>
                                    )
                                })}
                            </select>
                        </Col>
                    </StyledRow>
                    <StyledRow>
                        <Col>
                            <span>
                                Balance:  {balanceToken2 / 10 ** decimalsToken2 ? balanceToken2 / 10 ** decimalsToken2 : 0}&nbsp;
                                        {symbolToken2}
                            </span>
                            <input style={{ width: '100%'}}/>
                        </Col>
                        <Col>
                            <select style={{ width: '100%', height: '100%'}} onChange={getInfoToken2}>
                                <option>Select token 2</option>
                                {result.map((item, index) => {
                                    return (
                                        <option key={index} value={item.symbol}>{item.symbol}</option>
                                    )
                                })}
                            </select>
                        </Col>
                    </StyledRow>
                </Form>
                <Button className="mt-4" >Swap</Button>
            </StyledContainer>
        </>
    )
}

export default Swap