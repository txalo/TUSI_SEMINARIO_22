# Listado de endpoints de Aplicador con sus req y res


## APLICAR

### request applicators/doses/apply

applicatorID -> ID aplicador (futura API Key)
receiverID -> CUIT del receptor
vaccine -> Codigo alfanumerico que identifica la dosis a aplicar (ver listado VACUNAS)

{
  "applicatorID" : "xx-xxxxxxxx-x,
  "receiverID" : "xx-xxxxxxxx-x",
  "vaccine" : "VAC_CODE"
}

### response

- CUIT EXISTENTE: Si el CUIT esta registrado, actualiza su lista de dosis y devuelve un status 200 OK
- CUIT NUEVO: Si el CUIT no esta registrado, crea una cuenta y registra la dosis, devuelve un status 201 CREATED

{
  status: "XXX"
  data: {
    status: "XXX xxxxx"
    applicatorID,
    receiverID,
    vaccine,
    appliedAt: "AAAA-MM-DD",
  }
}

#### Errores:
code -> Codigo del error
title -> Titulo del error
detail -> Descripcion del error
type -> Tipo de la transaccion que fallo.

- De entidad (creacion/guardado): 
{
  status: 400,
  error: {
    status: "400 Forbidden",
    code: "",
    title: "",
    detail: "",
    transaction: {
      type: "",
      receiverID,
    },
  },
}

- De aplicacion de dosis:
{
  status: 400,
  error: {
    status: "400 Forbidden",
    code: "",
    title: "",
    detail: "",
    transaction: {
      type: "Dose apply",
      applicatorID,
      receiverID,
      vaccine,
    },
  },
}



## SOLICITAR

POST /applicators/doses/request

### request

id -> CUIT del aplicador (futura API Key?)
distributorID -> CUIT del distribuidor al que se le solicitan las dosis
vaccine -> Codigo alfanumerico que identifica la dosis a aplicar
quantity -> Cantidad solicitada

{
  "id" : "xx-xxxxxxxx-x",
  "distributorID" : "xx-xxxxxxxx-x",
  "vaccine" : "VAC_CODE",
  "quantity" : xxxxx
}

### response
 - Si algun ID es incorrecto:

 detail -> Descripcion del error.

 STATUS 404
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
  }

 - Distribuidor tiene cantidad suficiente:
 
  doses -> Cantidad de dosis enviadas desde el distribuidor

 STATUS 200
 {
  "status" : "200",
  "data": {
    "from": "xx-xxxxxxxx-x",
    "to": "xx-xxxxxxxx-x",
    "vaccine": "BCG",
    "doses": "200"
  }
 }

 - Distribuidor NO tiene cantidad suficiente:
 STATUS 400
 {
  status: 400,
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
}

## CHEQUEAR

### request

 ?? DEBERIA SER GET?

id -> CUIT aplicador (futura API Key del aplicador o de una APP de tereceros que consuma la API)
citizenID -> CUIT sobre el cual se consulta las dosis.
{
  "id" : "xx-xxxxxxxx-x",
  "citizenID" : "xx-xxxxxxxx-x"
}

### response

- CUIT REGISTRADO
STATUS 200 OK
{
  "status" : "200 Ok",
  "data" : {
    "id": "xx-xxxxxxxx-x",
    "createdAt" : "YYYY-MM-DD",
    "doses" : [
      {
        "vaccine" : "VAC_CODE",
        "inoculatedAt" : "YYYY-MM-DD"
      } ...
    ]
  }
}

-> createdAt : Fecha de creacion de la cuenta asociada a ese CUIT
-> doses : Array con objetos, uno por cada dosis recibida. Estos objetos contienen: VAC_CODE y fecha en la que fue aplicada.

- CUIT NO REGISTRADO
STATUS 201 CREATED
{
  "status" : "201 Created",
  "data" : {
    "id": "xx-xxxxxxxx-x",
    "createdAt" : "YYYY-MM-DD",
    "doses" : []  
  }
}

## STOCK 

### request 

-> id : CUIT del aplicador (futura API Key)

{
  "id" : "xx-xxxxxxxx-x" 
}


### response

id -> CUIT del aplicador
doses -> Array con objetos que indican cuantas dosis hay de cada vacuna.

STATUS 200 Ok
{
  "status" : "200 Ok",
  "data" : {
    "id" : "xx-xxxxxxxx-x",
    "doses" : [
      {
        "id" : "VAC_CODE",
        "quantity": xxxxx
      } ....
    ]
  }
}

## VACUNAS

Listados de vacunas que forman parte del calendario. Tambien se agregan las obligatorias para viajar a ciertas zonas (Fiebre Amarilla y Fiebre Hemorragica) y las vacunas COVID que se aplican en nuestro pais.

[
  { "id": "BCG", "name": "BCG", "diseases": ["tubercolosis"] },
  { "id": "HEPB", "name": "Hepatitis B", "diseases": ["Hepatitis B"] },
  {
    "id": "VCN13",
    "name": "Vacuna Conjugada de 13 Serotipos",
    "diseases": ["meningitis", "neumonia", "sepsis por neumococo"]
  },
  {
    "id": "VPN23",
    "name": "Vacuna Polisácaridas contra Neumococo de 23 Serotipos",
    "diseases": ["meningitis", "neumonia", "sepsis por neumococo"]
  },
  {
    "id": "PENTA",
    "name": "Quintuple o Pentavalente",
    "diseases": [
      "difteria",
      "tétanos",
      "tos convulsa",
      "hepatitis b",
      "influenza tipo b"
    ]
  },
  { "id": "IPV", "name": "Polio o Salk", "diseases": ["poliomielitis"] },
  { "id": "ROTA", "name": "Rotavirus", "diseases": ["rotavirus"] },
  {
    "id": "ACYW",
    "name": "Meningococo ACYW",
    "diseases": ["meningitis"]
  },
  {
    "id": "ANTIGRIP",
    "name": "Gripe o Influenza",
    "diseases": ["Gripe"]
  },
  { "id": "HEPA", "name": "Hepatitis A", "diseases": ["hepatitis a"] },
  {
    "id": "DOBVIR",
    "name": "Triple Viral",
    "diseases": ["sarampión", "rubéola"]
  },
  {
    "id": "TRIPVIR",
    "name": "Triple Viral",
    "diseases": ["sarampión", "rubéola", "paperas"]
  },
  { "id": "VARIC", "name": "Varicela", "diseases": ["varicela"] },
  {
    "id": "DTP",
    "name": "Triple Bacteriana Celular",
    "diseases": ["difteria", "tétanos", "tos convulsa"]
  },
  {
    "id": "DTPA",
    "name": "Triple Bacteriana Acelular",
    "diseases": ["difteria", "tétanos", "tos convulsa"]
  },
  {
    "id": "VPH",
    "name": "Virus Papiloma Humano",
    "diseases": ["virus del papiloma humano"]
  },
  {
    "id": "DOBAC",
    "name": "Doble Bacteriana",
    "diseases": ["difteria", "tétanos"]
  },
  {
    "id": "FIAMA",
    "name": "Fiebre Amarilla",
    "diseases": ["fiebre amarilla"]
  },
  {
    "id": "FIHEMAR",
    "name": "Fiebre Hemorrágica Argentina",
    "diseases": ["fiebre hemorrágica Argentina"]
  },
  {
    "id": "SPUTNIKV",
    "name": "Sputnik V Componente 1",
    "diseases": ["COVID-19"]
  },
  {
    "id": "SPUTNIKV2",
    "name": "Sputnik V Componente 2",
    "diseases": ["COVID-19"]
  },
  { "id": "COVISHIELD", "name": "Covhishield", "diseases": ["COVID-19"] },
  { "id": "SINOPHARM", "name": "Sinopharm", "diseases": ["COVID-19"] },
  { "id": "ASTRAZEN", "name": "AstraZeneca", "diseases": ["COVID-19"] },
  { "id": "MODERNA", "name": "Moderna", "diseases": ["COVID-19"] },
  { "id": "CONVIDECIA", "name": "Convidecia", "diseases": ["COVID-19"] },
  { "id": "PFIZERCOV", "name": "Comirnaty", "diseases": ["COVID-19"] }
]
