import { Table, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import Deposit from '../../Components/Header/Buttons/Deposit'
import Register from '../../Components/Header/Buttons/Register'
import { getConfig } from '../../services/config';
import axios from 'axios';
import { connect, Contract, keyStores, WalletConnection } from 'near-api-js';
import { useNear } from '../../hooks/useNear';

const config = getConfig('testnet')

const Account = () => {
    const { getNear } = useNear();
    const [result, setResult] = useState([])
    let obj = {};
    const contract = window.contract;
    const accountId = window.accountId;

    const getBalanceOf = async () => {
        let depo = await contract.get_deposits({ account_id: accountId })
        const tokens = await fetch(
            `${config.helperUrl}/account/${accountId}/likelyTokens`
        )
            .then((response) => response.json())
            .then((tokens) => tokens);

        for (let i of tokens) {
            let balanceOfWallet = await window.walletConnection.account().viewFunction(i, "ft_balance_of", { account_id: accountId })
                .catch((err) => {
                    return {
                        isFailed: true
                    }
                });
            if (balanceOfWallet.isFailed) {
                continue
            }

            let metaData = await window.walletConnection.account().viewFunction(i, "ft_metadata")
            // console.log('here', metaData);
            obj = {
                id: i,
                name: metaData.name,
                balanceAccount: balanceOfWallet,
                symbol: metaData.symbol,
                decimals: metaData.decimals,
            }

            let storageBalanceOf = await window.walletConnection.account().viewFunction(i, "storage_balance_of", {account_id: config.contractName })
            
            if (storageBalanceOf !== null) {
                obj.checkRegis = true
            }

            for (let i2 in depo) {
                if (i === i2) {
                    obj.balanceContract = depo[i]
                }
            }
            setResult((data) => [...data, obj]);
        }

    }


    // const testing = async () => {
    //     const walletConnection = await getNear(config);
    //     const account = await walletConnection.getAccountId()

    //     const contract = new Contract(walletConnection.account(), "dev-1646701624418-65193707375662", {
    //         viewMethods: ['get_deposits'],
    //         changeMethods: ['new', 'create_new_pool', 'add_liquidity'],
    //     });

    //     const tokens = await fetch(
    //         `${config.helperUrl}/account/${account}/likelyTokens`
    //     )
    //         .then((response) => response.json())

    //     for (let i of tokens) {
    //         let balanceOfWallet = await walletConnection.account().viewFunction(i, "ft_balance_of", { account_id: account })
    //             .catch((err) => {
    //                 return {
    //                     isFailed: true
    //                 }
    //             });
    //         if (balanceOfWallet.isFailed) {
    //             continue
    //         }

    //         let metaData = await walletConnection.account().viewFunction(i, "ft_metadata")

    //         obj = {
    //             id: i,
    //             name: metaData.name,
    //             balanceAccount: balanceOfWallet * (10 ** -8),
    //             symbol: metaData.symbol,
    //         }

    //         for (let i2 in contract) {
    //             if (i === i2) {
    //                 obj.balanceContract = contract[i] * (10 ** -8)
    //             }
    //         }
    //         console.log('123');
    //         setResult((data) => [...data, obj]);
    //     }
    // }
    useEffect(() => {
        // testing()
        getBalanceOf()
        // await axios.get("http://localhost:5000/token").then(rep => console.log('rep', rep.data));
        // await axios.post("http://localhost:5000/token", {
        //     name: "Haha token",
        //     id: "123",
        //     value: {
        //         id: "123",
        //         name: "haha token",
        //         symbol: result.symbol,
        //         decimals: result.decimals,
        //         icon: ""
        //     }
        // }).then(rep => console.log('rep', rep.data.result));
    }, [])
    return (
        <Container fluid>
            <h1>Contract wallet</h1>
            <Table striped hover bordered responsive>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Symbol</th>
                        <th>Token name</th>
                        <th>Token ID</th>
                        <th>Amount in wallet Account</th>
                        <th>Amount in Contract</th>
                        <th>Decimals</th>
                        <th>Deposit</th>
                    </tr>
                </thead>
                <tbody>
                    {result.map((item, index) => {
                        return (
                            <tr key={index}>
                                <td>{++index}</td>
                                <td>{item.symbol}</td>
                                <td>{item.name}</td>
                                <td>{item.id}</td>
                                <td>{item.balanceAccount * (10 ** -item.decimals) ? item.balanceAccount * (10 ** -item.decimals) : 0}</td>
                                <td>{item.balanceContract * (10 ** -item.decimals) ? item.balanceContract * (10 ** -item.decimals) : 0}</td>
                                <td>{item.decimals}</td>
                                <td>
                                    {!item.checkRegis && <Register item={item} />}
                                    {item.checkRegis && <Deposit item={item}/>}
                    
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </Container>
    )
}

export default Account