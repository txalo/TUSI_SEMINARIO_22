import BlockchainService from "./BlockchainService.js";
import DAOService from "./DAOService.js";

export default class ReceiverService {
  constructor() {
    this.daoService = new DAOService();
    this.blockchainService = new BlockchainService();
  }

  async listDoses(receiverID) {
    const receiver = this.daoService.getReceiverByID(receiverID);
    if (receiver) {
      const result = await this.blockchainService.listPayments(
        receiver.getPublicKey()
      );
      const doses = []
      result.records.forEach((record) => {
        if (record.asset_code){
          let recordInfo = {
            "vaccine" : record.asset_code,
            "inoculatedAt" : record.created_at.split("T")[0]
          }
          doses.push(recordInfo)
        }
      });
      return JSON.stringify({
        status : "200",
        data : {
          receiverID : receiverID,
          createdAt : result.records[0].created_at.split("T")[0],
          doses
        }
      })
    }else{
      return JSON.stringify({
        status: "404",
        error: {
          code: "ENTITY_NOT_FOUND",
          title: "Entidad receptora no encontrada",
          detail: "La entidad receptora aun no posee registros en el sistema",
          transaction: {
            type: "DOSES_LIST",
            receiverID
          }
        }
      })
    }
  }
}
