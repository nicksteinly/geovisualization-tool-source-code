from flask import jsonify, json, request, Blueprint
import os
import sys
from dotenv import load_dotenv

# Base directory for the app (Check if running from a bundled executable)
if getattr(sys, 'frozen', False):  # App is frozen (packaged by PyInstaller)
    base_dir = sys._MEIPASS  # Use the temporary folder where PyInstaller extracts files
else:  # App is running from source code (development mode)
    base_dir = os.path.abspath(os.path.dirname(__file__))

# Load environment variables from the .env file
load_dotenv(os.path.join(base_dir, 'env', '.env'))

# Access environment variables with default values if not found
ACCESS_TOKEN = os.getenv('ACCESS_TOKEN', 'access-token')
TOM_TOM_API_KEY = os.getenv('TOM_TOM_API_KEY', 'tom-tom-api-key')

# Path to map legend config
MAP_LEGEND_CONFIG = os.path.join(base_dir, 'data', 'map_legend_config.json')

# Paths to GeoJSON and CSV files containing technicians and customers data
CURR_TECHNICIANS_DATA_FILE_GEOJSON = os.path.join(
    base_dir, 'data', 'technicians_data.json')
CURR_CUSTOMERS_DATA_FILE_GEOJSON = os.path.join(
    base_dir, 'data', 'customers_data.json')

CURR_CUSTOMERS_DATA_FILE_CSV = os.path.join(
    base_dir, 'data', 'customers_curr.csv')
PREVIOUS_CUSTOMERS_DATA_CSV = os.path.join(
    base_dir, 'data', 'customers_prev.csv')

CURR_TECHNICIANS_DATA_FILE_CSV = os.path.join(
    base_dir, 'data', 'technicians_curr.csv')
PREVIOUS_TECHNICIANS_DATA_CSV = os.path.join(
    base_dir, 'data', 'technicians_prev.csv')

config_bp = Blueprint('config', __name__)

# Function to read the configuration file


def read_config():
    """
    Reads the configuration data from the JSON file specified in MAP_LEGEND_CONFIG.

    Returns:
        dict: The configuration data as a dictionary, or an error message if reading the file fails.
    """
    try:
        with open(MAP_LEGEND_CONFIG, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(str(e))
        return {"error": str(e)}

# Helper function to write to the configuration file


def write_config(config_data):
    """
    Writes the provided configuration data to the configuration file.

    Args:
        config_data (dict): The data to be written to the configuration file.

    Returns:
        dict: A success message, or an error message if writing the file fails.
    """
    try:
        with open(MAP_LEGEND_CONFIG, 'w') as file:
            json.dump(config_data, file, indent=4)
    except Exception as e:
        return {"error": str(e)}

# Endpoint to get the TomTom API key


@config_bp.route('/get-tomtom-api-key', methods=['GET'])
def get_tomtom_api_key():
    """
    Endpoint to fetch the TomTom API key from environment variables.

    Returns:
        JSON: A response containing the API key or an error message if the key is not found.
    """
    try:
        api_key = os.getenv('TOM_TOM_API_KEY')
        if api_key:
            return jsonify({'api_key': api_key})
        else:
            return jsonify({'error': 'API key not found'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint to get the map legend colors (customer and technician icon colors)


@config_bp.route('/get-map-legend-colors')
def get_map_legend_config():
    """
    Endpoint to get the map legend configuration, specifically the customer and technician icon colors.

    Returns:
        JSON: A response containing the customer and technician icon colors, or an error message if not found.
    """
    try:
        # Attempt to read the configuration file
        config = read_config()

        # Check if the required color configuration exists
        if "customerIconColor" in config and "technicianIconColor" in config:
            return jsonify({
                "customerIconColor": config["customerIconColor"],
                "technicianIconColor": config["technicianIconColor"]
            })
        # If the color configuration is not found in the file, return an error
        return jsonify({"error": "Color configuration not found"}), 404

    except Exception as e:
        # If an error occurs (e.g., file not found, JSON error), catch and return a 500 error
        return jsonify({"error": f"An error occurred while reading the configuration: {str(e)}"}), 500

# Endpoint to update the map legend colors


@config_bp.route('/update-map-legend-colors', methods=['POST'])
def update_colors():
    """
    Endpoint to update the map legend colors for customer and technician icons.

    Args:
        JSON request: Contains the customerIconColor and technicianIconColor fields.

    Returns:
        JSON: A response indicating the success or failure of the update operation.
    """
    try:
        # Get the data from the request
        data = request.get_json()

        # Read the current configuration
        config = read_config()

        # Update the colors in the config
        config["customerIconColor"] = data["customerIconColor"]
        config["technicianIconColor"] = data["technicianIconColor"]

        # Write the updated config back to the file
        write_config(config)

        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
