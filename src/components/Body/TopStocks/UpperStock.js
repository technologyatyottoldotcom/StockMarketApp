import React from 'react';
import $ from 'jquery';
import Axios from 'axios';
import UpperStockChart from './UpperStockChart';
import AnimatedDigit from '../AnimatedDigit';
import {readMarketData,setChange} from '../../../exports/FormatData';
import {getEndOfDayMinutes,generateMarketDay} from '../../../exports/FutureEntries';
import Spinner from '../../Loader/Spinner';
import Pulse from '../../Loader/Pulse';

const REQUEST_BASE_URL = process.env.REACT_APP_REQUEST_BASE_URL;
const LIVEFEED_BASE_URL = process.env.REACT_APP_LIVEFEED_BASE_URL;

export class UpperStock extends React.PureComponent {

    constructor(props)
    {
        super(props);
        this.setInitialSize = this.setInitialSize.bind(this);
        this.state = {
            isLoading : true,
            apidata : null,
            extradata : null,
            dbclose : 0,
            chartWidth : 0,
            chartHeight : 0,
            stockData : '',
            change : '',
            ws : null,
            FeedConnection : false,
        }
        this.getIndexData = this.getIndexData.bind(this);
        this.updateIndexData = this.updateIndexData.bind(this);
        this.feedLiveData = this.feedLiveData.bind(this);
        this.getDBClose = this.getDBClose.bind(this);
        
    }

    componentDidMount()
    {
        this.getDBClose()
        .then(()=>{
            this.makeSocketConnection()
            .then(()=>{
                this.checkConnection();
            });
        });
        this.setInitialSize();
        this.getIndexData();
        
    }

    async getDBClose()
    {
        return new Promise((resolve,reject)=>{
            Axios.get(`${REQUEST_BASE_URL}/LatestPriceIndex/${this.props.Symbol}`)
            .then((res)=>{
                let data = res.data;
                if(data.status === 'success')
                {
                    this.setState({
                        dbclose : data.close
                    });
                    resolve(data);
                }
            })
            .catch((err)=>{
                // console.log(err);
                reject(err);
            });
        })
    }

    setInitialSize()
    {
        let wd = $('.upper__stock__info').width();
        let ht = $('.upper__stock__info').height();
        this.setState({
            chartWidth : 80,
            chartHeight : 40
        });
    }

    getIndexData()
    {
        Axios.get(`${REQUEST_BASE_URL}/indexdata/${this.props.Symbol}`)
        .then((data)=>{
            let stockArray = data.data.chartdata;

            // console.log(stockArray);

            let date = stockArray.length > 0 && stockArray[0];

            let points = generateMarketDay(new Date(date['TIMESTAMP']));

            // console.log(points);


            let tempDataArray = points;
            tempDataArray.forEach((d,indx) =>{
                if(stockArray[indx])
                {
                    let dobj = {
                        open : stockArray[indx]['OPEN'] && parseFloat(stockArray[indx]['OPEN']),
                        high : stockArray[indx]["HIGH"] && parseFloat(stockArray[indx]["HIGH"]),
                        low : stockArray[indx]["LOW"] && parseFloat(stockArray[indx]["LOW"]),
                        close : stockArray[indx]['CLOSE'] && parseFloat(stockArray[indx]['CLOSE']),
                        volume : stockArray[indx]['VOLUME'] && parseInt(stockArray[indx]['VOLUME'])
                    }
    
                    tempDataArray[indx] = {...tempDataArray[indx],...dobj};
                }
            });

            // console.log(tempDataArray);

            this.setState({
                isLoading : false,
                apidata : tempDataArray,
                extradata : []
            },()=>{
                this.updateIndexData();
            });
        })
        .catch((error)=>{
            console.log(error);
        })
    }

    updateIndexData()
    {
        setInterval(()=>{

            Axios.get(`${REQUEST_BASE_URL}/indexdata/${this.props.Symbol}`)
            .then((data)=>{
                let stockArray = data.data.chartdata;

                let date = stockArray.length > 0 && stockArray[0];

                let points = generateMarketDay(new Date(date['TIMESTAMP']));

                let tempDataArray = points;
                stockArray.forEach((d,indx) =>{
                    let dobj = {
                        open : parseFloat(d['OPEN']),
                        high : parseFloat(d["HIGH"]),
                        low : parseFloat(d["LOW"]),
                        close : parseFloat(d['CLOSE']),
                        volume : parseInt(d['VOLUME'])
                    }

                    tempDataArray[indx] = {...tempDataArray[indx],...dobj};
                });

                
                this.setState({
                    apidata : tempDataArray,
                    extradata : []
                });
            })
            .catch((error)=>{
                console.log(error);
            })
        },10000)
    }

    feedLiveData(ws)
    {
        ws.send(JSON.stringify({
            "a": "subscribe", 
            "v": [[this.props.ExchangeCode, this.props.StockCode]], 
            "m": "marketdata"}
        ));

        ws.onmessage = (response)=>{

            
            var reader = new FileReader();
            
            reader.readAsArrayBuffer(response.data);
            let convertedData;
            reader.onloadend = (event) => {
                let data = new Uint8Array(reader.result);
                // console.log(response.data.size)
                if(response.data.size >= 86)
                {
                    if(this.state.stockData)
                    {

                        let stockdata = this.state.stockData;
                        // console.log(stockdata.last_traded_price,stockdata.close_price,stockdata.open_price);
                        if(stockdata.last_traded_price === stockdata.close_price)
                        {

                            let compare = stockdata.open_price === 0 ? stockdata.close_price : stockdata.open_price;
                            // console.log(compare)
                            const {change_price,change_percentage} = setChange(stockdata.last_traded_price,compare);
                            // livedata

                            let livedata = stockdata;
                            livedata['change_price'] = change_price;
                            livedata['change_percentage'] = change_percentage;

                            convertedData = {
                                livedata
                            }

                        }
                        else
                        {
                            // console.log('close');
                            convertedData = readMarketData(data,this.state.stockData['close_price']);
                        }
                    }
                    else
                    {
                        convertedData = readMarketData(data,-1);

                        // console.log(convertedData);
                        let stockdata = convertedData.livedata;
                        const dbclose = this.state.dbclose;

                        if(dbclose)
                        {
                            const {change_price,change_percentage} = setChange(stockdata.last_traded_price,dbclose);

                            let livedata = stockdata;
                            livedata['change_price'] = change_price;
                            livedata['change_percentage'] = change_percentage;

                            convertedData = {
                                livedata
                            }
                        }
                    }
    
                    let livedata = convertedData.livedata;
                    // console.log(livedata);
                    this.setState({
                        stockData : livedata,
                        change : livedata.change_percentage
                    });
                }
            }
        }

        setInterval(()=>{
            ws.send(JSON.stringify({
                "a": "h", 
                "v": [[this.props.ExchangeCode, this.props.StockCode]], 
                "m": ""}
            ));
        },10*1000)
    }

    async makeSocketConnection()
    {
        return new Promise((resolve,reject)=>{
            let ws = new WebSocket(LIVEFEED_BASE_URL);
            ws.onopen = ()=>{
                // console.log('connection done');
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

    convertIntoPriceFormat(num,frac=2)
    {
        if(num)
        {
            return num.toLocaleString('en-IN',{
                minimumFractionDigits: frac,
                currency: 'INR'
            });
        }
        else
        {
            return num;
        }
        
    }

    render() {

        const {Name,Symbol} = this.props;
        let stockData = this.state.stockData;

        // console.log(stockData);
        let TradePrice = this.convertIntoPriceFormat(stockData.last_traded_price);
        let change_price = parseFloat(stockData.change_price);

        let priceClass = change_price >= 0 ? 'positive' : 'negative';


        return (
            this.state.isLoading ? 
            <div className="upper__stock loader">
                {/* <Spinner size={20}/> */}
                <Pulse />
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
                        apidata={this.state.apidata}
                        extradata={this.state.extradata} 
                        width={this.state.chartWidth}   
                        height={this.state.chartHeight}
                        status={priceClass}
                        openPrice={stockData.open_price} 
                    />
                </div>
            </div>
        )
    }
}

export default UpperStock;
