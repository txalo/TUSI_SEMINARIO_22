import express from 'express'

import dotenv from 'dotenv'
dotenv.config({path:'./src/.env'})

import issuerRouter from './routes/issuerRouter.js'
import distributorRouter from './routes/distributorRouter.js'


const vac = express()

vac.use(express.json())
vac.use(express.urlencoded({extended: true}))

vac.get('/', (req, res) => res.send("Working!"))

//Routes
vac.use(issuerRouter)
vac.use(distributorRouter)

vac.listen(process.env.PORT, () => console.log( `Listen at port ${process.env.PORT}` ))


