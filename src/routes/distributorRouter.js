import DistributorController from '../controllers/distributorController.js'
import { Router } from 'express'

const distributorRouter = new Router()
const distributorController = new DistributorController()

distributorRouter.get('/distributor/:id/stock',(req, res) => distributorController.listDoses(req, res))

export default distributorRouter