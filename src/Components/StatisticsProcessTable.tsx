import React from 'react';
import { GoChevronDown, GoChevronUp } from 'react-icons/go';
import { TiMinus } from 'react-icons/ti';
import { useSortBy, useTable } from 'react-table';

import { asctime } from '../utils/misc';
import { Clippy } from './Clippy';

interface Props {
  title: string;
  instances: any[];
}

const StatisticsProcessTable: React.FC<Props> = ({ title, instances }) => {
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
        Header: 'Instances',
        accessor: 'instances',
        Cell: ({ value }: any) => <Clippy value={value}>{value}</Clippy>,
      },
      {
        Header: 'Total',
        accessor: 'duration',
        Cell: ({ value }: any) => <Clippy value={value}>{value}</Clippy>,
      },
      {
        Header: 'Average',
        accessor: 'average',
        Cell: ({ value }: any) => <Clippy value={value}>{value}</Clippy>,
      },
/*
      {
        Header: 'Median',
        accessor: 'median',
        Cell: ({ value }: any) => <Clippy value={value}>{value}</Clippy>,
      },
*/
    ],
    []
  );
  const [counter, totals, durations, ids] = React.useMemo(() => {
    const counter: Record<string, number> = {};
    const totals: Record<string, number> = {};
    const durations: Record<string, number[]> = {};
    const ids: Record<string, number> = {};
    for (const instance of instances) {
      const duration = instance.durationInMillis;
      var name = instance.processDefinitionName;
      var id = instance.processDefinitionId;
      if(!name) {
        name = '(unknown)';
        id = '';
      }
      counter[name] = counter[name] ? counter[name] + 1 : 1;
      totals[name] = totals[name] ? totals[name] + duration : duration;
      ids[name] = id;
/*
      if (!durations[name]) {
        durations[name] = [duration];
      } else {
        durations[name].push(duration);
      }
*/
    }
    return [counter, totals, durations, ids];
  }, [instances]);
  const processNames = React.useMemo(() => {
    const processNames = Object.keys(totals);
    processNames.sort((a, b) => {
      if (totals[a] > totals[b]) {
        return -1;
      } else if (totals[a] < totals[b]) {
        return 1;
      }
      return 0;
    });
    return processNames;
  }, [instances]);
  const data = React.useMemo(
    () =>
      processNames.map((processName: string) => {
/*
        durations[processName].sort((a: number, b: number) => {
          if (a > b) {
            return -1;
          } else if (a < b) {
            return 1;
          }
          return 0;
        });
*/
        return {
          processDefinitionName: processName,
          processDefinitionId: ids[processName],
          instances: counter[processName],
          duration: asctime(totals[processName]),
          average: asctime(totals[processName] / counter[processName]),
/*
          median: asctime(durations[processName][Math.floor(durations[processName].length / 2)]),
*/
        };
      }),
    [instances]
  );
  const tableInstance = useTable({ columns: columns as any, data }, useSortBy);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;
  return (
  <div className="tabcontent">
    <h4>{title}</h4>
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

export default StatisticsProcessTable;
