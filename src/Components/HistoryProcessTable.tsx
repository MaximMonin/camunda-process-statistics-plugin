import moment from 'moment';
import React from 'react';
import { GoChevronDown, GoChevronUp } from 'react-icons/go';
import { TiMinus } from 'react-icons/ti';
import { useSortBy, useTable } from 'react-table';

import { Clippy } from './Clippy';
import { asctime } from '../utils/misc';

interface Props {
  title: string;
  maxResults: number;
  links: string;
  instances: any[];
}

const HistoryProcessTable: React.FC<Props> = ({ title, maxResults, links, instances }) => {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Process Name',
        accessor: 'processDefinitionName',
        Cell: ({ data, row, value }: any) => {
          const raw = data[row.index];
          return (
          <Clippy value={value}>
            <a href={`#/process-definition/${raw.processDefinitionId}`}>{value}</a>
          </Clippy>
          );
        },
      },
      {
        Header: 'Instance ID',
        accessor: 'id',
        Cell: ({ value }: any) => (
          <Clippy value={value}>
            <a href={`#${links}${value}`}>{value}</a>
          </Clippy>
        ),
      },
      {
        Header: 'State',
        accessor: 'state',
        Cell: ({ value }: any) => <Clippy value={value}>{value}</Clippy>,
      },
      {
        Header: 'Start Time',
        accessor: 'startTime',
        Cell: ({ value }: any) => (
          <Clippy value={value ? value.format('YYYY-MM-DDTHH:mm:ss') : value}>
            {value ? value.format('YYYY-MM-DDTHH:mm:ss') : value}
          </Clippy>
        ),
      },
      {
        Header: 'End Time',
        accessor: 'endTime',
        Cell: ({ value }: any) => (
          <Clippy value={value ? value.format('YYYY-MM-DDTHH:mm:ss') : value}>
            {value ? value.format('YYYY-MM-DDTHH:mm:ss') : value}
          </Clippy>
        ),
      },
      {
        Header: 'Duration',
        accessor: 'duration',
        Cell: ({ value }: any) => (
          <Clippy value={value}>{value}</Clippy>
        ),
      },
      {
        Header: 'Business Key',
        accessor: 'businessKey',
        Cell: ({ value }: any) => <Clippy value={value}>{value}</Clippy>,
      },
    ],
    []
  );
  const data = React.useMemo(
    () =>
      instances.map((instance: any) => {
        return {
          state: instance.state,
          id: instance.id,
          processDefinitionId: instance.processDefinitionId,
          processDefinitionName: instance.processDefinitionName,
          businessKey: instance.businessKey,
          startTime: moment(instance.startTime),
          endTime: instance.endTime ? moment(instance.endTime) : '',
          duration: asctime(instance.durationInMillis),
        };
      }),
    [instances]
  );
  const tableInstance = useTable({ columns: columns as any, data }, useSortBy);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;
  return (
  <div className="tabcontent">
    <h4>{title} ({instances.length != maxResults ? instances.length : maxResults})</h4>
    <table className="cam-table" {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              /* @ts-ignore */
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render('Header')}
                <span style={{ position: 'absolute', fontSize: '125%' }}>
                  {
                    /* @ts-ignore */
                    column.isSorted ? (
                      /* @ts-ignore */
                      column.isSortedDesc ? (
                        <GoChevronDown style={{ color: '#155cb5' }} />
                      ) : (
                        <GoChevronUp style={{ color: '#155cb5' }} />
                      )
                    ) : (
                      <TiMinus style={{ color: '#155cb5' }} />
                    )
                  }
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
  );
};

export default HistoryProcessTable;
