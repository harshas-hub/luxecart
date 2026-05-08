# from typing import Any
# from fastapi import FastAPI
# from scalar_fastapi import get_scalar_api_reference

# app= FastAPI()

# db = {12701: {
#     "weight": .6 ,
#     "content": "glassware",
#     "status":"placed"

# }}

# @app.get("/shipment/{id}")
# def get_shipment(id: int) -> dict[str, str | int | float]:
#     return{
#         "id": id,
#         # "weight": 1.2,
#         "content": "wooden table ",
#         "status": "in transist"

#     }