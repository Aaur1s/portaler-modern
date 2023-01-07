import { ZoneColor } from '@portaler/types'

const getColor = (type: string): ZoneColor => {
  if (type.includes('PLAYERCITY_SAFEAREA')) {
    return 'city'
  }

  if (type.includes('PLAYERCITY_BLACK')) {
    return 'city-black'
  }

  if (type.includes('TUNNEL')) {
    if (type.includes('HIDEOUT')) {
      return 'road-ho'
    }

    return 'road'
  }

  if (type.includes('BLACK')) {
    return 'black'
  }

  if (type.includes('RED')) {
    return 'red'
  }

  if (type.includes('YELLOW')) {
    return 'yellow'
  }

  if (type === 'SAFEAREA') {
    return 'blue'
  }

  return 'home'
}

export default getColor
