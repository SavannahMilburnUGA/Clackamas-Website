// Map.tsx: exports Map component that displays Esri map & markers for each site in siteData
"use client";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";

import Site, { SiteProps } from "./Site";
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';

// Define TypeScript interface for Map component props (siteData)
interface MapProps {
    sites: SiteProps[];
    tempType: 'air' | 'stream'; 
} // MapProps

// Declaring 38 colors for temperature scale
const TEMP_SCALE = [
    '#e4f0ff', '#dce9fa', '#d3e2f7', '#cbdbf4', 
    '#c1d4ed', '#b7ceea', '#afc6e6', '#a7bfe3',
    '#9cb8df', '#93b1d7', '#89a5cd', '#7f9bc3', 
    '#7591b9', '#607ba6', '#56719c', '#4d6591', 
    '#415c87', '#39517f', '#2f4775', '#26436f', 
    '#254f77', '#275b81', '#27678a', '#287593', 
    '#438190', '#648d89', '#879a84', '#aba87d', 
    '#c2ab75', '#c19d61', '#c38a53', '#be704c', 
    '#af4d4e', '#9f294c', '#87203e', '#6e1531', 
    '#540d26', '#3e0216'
]

// Declaring ranges for daily mean air temperature/stream temperature
const TEMP_RANGES = {
    air: { min: 16.892, max: 21.573},
    stream: { min: 4.83, max: 21.655}
};

// Find color on temperature scale based on mean air temperature/stream temperature
const getTempColor = (temp: number, tempType: 'air' | 'stream') : string => {
    const { min, max } = TEMP_RANGES[tempType];
    const normalized = (temp - min) / (max - min);
    const colorIndex = Math.floor(normalized * (TEMP_SCALE.length - 1));
    return TEMP_SCALE[Math.max(0, Math.min(colorIndex, TEMP_SCALE.length - 1))];
};

// Return Map component by destructuring MapProps
export default function Map({ sites, tempType } : MapProps) {
    console.log("Map component received tempType:", tempType);
    return (
    // Full viewport of device - return map window containing Esri map w/ labels & markers for each site in siteData
    <div style={{ height: '100vh', width: '100vw' }}>
        <MapContainer center={[45.12, -122.15]} zoom={10} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}"
            attribution="&copy; Esri"
        />
        <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer/tile/{z}/{y}/{x}"
            attribution="&copy; Esri"
        />
        {sites.map((siteData) => {
            console.log("Mapping Site:", siteData.site, "x:", siteData.x, "y:", siteData.y);
            // Finding site temperature & color 
            const siteTemp = tempType === 'air' ? siteData.meanAirTemp : siteData.meanStreamTemp;
            const siteMarkerColor = getTempColor(siteTemp, tempType);
            // Returns Marker for each site in siteData w/ site ID, lat, long, mean AT, mean ST, thermal sensitivity
            return (
            <CircleMarker key={siteData.site} center={[siteData.y, siteData.x]} radius = {8} pathOptions={{fillColor: siteMarkerColor, color: siteMarkerColor, fillOpacity: 1.0, weight: 1}}>
                <Popup>
                    <div className="MarkerPopup">
                        <Site
                            site={siteData.site}
                            x={siteData.x}
                            y={siteData.y}
                            meanAirTemp={siteData.meanAirTemp}
                            meanStreamTemp={siteData.meanStreamTemp}
                            thermalSensitivity={siteData.thermalSensitivity}
                        />
                    </div>
                </Popup>
            </CircleMarker>
            );
        })}
        </MapContainer>
    </div>
    );
} // Map