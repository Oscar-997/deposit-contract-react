import { functionCall, createTransaction } from 'near-api-js/lib/transaction';
import { baseDecode } from 'borsh';
import { utils } from 'near-api-js';
import { PublicKey } from 'near-api-js/lib/utils';
import { BN } from 'bn.js'


export const executeMultipleTransactions = async function (transactions, callbackUrl) {
  const wallet = window.walletConnection
  const near = window.near;

  // get localKey
  const getAccessKey = async () => {
    const accountInfo = JSON.parse(localStorage.getItem("undefined_wallet_auth_key"));
    const localKey = accountInfo.allKeys[0];
    console.log("Local Key", localKey);
    return localKey
  }

  // wrap gas fee
  const getGas = (gas) => gas ? new BN(gas) : new BN('100000000000000');
  const getAmount = (amount) => amount ? new BN(utils.format.parseNearAmount(amount)) : new BN('0');


    // get public key
    const publicKeyGet = await getAccessKey();
    const pubKey = PublicKey.from(publicKeyGet)
    const tokenTransactions = await Promise.all(
      transactions.map(async (t, i) => {
        // get block hash
        let block = await near.connection.provider.block({ finality: 'final' });
        let blockHash = baseDecode(block.header.hash);
        console.log("t in excutemultiple: ", t);
        return createTransaction(
          window.accountId,
          pubKey,
          t.receiverId,
          i + 1,
          t.functionCalls.map((fc) => {
            return functionCall(fc.methodName, fc.args, getGas(fc.gas), getAmount(fc.amount));
          }),
          blockHash
        )
      })
    )
    console.log(tokenTransactions);
    return wallet.requestSignTransactions({ transactions: tokenTransactions, callbackUrl });
  }

