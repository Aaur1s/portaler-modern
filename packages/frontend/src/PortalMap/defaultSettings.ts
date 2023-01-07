import { CytoscapeOptions } from 'cytoscape'

const defaultSettings: CytoscapeOptions = {
  pan: { x: 0, y: 0 },
  minZoom: 0.05,
  maxZoom: 1.75,
  wheelSensitivity: 0.25,
  zoomingEnabled: true,
  userZoomingEnabled: true,
  panningEnabled: true,
  userPanningEnabled: true,
  boxSelectionEnabled: true,
  selectionType: 'single',
  // @ts-ignore
  layout: {
    // @ts-ignore
    name: 'fcose',
    // @ts-ignore
    nodeDimensionsIncludeLabels: true,
    // @ts-ignore
    idealEdgeLength: 200,
    // @ts-ignore
    nestingFactor: 0.5,
    // @ts-ignore
    fit: true,
    // @ts-ignore
    randomize: true,
    // @ts-ignore
    padding: 42,
    // @ts-ignore
    animationDuration: 250,
    // @ts-ignore
    tilingPaddingVertical: 20,
    // @ts-ignore
    tilingPaddingHorizontal: 20,
    // @ts-ignore
    nodeRepulsion: 4194304,
    // @ts-ignore
    numIter: 2097152,
    uniformNodeDimensions: true,
    quality: 'proof',
    gravityRangeCompound: -100.0,
  },
}

export default defaultSettings
