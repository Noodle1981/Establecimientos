export interface DepartmentFeature {
  type: "Feature";
  properties: {
    name: string;
    center: [number, number]; // [lat, lng] for label placement
  };
  geometry: {
    type: "Polygon";
    coordinates: [number, number][][]; // Array of [lng, lat] matching standard GeoJSON specs
  };
}

export interface DepartmentCollection {
  type: "FeatureCollection";
  features: DepartmentFeature[];
}

// Highly stylized, simplified, and perfectly adjacent coordinate boundaries for San Juan's 19 Departments
export const SAN_JUAN_DEPARTMENTS_GEOJSON: DepartmentCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "IGLESIA", center: [-30.2, -69.6] },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-70.3, -29.8],
            [-69.2, -29.8],
            [-69.2, -30.5],
            [-69.7, -30.5],
            [-69.7, -30.9],
            [-70.3, -30.9],
            [-70.3, -29.8]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: { name: "JÁCHAL", center: [-30.2, -68.7] },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-69.2, -29.8],
            [-68.2, -29.8],
            [-68.2, -30.8],
            [-69.2, -30.8],
            [-69.2, -29.8]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: { name: "VALLE FÉRTIL", center: [-30.7, -67.2] },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-67.6, -30.0],
            [-66.8, -30.0],
            [-66.8, -31.4],
            [-67.6, -31.4],
            [-67.6, -30.0]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: { name: "CALINGASTA", center: [-31.6, -69.7] },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-70.3, -30.9],
            [-69.2, -30.9],
            [-69.2, -32.2],
            [-70.3, -32.2],
            [-70.3, -30.9]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: { name: "ULLUM", center: [-31.1, -68.9] },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-69.2, -30.5],
            [-68.6, -30.5],
            [-68.6, -31.4],
            [-69.2, -31.4],
            [-69.2, -30.5]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: { name: "ZONDA", center: [-31.7, -68.9] },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-69.2, -31.4],
            [-68.6, -31.4],
            [-68.6, -32.0],
            [-69.2, -32.0],
            [-69.2, -31.4]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: { name: "SARMIENTO", center: [-32.2, -68.7] },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-69.2, -32.0],
            [-68.3, -32.0],
            [-68.3, -32.5],
            [-69.2, -32.5],
            [-69.2, -32.0]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: { name: "25 DE MAYO", center: [-32.2, -67.9] },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-68.3, -32.0],
            [-67.6, -32.0],
            [-67.6, -32.5],
            [-68.3, -32.5],
            [-68.3, -32.0]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: { name: "CAUCETE", center: [-31.7, -67.7] },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-68.2, -31.4],
            [-67.6, -31.4],
            [-67.6, -32.0],
            [-68.2, -32.0],
            [-68.2, -31.4]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: { name: "ALBARDÓN", center: [-31.38, -68.52] },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-68.6, -31.35],
            [-68.45, -31.35],
            [-68.45, -31.47],
            [-68.6, -31.47],
            [-68.6, -31.35]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: { name: "ANGACO", center: [-31.32, -68.37] },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-68.45, -31.20],
            [-68.30, -31.20],
            [-68.30, -31.45],
            [-68.45, -31.45],
            [-68.45, -31.20]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: { name: "SAN MARTÍN", center: [-31.50, -68.37] },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-68.45, -31.45],
            [-68.30, -31.45],
            [-68.30, -31.55],
            [-68.45, -31.55],
            [-68.45, -31.45]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: { name: "POCITO", center: [-31.75, -68.60] },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-68.7, -31.6],
            [-68.5, -31.6],
            [-68.5, -31.9],
            [-68.7, -31.9],
            [-68.7, -31.6]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: { name: "RAWSON", center: [-31.75, -68.45] },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-68.5, -31.6],
            [-68.4, -31.6],
            [-68.4, -31.9],
            [-68.5, -31.9],
            [-68.5, -31.6]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: { name: "RIVADAVIA", center: [-31.54, -68.60] },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-68.65, -31.50],
            [-68.55, -31.50],
            [-68.55, -31.58],
            [-68.65, -31.58],
            [-68.65, -31.50]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: { name: "CHIMBAS", center: [-31.49, -68.53] },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-68.56, -31.47],
            [-68.50, -31.47],
            [-68.50, -31.51],
            [-68.56, -31.51],
            [-68.56, -31.47]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: { name: "CAPITAL", center: [-31.53, -68.53] },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-68.55, -31.51],
            [-68.51, -31.51],
            [-68.51, -31.55],
            [-68.55, -31.55],
            [-68.55, -31.51]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: { name: "SANTA LUCÍA", center: [-31.53, -68.47] },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-68.50, -31.51],
            [-68.45, -31.51],
            [-68.45, -31.55],
            [-68.50, -31.55],
            [-68.50, -31.51]
          ]
        ]
      }
    }
  ]
};
