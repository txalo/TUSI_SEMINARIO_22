import IssuerService from "../services/IssuerService.js"

export default class IssuerController{
  constructor(){
    this.issuerService = new IssuerService()
  }

  async assignDoses(req, res){
    const {vaccine, quantity, destinyEntityID} = req.body
    
      res.status(200)
      res.json(JSON.parse(await this.issuerService.assignDoses(destinyEntityID, vaccine, quantity)))
    
       
  }
}