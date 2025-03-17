import pandas as pd
import traceback
import time
from Geocode import geocode_address
from FileUtil import are_equal


def safely_get_value(row, column, default=''):
    """Safely extract a value from a DataFrame row."""
    value = row.get(column, default)
    return str(value) if pd.notna(value) else default


def create_geojson_feature(feature_type, coordinates, properties):
    """Create a standardized GeoJSON feature."""
    return {
        "type": "Feature",
        "geometry": {
            "type": feature_type,
            "coordinates": coordinates
        },
        "properties": properties
    }


def find_matching_feature(features, id_field, id_value):
    """Find a matching feature in existing GeoJSON based on ID field."""
    for feature in features:
        if feature['properties'].get(id_field) == id_value:
            return feature
    return None


def convert_csv_to_geojson_base(new_df, old_df, old_geojson, id_field, process_row_func):
    """Base function to convert CSV data to GeoJSON with customizable row processing."""
    geojson_features = []
    iterated_ids = set()
    for index, row in new_df.iterrows():
        try:
            # Process the row using the provided function
            id_value = row.get(id_field, None)
            if id_value is None:
                print(f"Skipping row {index} because id_field is missing")
                continue
            elif id_value in iterated_ids:
                print(f"Skipping row {index} because id_field is duplicate")
                continue
            iterated_ids.add(id_value)
            # This will return feature data or None if the row should be skipped
            feature_data = process_row_func(
                row, index, old_df, old_geojson, id_field)

            if feature_data:
                geojson_features.append(feature_data)

        except Exception as e:
            print(f"Error processing row {index}; error: {e}")
            traceback.print_exc()
            continue  # Skip the current row and continue with the next one

    # Create GeoJSON object
    geojson = {
        "type": "FeatureCollection",
        "features": geojson_features
    }

    return geojson


def process_location_row(row, index, old_df, old_geojson, id_field):
    """Process a row for location data."""
    # Safe extraction of address fields to handle missing columns
    new_address_parts = {
        'address_one': safely_get_value(row, 'address_one'),
        'address_two': safely_get_value(row, 'address_two'),
        'city': safely_get_value(row, 'city'),
        'state': safely_get_value(row, 'state'),
        'zipcode': safely_get_value(row, 'zipcode'),
        'country': safely_get_value(row, 'country')
    }

    full_address = f"{new_address_parts['address_one']} {new_address_parts['address_two']} {new_address_parts['city']} {new_address_parts['state']} {new_address_parts['zipcode']} {new_address_parts['country']}".strip()

    # Safely check the presence of id_field column
    id_value = row.get(id_field, None)
    if id_value is None:
        print(f"Skipping row {index} because id_field is missing")
        return None

    lat, lon = None, None

    if not old_df[old_df.get(id_field, None) == id_value].empty:
        matching_feature = None
        old_entry = old_df[old_df.get(id_field, None) == id_value].iloc[0]
        repeated_address = False
        # print(old_df[old_df.get(id_field, None) == id_value].iloc[0])
        if not old_entry.empty:
            # Compare if all addresses are equal safely
            repeated_address = (
                are_equal(old_entry.get('address_one', ''), row.get('address_one', '')) and
                are_equal(old_entry.get('address_two', ''), row.get('address_two', '')) and
                are_equal(old_entry.get('city', ''), row.get('city', '')) and
                are_equal(old_entry.get('state', ''), row.get('state', '')) and
                are_equal(old_entry.get('zipcode', ''), row.get('zipcode', '')) and
                are_equal(old_entry.get('country', ''), row.get('country', ''))
            )

        if repeated_address:
            matching_feature = find_matching_feature(
                old_geojson['features'], id_field, id_value)

            if matching_feature:
                lat, lon = matching_feature['geometry']['coordinates'][1], matching_feature['geometry']['coordinates'][0]
                print("not geocoding: stored id and new address matches old address")
            else:
                print("geocoding reason: stored id, geojson matching feature not found")
                lat, lon = geocode_address(full_address)
                time.sleep(0.25)  # Avoid too many requests
        else:
            print("geocoding reason: stored id, new address")
            lat, lon = geocode_address(full_address)
            time.sleep(0.25)  # Avoid too many requests
    else:
        print("geocoding reason: not stored id")
        lat, lon = geocode_address(full_address)
        time.sleep(0.25)  # Avoid too many requests

    if lat and lon:
        properties = {
            id_field: id_value,
            "name": row.get('name', ''),
            "address_one": new_address_parts['address_one'],
            "address_two": new_address_parts['address_two'],
            "city": new_address_parts['city'],
            "state": new_address_parts['state'],
            "zipcode": new_address_parts['zipcode'],
            "country": new_address_parts['country'],
        }

        return create_geojson_feature("Point", [lon, lat], properties)
    else:
        print(f"Could not geocode {full_address}")
        return None


def convert_csv_to_geojson_customers(new_df, old_df, old_geojson):
    """Convert location CSV data to GeoJSON."""
    return convert_csv_to_geojson_base(
        new_df,
        old_df,
        old_geojson,
        'cnum',
        process_location_row
    )


def convert_csv_to_geojson_technicians(new_df, old_df, old_geojson):
    """Convert technician CSV data to GeoJSON."""
    return convert_csv_to_geojson_base(
        new_df,
        old_df,
        old_geojson,
        'id',
        process_location_row
    )
