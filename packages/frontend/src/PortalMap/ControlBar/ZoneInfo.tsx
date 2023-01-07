import React, { useEffect, useState } from 'react'

import { Paper } from '@material-ui/core'

import useZoneInfo from '../../common/hooks/useZoneInfo'
import styles from './styles.module.scss'
import callSign from '../../common/utils/callSign'

const ZoneInfo = () => {
  const zone = useZoneInfo()
  const [color, setColor] = useState<string>('')

  useEffect(() => {
    if (zone?.color.includes('road')) {
      const colorStr = ['Road']

      if (zone?.color.includes('ho')) {
        colorStr.push('Hideout')
      }

      if (zone?.isDeep) {
        colorStr.unshift('Deep')
      }

      setColor(colorStr.join(' '))
    } else {
      setColor(zone?.color ?? '')
    }
  }, [zone])

  const _callSign = zone ? callSign(zone) : null

  return !zone ? null : (
    <div className={styles.infoContainer}>
      <Paper variant="outlined" className={styles.zoneInfo}>
        {zone.name} {_callSign ? `(${_callSign})` : ''} -{' '}
        <span className={styles.cap}>{color.replace('-', ' ')}</span>{' '}
        {!zone.color.includes('city') ? zone.tier : null}
      </Paper>
    </div>
  )
}

export default ZoneInfo
