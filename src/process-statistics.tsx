import './process-statistics.scss';

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import HistoryProcessTable from './Components/HistoryProcessTable';
import StatisticsProcessTable from './Components/StatisticsProcessTable';
import { StatisticsPluginParams } from './types';
import { post } from './utils/api';

const items = [
  { title: 'Running Process Instances', maxResults: 1000, path: '/history/process-instance', sortBy: 'startTime', options: {unfinished: true}, type: 'table' },
  { title: 'Open Incidents Instances', maxResults: 1000, path: '/history/process-instance', sortBy: 'startTime', options: {unfinished: true, withIncidents: true}, type: 'table' },
  { title: 'Last Finished Process Instances', maxResults: 1000, path: '/history/process-instance', sortBy: 'endTime', options: {finished: true}, type: 'table' },
  { title: 'Statistics Last Hour', maxResults: 100000, path: '/history/process-instance', sortBy: 'endTime', options: {finished: true}, startedAfter: 'hourAgo', type: 'stats' },
  { title: 'Statistics Last Day', maxResults: 100000, path: '/history/process-instance', sortBy: 'endTime', options: {finished: true}, startedAfter: 'dayAgo', type: 'stats'  },
  { title: 'Statistics Last Week', maxResults: 100000, path: '/history/process-instance', sortBy: 'endTime', options: {finished: true}, startedAfter: 'weekAgo', type: 'stats' },
];

const TableForm: any = ({ api }: any) => {
  const [active, setActive] = useState(0);
  const [instances, setInstances]: any = useState([] as any[]);

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
          { maxResults: String(items[active].maxResults) },
          JSON.stringify({
            sortBy: items[active].sortBy,
            sortOrder: 'desc',
            ...options,
          })
        )
      );
    })();
  }, [active]);

  const tabs =
    <div>
      <ul className='nav nav-tabs'>
        {items.map((n, i) => (
	         <button
           className={`tablinks ${i === active ? 'active' : ''}`}
           style={{border: 'none', background:'white'}}
           onClick={(e: any) => {setInstances([]); setActive(+e.target.dataset.index);}}
           data-index={i}
           >{n.title}</button>
	      ))}
      </ul>
      {instances.length && items[active].type == 'table' ? <HistoryProcessTable title={items[active].title} maxResults={items[active].maxResults} instances={instances} /> : null}
      {instances.length && items[active].type == 'stats' ? <StatisticsProcessTable title={items[active].title} maxResults={items[active].maxResults} instances={instances} /> : null}
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
