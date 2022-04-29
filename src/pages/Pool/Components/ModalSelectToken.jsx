import { Button, Modal, FormControl, InputGroup } from 'react-bootstrap';
import { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import ModalAddToken from './ModalAddToken';
import { TokenResults } from '../../../context/TokenResultsContext'
import { getConfig } from '../../../services/config';

const ModalSelectToken = ({show, handleClose, setToken1, setToken2, tokenChoice}) => {
    const [importTokenList, setImportTokenList] = useState([])
    const config  = getConfig('testnet')

    const { result } = useContext(TokenResults)

    const handleChoiceToken = (tokenGet) => {
        if(tokenChoice === 'token1') {
            setToken1(tokenGet)
        } else if (tokenChoice === 'token2') {
            setToken2(tokenGet)
        }
        handleClose()
    }
    
    const getImportedTokenInfo = async() => {
        let tokenImport = [];

        let tokensInContract = await window.contract.get_deposited_tokens({
            account_id: window.accountId
        })

        for (let i of Object.keys(tokensInContract)) {
            let balanceOfWallet = await window.walletConnection.account().viewFunction(i, "ft_balance_of", {account_id: window.accountId})
                .catch((err) => {
                    return {
                        isFailed: true
                    }
                });
            if (balanceOfWallet.isFailed) {
                continue
            }

            let metadata = await window.walletConnection.account().viewFunction(i, "ft_metadata", {account_id: window.accountId})
            let obj = {
                id: i,
                name: metadata.name,
                balanceAccount: balanceOfWallet,
                symbol: metadata.symbol,
                decimals: metadata.decimals,
                icon: metadata.icon,
            }

            let storageBalanceOf = await window.walletConnection.account().viewFunction(i, "storage_balance_of", {account_id: config.contractName })
            
            if (storageBalanceOf !== null) {
                obj.checkRegis = true
            }else {
                obj.checkRegis = false
            }

            tokenImport.push(obj)
        }
        return tokenImport
    }

    
    useEffect(async() => {
        setImportTokenList(await getImportedTokenInfo())
    },[])

    return (
        <>

        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
            <Modal.Title>Select token</Modal.Title>
            </Modal.Header>
                <Modal.Body>
                <InputGroup className="mb-3">
                    <FormControl
                    aria-label="Example text with button addon"
                    aria-describedby="basic-addon1"
                    placeholder='Search token'
                    />&nbsp;&nbsp;&nbsp;
                    <ModalAddToken />
                </InputGroup>
                    {importTokenList.map((token, index) => {
                        return (
                            <>  
                            <StyledWrappToken onClick={() => handleChoiceToken(token)}>
                                <StyledTokenIcon src={token.icon ? token.icon : 'https://i.pinimg.com/736x/ec/14/7c/ec147c4c53abfe86df2bc7e70c0181ff.jpg'}></StyledTokenIcon>
                                <StyledWrappTokenInfo>
                                    <StyledToken>{token.symbol}</StyledToken>
                                    <StyledTokenBalance>{(token.balanceAccount / 10 ** token.decimals).toFixed(2)}</StyledTokenBalance>
                                </StyledWrappTokenInfo>
                            </StyledWrappToken>
                            </>
                        )
                    })}
                </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            <Button variant="primary">Approve</Button>
            </Modal.Footer>
        </Modal>
        </>
    );
}

const StyledWrappToken = styled.div`
    display: flex;
    border: 1px solid #333;
    margin: 0 0 10px 0;
    padding: 4px 8px;
    :hover {
        color: white;
        background-color: black;
        cursor: pointer;
    }
`
const StyledTokenBalance = styled.div`

`


const StyledTokenSelectButton = styled.div`
    border: 1px solid;
    border-radius: 5px;
    width: 100%; 
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    :hover {
        background-color: #333;
        color: #fff;
    }
`

const StyledToken = styled.div`
    
`

const StyledTokenIcon = styled.img`
  width: 20px;
  height: 20px
`

const StyledWrappTokenInfo = styled.div`
    display: flex;
    justify-content: space-between;
    flex: 1;
    margin: 0 0 0 10px;
`

export default ModalSelectToken