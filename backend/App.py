import logging
import os
from flask import Flask
from flask_cors import CORS
from NearestTechnicians import technicians_bp
from Config import config_bp
from MapUpload import map_bp
from DrivingIsochrone import driving_isochrone_bp
from Geofence import geofence_bp
from waitress import serve  # Import Waitress

# Initialize the Flask application
app = Flask(__name__)
# app.debug = True
# CORS Configuration (commented out for security reasons in production)
CORS(app, origins="*")

# Register blueprints for different modules

app.register_blueprint(technicians_bp, url_prefix='/technicians')
app.register_blueprint(map_bp, url_prefix='/map')
app.register_blueprint(config_bp, url_prefix='/config')
app.register_blueprint(driving_isochrone_bp, url_prefix='/driving-isochrone')
app.register_blueprint(geofence_bp, url_prefix='/geofence')

# Run the application (development)
if __name__ == '__main__':
    app.run()

# Run the application using Waitress
# if __name__ == '__main__':
#     serve(app, host="127.0.0.1", port=5000)
