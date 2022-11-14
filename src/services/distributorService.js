import BlockchainService from './BlockchainService.js'
import DAOService from './DAOService.js'

export default class DistributorService{

  constructor () {
    this.daoService = new DAOService()
    this.blockchainService = new BlockchainService()
  }


  async listDoses(distributorID){
    const distributor = this.daoService.getDistributorByID(distributorID)
    if(distributor){
      const result = await this.blockchainService.listAssets(distributor.getPublicKey())
      const doses = []
      result.forEach( res => {
        if (res.asset_type != "native")
          doses.push({id: res.asset_code, quantity: Number(res.balance).toFixed(0)})
      })   
      return {
        status: 200, 
        data: {
          distributorID,
          name : distributor.name, 
          doses
        }
      }    
    }else{
      return {
        status: 404, 
        error: {
          title: "Distributor not found",
          data : {
            distributorID: distributorID            
          }
        }
      }    
    }
  }
}