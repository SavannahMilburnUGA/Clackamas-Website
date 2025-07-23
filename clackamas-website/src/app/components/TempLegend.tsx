// TempLegend.tsx: exports TempLegend component that displays temperature/TS scale legend for distribution type

// Define TypeScript interface for TempLegend component props: distribution type
interface LegendProps {
    tempType: 'air' | 'stream' | 'sensitivity'; 
} // LegendProps

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
] // TEMP_SCALE

// Declaring ranges for daily mean air temperature/stream temperature & thermal sensitivity
const TEMP_RANGES = {
    air: { min: 16.892, max: 21.573, unit: '°C' },
    stream: { min: 4.83, max: 21.655,  unit: '°C'}, 
    sensitivity: { min: 0.005, max: 0.526, unit: ''}
}; // TEMP_RANGES

export default function TempLegend ({ tempType } : LegendProps) {
  // Get range for the current distribution (daily mean AT/ST or TS)
  const range = TEMP_RANGES[tempType];
  // Create gradient using CSS
  const gradientStops = TEMP_SCALE.slice().reverse().map((color, index) => {
    // Find position for each gradient stop
    const position = (index / (TEMP_SCALE.length - 1)) * 100;
        return `${color} ${position}%`;
  }).join(', '); // gradientStops
  // Create vertical gradient using gradient stops
  const gradient = {
    background: `linear-gradient(to bottom, ${gradientStops})`
  }; // gradient

  // Proper distribution type displayed for TempLegend based on distribution type
  const legendTitle = () => {
    switch (tempType) {
      case 'air':
          return 'Daily Mean Air Temperature';
      case 'stream':
          return 'Daily Mean Stream Temperature';
      case 'sensitivity':
          return 'Thermal Sensitivity';
      default:
          return 'Temperature';
      } // switch
  }; // legendTitle
  
  // Make tick values on scale user-friendly (readable)
  let tickValues = [];
  // Readable tick values
  if (tempType === 'air') {
    tickValues = [17, 18, 19, 20, 21];
  } else if (tempType === 'stream') {
    tickValues = [5, 10, 15, 20];
  } else {
    tickValues = [0.1, 0.2, 0.3, 0.4, 0.5];
  } // if 
  
  return (
    <div className="absolute bottom-4 right-4 z-[1000] bg-white p-4 rounded-lg shadow-lg">
      <h4 className="font-semibold mb-3 text-black text-sm">
        {legendTitle()} {range.unit && `(${range.unit})`}
      </h4>

      <div className="flex justify-center">
        <div className="flex items-stretch gap-2">
          <div className="flex flex-col justify-between h-48 py-1">
          {tickValues.slice().reverse().map((value, index) => (
            <span 
              key={index}
              className="text-xs text-black leading-none"
            >
              {value}
            </span>
          ))}
          </div>
        </div>
      
        <div className="relative">
          <div 
            className="w-4 h-48 rounded border border-gray-300"
            style={gradient}
          />
          
          <div className="absolute top-0 bottom-0 -right-2 flex flex-col justify-between py-1">
            {tickValues.map((position, index) => (
              <div 
                key={index}
                className="h-px w-2 bg-gray-400"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} // TempLegend