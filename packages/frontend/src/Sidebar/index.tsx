import cn from 'clsx'
import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { animated, useSpring } from 'react-spring'

import { IconButton, makeStyles, Tab, Tabs, Theme } from '@material-ui/core'
import AddLocationIcon from '@material-ui/icons/AddLocation'
import HideIcon from '@material-ui/icons/FirstPage'
import FindPathIcon from '@material-ui/icons/CompareArrows'
import HelpIcon from '@material-ui/icons/HelpOutline'
import TopWalkersIcon from '@material-ui/icons/BarChart'
import InfoIcon from '@material-ui/icons/InfoOutlined'
import SettingsIcon from '@material-ui/icons/Settings'

import useToken from '../common/hooks/useToken'
import { portalerSmall } from '../common/images'
import LoginButton from '../LoginButton'
import MapInfo from '../MapInfo'
import TopWalkers from '../TopWalkers'
import FindPath from '../FindPath'
import PortalForm from '../PortalForm'
import { RootState } from '../reducers'
import { SidebarActionTypes } from '../reducers/sideBarReducer'
import UserSettings from '../UserSettings'
import Help from './Help'
import styles from './styles.module.scss'

type TabOpts = 'form' | 'find' | 'info' | 'top' | 'help' | 'settings'

const tabMap = (tabVal: number): TabOpts => {
  switch (tabVal) {
    case 0:
      return 'form'
    case 1:
      return 'find'
    case 2:
      return 'info'
    case 3:
      return 'top'
    case 4:
      return 'help'
    case 5:
      return 'settings'
    default:
      return 'form'
  }
}

const getTabVal = (tabOpt: TabOpts): number => {
  switch (tabOpt) {
    case 'form':
      return 0
    case 'find':
      return 1
    case 'info':
      return 2
    case 'top':
      return 3
    case 'help':
      return 4
    case 'settings':
      return 5
    default:
      return 0
  }
}

const useStyles = makeStyles((theme: Theme) => ({
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  tab: {
    minWidth: 0,
  },
  selected: {
    backgroundColor: `rgba(255, 255, 255, 0.05)`,
  },
}))

const SideBar = () => {
  const token = useToken()
  const dispatch = useDispatch()

  const [tabValue, setTabValue] = useState<TabOpts>(tabMap(0))

  const handleChange = useCallback((_: any, newValue: number) => {
    setTabValue(tabMap(newValue))
  }, [])

  const handleSlide = useCallback(() => {
    dispatch({ type: SidebarActionTypes.TOGGLE })
  }, [dispatch])

  const classes = useStyles()

  const sideBar = useSelector((state: RootState) => state.sideBar)

  const opacity = useSpring({
    opacity: sideBar ? 1 : 0,
    config: { duration: sideBar ? 420 : 50 },
  })

  const props = useSpring({
    width: sideBar ? 'inherit' : 0,
    marginLeft: sideBar ? 'inherit' : 0,
    marginRight: sideBar ? 'inherit' : 0,
  })

  const headerProps = useSpring({
    paddingLeft: sideBar ? 'inherit' : 0,
    paddingRight: sideBar ? 'inherit' : 0,
  })

  return !token ? (
    <LoginButton />
  ) : (
    <aside className={styles.searchSide}>
      <animated.div style={headerProps} className={styles.header}>
        <animated.div style={props}>
          <animated.img
            style={opacity}
            alt="logo"
            src={portalerSmall}
            className={styles.logo}
          />
        </animated.div>
        <div className={cn({ [styles.expand]: !sideBar })}>
          <IconButton onClick={handleSlide} aria-label="hide">
            <HideIcon fontSize="large" className={styles.hideIcon} />
          </IconButton>
        </div>
      </animated.div>
      <animated.div style={props} className={styles.content}>
        <animated.div
          style={opacity}
          className={cn(styles.mainContent, {
            [styles.help]: tabValue === 'help',
          })}
        >
          {tabValue === 'form' && <PortalForm />}
          {tabValue === 'find' && <FindPath />}
          {tabValue === 'info' && <MapInfo />}
          {tabValue === 'top' && <TopWalkers />}
          {tabValue === 'help' && <Help />}
          {tabValue === 'settings' && <UserSettings />}
        </animated.div>
        <animated.div style={opacity} className={styles.nav}>
          <Tabs
            orientation="vertical"
            value={getTabVal(tabValue)}
            textColor="secondary"
            indicatorColor="secondary"
            onChange={handleChange}
            aria-label="panel options"
            className={classes.tabs}
          >
            <Tab
              className={classes.tab}
              icon={<AddLocationIcon />}
              aria-label="Add location"
              title="Add location"
            />
            <Tab
              className={classes.tab}
              icon={<FindPathIcon />}
              aria-label="Find Path"
              title="Find Path"
            />
            <Tab
              className={classes.tab}
              icon={<InfoIcon />}
              aria-label="Zone Info"
              title="Zone Info"
            />
            <Tab
              className={classes.tab}
              icon={<TopWalkersIcon />}
              aria-label="Top of Mist Walkers"
              title="Top of Mist Walkers"
            />
            <Tab
              className={classes.tab}
              icon={<HelpIcon />}
              aria-label="Portaler Help"
              title="Portaler Help"
            />
            <Tab
              className={classes.tab}
              icon={<SettingsIcon />}
              aria-label="Settings"
              title="Settings"
            />
          </Tabs>
        </animated.div>
      </animated.div>
    </aside>
  )
}

export default SideBar
