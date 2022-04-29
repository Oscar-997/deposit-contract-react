import styled from 'styled-components';
import { Card , ListGroup, ListGroupItem, Row, Col} from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getMetaData } from '../../utils/getPoolPairStuff';
import AddLiquidity from '../../Components/Header/Buttons/AddLiquidity';
import RemoveLiquidity from '../../Components/Header/Buttons/RemoveLiquidity';

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

const PoolDetail = () => {
    const [metadata, setMetadata] = useState({});
    const [shares, setShares] = useState(0)

    const { poolId } = useParams();
    const [poolInfo, setPoolInfo] = useState({});

    const contract = window.contract;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getPoolInfo = async() => {
        
        const poolInfo = await contract.get_pool({
            pool_id: Number(poolId),
        })
        setPoolInfo(poolInfo);
    }

    console.log("pool info", poolInfo);

    // get shares
    const getShareInPool = async() => {
        const shares = await window.contract.get_pool_shares({
            pool_id: Number(poolId),
            account_id: window.accountId,
        })

        setShares(shares);
    }

    const formatToken = (token) => {
        return token == 1 ? token : token.toFixed(2)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async() => {
        setMetadata(await getMetaData());
        await getPoolInfo();
        await getShareInPool();
    },[])

    return (
        <>
        { poolInfo.amounts &&  <Card style={{ width: '18rem' }}>
            <StyledTitle>
                <h3>Pool Details</h3>
            </StyledTitle>
                <Card.Body>
                    <StyledRow>
                            <StyledColToken>
                                <span style={{ color: 'green'}}>{metadata[poolInfo.token_account_ids[0]].symbol}</span><br />
                                <StyledTokenId>{poolInfo.token_account_ids[0]}</StyledTokenId>
                            </StyledColToken>
                            <StyledCol style={{ color: 'green'}}>{poolInfo.amounts[0] / 10 ** metadata[poolInfo.token_account_ids[0]].decimals}</StyledCol>
                    </StyledRow>
                    <StyledRow>
                            <StyledColToken>
                                <span style={{ color: 'blue'}}>{metadata[poolInfo.token_account_ids[1]].symbol}</span><br />
                                <StyledTokenId>{poolInfo.token_account_ids[1]}</StyledTokenId>
                            </StyledColToken>
                            <StyledCol style={{ color: 'blue'}}>{poolInfo.amounts[1] / 10 ** metadata[poolInfo.token_account_ids[1]].decimals}</StyledCol>
                    </StyledRow>
                    <StyledRow>
                        <Col style={{ alignItems: 'center' }}>
                            <span style={{ fontSize: '0.7rem'}}>
                                {formatToken(poolInfo.amounts[0] / poolInfo.amounts[0])} {metadata[poolInfo.token_account_ids[0]].symbol} = {formatToken(poolInfo.amounts[1] / poolInfo.amounts[0])} {metadata[poolInfo.token_account_ids[1]].symbol}
                            </span>
                        </Col>
                        <StyledCol>
                            <span style={{ fontSize: '0.7rem'}}>
                                {formatToken(poolInfo.amounts[1] / poolInfo.amounts[1])} {metadata[poolInfo.token_account_ids[1]].symbol} = {formatToken(poolInfo.amounts[0] / poolInfo.amounts[1])} {metadata[poolInfo.token_account_ids[0]].symbol}
                            </span>
                        </StyledCol>
                    </StyledRow>
                </Card.Body>
                <ListGroup className="list-group-flush">
                    <ListGroupItem>Fee : { poolInfo.total_fee / 100}%</ListGroupItem>
                    <ListGroupItem>Total shares: { poolInfo.shares_total_supply / 10 ** 24}</ListGroupItem>
                    <ListGroupItem>Shares: {shares / 10 ** 24}</ListGroupItem>
                </ListGroup>
                <WrapButtonLiquidity>
                    <AddLiquidity poolId={poolId} metaData={metadata} poolInfo={poolInfo}/>
                    <RemoveLiquidity poolId={poolId} metaData={metadata} poolInfo={poolInfo}/>
                </WrapButtonLiquidity>
            </Card> 
        }
        </>
    )
}
export default PoolDetail
