// SitePage.tsx = site/[id]/page.tsx: Dynamic page for displaying each site's unique thermal sensitivity
"use client"
import Papa from 'papaparse';
// airTemperature2021.csv = site - date - tmean_C, tmin_C, tmax_C
// CRBStreamTemperatureMMM2021.csv = siteID - date - dailyMeanST - dailyMinST - dailyMaxST - timeMinST - timeMaxST
// coordinates2021.csv - lat - lon - siteID

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; 

// Define TypeScript interfaces for SitePage components props - ST/AT/coordinate data can be passed
interface AirTempProps {
    site: number;
    date: string;
    tmean_C: number;
    tmin_C: number;
    tmax_C: number;
} // AirTempProps
interface StreamTempProps {
    siteID: number;
    date: string;
    dailyMeanST: number;
    dailyMinST: number;
    dailyMaxST: number;
    timeMinST: string;
    timeMaxST: string;
} // StreamTempProps
interface CoordinateProps {
    lat: number;
    lon: number;
    siteID: number;
} // CoordinateProps
interface CombinedMeanTempProps {
    date: string;
    tmean_C: number;
    dailyMeanST: number;
} // CombinedMeanTempProps


// Return SitePage component
export default function SitePage () {
    const params = useParams();
    const id = params.id as string;

    // useState for AirTempProps, StreamTempProps, CoordinateProps, CombinedMeanTempProps
    const[airTempData, setAirTempData] = useState<AirTempProps[]>([]);
    const[streamTempData, setStreamTempData] = useState<StreamTempProps[]>([]);
    const[coordinateData, setCoordinateData] = useState<CoordinateProps[]>([]);
    const[combinedMeanTempData, setCombinedMeanTempData] = useState<CombinedMeanTempProps[]>([]);
    const[isLoading, setIsLoading] = useState(true);

  // Using useEffect for data loading of AT/ST and coordinates using Papa Parse to load CSV file
  useEffect(() => {
    let loadedFiles = 0;
    const checkIfLoaded = () => {
        loadedFiles++;
        if (loadedFiles === 3) {
            setIsLoading(false);
        } // if
    }; // checkIfLoaded

    // Don't need .then() statements since PapaParse handles promises internally
    // AT data
    Papa.parse('/data/airTemperature2021.csv', {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (results) => {
      setAirTempData(results.data as AirTempProps[]);
      checkIfLoaded();
      }, // complete
      error: (error) => {
        console.log("Air Temp CSV loading error:", error);
        checkIfLoaded();
      } // error
    }); // Papa.parse for AT

    // ST data
    Papa.parse('/data/CRBStreamTemperatureMMM2021.csv', {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (results) => {
      setStreamTempData(results.data as StreamTempProps[]);
      checkIfLoaded();
      }, // complete
      error: (error) => {
        console.log("Stream Temp CSV loading error:", error);
        checkIfLoaded();
      } // error
    }); // Papa.parse for ST

    // Coordinates data
    Papa.parse('/data/coordinates2021.csv', {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (results) => {
      setCoordinateData(results.data as CoordinateProps[]);
      checkIfLoaded();
      }, // complete
      error: (error) => {
        console.log("Coordinates CSV loading error:", error);
        checkIfLoaded();
      } // error
    }); // Papa.parse for coordinates
  }, []); // useEffect - runs once on mount - data loading

  // Combine AT and ST data for current site after data is loaded
  useEffect(() => {
    if(!isLoading && airTempData.length > 0 && streamTempData.length > 0) {
        const currentID = parseInt(id);

        // Filter data for current site using site ID
        const siteAirData = airTempData.filter(data => data.site === currentID);
        const siteStreamData = streamTempData.filter(data => data.siteID === currentID);

        // Combine AT and ST data by dates
        const combinedData: CombinedMeanTempProps[] = [];
        siteAirData.forEach(airData => {
            const match = siteStreamData.find(streamData => streamData.date === airData.date);
            if (match) {
                combinedData.push({
                    date: airData.date,
                    tmean_C: airData.tmean_C,
                    dailyMeanST: match.dailyMeanST
                }); // add to combinedData
            } // if
        }); // combinedData
        setCombinedMeanTempData(combinedData);
    } // if

  }, [isLoading, airTempData, streamTempData, id]); // useEffect - combining AT and ST data 

  // Find coordinates for current site
  const siteCoords = coordinateData.find(coord => coord.siteID === parseInt(id));

  return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header with back navigation */}
                <div className="mb-6">
                    <button 
                        onClick={() => window.history.back()}
                        className="text-blue-600 hover:text-blue-800 mb-4"
                    >
                        ← Back to Map
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Thermal Sensitivity for Site {id}
                    </h1>
                </div>
                
                {/* Loading state */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <p className="text-lg text-gray-600">Loading site data...</p>
                    </div>
                ) : (
                    <div>
                        {/* Graph container - Plotly component will go here in next steps */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="h-96 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                                <div className="text-center text-gray-500">
                                    <p className="text-xl mb-2">Graph will be rendered here</p>
                                    <p>Site {id} has {combinedMeanTempData.length} daily temperature readings</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Debug info - remove in production */}
                        <div className="mt-4 p-4 bg-gray-100 rounded text-sm">
                            <p><strong>Debug Info:</strong></p>
                            <p>Site ID: {id}</p>
                            <p>Combined data points: {combinedMeanTempData.length}</p>
                            <p>Air temp data points: {airTempData.filter(d => d.site === parseInt(id)).length}</p>
                            <p>Stream temp data points: {streamTempData.filter(d => d.siteID === parseInt(id)).length}</p>
                            {combinedMeanTempData.length > 0 && (
                                <p>Sample: {combinedMeanTempData[0].date} - Air: {combinedMeanTempData[0].tmean_C}°C, Stream: {combinedMeanTempData[0].dailyMeanST}°C</p>
                            )}
                            {siteCoords && (
                                <p>Coordinates: ({siteCoords.lat}, {siteCoords.lon})</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} // SitePage.tsx