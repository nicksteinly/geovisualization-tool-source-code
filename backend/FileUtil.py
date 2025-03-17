import csv
import io
import json
from datetime import datetime
import pandas as pd
import os


def parse_csv_data(csv_data):
    """Helper function to parse CSV data"""
    if not csv_data:
        raise ValueError('No CSV data provided')

    csv_file = io.StringIO(csv_data)
    reader = csv.reader(csv_file)
    try:
        headers = next(reader)
    except StopIteration:
        raise ValueError('CSV is empty')

    return headers, reader


def save_file_copy(source_path, destination_path):
    try:
        with open(source_path, 'rb') as src_file:
            with open(destination_path, 'wb') as dest_file:
                dest_file.write(src_file.read())

        print(f"File successfully copied to: {destination_path}")
    except Exception as e:
        print(f"Error while copying the file: {e}")


def load_geojson_from_file(file_path):
    """Helper function to load GeoJSON data from a file"""
    try:
        with open(file_path, 'r') as f:
            geojson_data = json.load(f)
        return geojson_data
    except Exception as e:
        return {'error': f"Failed to load GeoJSON data from file: {str(e)}"}


def validate_required_fields(headers, required_fields):
    """Helper function to validate required fields in CSV headers"""
    missing_fields = [
        field for field in required_fields if field not in headers]
    if missing_fields:
        raise ValueError(
            f'Missing required fields: {", ".join(missing_fields)}')


def process_rows(reader, headers, date_field=None):
    """Helper function to process the rows and handle date conversion"""
    rows = []
    for row in reader:
        row_dict = dict(zip(headers, row))

        if date_field and date_field in row_dict:
            try:
                row_dict[date_field] = datetime.strptime(
                    row_dict[date_field], '%Y-%m-%d')
            except ValueError:
                raise ValueError(f"Invalid date format in row: {row}")

        rows.append(row_dict)
    return rows


def save_to_csv(rows, headers, filepath):
    """Helper function to save data to a CSV file"""
    output_file = filepath

    with open(filepath, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=headers)

        writer.writeheader()
        writer.writerows(rows)

    return output_file


def are_equal(value1, value2):
    """
    Checks if two values are equal, accounting for NaN equivalence.

    Args:
        value1: First value to compare.
        value2: Second value to compare.

    Returns:
        bool: True if values are equal, False otherwise.
    """
    if pd.isna(value1) and pd.isna(value2):
        return True
    return value1 == value2


def load_old_data(old_file_path):
    """
    Loads old data from a CSV file.

    Args:
        old_file_path (str): The path to the old CSV file.

    Returns:
        pd.DataFrame: Dataframe containing the old data.
    """
    try:
        old_data = pd.read_csv(old_file_path)
        return old_data
    except Exception as e:
        print(f"Error loading old data: {e}")
        return None


def append_to_csv(file_path, new_data):
    """
    Appends new data (Pandas DataFrame) to an existing CSV file or creates a new file if it doesn't exist.
    Returns the updated DataFrame.

    Args:
        file_path (str): Path to the CSV file.
        new_data (pd.DataFrame): DataFrame where columns match the CSV headers.

    Returns:
        pd.DataFrame: Updated DataFrame with appended data.
    """
    try:
        file_exists = os.path.exists(file_path)

        # Ensure new_data is a DataFrame
        if not isinstance(new_data, pd.DataFrame):
            raise TypeError("new_data must be a Pandas DataFrame.")

        if new_data.empty:
            raise ValueError("No data provided to append.")

        # Append data, writing headers only if the file doesn't exist
        new_data.to_csv(file_path, mode='a',
                        header=not file_exists, index=False, encoding='utf-8')

        print("Data successfully appended.")

        # Return the updated DataFrame
        return pd.read_csv(file_path)

    except Exception as e:
        print(f"An error occurred: {e}")
        return None
