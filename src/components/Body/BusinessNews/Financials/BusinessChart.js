import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
const data = [
  {
    "name": "16",
    "uv": 200,
    "pv": 400,
    "amt": 2400
  },
  {
    "name": "17",
    "uv": 300,
    "pv": 500,
    "amt": 2210
  },
  {
    "name": "18",
    "uv": 350,
    "pv": 450,
    "amt": 2290
  },
  {
    "name": "19",
    "uv": 500,
    "pv": 700,
    "amt": 2000
  },
  {
    "name": "20",
    "uv": 800,
    "pv": 900,
    "amt": 2181
  },
]




class BusinessChart extends React.PureComponent {
  render() {
    return (
      <>
         <LineChart width={290} height={180} data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="name" />
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            <Line name="Revenue" type="monotone" dataKey="pv" stroke="#00A0E3" />
            <Line name="Net Profit" type="monotone" dataKey="uv" stroke="#E51A4B" />
          </LineChart>
      </>
    )
  }
}

export { BusinessChart };