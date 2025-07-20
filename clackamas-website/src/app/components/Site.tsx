// Site.tsx: exports Site component and SiteProps interface for Site component props

// Define TypeScript interface for Site component props
export interface SiteProps {
   site: number;
   x: number;
   y: number;
   meanAirTemp: number;
   meanStreamTemp: number;
   thermalSensitivity: number;
} // SiteProps

// Return Site component by destructuring SiteProps
export default function Site({site, x, y, meanAirTemp, meanStreamTemp, thermalSensitivity}: SiteProps) {
    return (
      <div>
        <h1> Site: {site} </h1>
        <p> Location: ({y},{x})</p>     
        <p> Daily Mean Air Temperature: {meanAirTemp} C </p>
        <p> Daily Mean Stream Temperature: {meanStreamTemp} C </p>
        <p> Thermal Sensitivity: {thermalSensitivity} </p>
      </div>
    );
} // Site