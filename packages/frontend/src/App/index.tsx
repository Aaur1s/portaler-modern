import React from 'react'

import { CssBaseline, ThemeProvider } from '@material-ui/core'

import SideBar from '../Sidebar'
import Footer from './Footer'
import useGetPortalTimer from './hooks/useGetPortalTimer'
import useGetZones from './hooks/useGetZones'
import useSetToken from './hooks/useSetToken'
import MainLayout from './MainLayout'
import MapArea from './MapArea'
import Notifications from './Notifications'
import styles from './styles.module.scss'
import theme from './theme'

const App = () => {
  useSetToken()
  useGetZones()
  useGetPortalTimer()

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={styles.appContainer}>
        <Notifications />
        <MainLayout>
          <SideBar />
          <MapArea />
        </MainLayout>
        <Footer />
      </div>
    </ThemeProvider>
  )
}

export default App
