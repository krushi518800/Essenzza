import requests
import json

portalId = '245710062'
formGuid = 'e148dc1d-56e6-4dcd-b665-8bf6ce5a87c3'
url = f"https://api.hsforms.com/submissions/v3/integration/submit/{portalId}/{formGuid}"

data = {
    "fields": [
        {"name": "email", "value": "test2@essenzza.com"},
        {"name": "firstname", "value": "Test User 2"},
        {"name": "phone", "value": "+12345678901"}, # Try with country code
        {"name": "message", "value": "Test reason"}
    ]
}

response = requests.post(url, json=data)
print("Status Code:", response.status_code)
print("Response:", response.text)
