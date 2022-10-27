import { Keypair, Asset, Server, TransactionBuilder, Operation} from 'stellar-sdk'

import fetch from 'node-fetch'

export default class BlockchainService{
  constructor(){
    this.server = new Server('https://horizon-testnet.stellar.org')
  }  
}