# Backend Server

- Express.js + JWT Authentication
- MongoDB

### Database Configuration

We can configure the configuration of database on `.env` or `/src/config/mongo.ts`.

```sh
MONGO_HOST=127.0.0.1
MONGO_PORT=27017
DATABASE=lindy
```

```sh
const host = process.env.MONGO_HOST ? process.env.MONGO_HOST : '127.0.0.1'
const port = process.env.MONGO_PORT ? process.env.MONGO_PORT : 27017
const database = process.env.DATABASE ? process.env.DATABASE : 'lindy'
const uri = `mongodb://${host}:${port}/${database}`
export { uri }
```

- `host` address of mongodb server
- `port` port of mongodb server
- `database` name of the database

### Setting up Models

We can setting up database models on `/src/db/models`.

> Building a Schema for a Collection

```sh
const UserSchema: Schema = new Schema({
  email: {
    type: String,
    lowercase: true,
    required: [true, 'Email is required'],
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please use a valid address'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Please use minimum of 8 characters'],
  },
  address: {
    type: String,
    lowercase: true,
    required: [true, 'Wallet Address is required'],
  },
})
```

Adding a middleware to save the password as a hash value

```sh
UserSchema.pre<UserInterface>('save', function (next: any) {
  if (!this.isModified('password')) return next()
  const hash = bcrypt.hashSync(this.password, 10)
  this.password = hash
  next()
})
```

Adding some methods for comparing password and generating JWT token

```sh
UserSchema.methods.matchPassword = function (password: string) {
  const result = bcrypt.compareSync(password, this.password)
  return bcrypt.compareSync(password, this.password)
}

UserSchema.methods.getSignedToken = function () {
  return jwt.sign(
    { email: this.email, address: this.address },
    JwtConfig.secret
  )
}
```

> Buliding Interface for a Collection

```sh
interface IUser extends Document {
  email: string
  password: string
  address: string
  matchPassword(password: string): boolean | PromiseLike<boolean>
  getSignedToken(): string
}
```

> Creating model instance

```sh
const User: Model<IUser> = model<IUser>('User', UserSchema)
```

## Setting up JWT Authentciation for the apis

> Generating JWT when user signin

```sh
const token = user.getSignedToken()
res.status(200).send({ token: token })
```

> Setting up Passport on the apis

```sh
npm i passport jsonwebtoken
npm i -D @types/passport
```

Passport is a Express compitable authentication middleware.
We need to let Passport to define a new JWT authentication Strategy.

```sh
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JwtConfig.secret,
    },
    function (jwtToken, done) {
      User.findOne({ email: jwtToken.email }, function (err: any, user: any) {
        if (err) return done(err, false)
        if (user) {
          return done(undefined, user, jwtToken)
        } else {
          return done(undefined, false)
        }
      })
    }
  )
)
```

After that we need to define jwt authorization function

```sh
const authorizeJwt = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', function (err, user, jwtToken) {
    const { address } = req.params
    if (err) {
      console.log(err)
      return res.status(401).json({ status: 'error', code: 'unauthorized' })
    }
    if (!user) {
      return res.status(500).json({ status: 'error', code: 'unauthorized' })
    } else if (address !== user.address) {
      return res.status(401).json({ status: 'error', code: 'unauthorized' })
    } else {
      next()
    }
  })(req, res, next)
}
```

Setting up passport authentication on the apis

```sh
router.get('/transaction/:address', authorizeJwt, transaction)
```

## Fetching transactions from etherscan

```sh
const transaction = async (req: Request, res: Response, next: NextFunction) => {
  const { address } = req.params
  const page = req.params.page ? req.params.page : PaginationConfig.page
  const offset = req.params.offset ? req.params.offset : PaginationConfig.offset
  const response = await axios.get(EtherScan.url, {
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
```
