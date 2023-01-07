import React from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import styles from './styles.module.scss'
import useGetUserInfo from '../common/hooks/useGetUserInfo'

const TopWalkers = () => {
  const raw_data = useGetUserInfo()
  const data: any[] = []
  // @ts-ignore
  raw_data
    ? raw_data?.map(
        (i) =>
          (data[data.length] = {
            number: data.length + 1,
            name: i.discord_name + '#' + i.discord_discriminator,
            points: i.portals_created,
          })
      )
    : (data[0] = {
        number: 0,
        name: 'null',
        points: 0,
      })
  // @ts-ignore
  data[0].name !== 'null'
    ? window.localStorage.setItem('top', JSON.stringify(data))
    : ''
  const final_data = JSON.parse(window.localStorage.getItem('top') as string)
  const columns = [
    {
      dataField: 'number',
      text: '№',
      headerStyle: { width: '70px', textAlign: 'center' },
      style: { textAlign: 'center' },
      formatter: (cell: any, row: any, rowIndex: number) => rowIndex + 1,
    },
    {
      dataField: 'name',
      text: 'Name',
      headerStyle: { textAlign: 'center', width: '300px' },
      style: { textAlign: 'center' },
    },
    {
      dataField: 'points',
      text: 'Points',
      headerStyle: { width: '100px', textAlign: 'center' },
      style: { textAlign: 'center' },
      sort: true,
    },
  ]

  return (
    <div className={styles.table}>
      <h2>Mistwalker Hall of Fame</h2>
      <BootstrapTable
        keyField="number"
        data={final_data ? final_data : [0]}
        columns={columns}
        sort={{ dataField: 'points', order: 'desc' }}
      />
    </div>
  )
}

export default TopWalkers
