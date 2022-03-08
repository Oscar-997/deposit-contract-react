import Header from './Components/Header/Header';
import Body from './Components/Body/Body';
import styled from 'styled-components';

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
  return (
    <AppWrapper>
      <HeaderWrapper>
        <Header></Header>
      </HeaderWrapper>
      <BodyWrapper>
        <Body></Body>
      </BodyWrapper>
    </AppWrapper>
  );
}

export default App;
