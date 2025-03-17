// TechnicianMarker.js
import MarkerCluster from './MarkerCluster';
import { TechnicianPopup } from '../popup/TechnicianPopup';


class TechnicianMarkerCluster extends MarkerCluster {
  constructor(sourceId, mapInstance, data, color, size, setSelectedLocation, selectIcon, clusterOptions = {}) {
    super(sourceId, mapInstance, data, color, size, setSelectedLocation, selectIcon, TechnicianPopup, clusterOptions)
  }

}

export default TechnicianMarkerCluster;
