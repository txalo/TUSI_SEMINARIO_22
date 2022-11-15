import { Router } from 'express'
import IssuerController from '../controllers/IssuerController.js'


const issuerRouter = new Router()
const issuerController = new IssuerController()

issuerRouter.post('/issuer/doses/assign', (req, res) => issuerController.assignDoses(req, res))
issuerRouter.get('/vaccines/list', (req, res) => issuerController.getAllVaccinesData(req, res))

export default issuerRouter