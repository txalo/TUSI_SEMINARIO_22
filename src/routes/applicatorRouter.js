import { Router } from 'express'
import ApplicatorController from '../controllers/applicatorController.js'

const applicatorRouter = new Router
const applicatorController = new ApplicatorController()

applicatorRouter.post('/applicators/doses/request', (req, res) => applicatorController.requestDoses(req, res))

export default applicatorRouter