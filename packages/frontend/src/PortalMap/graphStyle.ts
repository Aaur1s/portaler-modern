const graphStyle = [
  {
    selector: 'node[label]',
    css: {
      label: 'data(label)',
      color: 'white',
    },
  },
  {
    selector: 'edge[label]',
    css: {
      label: 'data(label)',
      width: 3,
      color: 'white',
    },
  },
  {
    selector: '.timeLow',
    css: {
      color: 'red',
    },
  },
  {
    selector: 'edge',
    style: {
      'curve-style': 'unbundled-bezier',
    },
  },
]

export default graphStyle
