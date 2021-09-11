import {
    ResponsiveContainer, Legend, LabelList, Cell, Tooltip,
    PieChart, Pie,
    BarChart, Bar,
    LineChart, Line, ReferenceLine, XAxis, YAxis
} from "recharts";



export const BaseLine = ({ height = 200, centerLine = 1, data = data, benchmark = benchmark }) => {

    return <ResponsiveContainer width="100%" height={height}>
        <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
              left: -30
            }}
        >
            <YAxis axisLine={false} tickLine={false} />
            <Legend verticalAlign="top" />
            <XAxis dataKey="date" />
            <Tooltip content={<CustomTooltip benchmark={benchmark}/> }/>
            <ReferenceLine y={centerLine} stroke="#B4F8A6" strokeDasharray="3 3" />
            <Line type="monotone" dataKey="Portfolio" stroke="#00a0e3" dot={false} />
            <Line type="monotone" dataKey={benchmark} stroke="#404040" dot={false} />
        </LineChart>

    </ResponsiveContainer>
}


const CustomTooltip = ({ active, payload, benchmark }) => {

    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ background: '#ffff', padding: '0 2px 0 2px', borderRadius: 4, boxShadow: '2px 2px 2px #e8e8e8, 0px 0px 2px #8e8e8e'}}>
          <p className="label" style={{color: '#00a0e3'}}>{`Portfolio : ${parseFloat(payload[0].payload.Portfolio).toFixed(2)}`}</p>
          <p className="label" style={{color: '#404040'}}>{`${benchmark} : ${parseFloat(payload[0].payload[benchmark]).toFixed(2)}`}</p>
          <p className="label" style={{display: 'flex', justifyContent: 'center', fontSize: 10, color: 'red'}}>{`${payload[0].payload.date}`}</p>
        </div>
      );
    }
  
    return null;
  };

/*
const RenderLegend = ({payload}) => {

  return (
    <ul style={{ display: 'flex', justifyContent: 'center'}}>
      <li style={{color: '#00a0e3', marginLeft: 0}}>Portfolio</li>
      <li style={{color: '#404040'}}>Nifty 50</li>
    </ul>
  );
}
*/