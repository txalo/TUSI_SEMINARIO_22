import DistributorService from '../services/distributorService.js'


export default class DistributorController{
  
  constructor(){
    this.distributorService = new DistributorService()    
  }

  async listDoses(req, res){
    const result = await this.distributorService.listDoses(req.params.id)
    res.status(Number(result.status))
    res.send(result)   
  }

  async getAll(req, res){
    const result = JSON.parse(await this.distributorService.getAll())
    res.status(Number(result.status))
    res.send(result)
  }

}