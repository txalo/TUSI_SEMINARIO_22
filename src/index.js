import express from 'express'

import dotenv from 'dotenv'
dotenv.config({path:'./src/.env'})

const vac = express()

vac.use(express.json())
vac.use(express.urlencoded({extended: true}))

vac.get('/', (req, res) => res.send("Working!"))

vac.listen(process.env.PORT, () => console.log( `Listen at port ${process.env.PORT}` ))


