import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import HistoryProcessTable from './Components/HistoryProcessTable';
import StatisticsProcessTable from './Components/StatisticsProcessTable';
import { StatisticsPluginParams } from './types';
import { get } from './utils/api';
import { post } from './utils/api';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

const items = [
  { title: 'Active Instances', maxResults: '1000', path: '/history/process-instance', options: {unfinished: true} },
  { title: 'Instances With Incidents', maxResults: '1000', path: '/history/process-instance', options: {unfinished: true, withIncidents: true} },
  { title: 'Finished Last Processes', maxResults: '1000', path: '/history/process-instance', options: {finished: true} },
  { title: 'Stats Last Hour', maxResults: '10000', path: '/history/process-instance', options: {startedAfter: 'hourAgo'} },
  { title: 'Stats Last Day', maxResults: '10000', path: '/history/process-instance', options:  {startedAfter: 'dayAgo' } },
  { title: 'Stats Last Week', maxResults: '10000', path: '/history/process-instance', options: {startedAfter: 'weekAgo'} },
];

const TableForm: any = ({ api }: any) => {
  const [active, setActive] = useState(0);
  const [instances, setInstances]: any = useState([] as any[]);

  // FETCH
  useEffect(() => {
    (async () => {
      /* @ts-ignore */
      var hourAgo = new Date(new Date() - 1000 * 3600).toISOString().replace('Z', '+0000');
      /* @ts-ignore */
      var dayAgo = new Date(new Date() - 1000 * 3600 * 24 * 1).toISOString().replace('Z', '+0000');
      /* @ts-ignore */
      var weekAgo = new Date(new Date() - 1000 * 3600 * 24 * 7).toISOString().replace('Z', '+0000');
      var options = items[active].options;
      if (options.startedAfter == 'hourAgo') {
        options.startedAfter = hourAgo;
      }
      if (options.startedAfter == 'dayAgo') {
        options.startedAfter = dayAgo;
      }
      if (options.startedAfter == 'weekAgo') {
        options.startedAfter = weekAgo;
      }

      setInstances(
        await post(
          api,
          items[active].path,
          { maxResults: items[active].maxResults },
          JSON.stringify({
            sortBy: 'endTime',
            sortOrder: 'desc',
            ...options,
          })
        )
      );
    })();
  }, [active]);

  const tabs =
    <div>
      <div className='tab'>
        {items.map((n, i) => (
	         <button
        	  className={`tablinks ${i === active ? 'active' : ''}`}
	          onClick={(e: any) => {setActive(+e.target.dataset.index);}}
        	  data-index={i}
	         >{n.title}</button>
	      ))}
      </div>
      {instances.length && active == 0 ? <HistoryProcessTable title={items[active].title} instances={instances} /> : null}
      {instances.length && active == 1 ? <HistoryProcessTable title={items[active].title} instances={instances} /> : null}
      {instances.length && active == 2 ? <HistoryProcessTable title={items[active].title} instances={instances} /> : null}
      {instances.length && active == 3 ? <StatisticsProcessTable title={items[active].title} instances={instances} /> : null}
      {instances.length && active == 4 ? <StatisticsProcessTable title={items[active].title} instances={instances} /> : null}
      {instances.length && active == 5 ? <StatisticsProcessTable title={items[active].title} instances={instances} /> : null}
    </div>;
  return (
    tabs
  );
};

export default [
  {
    id: 'process-statistics',
    pluginPoint: 'cockpit.dashboard',
    properties: {
      label: 'Process Instances',
    },
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
