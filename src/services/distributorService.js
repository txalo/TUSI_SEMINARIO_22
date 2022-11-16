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

  async getAll() {
    const distributors = this.daoService.readData("distributors");
    let result = {};
    if (distributors.length != 0) {
      result.status = 200;
      result.data = [];
      for await (const distributor of distributors) {
        let { id, name, keypair } = distributor;
        let distributorStock = await this.blockchainService.listAssets(
          keypair.public
        );
        let doses = [];
        distributorStock.forEach((stock) => {
          if (stock.asset_type != "native") {
            doses.push({
              vaccine: stock.asset_code,
              quantity: Number(stock.balance).toFixed(0),
            });
          }
        });
        result.data.push({ id, name, doses });
      }
    }
    
    return JSON.stringify(result);
  }
}