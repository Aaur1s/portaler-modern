import React, { FC, useCallback, useEffect, useState } from 'react'

import {
  Button,
  ButtonGroup,
  colors,
  Theme,
  withStyles,
} from '@material-ui/core'
import { PortalSize } from '@portaler/types'

const BlueButton = withStyles((theme: Theme) => ({
  root: {
    color: theme.palette.getContrastText(colors.blue[500]),
    backgroundColor: colors.blue[500],
    '&:hover': {
      backgroundColor: colors.blue[600],
    },
    '&:disabled': {
      color: theme.palette.getContrastText(colors.blue[900]),
      backgroundColor: colors.blue[900],
    },
  },
}))(Button)

const YellowButton = withStyles((theme: Theme) => ({
  root: {
    color: theme.palette.getContrastText(colors.amber[500]),
    backgroundColor: colors.amber[500],
    '&:hover': {
      backgroundColor: colors.amber[600],
    },
    '&:disabled': {
      color: theme.palette.getContrastText(colors.amber[900]),
      backgroundColor: colors.amber[900],
    },
  },
}))(Button)

const RoyalButton = withStyles((theme: Theme) => ({
  root: {
    color: theme.palette.getContrastText('#aa00ff'),
    backgroundColor: '#aa00ff',
    '&:hover': {
      backgroundColor: '#d500f9',
    },
    '&:disabled': {
      color: theme.palette.getContrastText('#9700b2'),
      backgroundColor: '#9700b2',
    },
  },
}))(Button)

const ConstButton = withStyles((theme: Theme) => ({
  root: {
    color: theme.palette.getContrastText('#ff3838'),
    backgroundColor: '#ff3838',
    '&:hover': {
      backgroundColor: '#ff6060',
    },
    '&:disabled': {
      color: theme.palette.getContrastText('#aa2121'),
      backgroundColor: '#aa2121',
    },
  },
}))(Button)

interface PortalSizeSelectorProps {
  size: PortalSize | null
  update: (size: PortalSize) => void
}

const PortalSizeSelector: FC<PortalSizeSelectorProps> = ({ size, update }) => {
  const handleClick = useCallback(
    (val: string) => {
      update(val as PortalSize)
    },
    [update]
  )
  return (
    <ButtonGroup
      variant="contained"
      color="primary"
      aria-label="portal selector"
      fullWidth
    >
      <BlueButton
        onClick={() => handleClick('blue')}
        disabled={size === 'blue'}
      >
        7
      </BlueButton>
      <YellowButton
        onClick={() => handleClick('yellow')}
        disabled={size === 'yellow'}
      >
        20
      </YellowButton>
      <RoyalButton
        onClick={() => handleClick('royal')}
        disabled={size === 'royal'}
      >
        Royal
      </RoyalButton>
      <ConstButton
        onClick={() => handleClick('const')}
        disabled={size === 'const'}
      >
        Const
      </ConstButton>
    </ButtonGroup>
  )
}

export default PortalSizeSelector
