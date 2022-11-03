import { Keypair, Asset, Server, TransactionBuilder, Operation, Account} from 'stellar-sdk'

import fetch from 'node-fetch'

import dotenv from 'dotenv'
dotenv.config({path:'src/.env'})

export default class BlockchainService{
  constructor(){
    this.server = new Server('https://horizon-testnet.stellar.org')
    this.issuerKeypair = Keypair.fromSecret(process.env.ISSUER_SECRET)
  }

  createAccount(){
    const keypair = Keypair.random()
    return {secret: keypair.secret(), public: keypair.publicKey()}
  }

  async fundAccount(publicKey){
    try{
      const response = await fetch(
        `https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`,
      ).then(response => response.json())
      return response.successful
    }catch(error){
      return false
    }
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
    this.listPayments(destinyKeypair.publicKey())

    try{
      const txResult = await this.server.submitTransaction(tx)
      return txResult
    }catch(error){
      return error
    }
  }

  async makePayment (sourceSecretKey, destinySecretKey, assetName, amount){
    const sourceKeypair = Keypair.fromSecret(sourceSecretKey)
    const destinyKeypair = Keypair.fromSecret(destinySecretKey)
    
    const asset = new Asset(assetName, this.issuerKeypair.publicKey())
    const sourceAccount = await this.server.loadAccount(sourceKeypair.publicKey())

    const tx = new TransactionBuilder(sourceAccount,{
      fee: await this.server.fetchBaseFee(),
      networkPassphrase: "Test SDF Network ; September 2015",
    })
    .addOperation(Operation.changeTrust({
      source: destinyKeypair.publicKey(),
      asset
    }))
    .addOperation(Operation.payment({
      amount,
      asset,
      destination: destinyKeypair.publicKey()
    }))
    .setTimeout(10*60)
    .build()

    tx.sign(sourceKeypair)
    tx.sign(destinyKeypair)

    try{
      const txResult = await this.server.submitTransaction(tx)
      return txResult
    }catch(error){
      return error.response.data
    }
    
  }
  async listPayments(publicKey){
    const _account = await this.server.loadAccount(publicKey)    
    return await _account.payments()
  }

  async listAssets(publicKey){
    const _account = await this.server.loadAccount(publicKey)
    return await _account.balances    
  }
}