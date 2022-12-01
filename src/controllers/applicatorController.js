import ApplicatorService from '../services/ApplicatorService.js'

export default class ApplicatorController{

  constructor (){
    this.applicatorService = new ApplicatorService()
  }

  async requestDoses(req, res){
    const {id, distributorID, vaccine, quantity } = req.body
    const result = JSON.parse(await this.applicatorService.requestDoses(id, distributorID, vaccine, quantity))
    res.status(Number(result.status))
    res.send(result)
  }

  async applyDoses(req, res){
    const { applicatorID, receiverID, vaccine } = req.body
    const result = JSON.parse(await this.applicatorService.applyDoses(applicatorID, receiverID, vaccine))
    res.status(Number(result.status))
    res.send(result)
  }

  async listDoses(req, res){
    const result = await this.applicatorService.listDoses(req.params.id)
    res.status(Number(result.status))
    res.send(result)   
  }

  async getAll(req, res){
    const result = JSON.parse(await this.applicatorService.getAll())
    res.status(Number(result.status))
    res.send(result)
  }
}