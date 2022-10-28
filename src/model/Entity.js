export default class Entity{
  
  constructor(id, name, keypair = {}){
    this.id = id
    this.name = name
    this.keypair = keypair
  }

  setKeypair(keypair){
    this.keypair = keypair
  }

  getKeypair(){
    return this.keypair
  }

  getPublicKey(){
    return this.keypair.public
  }
  
  getSecretKey(){
    return this.keypair.secret
  }

  getName(){
    return this.name
  }

  
}