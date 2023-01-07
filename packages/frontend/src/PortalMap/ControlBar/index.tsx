import React, { forwardRef } from 'react'

import { Zone } from '@portaler/types'

import { CytoEdgeData } from '../'
import DeleteNode from './DeleteNode'
import HomeButton from './HomeButton'
import ReloadMap from './ReloadMap'
import Search from './Search'
import styles from './styles.module.scss'
import ZoneInfo from './ZoneInfo'

interface ControlBarProps {
  handleHome: (zone: Zone) => void
  reloadMap: () => void
  zone: Zone | null
  edgeData: CytoEdgeData[]
}

const ControlBar = forwardRef<HTMLDivElement, ControlBarProps>(
  ({ handleHome, reloadMap, zone, edgeData }, ref) => (
    <div ref={ref} className={styles.bar}>
      <div>
        <ZoneInfo />
      </div>
      <div className={styles.controls}>
        <DeleteNode edgeData={edgeData} zoneName={zone?.name} />
        <Search />
        <HomeButton handleHome={handleHome} />
        <ReloadMap handleClick={reloadMap} />
      </div>
    </div>
  )
)

export default ControlBar
