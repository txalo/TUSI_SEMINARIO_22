import express from 'express'
import { createRequire } from "module";


import dotenv from 'dotenv'
dotenv.config({path:'./src/.env'})

import swaggerUI from 'swagger-ui-express'

import issuerRouter from './routes/issuerRouter.js'
import distributorRouter from './routes/distributorRouter.js'
import applicatorRouter from './routes/applicatorRouter.js'
import receiverRouter from './routes/receiverRouter.js'

const require = createRequire(import.meta.url);

const vac = express()
const swaggerDocument = require('./data/documentation.json')

vac.use(express.json())
vac.use(express.urlencoded({extended: true}))

vac.get('/', (req, res) => res.send("Working!"))

//Routes
vac.use(issuerRouter)
vac.use(distributorRouter)
vac.use(applicatorRouter)
vac.use(receiverRouter)

vac.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
vac.listen(process.env.PORT, () => console.log( `Listen at port ${process.env.PORT}` ))


