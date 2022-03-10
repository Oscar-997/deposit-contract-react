import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap'


const ButtonViewAccount = () => {
    return (
    <>
        <Button variant="danger">
            <Link to={'/'} style={{color: 'white', textDecoration: 'none'}}>
                Home
            </Link>
        </Button>
        <Button variant="success">
            <Link to={'/account'} style={{color: 'white', textDecoration: 'none'}}>
                View Contract wallet
            </Link>
        </Button>
        <Button variant="warning">
            <Link to={'/swap'} style={{color: 'black', textDecoration: 'none'}}>
                Swap
            </Link>
        </Button>
    </>
    )
}

export default ButtonViewAccount