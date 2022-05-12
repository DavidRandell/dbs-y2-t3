import json
import requests
import pymongo

client = pymongo.MongoClient("mongodb+srv://abracadave:Px78vSEjvJxUyUTQ@10573282-mydbs.kwk32.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
db = client["test"]
collection=db['test']

url='https://gateway.daft.ie/old/v1/listings'
data='''{"section":"residential-to-rent","filters":[{"name":"adState","values":["published"]}],"andFilters":[],"ranges":[],"paging":{"from":"%i","pageSize":"50"},"geoFilter":{},"terms":""}'''%250
headers={'authority': 'gateway.daft.ie','method': 'POST','path': '/old/v1/listings','scheme': 'https','accept': 'application/json','accept-encoding': 'gzip, deflate, br','accept-language': 'en-US,en;q=0.9','brand': 'daft','cache-control': 'no-cache, no-store','content-length': '180','content-type': 'application/json','expires': '0','origin': 'https://www.daft.ie','platform': 'web','pragma': 'no-cache','referer': 'https://www.daft.ie/','sec-ch-ua': '"Google Chrome";v="95", "Chromium";v="95", ";Not A Brand";v="99"','sec-ch-ua-mobile': '?0','sec-ch-ua-platform': '"Windows"','sec-fetch-dest': 'empty','sec-fetch-mode': 'cors','sec-fetch-site': 'same-site','user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36','version': '0.1.1476'}
resp=requests.post(url,data=data,headers=headers)
listings=json.loads(resp.content)['listings']

print(db.list_collection_names())
x=collection.insert_one(listings[0])
print(db.list_collection_names())
x=collection.insert_many(listings[1:])
print(x.inserted_ids)
listings[0]['listing'].keys()


for x in collection.find({},{"_id":0, "listing": 1 }):
    print(x)

for x in collection.find({'listing.sections' :['Property', 'Residential', 'House'],
"listing.title":{ "$regex": "Dublin" }},{"_id":0, 'listing.title':1, "listing.price": 1 }):
    print(x)
    
###########################


