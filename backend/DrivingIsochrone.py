import requests
from flask import Flask, request, jsonify, Blueprint
import json
from Config import TOM_TOM_API_KEY
import requests

# Blueprint for the driving isochrone feature
driving_isochrone_bp = Blueprint('driving-isochrone', __name__)

# Route for calculating reachable range isochrone
@driving_isochrone_bp.route("/reachable-range", methods=['POST'])
def calculate_reachable_range():
    """
    This endpoint calculates the reachable range for a given location based on time or distance budget using
    the TomTom API's reachable range calculation feature.

    **Expected Input:**
    - JSON body with the following parameters:
      - `latitude` (float): The latitude of the origin location.
      - `longitude` (float): The longitude of the origin location.
      - `time_budget` (int): The time budget in seconds (used if `bottleneck` is not 'distance').
      - `max_miles` (int): The maximum distance in miles (used if `bottleneck` is 'distance').
      - `bottleneck` (string): Determines if the reachable range is based on distance or time. Possible values are:
        - `'distance'`: Reachable range is calculated based on maximum distance.
        - Anything else: Reachable range is calculated based on time.

    **Example Request Body:**
    ```json
    {
        "latitude": 37.7749,
        "longitude": -122.4194,
        "time_budget": 3600,
        "max_miles": 50,
        "bottleneck": "time"
    }
    ```

    **Additional Notes:**
    - The `max_miles` value is converted to meters (using the factor `1 mile = 1609.344 meters`) for the TomTom API request if `bottleneck` is set to `'distance'`.
    - The `time_budget` value is used as is if `bottleneck` is not `'distance'`, assuming it's in seconds.

    """
    try:
        # Parse the request data
        data = request.get_json()
        latitude = data.get("latitude")
        longitude = data.get("longitude")
        time_budget = data.get("time_budget")
        max_miles = data.get("max_miles")
        bottleneck = data.get("bottleneck")
        print(max_miles)

        # Input validation
        if not latitude or not longitude or not time_budget or not max_miles:
            return jsonify({"error": "Missing required parameters"}), 400

        # Ensure the data is cast to appropriate types
        try:
            latitude = float(latitude)
            longitude = float(longitude)
            time_budget = int(time_budget)
            max_miles = int(max_miles)
        except ValueError as e:
            return jsonify({"error": "Invalid parameter type"}), 400

        # Base URL for TomTom API
        base_url = "https://api.tomtom.com/routing/1/calculateReachableRange/"

        # Construct the full URL with the provided parameters
        url = f"{base_url}{latitude},{longitude}/json"
        if bottleneck == 'distance':
            params = {
                'report': 'effectiveSettings',
                'distanceBudgetInMeters': max_miles * 1609.344,
                'traffic': 'true',
                'travelMode': 'car',
                'key': TOM_TOM_API_KEY
            }
        else:
            print(time_budget)
            params = {
                'report': 'effectiveSettings',
                'timeBudgetInSec': time_budget,
                'traffic': 'true',
                'travelMode': 'car',
                'key': TOM_TOM_API_KEY
            }

        # Make the API request
        response = requests.get(url, params=params)

        # Check if the response is successful
        if response.status_code == 200:
            return jsonify(response.json()), 200  # Return the response as a JSON object
        else:
            return jsonify({
                "error": f"TomTom API error",
                "status_code": response.status_code,
                "message": response.text
            }), response.status_code

    except Exception as e:
        # Handle unexpected server errors
        return jsonify({"error": str(e)}), 500
