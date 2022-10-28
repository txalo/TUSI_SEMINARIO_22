import Entity from '../model/Entity.js'
import DAOService from './DAOService.js'
import BlockchainService from './BlockchainService.js'

import dotenv from 'dotenv'
dotenv.config({path:'src/.env'})

export default class IssuerService{
  constructor(){
    this.blockchainService = new BlockchainService()
    this.issuer = new Entity('ANMAT', 
                  'ANMAT',
                  {
                    secret: process.env.ISSUER_SECRET,
                    publid: process.env.ISSUER_PUBLIC
                  })
    this.daoService = new DAOService()
  }

  async assignDoses (destinyEntityID, vaccine, doses){
    const destinyEntity = this.daoService.getDistributorByID(destinyEntityID)
    if (await this.blockchainService.issueAssets(this.issuer.getSecretKey(),destinyEntity.getSecretKey(),vaccine,doses) == true)
      return JSON.stringify({status: 200, data: {destinyEntityID, name: destinyEntity.name, vaccine, quantity : doses }})
  }
}
