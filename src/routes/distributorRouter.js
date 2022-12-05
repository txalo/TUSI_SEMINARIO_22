import DistributorController from '../controllers/distributorController.js'
import { Router } from 'express'

const distributorRouter = new Router()
const distributorController = new DistributorController()

distributorRouter.get('/distributors/:id/doses/stock',(req, res) => distributorController.listDoses(req, res))
distributorRouter.get('/distributors/list',(req, res) => distributorController.getAll(req, res))

export default distributorRouter