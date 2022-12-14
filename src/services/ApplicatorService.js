import blockchainService from "./BlockchainService.js";
import DAOService from "./DAOService.js";
import Entity from "../model/Entity.js";

import fetch from "node-fetch";

export default class ApplicatorService {
  constructor() {
    this.blockchainService = new blockchainService();
    this.daoService = new DAOService();
  }

  async requestDoses(applicatorID, distributorID, vaccine, quantity) {
    const distributor = this.daoService.getDistributorByID(distributorID);
    const applicator = this.daoService.getAplicatorByID(applicatorID);

    if (distributor && applicator) {
      const result = await this.blockchainService.makePayment(
        distributor.getSecretKey(),
        applicator.getSecretKey(),
        vaccine,
        quantity
      );
      if (result.successful) {
        return JSON.stringify({
          status: 200,
          data: {
            from: distributorID,
            to: applicatorID,
            vaccine,
            doses: quantity,
          },
        });
      } else {
        console.log(result.status)
        return JSON.stringify({
          status: result.status,
          error: {
            code: "NOT_ENOUGH_DOSES",
            title: "Dosis insuficientes",
            detail:
              "El distribuidor no cuenta con la cantidad de dosis solicitadas",
            transaction: {
              type: "DOSES_REQUEST",
              from: distributorID,
              to: applicatorID,
              vaccine,
              doses: quantity,
            },
          },
        });
      }
    } else {
      const detail = `${!distributor ? "Distribuidor no encontrado" : ""}${
        !distributor && !applicator ? ", " : ""
      }${!applicator ? "Aplicador no encontrado" : ""}`;
      return JSON.stringify({
        status: 404,
        error: {
          code: "INVALID_ENTITY",
          title: "Entidad invalida",
          detail,
          transaction: {
            type: "DOSES_REQUEST",
            from: distributorID,
            to: applicatorID,
            vaccine,
            doses: quantity,
          },
        },
      });
    }
  }

  async applyDoses(applicatorID, receiverID, vaccine) {
    const applicator = this.daoService.getAplicatorByID(applicatorID);
    const vaccineData = this.daoService.getVaccineDataByID(vaccine);
    let receiver = this.daoService.getReceiverByID(receiverID);
    let isNew = false;

    if (!receiver) {
      const keypair = this.blockchainService.createAccount();
      const accountCreationResult = await this.blockchainService.fundAccount(
        keypair.public
      );
      if (accountCreationResult.successful) {
        receiver = new Entity(receiverID, "Nueva Persona", keypair);
        //TRY??
        if (!this.daoService.saveEntity("receivers", receiver))
          return JSON.stringify({
            status: 400,
            error: {
              code: "CANT_SAVE_ENTITY",
              title: "Error guardado",
              detail: "La entidad receptora no pudo ser guardada correctamente",
              transaction: {
                type: "Receiver save",
                receiverID,
              },
            },
          });
        isNew = true;
      } else {
        return JSON.stringify({
          status: 400,
          error: {
            code: "CANT_CREATE_ENTITY",
            title: "Creacion fallida",
            detail: "La entidad receptora no pudo ser creada correctamente",
            transaction: {
              type: "Receiver creation",
              receiverID,
            },
          },
        });
      }
    }

    const applyResult = await this.blockchainService.makePayment(
      applicator.getSecretKey(),
      receiver.getSecretKey(),
      vaccine,
      "1",
      vaccineData.doses
    );

    if (applyResult.successful) {
      return JSON.stringify({
        status: isNew ? "201" : "200",
        data: {
          applicatorID,
          receiverID,
          vaccine,
          appliedAt: applyResult.created_at.split("T")[0],
        },
      });
    } else {
      const resultCodes = [
        {
          op_code: "op_line_full",
          err_code: "DOSE_EXCEED",
          title: "Esquema completo",
          detail:
            "La entidad receptora ya posee esquema completo para esta vacuna",
        },
        {
          op_code: "op_src_no_trust",
          err_code: "NOT_ENOUGH_DOSES",
          title: "Dosis insuficientes",
          detail: "La entidad aplicadora no posee suficientes dosis de esta vacuna",
        },
      ];
      const error = resultCodes.filter(
        (result) =>
          result.op_code == applyResult.extras.result_codes.operations[1]
      )[0];

      return JSON.stringify({
        status: 403,
        error: {
          code: error.err_code,
          title: error.title,
          detail: error.detail,
          transaction: {
            type: "Dose apply",
            applicatorID,
            receiverID,
            vaccine,
          },
        },
      });
    }
  }

  async listDoses(applicatorID){
    const applicator = this.daoService.getAplicatorByID(applicatorID)
    if(applicator){
      const result = await this.blockchainService.listAssets(applicator.getPublicKey())
      const doses = []
      result.forEach( res => {
        if (res.asset_type != "native")
          doses.push({id: res.asset_code, quantity: Number(res.balance).toFixed(0)})
      })   
      return {
        status: 200, 
        data: {
          applicatorID,
          name : applicator.name, 
          doses
        }
      }    
    }else{
      return {
        status: 404, 
        error: {
          title: "Applicator not found",
          data : {
            applicatorID
          }
        }
      }    
    }
  }

  async getAll() {
    const applicators = this.daoService.readData("applicators");
    let result = {};
    if (applicators.length != 0) {
      result.status = 200;
      result.data = [];
      for await (const applicator of applicators) {
        let { id, name, keypair } = applicator;
        let applicatorStock = await this.blockchainService.listAssets(
          keypair.public
        );
        let doses = [];
        applicatorStock.forEach((stock) => {
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
