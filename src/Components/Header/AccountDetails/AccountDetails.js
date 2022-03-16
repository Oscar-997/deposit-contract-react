import styled from "styled-components/macro"
import { Button } from "react-bootstrap"
import ButtonViewAccount from "../Buttons/ButtonViewAccount"
import { login, logout } from '../../../services/near'
import { useContext } from 'react'
import { AuthContext } from '../../../context/authContext'
import { getConfig } from "../../../services/config"
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
    const accountId = window.accountId
    const config = getConfig('testnet')
    const contract = window.contract
    

    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext)

    const storageDeposit = async () => {
        await contract.storage_deposit({
          account_id: accountId
        },
        "300000000000000",
        "12500000000000000000000",
        )
      }

    const registerAccount = async () => {
        let storageBalanceOf = await window.walletConnection.account().viewFunction(config.contractName, "storage_balance_of", {account_id: accountId})
        console.log(storageBalanceOf)
        if (storageBalanceOf == null) {
           await storageDeposit()
        }
    }

    const login = async () => {
        window.walletConnection.requestSignIn()
        await registerAccount()
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
                        <Button variant="info">{window.accountId}</Button>
                        <ButtonViewAccount></ButtonViewAccount>
                        <Button variant="dark" onClick={logout}> Logout</Button>
                    </>}
            </DetailFlex>
        </DetailCover>
    )
}

export default AccountDetails