export const makeTokenReadable = (tokenAmount, decimals) => {
    return tokenAmount / 10 ** decimals
}

export const amountWithSlippage = (amount, slippage, decimal) => {
    return amount - (amount * slippage / 100)
}