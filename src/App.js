import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

function App() {
  const [data, setData] = useState({ workflow_runs: [] });
  useEffect(async () => {
    const result = await axios(
      "https://lenakh97.github.io/get-workflow-runs/public/JSONObject.json"
    );

    setData(result.data);
  });

  var sortedData = data.workflow_runs.sort(function (a, b) {
    return (
      a.conclusion.localeCompare(b.conclusion) ||
      new Date(b.updated_at) - new Date(a.updated_at)
    );
  });

  return (
    <div>
      <h1>Workflow runs for the nRF Asset Tracker team</h1>
      <table className="tablediv">
        <thead className="thead">
          <tr className="thead">
            <th> Repository Name</th>
            <th> Headbranch </th>
            <th> Status </th>
            <th> Last updated </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item) => (
            <tr className={item.conclusion}>
              <td className="td" key={item.name}>
                <a href={item.url}>{item.name}</a>
              </td>
              <td className="td" key={item.url}>
                {item.branch}
              </td>
              <td className="td" key={item.id}>
                {item.conclusion}
              </td>
              <td className="td" key={item.updated_at}>
                {formatDistanceToNow(new Date(item.updated_at))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
