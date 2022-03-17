import styled from "styled-components/macro"
import { Button } from "react-bootstrap"
import ButtonViewAccount from "../Buttons/ButtonViewAccount"
import { useContext } from 'react'
import { AuthContext } from '../../../context/authContext'
// import { useNear } from "../../../hooks/useNear"
// import {config} from "./config"

const DetailCover = styled.div`
    display: flex;
    flex-direction: row;
    -webkit-box-align: center;
    align-items: center;
    justify-self: flex-end;
    `

const DetailFlex = styled.div`
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    gap: 5px;
    `
const AccountDetails = () => {
    // const nearConfig = getConfig(process.env.NODE_ENV || 'development');
    // const { getNear } = useNear();


    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext)

    const login = async () => {
        await window.walletConnection.requestSignIn()
    }

    const logout = () => {
        window.walletConnection.signOut()
        setIsLoggedIn(false)
        /*global event, fdescribe*/
        /*eslint no-restricted-globals: ["error", "event", "fdescribe"]*/
        location.reload()
    }

    return (
        <DetailCover>
            <DetailFlex>
                {!isLoggedIn && <Button onClick={login}>Connect to NEAR wallet</Button>}
                {isLoggedIn &&
                    <>
                        <Button variant="info">Account name: {window.accountId}</Button>
                        <ButtonViewAccount></ButtonViewAccount>
                        <Button variant="dark" onClick={logout}> Logout</Button>
                    </>}
            </DetailFlex>
        </DetailCover>
    )
}

export default AccountDetails