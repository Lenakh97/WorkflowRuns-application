import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

function App() {
  const [exp, setExp] = useState();
  const [data, setData] = useState({ workflow_runs: [] });

  const fetchData = async () => {
    try {
      const result = await axios.get(
        `https://lenakh97.github.io/get-workflow-runs/JSONObject.json?${Date.now()}`
      );

      setData(result.data);
      setExp(parseInt(result.headers["cache-control"].split("=")[1], 10));
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (exp === undefined) {
      fetchData();
      return;
    }
    const interval = setInterval(() => {
      fetchData();
    }, exp * 1000);
    return () => clearInterval(interval);
  }, [exp]);

  var sortedData = data.workflow_runs.sort(function (a:{conclusion:string, updated_at:string}, b:{conclusion:string, updated_at: string}) {
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
            <th> Branch </th>
            <th> Last updated </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item:{conclusion:string, name:string, url:string, branch:string, updated_at: string}) => (
            <tr className={item.conclusion}>
              <td className="td" key={item.name}>
                <a href={item.url}>{item.name}</a>
              </td>
              <td className="td" key={item.url}>
                {item.branch}
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
