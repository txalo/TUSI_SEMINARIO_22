import { Keypair, Asset, Server, TransactionBuilder, Operation} from 'stellar-sdk'

import fetch from 'node-fetch'

export default class BlockchainService{
  constructor(){
    this.server = new Server('https://horizon-testnet.stellar.org')
  }
  
  async issueAssets(issuerSecret, destinySecret, assetName, quantity){
    const issuerKeypair = Keypair.fromSecret(issuerSecret)
    const destinyKeypair = Keypair.fromSecret(destinySecret)

    const issuerAccount = await this.server.loadAccount(issuerKeypair.publicKey())
    const issuedAsset = new Asset(assetName, issuerKeypair.publicKey())

    const tx = new TransactionBuilder(issuerAccount, {
      fee: await this.server.fetchBaseFee(),
      networkPassphrase: "Test SDF Network ; September 2015",
    })
    .addOperation(Operation.changeTrust({
      source: destinyKeypair.publicKey(),
      asset: issuedAsset
    }))
    .addOperation(Operation.payment({
      amount: quantity,
      asset: issuedAsset,
      destination: destinyKeypair.publicKey()
    }))
    .setTimeout(60 * 10)
    .build()

    tx.sign(issuerKeypair)
    tx.sign(destinyKeypair)
    

    try{
      const txResult = await this.server.submitTransaction(tx)
      return txResult
    }catch(error){
      return error
    }
  }
}