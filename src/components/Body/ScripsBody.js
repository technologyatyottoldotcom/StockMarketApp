import React from 'react';
import axios from 'axios';
import $ from 'jquery';
import Close from '../../assets/icons/close.svg';
import CashPosition from './CashPosition';
import ChartContainer from './ChartContainer';
import KeyStatistics from './KeyStatistics';
import StocksToWatch from './StocksToWatch';
import TopStocks from './TopStocks';
import Portfolios from './MenuSection/Portfolios';
import Orders from './MenuSection/Orders';
import SmallCase from './MenuSection/SmallCase';
import Research from './MenuSection/Research';
import Exit from './MenuSection/Exit';
import { timeParse } from "d3-time-format";
import MSFTArray from '../../data/MSFT';
import { BusinessNews } from './BusinessNews/BusinessNews';
import {readMarketData} from '../../exports/FormatData';
import '../../css/BusinessNews.css';
import '../../css/MenuSection.css';
import 'rsuite/dist/styles/rsuite-default.css';




class ScripsBody extends React.Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            chartdata : [],
            stockData : '',
            tempData : '',
            endpoint : 'wss://masterswift-beta.mastertrust.co.in/hydrasocket/v2/websocket?access_token=qaoSOB-l4jmwXlxlucY4ZTKWsbecdrBfC7GoHjCRy8E.soJkcdbrMmew-w1C0_KZ2gcQBUPLlPTYNbt9WLJN2g8'}
    }

    componentDidMount()
    {
        // this.loadData();
        this.loadChartData();
        this.checkConnection();
    }

    checkConnection()
    {
        let ws = new WebSocket(this.state.endpoint);
        ws.onopen = ()=>{
            console.log('connection done')
            ws.send(JSON.stringify({"a": "subscribe", "v": [[1, this.props.stockCode]], "m": "marketdata"}))
        }
        ws.onmessage = (response)=>{
            
            var reader = new FileReader();
            
            reader.readAsArrayBuffer(response.data);
            let convertedData;
            reader.onloadend = (event) => {
                let data = new Uint8Array(reader.result);
                if(this.state.stockData)
                {
                    convertedData = readMarketData(data,this.state.stockData.close_price);
                }
                else
                {
                    convertedData = readMarketData(data,-1);
                }
                // console.log(convertedData);
                //get price change

                this.setState({
                    stockData : convertedData
                })
            }
        }
    }

    async loadChartData()
    {
        axios.get(`https://mastertrust-charts.tradelab.in/api/v1/charts?exchange=NSE&token=${this.props.stockCode}&candletype=1&starttime=1609479368&endtime=1632583718&data_duration=1`)
        .then(res=>{
            const data = res.data;
            if(data.status === 'success')
            {
                
                let stockArray = data.data.candles;
                let tempDataArray = [];
                stockArray.forEach(d =>{
                    let dobj = {
                        date : new Date(d[0]),
                        open : parseFloat(d[1]),
                        high : parseFloat(d[2]),
                        low : parseFloat(d[3]),
                        close : parseFloat(d[4]),
                        volume : parseInt(d[5])
                    }

                    tempDataArray.push(dobj);

                });
                this.setState({
                    chartdata : tempDataArray
                })
            }

            console.log('chart data');
            
        })
    }

    async loadData()
    {

        // console.log('load');
        let tempDataArray = [];
        const parseDate = timeParse('%Y-%m-%d');
        MSFTArray.forEach(d =>{
            let dobj = {
                date : parseDate(d[0]),
                open : parseFloat(d[1]),
                high : parseFloat(d[2]),
                low : parseFloat(d[3]),
                close : parseFloat(d[4]),
                volume : parseInt(d[5])
            }

            tempDataArray.push(dobj);

        });

        // console.log(tempDataArray);

        this.setState({
            chartdata : tempDataArray
        });

    }

    openNews()
    {
        $('.business__news__section').css('transform','translateY(0%)');
        $('.bn__close').addClass('active');
    }

    closeNews()
    {
        $('.business__news__section').css('transform','translateY(100%)');
        $('.bn__close').removeClass('active');
    }

    

    render()
    {


        let activeElement = this.props.active?.toLowerCase().replace(/ /g, '');

        const dataArray = [
            {
                'name' : 'BSE Sensex',
                'value' : '51,238.15',
                'changeP' : '0.97%'
            },
            {
                'name' : 'Nifty 50',
                'value' : '51,238.15',
                'changeP' : '0.97%'
            },
            {
                'name' : 'NSE FMCG',
                'value' : '51,238.15',
                'changeP' : '0.97%'
            },
            {
                'name' : 'Bank Nifty',
                'value' : '51,238.15',
                'changeP' : '0.97%'
            },
            {
                'name' : 'NSE Midcap',
                'value' : '51,238.15',
                'changeP' : '0.97%'
            }
        ]

        if(this.state.chartdata.length > 0)
        {

            return <div className="app__body">

                <div className="app__body__top">
                    {/* <TopStocks data={this.state.chartdata} dataArray={dataArray}/> */}
                </div>
                <div className="app__body__bottom">
                    <div className="business__news__section">
                        <div className="business__news__wrapper">
                            <div className="bn__title">
                                <div>
                                    <p className="bn__stock__name">RELIANCE.NS</p>
                                    <p className="bn__stock__fullname">Reliance Industries Ltd.</p>
                                </div>
                                <div>
                                    <p onClick={this.openNews.bind(this)}>Detailed View</p>
                                    <div className="bn__close" onClick={this.closeNews.bind(this)}>
                                        <img src={Close} alt="x"/>    
                                    </div>
                                </div>
                            </div>
                            <div className="business__news__content">
                                <BusinessNews />
                            </div>
                            
                        </div>
                        
                    </div>
                    {this.props.isActive &&
                        <div className="menu__section">
                            <div className="menu__section__wrapper">
                                
                                <div className="menu__section__close" onClick={()=> this.props.setActiveElement(null,false)}>
                                    <img src={Close} alt="x"/>    
                                </div>

                                <div className="menu__content">
                                    {activeElement === 'portfolios' && <Portfolios />}
                                    {activeElement === 'orders' && <Orders />}
                                    {activeElement === 'smallcase' && <SmallCase />}
                                    {activeElement === 'research' && <Research />}
                                    {activeElement === 'exit' && <Exit />}

                                </div>


                                
                            </div>
                        </div>
                    }
                    <div className="app__body__left">
                        <ChartContainer data={this.state.chartdata} stockData={this.state.stockData}/>
                        <StocksToWatch />
                        <KeyStatistics stockData={this.state.stockData}/>
                    </div>
                    <div className="app__body__right">
                        <CashPosition />
                    </div>
                </div>

            </div>
        }
        else
        {
            return null
        }
    }
}

export default ScripsBody;
