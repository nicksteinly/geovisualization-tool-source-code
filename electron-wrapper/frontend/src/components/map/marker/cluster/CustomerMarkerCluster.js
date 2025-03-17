// CustomerMarker.js
import MarkerCluster from './MarkerCluster';
import { CustomerPopup } from '../popup/CustomerPopup';

class CustomerMarkerCluster extends MarkerCluster {
  constructor(sourceId, mapInstance, data, color, size, setSelectedLocation, selectIcon, clusterOptions = {}) {
    super(sourceId, mapInstance, data, color, size, setSelectedLocation, selectIcon, CustomerPopup, clusterOptions)
  }

}

export default CustomerMarkerCluster;
