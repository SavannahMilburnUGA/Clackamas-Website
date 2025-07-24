// Map.tsx: exports Map component that displays Esri map & markers for each site in siteData
"use client";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";

import { useRouter } from 'next/navigation';
import Site, { SiteProps } from "./Site";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Define TypeScript interface for Map component props (siteData)
interface MapProps {
    sites: SiteProps[];
    tempType: 'air' | 'stream' | 'sensitivity'; 
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
    stream: { min: 4.83, max: 21.655}, 
    sensitivity: { min: 0.005, max: 0.526}
};

// Find color on temperature scale based on mean air temperature/stream temperature
const getTempColor = (temp: number, tempType: 'air' | 'stream' | 'sensitivity') : string => {
    const { min, max } = TEMP_RANGES[tempType];
    const normalized = (temp - min) / (max - min);
    const colorIndex = Math.floor(normalized * (TEMP_SCALE.length - 1));
    return TEMP_SCALE[Math.max(0, Math.min(colorIndex, TEMP_SCALE.length - 1))];
};

// Return Map component by destructuring MapProps
export default function Map({ sites, tempType } : MapProps) {
    // Adding dynamic routing for each site click
    const router = useRouter();
    // Handle clicking on site marker to navigate to dynamic site page
    const handleSiteClick = (id: number) => {
        router.push(`/site/${id}`);
    }; // handleSiteClick

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
            const siteTemp = tempType === 'air' ? siteData.meanAirTemp : 
                                tempType === 'stream' ? siteData.meanStreamTemp : siteData.thermalSensitivity;
            const siteMarkerColor = getTempColor(siteTemp, tempType);
            // Number sites with custom numbered icon
            const numIcon = L.divIcon({
                html: `<div style="
                    background-color: ${siteMarkerColor};
                    border: 1px solid ${siteMarkerColor};
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 11px;
                    font-weight: bold;
                    font-family: Merriweather, sans-serif;
                    color: white;
                ">${siteData.index}</div>`,
                className: 'custom-marker',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            }); // numIcon
            // Returns Marker for each site in siteData w/ site ID, lat, long, mean AT, mean ST, thermal sensitivity
            return (
            <Marker key={siteData.index} position={[siteData.y, siteData.x]} icon={numIcon}>
                <Popup>
                    <div className="MarkerPopup">
                        <Site
                            site={siteData.site}
                            x={siteData.x}
                            y={siteData.y}
                            meanAirTemp={siteData.meanAirTemp}
                            meanStreamTemp={siteData.meanStreamTemp}
                            thermalSensitivity={siteData.thermalSensitivity}
                            index={siteData.index}
                            Stream_Nam={siteData.Stream_Nam}
                            SLOPE={siteData.SLOPE}
                            h2oHiCascP={siteData.h2oHiCascP}
                            h2oWetland={siteData.h2oWetland}
                            Shrub21={siteData.Shrub21}
                            BurnRCA={siteData.BurnRCA}
                        />
                        <div className="mt-3 pt-3 border-t border-gray-200">
                            <button onClick={() => handleSiteClick(siteData.index)} className="w-full bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors">
                                View Site Graph
                            </button>
                        </div>
                    </div>
                </Popup>
            </Marker>
            );
        })}
        </MapContainer>
    </div>
    );
} // Map