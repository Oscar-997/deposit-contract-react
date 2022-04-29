import { Button, Modal, InputGroup, FormControl } from 'react-bootstrap';
import { useContext, useState } from 'react';
import { getConfig } from '../../../services/config';
import { executeMultipleTransactions } from '../../../utils/executeMultipleTransactions';
import { TokenResults } from '../../../context/TokenResultsContext';
import styled from 'styled-components'

const ModalAddToken = () => {

  const [tokenId, setTokenId] = useState('')
  const [show, setShow] = useState(false)
  const [filterToken, setFilterToken] = useState('')
  const config = getConfig('testnet')
  
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { result } = useContext(TokenResults)
  
  const handleSetTokenId = (e) => {
    setTokenId(e.target.value)
  }

  const ftGetStorageBalance = async(tokenId, accountId) => {
      return await window.walletConnection.account().viewFunction(tokenId, 'storage_balance_of', {account_id: accountId});
  }

  // check Account for contract
  const checkAccToContract = async () => {
    let checkAcc = await window.walletConnection.account().viewFunction(config.contractName, "storage_balance_of", { account_id: window.accountId })
    console.log("Check Account balance: ", checkAcc);
    return checkAcc
  }

  const regisAndStorageDepo = async(tokenId) => {
    let transactions = []

    transactions.unshift({
        receiverId: config.contractName,
        functionCalls: [
            {
                methodName: 'register_tokens',
                args: {
                    token_ids: [tokenId.toString()]
                },
                amount: "0.000000000000000000000001",
                gas: "100000000000000",
            }
        ]
    })

    if(await ftGetStorageBalance(tokenId, config.contractName) === null) {
      transactions.unshift({
        receiverId: tokenId,
        functionCalls: [
          {
            methodName: 'storage_deposit',
            args: {
              account_id: config.contractName,
              registration_only: true,
            },
            amount: "0.00125",
            gas: "100000000000000",
          },
        ],
      });
    }

    if (await checkAccToContract() === null) {
      transactions.unshift({
        receiverId: config.contractName,
        functionCalls: [
          {
            methodName: 'storage_deposit',
            args: {
              registration_only: false,
            },
            amount: "0.01",
            gas: "100000000000000",
          }
        ]
      })
    }

    return executeMultipleTransactions(transactions)
    
  }

  return (
    <>
      <Button variant="outline-info" onClick={handleShow}>
        Add Token
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
            <InputGroup className="mb-3">
                <FormControl
                aria-label="Example text with button addon"
                aria-describedby="basic-addon1"
                placeholder="Search for Token ID, Token Symbol"
                value={filterToken}
                onChange={(e) =>setFilterToken(e.target.value)}
                />
            </InputGroup>
            {filterToken ? 
              result.map((tokenInfo, index) => {
                if(tokenInfo.symbol.includes(filterToken.toUpperCase()) || tokenInfo.id.includes(filterToken)) {
                  if(tokenInfo.balanceAccount > 0) {
                    return (
                      <>
                        <StyledWrappToken key={index}>
                          <StyledToken>
                              <StyledTokenIcon src={tokenInfo.icon ? tokenInfo.icon : 'https://i.pinimg.com/736x/ec/14/7c/ec147c4c53abfe86df2bc7e70c0181ff.jpg'}></StyledTokenIcon>
                              <StyleTokenInfo>
                                <StyledTokenSymbol>{tokenInfo.symbol}</StyledTokenSymbol>
                                <StyledTokenId>{tokenInfo.id}</StyledTokenId>
                              </StyleTokenInfo>
                          </StyledToken>
                          <StyledButtonImport variant='info' onClick={() => regisAndStorageDepo(tokenInfo.id)}>Import</StyledButtonImport>
                        </StyledWrappToken>
                      </>
                    )
                  }
                }
              })
             :
             <span>Please enter your token id or token symbol</span>
            }
        </Modal.Body>
      </Modal>
    </>
  );
}

const StyledWrappToken = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 0 10px 0;
  border: 1px solid #333;
`

const StyledToken = styled.div`
  display: flex;
  align-items: center;
`

const StyledTokenIcon = styled.img`
  width: 20px;
  height: 20px
`

const StyledTokenId = styled.div`

`

const StyledButtonImport = styled(Button)`
  border: none;
  margin: 4px 4px 4px 0;
`

const StyleTokenInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 0 0 10px;
`

const StyledTokenSymbol = styled.div`
`

export default ModalAddToken