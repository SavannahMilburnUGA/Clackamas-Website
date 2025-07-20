// Map.tsx: exports Map component that displays Esri map & markers for each site in siteData
"use client";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";

import Site, { SiteProps } from "./Site";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

// Define TypeScript interface for Map component props (siteData)
interface MapProps {
    sites: SiteProps[];
} // MapProps


// Return Map component by destructuring MapProps
export default function Map({ sites } : MapProps) {
    return (
    // Full viewport of device - return map window containing Esri map w/ labels & markers for each site in siteData
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
        {sites.map((siteData) => {
            console.log("Mapping Site:", siteData.site, "x:", siteData.x, "y:", siteData.y);
            // Returns Marker for each site in siteData w/ site ID, lat, long, mean AT, mean ST, thermal sensitivity
            return (
                <Marker key={siteData.site} position={[siteData.y, siteData.x]}>
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
            </Marker>
            );
        })}
        </MapContainer>
    </div>
    );
} // Map