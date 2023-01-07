import './index.scss'

import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import { Provider } from 'react-redux'
import store from './store'

const root = createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)
