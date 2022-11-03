import blockchainService from './BlockchainService.js'
import DAOService from './DAOService.js'

export default class ApplicatorService{

  constructor(){
    this.blockchainService = new blockchainService()
    this.daoService = new DAOService()    
  }

  async requestDoses(applicatorID, distributorID, vaccine, quantity){
    const distributor = this.daoService.getDistributorByID(distributorID)
    const applicator = this.daoService.getAplicatorByID(applicatorID)
    if (distributor && applicator){
      const result = await this.blockchainService.makePayment(distributor.getSecretKey(), applicator.getSecretKey(), vaccine, quantity)
      if (result.successful){
        return JSON.stringify(
          {
            status: 200, 
            data: {
              from : distributorID, 
              to : applicatorID,              
              vaccine, 
              doses : quantity 
            }
          })
      }else{
        return JSON.stringify(
          {
            status: result.status,
            error : {
              status : "400 Forbidden",
              code : "NOT_ENOUGH_DOSES",
              title : "Dosis insuficientes",
              detail : "El distribuidor no cuenta con la cantidad de dosis solicitadas",
              transaction:{
                type : "DOSES_REQUEST",
                from : distributorID, 
                to : applicatorID,              
                vaccine, 
                doses : quantity
              }
            }
          })          
      }
    }else{
      const detail = `${!distributor ? "Distribuidor no encontrado" : ""}${!distributor && !applicator ? ", " : ""}${!applicator ? "Aplicador no encontrado" : ""}`
      return JSON.stringify(
        {
          status: 404,
          error : {
            status : "404 Not found",
            code : "INVALID_ENTITY",
            title : "Entidad invalida",
            detail,
            transaction:{
              type : "DOSES_REQUEST",
              from : distributorID, 
              to : applicatorID,              
              vaccine, 
              doses : quantity
            }
          }
        })
    }
  }
} 
