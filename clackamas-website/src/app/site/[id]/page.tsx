// SitePage.tsx = site/[id]/page.tsx: Dynamic page for displaying each site's unique thermal sensitivity
"use client"
import Papa from 'papaparse';
// airTemperature2021.csv = site - date - tmean_C, tmin_C, tmax_C
// CRBStreamTemperatureMMM2021.csv = siteID - date - dailyMeanST - dailyMinST - dailyMaxST - timeMinST - timeMaxST
// coordinates2021.csv - lat - lon - siteID

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; 

import dynamic from 'next/dynamic'
const Plot = dynamic(() => import('react-plotly.js'), {ssr: false});

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

// For Plot
interface LinRegProps {
    slope: number;
    intercept: number;
    rSquared: number;
} // LinRegProps

// Adding landscape covariates
interface landscapeEVsProps {
    site: number;
    Stream_Nam: string;
    x: number;
    y: number;
    meanAirTemp: number;
    meanStreamTemp: number;
    thermalSensitivity: number;
    SLOPE: number;
    h2oHiCascP: number;
    h2oWetland: number;
    Shrub21: number;
    BurnRCA: number;
} // landscapeEVsProps

// Calculate simple linear regression for thermal sensitivity: daily mean ST ~ daily mean AT
// Calculate linear regression for thermal sensitivity (improved version)
const linReg = (data: CombinedMeanTempProps[]): LinRegProps => {
    // No data
    if (data.length === 0) {
        return { slope: 0, intercept: 0, rSquared: 0 };
    } // if

    // Extract x (AT) and y (ST) arrays
    const xValues = data.map(d => d.tmean_C);
    const yValues = data.map(d => d.dailyMeanST);
    // Calculate means for AT & ST 
    const meanX = xValues.reduce((sum, val) => sum + val, 0) / data.length;
    const meanY = yValues.reduce((sum, val) => sum + val, 0) / data.length;
    // Calculate slope (b1)
    const numerator = xValues.reduce((sum, x, i) => sum + (x - meanX) * (yValues[i] - meanY), 0);
    const denominator = xValues.reduce((sum, x) => sum + Math.pow(x - meanX, 2), 0);
    const slope = denominator !== 0 ? numerator / denominator : 0;
    // Calculate intercept (b0)
    const intercept = meanY - slope * meanX;
    // Calculate R-squared
    const predictions = xValues.map(x => intercept + slope * x);
    const residuals = predictions.map((pred, i) => yValues[i] - pred);
    const ssResiduals = residuals.reduce((sum, residual) => sum + Math.pow(residual, 2), 0);
    const ssTotal = yValues.reduce((sum, y) => sum + Math.pow(y - meanY, 2), 0);
    const rSquared = ssTotal !== 0 ? 1 - (ssResiduals / ssTotal) : 0;
    return { slope, intercept, rSquared };
}; // calculateLinearRegression


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

    // useState for linear regression
    const[meanAirTemp, setMeanAirTemp] = useState<number>(0);
    const[meanStreamTemp, setMeanStreamTemp] = useState<number>(0);
    const[regResults, setRegResults] = useState<LinRegProps>({ slope:0, intercept: 0, rSquared: 0});

    // useState for landscape covariates
    const[landscapeEVs, setLandscapeEvs] = useState<landscapeEVsProps[]>([]);

  // Using useEffect for data loading of AT/ST and coordinates using Papa Parse to load CSV file
  useEffect(() => {
    let loadedFiles = 0;
    const checkIfLoaded = () => {
        loadedFiles++;
        if (loadedFiles === 4) {
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

    // Landscape EVs data
    Papa.parse('/data/TSandEVs2021.csv', {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (results) => {
      setLandscapeEvs(results.data as landscapeEVsProps[]);
      checkIfLoaded();
      }, // complete
      error: (error) => {
        console.log("TSAndEVs CSV loading error:", error);
        checkIfLoaded();
      } // error
    }); // Papa.parse for landscape EVs

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
        // Find simple linear regression: daily mean AT ~ daily mean ST
        // Calculate means
        const airMean = combinedData.reduce((sum, d) => sum + d.tmean_C, 0) / combinedData.length;
        const streamMean = combinedData.reduce((sum, d) => sum + d.dailyMeanST, 0) / combinedData.length;
        setMeanAirTemp(airMean);
        setMeanStreamTemp(streamMean);
        const slr = linReg(combinedData);
        setRegResults(slr);
    } // if

  }, [isLoading, airTempData, streamTempData, id]); // useEffect - combining AT and ST data
  
  // Find SLR regression line for plotting graph
  const computeRegLine = (): { x: number[], y: number[] } => {
    // Standardizing axes to 0 to 25
    const xValues = [0, 25];
    const yValues = xValues.map(x => regResults.slope * x + regResults.intercept);
    return { x: xValues, y: yValues };
  }; // computeRegLine
  const slrRegLine = computeRegLine();

  // Find coordinates for current site
  const siteCoords = coordinateData.find(coord => coord.siteID === parseInt(id));
  // Find landscape covariate values
  const siteTSAndEVs = landscapeEVs.find(data => data.site === parseInt(id));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
            <div className="mb-6">
                <button 
                    onClick={() => window.history.back()}
                    className="text-blue-600 hover:text-blue-800 mb-4"
                >
                    Back to Map
                </button>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Thermal Sensitivity for Site {id}
                    </h1>
            </div>
                
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <p className="text-lg text-gray-600">Loading site data...</p>
                </div>
                ) : (
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div style={{width: '100%', aspectRatio: '1/1', maxWidth: '680px', margin: '0 auto',position: 'relative'}}>
                        <Plot
                            data={[
                                {
                                    x: combinedMeanTempData.map(d => d.tmean_C),
                                    y: combinedMeanTempData.map(d => d.dailyMeanST),
                                    type: 'scatter',
                                    mode: 'markers',
                                    marker: { color: '#636efa', size: 8 },
                                    name: 'Daily Values',
                                    hovertemplate: 'Air Temp: %{x}°C<br>Stream Temp: %{y}°C<extra></extra>'
                                },
                                {
                                    x: slrRegLine.x,
                                    y: slrRegLine.y,
                                    type: 'scatter',
                                    mode: 'lines',
                                    line: { color: '#fea15b', width: 2 },
                                    name: `Thermal Sensitivity = ${regResults.slope.toFixed(3)}`,
                                    hoverinfo: 'skip'
                                }
                            ]}
                            layout={{
                                title: {
                                    text: `Thermal Sensitivity for Site ${id}`,
                                    font: { family: 'Merriweather, serif', color: 'black', size: 16 }
                                },
                                xaxis: {
                                    title: { text: 'Mean Air Temperature (°C)'},
                                    range: [0, 25],
                                    font: { family: 'Merriweather, serif', color: 'black', size: 12 }
                                },
                                yaxis: {
                                    title: {text: 'Mean Stream Temperature (°C)'},
                                    range: [0, 25],
                                    font: { family: 'Merriweather, serif', color: 'black', size: 12 }
                                },
                                legend: {
                                    x: 0.02,
                                    y: 0.98,
                                    bgcolor: 'rgba(255,255,255,0.8)',
                                    bordercolor: 'rgba(0,0,0,0.2)',
                                    borderwidth: 1,
                                    font: { family: 'Merriweather, serif', color: 'black', size: 12 }
                                },
                                plot_bgcolor: '#e5ecf6',
                                paper_bgcolor: '#e5ecf6',
                                font: { family: 'Merriweather, serif', color: 'black', size: 12 },
                                hovermode: 'closest',
                                hoverdistance: 20
                            }}
                            style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0}}
                            config={{ responsive: true, displayModeBar: false }}
                            useResizeHandler={true}
                        />
                    </div>
                        
                <div className="mt-4 p-4 bg-gray-100 rounded text-sm">
                    <p><strong>Site Information: {siteTSAndEVs?.Stream_Nam}</strong></p>
                    <p>Site ID: {id}</p>
                    {siteCoords && (<p>Coordinates: ({siteCoords.lat.toFixed(3)}, {siteCoords.lon.toFixed(3)})</p>)}
                    <p>Mean air temperature: {meanAirTemp.toFixed(3)}°C</p>
                    <p>Mean stream temperature: {meanStreamTemp.toFixed(3)}°C</p>
                    {siteTSAndEVs && (
                        <>
                        <p>Thermal sensitivity: {siteTSAndEVs.thermalSensitivity.toFixed(3)}</p>
                        <p>Stream channel slope: {siteTSAndEVs.SLOPE.toFixed(3)}</p>
                        <p>High Cascades geology: {siteTSAndEVs.h2oHiCascP.toFixed(3)}</p>
                        <p>Wetlands: {siteTSAndEVs.h2oWetland.toFixed(3)}</p>
                        <p>Shrub: {siteTSAndEVs.Shrub21.toFixed(3)}</p>
                        <p>Burn area: {siteTSAndEVs.BurnRCA.toFixed(3)}</p>
                        </>
                    )}
                    
                </div>
            </div>
                )}
        </div>
    </div>
    );
} // SitePage.tsx