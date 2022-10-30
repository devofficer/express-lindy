const secret = process.env.JWT_SECRET ? process.env.JWT_SECRET : 'secret'
const expire = process.env.JWT_EXPIRE ? process.env.JWT_EXPIRE : '10min'

export { secret, expire }
