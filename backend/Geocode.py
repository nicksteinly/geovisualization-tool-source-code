# geocode.py
import requests
from Config import TOM_TOM_API_KEY
import pandas as pd


def geocode_address(address):
    """
    Geocodes an address to latitude and longitude using TomTom's Geocoding API.

    Args:
        address (str): The address to geocode.

    Returns:
        tuple: A tuple with 'latitude' and 'longitude' if successful, None otherwise.
    """
    base_url = "https://api.tomtom.com/search/2/geocode/"
    params = {
        "key": TOM_TOM_API_KEY,
        "limit": 1,  # Limit results to the most relevant one
    }

    try:
        # URL encode the address
        url = f"{base_url}{requests.utils.quote(address)}.json"

        # Make the request
        response = requests.get(url, params=params)
        response.raise_for_status()  # Raise HTTPError for bad responses

        # Parse the response
        data = response.json()
        if data.get("results"):
            result = data["results"][0]
            lat = result["position"]["lat"]
            lon = result["position"]["lon"]
            return lat, lon
        else:
            print(f"No results found for address: {address}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"Error during API request: {e}")
        return None
