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
}