import './process-statistics.scss';

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import HistoryProcessTable from './Components/HistoryProcessTable';
import StatisticsProcessTable from './Components/StatisticsProcessTable';
import { StatisticsPluginParams } from './types';
import { post } from './utils/api';

const tableMessage = 'Display Max:';
const statMessage = 'Finished Instances to analyze:';

const items = [
  { title: 'Running Process Instances', defaultMaxResults: 10, selectMaxResult: [10,100,1000], selectMessage: tableMessage,
      path: '/history/process-instance', sortBy: 'startTime', options: {unfinished: true}, type: 'table', links: '/process-instance/' },
  { title: 'Open Incidents Instances', defaultMaxResults: 10, selectMaxResult: [10,100,1000], selectMessage: tableMessage,
      path: '/history/process-instance', sortBy: 'startTime', options: {unfinished: true, withIncidents: true}, type: 'table', links: '/process-instance/' },
  { title: 'Last Finished Process Instances', defaultMaxResults: 100, selectMaxResult: [100,500,1000], selectMessage: tableMessage,
      path: '/history/process-instance', sortBy: 'endTime', options: {finished: true}, type: 'table', links: '/history/process-instance/' },
  { title: 'Statistics Last Hour', defaultMaxResults: 1000, selectMaxResult: [1000,10000,100000], selectMessage: statMessage,
      path: '/history/process-instance', sortBy: 'endTime', options: {finished: true}, startedAfter: 'hourAgo', type: 'stats', links: '' },
  { title: 'Statistics Last Day', defaultMaxResults: 1000, selectMaxResult: [1000,10000,100000], selectMessage: statMessage,
      path: '/history/process-instance', sortBy: 'endTime', options: {finished: true}, startedAfter: 'dayAgo', type: 'stats', links: '' },
  { title: 'Statistics Last Week', defaultMaxResults: 1000, selectMaxResult: [1000,10000,100000], selectMessage: statMessage,
      path: '/history/process-instance', sortBy: 'endTime', options: {finished: true}, startedAfter: 'weekAgo', type: 'stats', links: '' },
];

const TableForm: any = ({ api }: any) => {
  const [active, setActive] = useState(0);
  const [instances, setInstances]: any = useState([] as any[]);
  const [maxResults, setMaxResults] = useState(items[0].defaultMaxResults);
  const [selectMessage, setSelectMessage] = useState(items[0].selectMessage);
  const [selectMaxResult, setSelectMaxResults] = useState(items[0].selectMaxResult);

  // FETCH
  useEffect(() => {
    (async () => {
      var options = items[active].options;
      if (items[active].startedAfter) {
        if (items[active].startedAfter == 'hourAgo') {
          /* @ts-ignore */
          options['startedAfter'] = new Date(new Date() - 1000 * 3600).toISOString().replace('Z', '+0000');
        }
        if (items[active].startedAfter == 'dayAgo') {
          /* @ts-ignore */
          options['startedAfter'] = new Date(new Date() - 1000 * 3600 * 24 * 1).toISOString().replace('Z', '+0000');
        }
        if (items[active].startedAfter == 'weekAgo') {
          /* @ts-ignore */
          options['startedAfter'] = new Date(new Date() - 1000 * 3600 * 24 * 7).toISOString().replace('Z', '+0000');
        }
      }

      setInstances(
        await post(
          api,
          items[active].path,
          { maxResults: String(maxResults) },
          JSON.stringify({
            sortBy: items[active].sortBy,
            sortOrder: 'desc',
            ...options,
          })
        )
      );
    })();
  }, [active, maxResults]);

  const tabs =
    <div>
      <ul className='nav nav-tabs'>
        {items.map((n, i) => (
	         <button
           className={`tablinks ${i === active ? 'active' : ''}`}
           style={{border: 'none', background:'white'}}
           onClick={(e: any) => {
             setInstances([]);
             setMaxResults(items[+e.target.dataset.index].defaultMaxResults);
             setSelectMessage(items[+e.target.dataset.index].selectMessage);
             setSelectMaxResults(items[+e.target.dataset.index].selectMaxResult);
             setActive(+e.target.dataset.index);
           }}
           data-index={i}
           >{n.title}</button>
	      ))}
        <a style={{marginLeft: '50px', color: 'black'}}>{selectMessage}</a>
        <select
          value={maxResults}
          style={{marginLeft: '10px'}}
          onChange={(e: any) => {setInstances([]); setMaxResults(e.target.value); }}
        >
          {selectMaxResult.map ((n, i) => (
            <option>{selectMaxResult[i]}</option>
          ))}
        </select>
      </ul>
      {instances.length && items[active].type == 'table' ? <HistoryProcessTable title={items[active].title}
          maxResults={maxResults} links={items[active].links} instances={instances} /> : null}
      {instances.length && items[active].type == 'stats' ? <StatisticsProcessTable title={items[active].title}
          maxResults={maxResults} instances={instances} /> : null}
      {!instances.length ? <div><h4>{items[active].title}</h4><p>No data</p></div> : null}
    </div>;
  return (
    tabs
  );
};

export default [
  {
    id: 'process-statistics',
    pluginPoint: 'cockpit.dashboard',
    render: (node: Element, { api }: StatisticsPluginParams) => {
      (async () => {
        ReactDOM.render(
          <React.StrictMode>
            <TableForm api={api}/>
          </React.StrictMode>,
          node
        );
      })();
    },
  },
];
