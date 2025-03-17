import pandas as pd
import numpy as np
from flask import request, jsonify, Blueprint
import traceback
import io
import json
import time
import os
from io import StringIO
from CSVToGeoJSON import convert_csv_to_geojson_customers, convert_csv_to_geojson_technicians
from FileUtil import load_geojson_from_file, parse_csv_data, process_rows, save_file_copy, save_to_csv, load_old_data, append_to_csv
from Config import CURR_TECHNICIANS_DATA_FILE_GEOJSON, CURR_CUSTOMERS_DATA_FILE_GEOJSON, PREVIOUS_CUSTOMERS_DATA_CSV, CURR_CUSTOMERS_DATA_FILE_CSV, PREVIOUS_TECHNICIANS_DATA_CSV, CURR_TECHNICIANS_DATA_FILE_CSV


map_bp = Blueprint('map', __name__)

# Common function to load and return GeoJSON data


def get_geojson_data(file_path):
    try:
        geojson_data = load_geojson_from_file(file_path)
        if 'error' in geojson_data:
            return jsonify(geojson_data), 500
        return jsonify(geojson_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route for fetching customer GeoJSON data


@map_bp.route('/get-customers-geojson', methods=['GET'])
def get_customers_geojson():
    return get_geojson_data(CURR_CUSTOMERS_DATA_FILE_GEOJSON)

# Route for fetching technician GeoJSON data


@map_bp.route('/get-technicians-geojson', methods=['GET'])
def get_technicians_geojson():
    return get_geojson_data(CURR_TECHNICIANS_DATA_FILE_GEOJSON)


@map_bp.route('/get-csv-column-headers', methods=['POST'])
def get_csv_column_headers():
    if 'csvFile' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['csvFile']

    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    if file:
        try:
            csv_data = pd.read_csv(io.StringIO(
                file.stream.read().decode("utf-8")))
            column_headers = csv_data.columns.tolist()
            return jsonify({"columns": column_headers})
        except Exception as e:
            print(str(e))
            return jsonify({"error": str(e)}), 500

    return jsonify({"error": "Unexpected error"}), 500


def replace_headers(csv_data, header_mappings):
    """
    Replace headers in CSV data according to mappings

    Args:
        csv_data (str): CSV data as a string
        header_mappings (dict): Mapping from expected headers to original headers

    Returns:
        pandas.DataFrame: DataFrame with replaced headers
    """
    # Create a DataFrame from the original CSV data
    original_df = pd.read_csv(StringIO(csv_data))

    # Get headers from the original CSV
    headers = original_df.columns.tolist()

    # Create a new DataFrame with mapped column names
    new_df = pd.DataFrame()

    # Map each header from the original CSV to the corresponding expected header
    for expected_header in header_mappings:
        if header_mappings[expected_header] != 'N/A':
            # If this header is mapped, use the mapping
            new_df[expected_header] = original_df[header_mappings[expected_header]].copy()
        else:
            # If not mapped, have NaN column
            new_df[expected_header] = np.nan

    # Process date fields if needed
    if 'date_added' in new_df.columns:
        new_df['date_added'] = pd.to_datetime(
            new_df['date_added']).dt.strftime('%Y-%m-%d')
    return new_df


# Common function to handle CSV imports
def replace_csv_data(csv_file, header_mappings, prev_csv_path, curr_csv_path, prev_geojson_path, curr_geojson_path, convert_geojson_func):
    try:
        if not csv_file:
            return jsonify({"error": "No file uploaded"}), 400

        # Read the CSV file content
        csv_data = csv_file.read().decode('utf-8')

        new_df = replace_headers(csv_data, header_mappings)

        # Backup the current CSV file to the previous CSV file path
        save_file_copy(curr_csv_path, prev_csv_path)

        # Save the updated DataFrame to CSV
        new_df.to_csv(curr_csv_path, index=False)
        output_file = curr_csv_path

        # Ensure the file exists before proceeding
        while not os.path.exists(output_file):
            print("Waiting for file to be saved...")
            time.sleep(0.5)  # Wait for 0.5 seconds before checking again

        # Load the old data for comparison
        old_data = load_old_data(prev_csv_path)

        # Load the old GeoJSON for reference
        old_geojson = load_geojson_from_file(prev_geojson_path)

        # Convert the new DataFrame to GeoJSON
        geojson = convert_geojson_func(new_df, old_data, old_geojson)

        # Save the updated GeoJSON
        with open(curr_geojson_path, 'w') as geojson_file:
            json.dump(geojson, geojson_file, indent=4)

        return jsonify({
            'status': 'success',
            'message': 'CSV data imported successfully and saved to file',
            'file_path': output_file,
            'geojson_file_path': curr_geojson_path
        }), 200

    except Exception as e:
        # Capture and return detailed error information
        error_msg = f"Error importing CSV data: {str(e)}"
        print(error_msg)
        traceback.print_exc()
        return jsonify({"error": error_msg}), 500

# Common function to handle CSV imports


def append_csv_data(csv_file, header_mappings, prev_csv_path, curr_csv_path, prev_geojson_path, curr_geojson_path, convert_geojson_func):
    try:
        if not csv_file:
            return jsonify({"error": "No file uploaded"}), 400

        # Read the CSV file content
        csv_data = csv_file.read().decode('utf-8')

        new_df = replace_headers(csv_data, header_mappings)

        # Backup the current CSV file to the previous CSV file path
        save_file_copy(curr_csv_path, prev_csv_path)

        new_df = append_to_csv(curr_csv_path, new_df)

        # Load the old data for comparison
        old_data = load_old_data(prev_csv_path)

        # Load the old GeoJSON for reference
        old_geojson = load_geojson_from_file(prev_geojson_path)

        # Convert the new DataFrame to GeoJSON
        geojson = convert_geojson_func(new_df, old_data, old_geojson)

        # Save the updated GeoJSON
        with open(curr_geojson_path, 'w') as geojson_file:
            json.dump(geojson, geojson_file, indent=4)

        return jsonify({
            'status': 'success',
            'message': 'CSV data imported successfully and saved to file',
            'file_path': curr_csv_path,
            'geojson_file_path': curr_geojson_path
        }), 200

    except Exception as e:
        # Capture and return detailed error information
        error_msg = f"Error importing CSV data: {str(e)}"
        print(error_msg)
        traceback.print_exc()
        return jsonify({"error": error_msg}), 500

# Route for replacing customer CSV data


@map_bp.route('/replace-customers-csv-data', methods=['POST'])
def replace_customer_csv_data():
    return replace_csv_data(
        request.files.get('csvFile'),
        getDictionaryFromJSONString(request.form.get('headerMappings')),
        PREVIOUS_CUSTOMERS_DATA_CSV,
        CURR_CUSTOMERS_DATA_FILE_CSV,
        CURR_CUSTOMERS_DATA_FILE_GEOJSON,
        CURR_CUSTOMERS_DATA_FILE_GEOJSON,
        convert_csv_to_geojson_customers
    )

# Route for replacing technician CSV data


@map_bp.route('/replace-technicians-csv-data', methods=['POST'])
def replace_technician_csv_data():
    return replace_csv_data(
        request.files.get('csvFile'),
        getDictionaryFromJSONString(request.form.get('headerMappings')),
        PREVIOUS_TECHNICIANS_DATA_CSV,
        CURR_TECHNICIANS_DATA_FILE_CSV,
        CURR_TECHNICIANS_DATA_FILE_GEOJSON,
        CURR_TECHNICIANS_DATA_FILE_GEOJSON,
        convert_csv_to_geojson_technicians
    )

# Route for replacing customer CSV data


@map_bp.route('/append-customers-csv-data', methods=['POST'])
def append_customer_csv_data():
    return append_csv_data(
        request.files.get('csvFile'),
        getDictionaryFromJSONString(request.form.get('headerMappings')),
        PREVIOUS_CUSTOMERS_DATA_CSV,
        CURR_CUSTOMERS_DATA_FILE_CSV,
        CURR_CUSTOMERS_DATA_FILE_GEOJSON,
        CURR_CUSTOMERS_DATA_FILE_GEOJSON,
        convert_csv_to_geojson_customers
    )

# Route for replacing technician CSV data


@map_bp.route('/append-technicians-csv-data', methods=['POST'])
def append_technician_csv_data():
    return append_csv_data(
        request.files.get('csvFile'),
        getDictionaryFromJSONString(request.form.get('headerMappings')),
        PREVIOUS_TECHNICIANS_DATA_CSV,
        CURR_TECHNICIANS_DATA_FILE_CSV,
        CURR_TECHNICIANS_DATA_FILE_GEOJSON,
        CURR_TECHNICIANS_DATA_FILE_GEOJSON,
        convert_csv_to_geojson_technicians
    )


class InvalidJSONError(Exception):
    """Custom exception for invalid JSON."""
    pass


def getDictionaryFromJSONString(json_string):
    try:
        # Convert the JSON string to a Python dictionary
        return json.loads(json_string)
    except json.JSONDecodeError:
        # Return None or raise an error if the JSON is invalid
        raise InvalidJSONError("Invalid JSON format")
