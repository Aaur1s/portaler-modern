import { ZoneColor } from '@portaler/types'

export const portalSizeToColor = {
  blue: '#00b0ff',
  yellow: '#ffc400',
  royal: '#aa00ff',
  const: '#ff3838',
}

export const getZoneColor = (
  type: ZoneColor,
  isHome: boolean = false,
  isDeep: boolean = false
): string => {
  if (isHome) {
    return '#aa00ff'
  }

  if (isDeep) {
    return '#00897b'
  }

  switch (type) {
    case 'road':
    case 'road-ho':
      return '#1de9b6'
    case 'black':
      return '#1b1a29'
    case 'red':
      return '#fe0b01'
    case 'yellow':
      return '#ffb002'
    case 'blue':
      return '#3d679c'
    case 'city':
      return '#42a5f5'
    case 'city-black':
      return '#1b1a29'
    default:
      return '#15ff00'
  }
}
