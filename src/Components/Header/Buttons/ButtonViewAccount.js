import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import styled from 'styled-components';

const WrapButtonPool = styled.div`
    position: relative;
    &:hover > .pool-list{
        display: block
    }
    &::before {
        content: "";
        display: block;
        position: absolute;
        width: 100%;
        height: 4px;
        top: 38px;
    }
`

const MenuDropdown = styled.div`
    display: none;
    position: absolute;
    background-color: #525E75;
    border: 1px solid rgba(21, 61, 111, 0.44);
    left: -80%;
    width: 200px;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
    border-radius: 10px;
    margin-top: 4px;


    

    a {
        color: #FFF6EA;
        text-decoration: none;
    }

    div:first-child {
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
    }

    div:last-child {
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
    }
`

const ItemDropdown = styled.div`
    padding: 12px 16px;
    display: block;
    cursor: pointer;
    &:hover {
        background-color: #FFF6EA;
    }
    &:hover a {
        color: #3A3845;
    }
`

const ButtonViewAccount = () => {
    return (
        <>
            <Button variant="danger">
                <Link to={'/'} style={{ color: 'white', textDecoration: 'none' }}>
                    Home
                </Link>
            </Button>
            <Button variant="success">
                <Link to={'/account'} style={{ color: 'white', textDecoration: 'none' }}>
                    Account Details
                </Link>
            </Button>
            <Button variant="warning">
                <Link to={'/swap'} style={{ color: 'black', textDecoration: 'none' }}>
                    Swap
                </Link>
            </Button>
            <WrapButtonPool>
                <Button variant="info">Pool</Button>
                <MenuDropdown className='pool-list'>
                    <ItemDropdown>
                        <Link to={'/create-pool'}>Create new pool</Link>
                    </ItemDropdown>
                    <ItemDropdown>
                        <Link to={'/view-pools'}>View pools</Link>
                    </ItemDropdown>
                </MenuDropdown>
            </WrapButtonPool>
        </>
    )
}

export default ButtonViewAccount