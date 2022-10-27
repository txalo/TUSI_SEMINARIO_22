import { Router } from 'express'
import IssuerController from '../controllers/IssuerController.js'


const issuerRouter = new Router()
const issuerController = new IssuerController()

issuerRouter.post('/issuer/doses/distribute', (req, res) => issuerController.distributeDoses(req, res))