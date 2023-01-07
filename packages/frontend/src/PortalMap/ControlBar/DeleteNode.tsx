import React, { FC, useCallback, useState } from 'react'

import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'

import { CytoEdgeData } from '../'
import useDeleteZone from '../hooks/useDeleteZone'
import styles from './styles.module.scss'

interface DeleteNodeProps {
  edgeData: CytoEdgeData[]
  zoneName: string | undefined
}

const DeleteNode: FC<DeleteNodeProps> = ({ edgeData, zoneName }) => {
  const deletePortals = useDeleteZone()
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleClose = useCallback(
    (deleteZone: boolean) => {
      if (deleteZone) {
        deletePortals(edgeData)
      }

      setIsOpen(false)
    },
    [deletePortals, edgeData]
  )

  return edgeData.length > 0 ? (
    <div className={styles.control}>
      <IconButton
        onClick={() => setIsOpen(true)}
        aria-label="home"
        title="focus home"
      >
        <DeleteIcon fontSize="large" color="secondary" />
      </IconButton>
      <Dialog
        open={isOpen}
        onClose={() => handleClose(false)}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">
          {(edgeData[0] as any).portalName
            ? `Are you sure you want to to delete this portal - "${
                (edgeData[0] as any).portalName
              }"?`
            : `Are you sure you want to delete this "${zoneName}" its connections?`}
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={() => handleClose(false)}
            color="secondary"
            autoFocus
          >
            Disagree
          </Button>
          <Button onClick={() => handleClose(true)} color="secondary">
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  ) : null
}

export default DeleteNode
