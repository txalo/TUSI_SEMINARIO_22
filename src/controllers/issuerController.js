import IssuerService from "../services/IssuerService.js"

export default class IssuerController{
  constructor(){
    this.issuerService = new IssuerService()
  }

  async assignDoses(req, res){
    const {vaccine, quantity, destinyEntityID} = req.body    
    const result = JSON.parse(await this.issuerService.assignDoses(destinyEntityID, vaccine, quantity))
    res.status(result.status)
    res.json(result)       
  }

  getAllVaccinesData(req, res){
    const result = JSON.parse(this.issuerService.getAllVaccinesData())
    res.status(result.status)
    res.json(result)
  }
}