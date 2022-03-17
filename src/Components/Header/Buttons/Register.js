import { Button } from "react-bootstrap"
import { getConfig } from "../../../services/config"

const Register = () => {
    const config = getConfig('testnet')
    const tokenContract = window.tokenContract

    const storageDeposit = async () => {
        await tokenContract.storage_deposit({
          account_id: config.contractName
        },
        "300000000000000",
        "12500000000000000000000",
        )
      }

    // const storageDeposit = async () => {
  //   const walletConnection = await getNear(configToken);
  //   const tokenContract = new Contract(walletConnection.account(), item.id, {
  //     viewMethods: ['ft_total_supply', 'ft_balance_of'],
  //     changeMethods: ['ft_transfer', 'ft_transfer_call', 'storage_deposit']
  //   });

  //   await tokenContract.storage_deposit({
  //     account_id: config.contractName,
  //   },
  //     "0.0125",
  //     "100000000000000"
  //   )

  // }

    const registerToken = async () => {
        // let transactions = []
        
        // transactions.unshift({
        //       receiverId: id,
        //       functionCalls: [
        //         {
        //           methodName: 'storage_deposit',
        //           args: {
        //             account_id: config.contractName
        //           },
        //           gas: "100000000000000",
        //           amount: "0.0125",
        //         },
        //       ]
        //     })
            await storageDeposit().then((da) => console.log(da))
    }



    return (
        <>
        <Button variant="danger" onClick={storageDeposit}>
            Register
        </Button>
        </>
        
    )
}

export default Register