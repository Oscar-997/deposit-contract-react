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

    a {
        padding: 12px 16px;
        text-decoration: none;
        display: block;
        cursor: pointer;
        color: inherit;
        &:hover {
            background-color: rgba(21, 61, 111, 1);
        }
    }

    a:first-child{
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
    }
    a:last-child {
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
    }
`

const MenuDropdown = styled.div`
    display: none;
    position: absolute;
    background-color: rgba(21, 61, 111, 0.8);
    border: 1px solid rgba(21, 61, 111, 0.44);
    width: 200px;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    color: white;
    z-index: 1;
    border-radius: 10px;
    margin-top: 4px;
    left: -70%;
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
                    View Contract wallet
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
                    <Link to={'/create-pool'}>Create New Pool</Link>
                    <Link to={'/view-pools'}>View Pools</Link>
                    <Link to={'/liquidity'}>Your liquidity</Link>
                </MenuDropdown>
            </WrapButtonPool>
        </>
    )
}

export default ButtonViewAccount