// Site.tsx: exports Site component and SiteProps interface for Site component props

// Define TypeScript interface for Site component props
export interface SiteProps {
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
  index: number;
} // SiteProps

// Return Site component by destructuring SiteProps
export default function Site({index, Stream_Nam, x, y, meanAirTemp, meanStreamTemp, thermalSensitivity, SLOPE, h2oHiCascP, h2oWetland, Shrub21, BurnRCA}: SiteProps) {
    return (
      <div>
        <h1> Site: {index} - {Stream_Nam} </h1>
        <p> Location: ({y.toFixed(3)},{x.toFixed(3)})</p>     
        <p> Daily Mean Air Temperature: {meanAirTemp.toFixed(3)} °C </p>
        <p> Daily Mean Stream Temperature: {meanStreamTemp.toFixed(3)} °C </p>
        <p> Thermal Sensitivity: {thermalSensitivity.toFixed(3)} </p>
        <p> Stream channel slope: {SLOPE.toFixed(3)}</p>
        <p> High Cascades geology: {h2oHiCascP.toFixed(3)}</p>
        <p> Wetlands: {h2oWetland.toFixed(3)}</p>
        <p> Shrub: {Shrub21.toFixed(3)}</p>
        <p> Burn area: {BurnRCA.toFixed(3)}</p>
      </div>
    );
} // Site