import React from 'react';
import Axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,  ResponsiveContainer } from 'recharts';
import Pulse from '../../../Loader/Pulse';

const REQUEST_BASE_URL = process.env.REACT_APP_REQUEST_BASE_URL;


function NumberWithCommas(num,fixed) {

  try {

      if(num)
      {

          let fixednum =  num.toLocaleString('en-IN',{
              maximumFractionDigits: fixed,
              minimumFractionDigits: fixed,
              currency: 'INR'
          });

          return fixednum;
      }
      else
      {
          return num;
      }
  } catch (e) { console.log(e) }
  return "--"
}

const CustomTooltip = ({ active, payload, label, fixed }) => {
  if (active && payload && payload.length) {

    // console.log(active,payload,label)
    return (
      <div className="custom-tooltip">
        <p className="custom-label" >{`${label}`}</p>
        {payload.map((p,indx)=>{
          return <p style={{'color' : `${p.color}`, fontSize : '10px'}} key={indx}>{`${p.name} : ${NumberWithCommas(p.value,fixed)}`}</p>
        })}
      </div>
    );
  }

  return null;
};


class BusinessChart extends React.PureComponent {

  constructor(props)
  {
    super(props);
    this.state = {
      data : {},
      chartcolors : ['#00a0e3','#404040'],
      loading : true
    }
  }

  componentDidMount()
  {
    this.axiosRequest();
  }

  componentDidUpdate(prevProps)
  {
    if(prevProps.stockcode !== this.props.stockcode)
    {
      this.setState({
        data : {},
        loading : true
      });
      this.axiosRequest();
    }
  }

  formatValue(value)
  {
    value = value.split('%');
    return parseFloat(value[0].replace(',',''));
  }

  formatField(field)
  {
    field = field?.replace(/_/g, " ")?.replace(/\b\w/g, l => l.toUpperCase()).replace(/ /g, " ");
    let s = field.split(' '), l = s.length;
    if (l >= 2) {
        let k = s[l - 1];
        let f = s[0];
        field = field.replace(k, k?.toString().substr(-2));

        field = l > 2 ? field.replace(f, ' ').trim() : field.trim();

        // field = field.replace(' ','');
    }

    return field;
  }

  axiosRequest(){

    // console.log(this.props.field)
    Axios({
        method: 'GET',
        url: `${REQUEST_BASE_URL}/createcharts/${this.props.field}/${this.props.type}/${this.props.stockcode}`,
        responseType: 'json',
        onDownloadProgress: (pEvnt) => {
            this.setState({loading: Math.round((pEvnt.loaded * 100) / pEvnt.total)})
        },
    })
    .then(
        (response) => {

            // console.log(response.data);
            let res = response.data;
            let data = [];
            let xvalues = [];

            let fields = res.fields;
            let values = res.values;

            fields.forEach(f => {
                let obj = {};
                obj[f.title] = this.formatField(f.value);
                data.push(obj);
            });
            // console.log(data);

            values.forEach(val=>{
              val.forEach((v,indx)=>{
                if(!xvalues.includes(v.title))
                {
                  xvalues.push(v.title);
                }
                data[indx][String(v.title)] = this.formatValue(v.value);
              });
            });



            this.setState({
                data: data,
                xvalues : xvalues,
                loading : false,
            })  
        }
    )
    .catch(
        (error) => {
            this.setState({
                loading : null
            })
            console.log("AxiosRequest_error = ",error)
        }
    );
  }

  customLabel(label)
  {

    const per = ['ROE','ROCE','Operating Margin','Net Profit Margin','Promoters'];
    const rs = ['Net Income','Revenue','Sales','Interest','Total Revenue','Interest Income Bank'];

    if(per.includes(label))
    {
      return '%';
    }

    else if(rs.includes(label))
    {
      return ('(in MN, INR)');
    }

    else
    {
      return '';
    }

  }
  

  render() {

    if(!this.state.loading)
    {

      const data = this.state.data;
      const xvalues = this.state.xvalues;
      const chartcolors = this.state.chartcolors;

      return (
        <>
           {xvalues.length > 0 && 
            
              <div className="bn__stock__financial__chart">
                <ResponsiveContainer width="80%" height={230}>
                  <LineChart  data={data}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <XAxis dataKey="date" tick={{fontSize : '10px'}} tickCount={6}/>
                    {/* <YAxis type="number" domain={['auto','auto']} hide={true}/>                   */}
                    <Tooltip labelStyle={{fontSize : '9px'}} contentStyle={{fontSize : '10px'}} content={<CustomTooltip fixed={this.props.fixed}/>}/>
                    <Legend verticalAlign="top" height={26} iconSize={6} iconType="circle" align="left" payload={
                      xvalues.map(
                          (item, indx) => ({
                            id: indx,
                            type: "circle",
                            value: item + ' '+this.customLabel(item),
                            color : chartcolors[indx%2]
                          })
                        )
                    } />
                    {
                      xvalues.map((xv,i)=>{
                        
                        return (
                          <YAxis orientation={i%2 === 0 ? 'left' : 'right'} yAxisId={xv} domain={[dataMin => (dataMin - dataMin / 4), dataMax => (dataMax + dataMax / 4)]} type="number" dataKey={xv} stroke="#8884d8" hide={true}/>
                        )
                      })
                    }
                    {
                      xvalues.map((xv,i)=>{
                        
                        return (
                            <Line key={i} yAxisId={xv} name={xv} type="monotone" dataKey={xv} stroke={chartcolors[i%2]} strokeWidth={2}/>
                        )
                      })
                    }
                  </LineChart>
                </ResponsiveContainer>
                
              </div>
            
           }

           

        </>
      )
    }
    else
    {

      // console.log(data);
      return (
        <>
           
           <div className="bn__stock__financial__chart">
              <Pulse />
           </div>
           
        </>
      )
    }
    
  }
}

export { BusinessChart };