import Header from './Components/Header';
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

const App = () => {
  return (
    <AppWrapper>
      <HeaderWrapper>
        <Header></Header>
      </HeaderWrapper>
    </AppWrapper>
  );
}

export default App;
