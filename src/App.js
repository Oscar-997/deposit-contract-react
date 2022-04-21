import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home'
import Account from './pages/Account/Account';
import Swap from './pages/Swap/Swap';
import CreateNewPool from './pages/Pool/CreateNewPool';
import Header from './Components/Header/Header';
import styled from 'styled-components';
import ViewPools from './pages/Pool/ViewPools';
import YourLiquidity from './pages/Pool/YourLiquidity';
import PoolDetail from './pages/Pool/PoolDetail';

const AppWrapper = styled.div`
    display: flex;
    flex-flow: column;
    align-items: flex-start;
`

const HeaderWrapper = styled.div`
    ${({ theme }) => theme.flexRowNoWrap}
    width: 100%;
    justify-content: space-between;
    position: fixed;
    top: 0;
    z-index: 2;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 120px 16px 0px;
  align-items: center;
  flex: 1;
  z-index: 1;
  min-height: calc(100vh - 100px);
`

const App = () => {
  const isLogged = window.walletConnection.isSignedIn()
  return (
    <AppWrapper>
      <HeaderWrapper>
        <Header></Header>
      </HeaderWrapper>
      { isLogged ?
        (<BodyWrapper>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path="/account" element={<Account/>}/>
          <Route path="/swap" element={<Swap/>}/>
          <Route path="/create-pool" element={<CreateNewPool/>}/>
          <Route path="/view-pools" element={<ViewPools/>}/>
          <Route path='/your-liquidity' element={<YourLiquidity/>}/>
          <Route path='/pool-detail/:poolId' element={<PoolDetail/>}/>
        </Routes>
      </BodyWrapper>)
        : (
        <BodyWrapper>
          <h1>Wellcome Oscar Exchange</h1>
          <h1>Please Connect your wallet</h1>
        </BodyWrapper>
        )
      }
    </AppWrapper>
  );
}

export default App;
