import React from 'react';
import $ from 'jquery';
import Axios from 'axios';
import UpperStockChart from './UpperStockChart';
import AnimatedDigit from '../AnimatedDigit';
import {readMarketData} from '../../../exports/FormatData';
import Spinner from '../../Loader/Spinner';

const REQUEST_BASE_URL = 'localhost';


export class UpperStock extends React.PureComponent {

    constructor(props)
    {
        super(props);
        this.setInitialSize = this.setInitialSize.bind(this);
        this.state = {
            isLoading : true,
            data : null,
            chartWidth : 0,
            chartHeight : 0,
            stockData : '',
            ws : null,
            FeedConnection : false,
            endpoint : 'wss://masterswift-beta.mastertrust.co.in/hydrasocket/v2/websocket?access_token=qaoSOB-l4jmwXlxlucY4ZTKWsbecdrBfC7GoHjCRy8E.soJkcdbrMmew-w1C0_KZ2gcQBUPLlPTYNbt9WLJN2g8',
        }
        this.getIndexData = this.getIndexData.bind(this);
        this.feedLiveData = this.feedLiveData.bind(this);
    }

    componentDidMount()
    {
        this.makeSocketConnection()
        .then(()=>{
            this.checkConnection();
        });
        this.setInitialSize();
        this.getIndexData();
    }

    setInitialSize()
    {
        let wd = $('.upper__stock__info').width();
        let ht = $('.upper__stock__info').height();
        this.setState({
            chartWidth : 80,
            chartHeight : 20
        });
    }

    getIndexData()
    {
        Axios.get(`http://${REQUEST_BASE_URL}:8000/indexdata/${this.props.Symbol}`)
        .then((data)=>{
            let stockArray = data.data.chartdata;
            let tempDataArray = [];
            // console.log(stockArray);
            stockArray.forEach(d =>{
                let dobj = {
                    date : new Date(d['Date']),
                    open : parseFloat(d['Open']),
                    high : parseFloat(d["High"]),
                    low : parseFloat(d["Low"]),
                    close : parseFloat(d['Close']),
                    volume : parseInt(d['Volume'])
                }

                    tempDataArray.push(dobj);
                });
            // console.log(tempDataArray);

            this.setState({
                isLoading : false,
                data : tempDataArray
            });
        })
        .catch((error)=>{
            console.log(error);
        })
    }

    feedLiveData(ws)
    {
        ws.send(JSON.stringify({
            "a": "subscribe", 
            "v": [[this.props.ExchangeCode, this.props.StockCode]], 
            "m": "marketdata"}
        ));

        ws.onmessage = (response)=>{

            // console.log(response.data);
            
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
                // console.log(convertedData.last_traded_price);
                //get price change

                this.setState({
                    stockData : convertedData
                })
            }
        }
    }

    async makeSocketConnection()
    {
        return new Promise((resolve,reject)=>{
            let ws = new WebSocket(this.state.endpoint);
            ws.onopen = ()=>{
                console.log('connection done');
                this.setState({
                    ws : ws,
                    FeedConnection : true
                });
                resolve(ws)
            }
            ws.onerror = ()=>{
                console.log('Connection Error');
                this.setState({
                    ws : null,
                    FeedConnection : false
                })
            }
        })

    }

    checkConnection()
    {
        if(this.state.FeedConnection)
        {
            this.feedLiveData(this.state.ws);
        }
       
    }

    render() {

        const {Name,Symbol} = this.props;
        let stockData = this.state.stockData;

        let TradePrice = stockData.last_traded_price;
        let change_price = parseFloat(stockData.change_price);

        let priceClass = change_price >= 0 ? 'positive' : 'negative';

        return (
            this.state.isLoading ? 
            <div className="upper__stock">
                <Spinner size={20}/>
            </div>
            :
            <div className="upper__stock">
                <div className="upper__stock__info">
                    <p className="upper__stock__name">{Name}</p>
                    <div className="upper__stock__value">
                        <div className={priceClass+' stock__performance__amount'} style={{display : 'flex'}}>
                            {TradePrice &&
                                TradePrice.split('').map((n,i) => {
                                return <AnimatedDigit 
                                    digit={n} 
                                    size={12} 
                                    key={i}
                                />
                            })}
                        </div>
                    </div>
                    <div className="upper__stock__change" style={{display : 'flex'}}>
                        <div className={priceClass+' stock__performance__amount'} style={{display : 'flex'}}>
                            {stockData.change_percentage &&
                                stockData.change_percentage.split('').map((n,i) => {
                                return <AnimatedDigit 
                                        digit={n} 
                                        size={12} 
                                        key={i}
                                    />
                            })}
                            {/* {stockData.change_price} */}
                        </div>
                    </div>
                </div>
                <div className="upper__stock__chart">
                    <UpperStockChart 
                        data={this.state.data} 
                        width={this.state.chartWidth}   
                        height={this.state.chartHeight} 
                    />
                </div>
            </div>
        )
    }
}

export default UpperStock;
