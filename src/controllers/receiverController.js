import ReceiverService from '../services/ReceiverService.js'

export default class ControllerService {
  constructor(){
    this.receiverService = new ReceiverService()
  }

  async listDoses (req, res){
    const { receiverID } = req.params
    res.send(JSON.parse(await this.receiverService.listDoses(receiverID)))
  }
}