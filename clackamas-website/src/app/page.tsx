// page.tsx: exports Home page component of map with markers & tab button for temperature type
"use client";
import Papa from 'papaparse';

import { useState, useEffect } from 'react';
import { SiteProps } from './components/Site';
import TabButton from './components/TabButton';
import TempLegend from './components/TempLegend';

import dynamic from 'next/dynamic'
const Map = dynamic(() => import('./components/Map'), {ssr: false, loading: () => <div>Loading map...</div>});

// Return Home component
export default function Home() {
  const[siteData, setSiteData] = useState<SiteProps[]>([]);
  const[isLoading, setIsLoading] = useState(true)
  // Using useEffect for data loading of TSAndEVs2021.csv using Papa Parse to load CSV file
  useEffect(() => {
    // Don't need .then() statements since PapaParse handles promises internally
    Papa.parse('/data/TSAndEVs2021.csv', {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (results) => {
      setSiteData(results.data as SiteProps[]);
      setIsLoading(false);
      }, // complete
      error: (error) => {
        console.log("CSV loading error:", error);
      } // error
    }); // Papa.parse
  }, []); // useEffect - runs once on mount

  // Handle tab button selection controlling temperature type chosen
  const[tempType, setTempType] = useState<'air' | 'stream' | 'sensitivity'>('air');
  const handleAirTemp = async() => {
    setTempType('air');
  } // handleAirTemp
  const handleStreamTemp = async() => {
    setTempType('stream');
  } // handleStreamTemp
  const handleSensitivity = async() => {
    setTempType('sensitivity');
  } // handleSensitivity

  return(
    // If map is loading: return loading sites, else render Map component w/ siteData
    <div>
      {isLoading ? (
        <p> Loading sites... </p>
      ) : (
        <div>
        <div className="absolute top-4 right-4 z-[1000] bg-white p-4 rounded-lg shadow-lg">
            <h3 className="font-semibold mb-3 text-gray-800 text-sm"> Mean Air-Stream Temperature & Thermal Sensitivity Distribution </h3>
            <div className="flex bg-gray-100 rounded-md p-1 gap-1">
              <TabButton
                action={handleAirTemp}
                isActive={tempType === 'air'}
              >
                Air Temperature
              </TabButton>
              <TabButton
                action={handleStreamTemp}
                isActive={tempType === 'stream'}
              >
                Stream Temperature
              </TabButton>
              <TabButton
                action={handleSensitivity}
                isActive={tempType === 'sensitivity'}
              >
                Thermal Sensitivity
              </TabButton>
            </div>
          </div>
        <TempLegend tempType={tempType} />
        <Map sites={siteData} tempType={tempType} />
        </div>
      )}
    </div>
  ); // return
} // page