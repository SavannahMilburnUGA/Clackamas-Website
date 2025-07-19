"use client";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export default function Map() {
    return (
    <div style={{ height: '100vh', width: '100vw' }}>
        <MapContainer center={[45.12, -122.15]} zoom={9} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}"
                attribution="&copy; Esri"
            />
        <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer/tile/{z}/{y}/{x}"
            attribution="&copy; Esri"
        />
        <Marker position={[51.505, -0.09]}>
            <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
        </Marker>
        </MapContainer>
    </div>
    );
}
// USGS Topographic (perfect for your Clackamas River project!)


// // USGS Imagery 
// 

// // OpenTopoMap
// 