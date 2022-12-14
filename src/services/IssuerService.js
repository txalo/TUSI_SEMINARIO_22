import Entity from "../model/Entity.js";
import DAOService from "./DAOService.js";
import BlockchainService from "./BlockchainService.js";

import dotenv from "dotenv";
dotenv.config({ path: "src/.env" });

export default class IssuerService {
  constructor() {
    this.blockchainService = new BlockchainService();
    this.issuer = new Entity("ANMAT", "ANMAT", {
      secret: process.env.ISSUER_SECRET,
      publid: process.env.ISSUER_PUBLIC,
    });
    this.daoService = new DAOService();
  }

  async assignDoses(destinyEntityID, vaccine, doses) {
    const destinyEntity = this.daoService.getDistributorByID(destinyEntityID);

    if (destinyEntity) {
      const result = await this.blockchainService.issueAssets(
        this.issuer.getSecretKey(),
        destinyEntity.getSecretKey(),
        vaccine,
        doses
      );

      if (result.successful)
        return JSON.stringify({
          status: 200,
          data: {
            destinyEntityID,
            name: destinyEntity.name,
            vaccine,
            quantity: doses,
          },
        });
      else
        return JSON.stringify({
          status: result.response.status,
          error: {
            title: result.response.data.title,
            transaction: {
              type: "Doses assign",
              destinyEntityID,
              name: destinyEntity.name,
              vaccine,
              quantity: doses,
            },
          },
        });
    } else
      return JSON.stringify({
        status: 404,
        error: {
          title: "Destiny entity not found",
          transaction: {
            type: "Doses assign",
            destinyEntityID,
            vaccine,
            quantity: doses,
          },
        },
      });
  }

  getAllVaccinesData() {
    const vaccines = this.daoService.readData("vaccines");
    const result = {};
    if (vaccines) {
      result.status = 200;
      result.data = vaccines;
    }

    return JSON.stringify(result);
  }
}
