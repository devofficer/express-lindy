import axios from 'axios'
import { NextFunction, Request, Response } from 'express'
import { EtherScan, PaginationConfig } from '../../config'

/**
 * https://api.etherscan.io/api?
 * module=account&
 * action=txlistinternal&
 * address=0x2c1ba59d6f58433fb1eaee7d20b26ed83bda51a3&
 * startblock=0&
 * endblock=2702578&
 * page=4&
 * offset=10&
 * sort=asc
 */
const transaction = async (req: Request, res: Response, next: NextFunction) => {
  const { address } = req.params
  const page = req.params.page ? req.params.page : PaginationConfig.page
  const offset = req.params.offset ? req.params.offset : PaginationConfig.offset
  console.log(address, page, offset, EtherScan.url)
  const result = await axios.get('https://api.etherscan.io/api', {
    params: {
      module: EtherScan.type,
      action: EtherScan.action,
      address: address,
      page: page,
      offset: offset,
      sort: EtherScan.sort,
    },
  })

  res.status(200).send(result.data)
}

export default transaction
