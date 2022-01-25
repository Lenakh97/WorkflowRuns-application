import axios from 'axios'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import React, { useEffect, useState } from 'react'
import './App.css'

type WorkflowRunsType = {
	workflow_runs: Array<{
		name: string
		branch: string
		conclusion: string
		url: string
		updated_at: string
	}>
}

function App() {
	const [exp, setExp] = useState<number>()
	const [data, setData] = useState<WorkflowRunsType>()

	const fetchData = async () => {
		const result = await axios.get<WorkflowRunsType>(
			`https://lenakh97.github.io/get-workflow-runs/JSONObject.json?${Date.now()}`,
		)

		setData(result.data)
		setExp(parseInt(result.headers['cache-control'].split('=')[1], 10))
	}

	useEffect(() => {
		if (exp === undefined) {
			fetchData().catch(console.error)
			return
		}
		const interval = setInterval(() => {
			fetchData().catch(console.error)
		}, exp * 1000)
		return () => clearInterval(interval)
	}, [exp])

	const sortedData = (data?.workflow_runs ?? []).sort(
		(
			a: { conclusion: string; updated_at: string },
			b: { conclusion: string; updated_at: string },
		) =>
			a.conclusion.localeCompare(b.conclusion) ||
			new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
	)

	return (
		<div>
			<h1>Workflow runs for the nRF Asset Tracker team</h1>
			<table>
				<thead>
					<tr>
						<th>Repository Name</th>
						<th>Branch</th>
						<th>Last updated</th>
					</tr>
				</thead>
				<tbody>
					{sortedData.map(
						(item: {
							conclusion: string
							name: string
							url: string
							branch: string
							updated_at: string
						}) => (
							<tr className={item.conclusion}>
								<td key={item.name}>
									<a href={item.url} target="_blank" rel="noreferrer">
										{item.name}
									</a>
								</td>
								<td key={item.url}>{item.branch}</td>
								<td key={item.updated_at}>
									{formatDistanceToNow(new Date(item.updated_at))}
								</td>
							</tr>
						),
					)}
				</tbody>
			</table>
		</div>
	)
}

export default App
