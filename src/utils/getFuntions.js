import BN from "bn.js";
import { utils } from 'near-api-js';

export const getGas = (gas) => gas ? new BN(gas) : new BN('100000000000000');
export const getAmount = (amount) => amount ? new BN(utils.format.parseNearAmount(amount)) : new BN('0');