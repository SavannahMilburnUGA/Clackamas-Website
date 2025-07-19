"use client";

import dynamic from 'next/dynamic'
const Map = dynamic(() => import('./components/Map'), {ssr: false, loading: () => <div>Loading map...</div>});

export default function Home() {
  return (
    <div>
      <Map />
    </div>
  );
}