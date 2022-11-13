import fs from 'fs'
import Entity from '../model/Entity.js'

export default class DAOService{
  constructor(){

  }

  readData (entityType){
    return JSON.parse(fs.readFileSync(process.cwd()+'/src/data/'+entityType+'.json', 'utf-8'))  
  }

  saveEntity (entityType, entity){
    const entities = this.readData(entityType)
    entities.push(entity)
    try {
      fs.writeFileSync(process.cwd()+'/src/data/'+entityType+'.json', JSON.stringify(entities))
      return true
    }catch (error){
      console.error (error)
      return false
    }
  }

  getDistributorByID(id){
    const result = this.readData('distributors').filter(distributor => distributor.id == id)    
    return result.length == 0 ? null : new Entity(result[0].id, result[0].name, result[0].keypair)
  }

  getAplicatorByID(id){
    const result = this.readData('applicators').filter(aplicator => aplicator.id == id)    
    return result.length == 0 ? null : new Entity(result[0].id, result[0].name, result[0].keypair)    
  }

  getReceiverByID(id){
    const result = this.readData('receivers').filter(receiver => receiver.id == id)    
    return result.length == 0 ? null : new Entity(result[0].id, result[0].name, result[0].keypair)    
  }
  
  getVaccineDataByID(id){
    const result = this.readData('vaccines').filter(receiver => receiver.id == id)    
    return result.length == 0 ? null : result[0]    
  }

}

