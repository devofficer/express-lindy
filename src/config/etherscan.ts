const url = process.env.ETHERSCAN_API
  ? process.env.ETHERSCAN_API
  : 'https://api.etherscan.io/api'

const type = 'account'
const action = 'txlistinternal'
const sort = 'desc'

export { url, type, action, sort }
