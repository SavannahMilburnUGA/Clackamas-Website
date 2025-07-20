// page.tsx: exports Home page component of map with markers 
"use client";
import Papa from 'papaparse';

import { useState, useEffect } from 'react';
import { SiteProps } from './components/Site';

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

  return(
    // If map is loading: return loading sites, else render Map component w/ siteData
    <div>
      {isLoading ? (
        <p> Loading sites... </p>
      ) : (
        <Map sites={siteData} />
      )}
    </div>
  ); // return
} // page