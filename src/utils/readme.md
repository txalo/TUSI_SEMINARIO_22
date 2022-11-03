# Carpeta con archivos de prueba y herramientas para facilitar carga de datos


 - POST issuer/doses/assign
Request:

{
    "destinyEntityID" : "30-22222222-9"
    "vaccine": "BCG",
    "quantity": "200",
}

Response: 
{
  "status": 200,
  "data": {
    "destinyEntityID": "30-22222222-9",
    "name": "Drogueria del Sud",
    "vaccine": "BCG",
    "quantity": "200"
  }
}

{
  "status": 400,
  "error": {
    "title": "Transaction Failed",
    "transaction": {
      "type": "Doses assign",
      "destinyEntityID": "30-22222222-9",
      "name": "Drogueria del Sud",
      "vaccine": "BCG",
      "quantity": "200"
    }
  }
}

{
  "status": 404,
  "error": {
    "title": "Destiny entity not found",
    "transaction": {
      "type": "Doses assign",
      "destinyEntityID": "30-22222211-9",
      "vaccine": "BCG",
      "quantity": "200"
    }
  }
}