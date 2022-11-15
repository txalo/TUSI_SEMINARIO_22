import ApplicatorService from '../services/ApplicatorService.js'

export default class ApplicatorController{

  constructor (){
    this.applicatorService = new ApplicatorService()
  }

  async requestDoses(req, res){
    const {id, distributorID, vaccine, quantity } = req.body
    const result = JSON.parse(await this.applicatorService.requestDoses(id, distributorID, vaccine, quantity))
    res.json(result)
  }

  async applyDoses(req, res){
    const { applicatorID, receiverID, vaccine } = req.body
    const result = JSON.parse(await this.applicatorService.applyDoses(applicatorID, receiverID, vaccine))
    res.json(result)
  }

  async getAll(req, res){
    const result = JSON.parse(await this.applicatorService.getAll())
    res.json(result)
  }
}