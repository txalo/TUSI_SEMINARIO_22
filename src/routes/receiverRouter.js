import { Router } from "express";
import ReceiverController from "../controllers/receiverController.js";

const receiverRouter = new Router();
const receiverController = new ReceiverController()

receiverRouter.get('/receiver/:receiverID/doses/list', (req, res) => receiverController.listDoses(req, res))

export default receiverRouter