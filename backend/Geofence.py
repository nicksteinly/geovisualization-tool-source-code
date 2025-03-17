import json
from shapely.geometry import shape
from flask import request, jsonify, Blueprint
from Config import CURR_TECHNICIANS_DATA_FILE_GEOJSON, CURR_CUSTOMERS_DATA_FILE_GEOJSON

# Initialize the geofence blueprint
geofence_bp = Blueprint('geofence', __name__)


def load_geojson_data():
    """
    Load the latest GeoJSON data from files.
    This ensures we always have the most up-to-date data.

    Returns:
        tuple: (technicians_geojson, customers_geojson)
    """
    try:
        with open(CURR_TECHNICIANS_DATA_FILE_GEOJSON) as file:
            technicians_geojson = json.load(file)

        with open(CURR_CUSTOMERS_DATA_FILE_GEOJSON) as file:
            customers_geojson = json.load(file)

        return technicians_geojson, customers_geojson
    except Exception as e:
        print(f"Error loading GeoJSON data: {e}")
        # Return empty GeoJSON structures if loading fails
        empty_geojson = {"type": "FeatureCollection", "features": []}
        return empty_geojson, empty_geojson

# Endpoint to calculate technician and customer density within a geofence


@geofence_bp.route('/get-geofence-data', methods=['POST'])
def getGeofenceData():
    """
    Endpoint to calculate technician and customer density within a geofence.

    Request Body:
    - 'coordinates': List of coordinates defining the geofence polygon.

    Response:
    - 'customer_count': The total number of customers within the geofence.
    - 'technician_count': The total number of technicians within the geofence.
    - 'customer_density_per_10_mile2': Customer density (per 100 mi²) within the geofence.
    - 'technician_density_per_10_mile2': Technician density (per 100 mi²) within the geofence.
    """
    try:
        # Load the latest GeoJSON data
        technicians_geojson, customers_geojson = load_geojson_data()

        # Parse request data
        data = request.get_json()
        geofence_coordinates = data.get("coordinates")

        # Ensure that coordinates are provided in the request
        if not geofence_coordinates:
            return jsonify({"error": "Missing required parameters"}), 400

        # Create a geofence polygon using the provided coordinates
        geofence_polygon = shape({
            "type": "Polygon",
            "coordinates": [geofence_coordinates]
        })

        # Helper function to count the number of people (technicians/customers) inside the geofence polygon
        def count_people_in_geojson(geojson_data):
            count = 0
            for feature in geojson_data.get("features", []):
                point = shape(feature["geometry"])
                # Check if the point is within the geofence polygon
                if point.within(geofence_polygon):
                    count += 1
            return count

        # Count the number of technicians and customers inside the geofence
        technician_count = count_people_in_geojson(technicians_geojson)
        customer_count = count_people_in_geojson(customers_geojson)

        # Calculate the area of the geofence polygon in square meters
        geofence_area_m2 = geofence_polygon.area  # Area in square meters
        # Convert the area from square meters to square miles
        square_meters_to_square_miles_conversion = 2_589_988.1103
        geofence_area_miles = geofence_area_m2 / \
            square_meters_to_square_miles_conversion

        # Calculate customer and technician density per 100 square miles
        customer_density_per_100_mile2 = (
            customer_count / (geofence_area_miles * 10000)) if geofence_area_miles > 0 else 0
        technician_density_per_100_mile2 = (
            technician_count / (geofence_area_miles * 10000)) if geofence_area_miles > 0 else 0

        # Prepare and return the response
        response = {
            "customer_count": customer_count,
            "technician_count": technician_count,
            "customer_density_per_10_mile2": customer_density_per_100_mile2,
            "technician_density_per_10_mile2": technician_density_per_100_mile2,
        }
        return jsonify(response)

    except Exception as e:
        # Handle any unexpected errors with proper error message
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
