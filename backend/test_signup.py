import urllib.request
import json
import uuid

def test_signup():
    email = f"test_{uuid.uuid4()}@example.com"
    url = "http://localhost:8001/api/auth/sign-up/email"
    data = {
        "email": email,
        "password": "password123",
        "name": "Test User"
    }
    json_data = json.dumps(data).encode('utf-8')
    req = urllib.request.Request(url, data=json_data, headers={'Content-Type': 'application/json'})
    
    try:
        with urllib.request.urlopen(req) as response:
            print(f"Status Code: {response.getcode()}")
            print(f"Response: {response.read().decode('utf-8')}")
    except urllib.request.HTTPError as e:
        print(f"HTTP Error: {e.code}")
        print(f"Response: {e.read().decode('utf-8')}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_signup()
