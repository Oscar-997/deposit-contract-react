import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap'


const ButtonViewAccount = () => {
    return (
    <>
        <Button>
            <Link to={'/'} style={{color: 'white', textDecoration: 'none'}}>
                Home
            </Link>
        </Button>
        <Button>
            <Link to={'/account'} style={{color: 'white', textDecoration: 'none'}}>
                View Contract wallet
            </Link>
        </Button>
    </>
    )
}

export default ButtonViewAccount