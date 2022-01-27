# Camunda process statistics plugin
Camunda BPM community extension providing a process statistics plugin for Camunda Cockpit 7.14+   
Insired by Asko Soukka History Plugin https://github.com/datakurre/camunda-cockpit-plugins   

![Running processes in dashboard](Running.jpg)

Plugin consists of 6 interactive reports available in Camunda Dashboard:   
1. Running Process Instances   
2. Open Incident Instances (running processes with incidents)   
3. Last Finished Processes   
![Finished processes in dashboard](Finished.jpg)
4. Finished Processes - Statistics (last hour)   
![Process statistics in dashboard](Statistics.jpg)
5. Finished Processes - Statistics (last day)   
6. Finished Processes - Statistics (last week)   
User can select number of processes to display or number of processes to analyze.   
All statistics reports analyze up to 100000 last finished processes and count stats data per Process Name.   

Filter can be applied to any report. Just type/copy-paste variableName and variableValue to filter processes by VariableName=Value.   
Special variable names can be entered:   
- "Process Name" - to filter result by Process Name Value   
- "Instance ID" - to find process instance with given Id   
- "Business Key" - to filter result by Process BusinessKey   

## Installation
1. Just copy process-statistics.js file to camunda cockpit scripts directory.   
2. Register plugin by editing config.js file in camunda cockpit scripts directory.   

```
  customScripts: [
    'scripts/process-statistics.js'
  ],
```

Plugin uses Camunda History Database. To follow links from Finished Processes tabs I recommend to install also Asko History Plugin.   
