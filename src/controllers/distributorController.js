import DistributorService from '../services/distributorService.js'


export default class DistributorController{
  
  constructor(){
    this.distributorService = new DistributorService()    
  }

  async listDoses(req, res){
    const result = await this.distributorService.listDoses(req.params.id)
    res.status(result.status)
    res.send(result)   
  }

}