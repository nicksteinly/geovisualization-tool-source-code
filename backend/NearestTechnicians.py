from flask import Flask, request, jsonify, json, Blueprint
import requests
import os
from datetime import datetime
from geopy.distance import geodesic
from Config import TOM_TOM_API_KEY
from Config import CURR_TECHNICIANS_DATA_FILE_GEOJSON, CURR_CUSTOMERS_DATA_FILE_GEOJSON

technicians_bp = Blueprint('technicians', __name__)


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


def parse_technicians(data):
    """Extracts technician details from the GeoJSON data."""
    technicians = []
    for feature in data.get("features", []):
        name = feature["properties"].get("name")
        coordinates = feature["geometry"].get("coordinates")
        if name and coordinates:
            technicians.append({
                "name": name,
                "location": (coordinates[1], coordinates[0])
            })
    return technicians


def getCustomerLocation(customer_name, customers_geojson):
    """
    Retrieves the location (latitude, longitude) of a customer by name from GeoJSON data.
    """
    for feature in customers_geojson.get("features", []):
        properties = feature.get("properties", {})
        geometry = feature.get("geometry", {})
        if properties.get("name") == customer_name:
            coordinates = geometry.get("coordinates")
            if coordinates and len(coordinates) == 2:
                return coordinates[1], coordinates[0]
    return None


def filter_technicians_within_radius(technicians, customer_location, max_radius_miles):
    customer_coords = (customer_location["lat"], customer_location["lng"])
    return [
        technician for technician in technicians
        if geodesic(customer_coords, technician["location"]).miles <= max_radius_miles
    ]


@technicians_bp.route('/nearest-technicians', methods=['POST'])
def get_technicians_within_time_budget():
    try:
        # Load the latest GeoJSON data
        technicians_geojson, customers_geojson = load_geojson_data()

        data = request.get_json()

        customer_location = data.get(
            "customer_location")  # Expecting { lat, lng }
        time_budget = data.get("time_budget")  # In seconds
        max_miles = data.get("max_miles")
        bottleneck = data.get("bottleneck")

        if not customer_location:
            return jsonify({"error": "Customer location required"}), 400
        if not isinstance(customer_location, dict) or not all(k in customer_location for k in ("lat", "lng")):
            return jsonify({"error": "Customer location must include 'lat' and 'lng'"}), 400
        if time_budget is None:
            return jsonify({"error": "Time budget required"}), 400

        technicians_data = parse_technicians(technicians_geojson)

        if bottleneck == 'time':
            filtered_technicians = filter_technicians_within_radius(
                technicians_data, customer_location, time_budget / 60 * 2.5)  # !!!!!! ASSUMPTION that the max distance that can be traveled within the time budget for the chosen region is under (2.5 * time_budget_in_minutes) miles, this is soley for narrowing down amount of technicians to actually make api calls for
        else:
            filtered_technicians = filter_technicians_within_radius(
                technicians_data, customer_location, max_miles)

        nearby_technicians = []

        for technician in filtered_technicians:
            # Call TomTom API for route information
            origin = f"{technician['location'][0]},{technician['location'][1]}"
            destination = f"{customer_location['lat']},{customer_location['lng']}"
            url = f"https://api.tomtom.com/routing/1/calculateRoute/{origin}:{destination}/json"

            params = {
                "key": TOM_TOM_API_KEY,
                "traffic": "true",
                "travelMode": "car",
                "computeTravelTimeFor": "all"
            }

            response = requests.get(url, params=params)
            if response.status_code == 200:
                route_data = response.json()
                if route_data and route_data.get("routes"):
                    route = route_data["routes"][0]
                    summary = route["summary"]

                    travel_time = summary.get(
                        "travelTimeInSeconds", float("inf"))
                    if bottleneck == 'distance' or travel_time <= time_budget:
                        no_traffic_time = summary.get(
                            "noTrafficTravelTimeInSeconds", 0)
                        historic_traffic_time = summary.get(
                            "historicTrafficTravelTimeInSeconds", 0)
                        live_traffic_incidents_time = summary.get(
                            "liveTrafficIncidentsTravelTimeInSeconds", 0)

                        nearby_technicians.append({
                            "name": technician["name"],
                            # Convert meters to miles
                            "driving_distance": f"{summary['lengthInMeters'] / 1609.34:.1f} miles",
                            # Convert seconds to minutes
                            "estimated_duration": f"{travel_time // 60} minutes",
                            # Convert seconds to minutes
                            "duration_in_traffic": f"{summary.get('trafficDelayInSeconds', 0) // 60} minutes",
                            # Convert seconds to minutes
                            "no_traffic_travel_time": f"{no_traffic_time // 60} minutes",
                            # Convert seconds to minutes
                            "historic_traffic_travel_time": f"{historic_traffic_time // 60} minutes",
                            # Convert seconds to minutes
                            "live_traffic_incidents_travel_time": f"{live_traffic_incidents_time // 60} minutes",
                            "location": technician["location"]
                        })
            else:
                print(
                    f"Failed to fetch data from TomTom API: {response.status_code}, {response.text}")

        # Sort technicians by driving distance
        nearby_technicians.sort(key=lambda x: float(
            x["driving_distance"].split()[0]))

        return jsonify({
            "customerLocation": customer_location,
            "timeBudget": time_budget,
            "techniciansFound": len(nearby_technicians),
            "technicians": nearby_technicians
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
