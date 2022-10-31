import axios from 'axios'
import { NextFunction, Request, Response } from 'express'
import { EtherScan, PaginationConfig } from '../../config'

/**
 * transaction
 *
 * fectch transaction history from etherscan using user address
 *
 * @param req
 * @param res
 * @param next
 */
const transaction = async (req: Request, res: Response, next: NextFunction) => {
  const { address } = req.params
  const page = req.params.page ? req.params.page : PaginationConfig.page
  const offset = req.params.offset ? req.params.offset : PaginationConfig.offset
  const response = await axios.get('https://api.etherscan.io/api', {
    params: {
      module: EtherScan.type,
      action: EtherScan.action,
      address: address,
      page: page,
      offset: offset,
      sort: EtherScan.sort,
    },
  })
  const result = response.data.result
  res.status(200).send(result)
}

export default transaction
