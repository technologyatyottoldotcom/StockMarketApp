import React, { Component } from 'react';
import AnimatedDigit from '../AnimatedDigit';
import {readMarketData,readMarketStatus,setChange} from '../../../exports/FormatData';
import Axios from 'axios';

const REQUEST_BASE_URL = process.env.REACT_APP_REQUEST_BASE_URL;
const LIVEFEED_BASE_URL = process.env.REACT_APP_LIVEFEED_BASE_URL;

class RelateStocks extends Component {

    constructor(props) {
        super(props);
        this.state = {
            stockCode: null,
            exchange: null,
            ws: null,
            FeedConnection: false,
            stockData: null,
        }

        this.feedLiveData = this.feedLiveData.bind(this)
        this.makeSocketConnection = this.makeSocketConnection.bind(this)
        this.checkConnection = this.checkConnection.bind(this)
    }
    

    componentDidMount(){

        Axios.get(`${REQUEST_BASE_URL}/StockFromSymbol/${this.props.el}`).then(response => {
            this.setState({
                stockCode: parseInt(response.data.stock.code),
                exchange: parseInt(response.data.stock.exchange)
            }, () => {
                console.log('callback');
                this.makeSocketConnection()
                .then(()=>{
                    this.checkConnection();
                })
            });
        })

    }


    /*<--- Live Data Feed Methods --->*/
    async makeSocketConnection()
    {
        return new Promise((resolve,reject)=>{
            // console.log('make socket connection')
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
                // console.log('Connection Error');
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

    feedLiveData(ws)
    {
    
        ws.send(JSON.stringify({
            "a": "subscribe", 
            "v": [[this.state.exchange, this.state.stockCode]], 
            "m": "marketdata"}
        ));

        ws.onmessage = (response)=>{
            var reader = new FileReader();
            
            reader.readAsArrayBuffer(response.data);
            let convertedData;
            reader.onloadend = (event) => {
                let data = new Uint8Array(reader.result);
                if(response.data.size >= 86)
                {
                    if(this.state.stockData)
                    {
                        convertedData = readMarketData(data,this.state.stockData['close_price']);
                    }
                    else
                    {
                        convertedData = readMarketData(data,-1);
                    }
    
                    let livedata = convertedData.livedata;
                    this.setState({
                        stockData : livedata
                    });
                }
                else
                {
                    // console.log('---GET FROM DATABASE---');
                    let livedata = this.state.stockData;
                    let trade_price = this.state.stockData && this.state.stockData.last_traded_price;
                    let open_price = this.state.stockData && this.state.stockData.open_price;

                    const {change_price,change_percentage} = setChange(trade_price,open_price);

                    // livedata
                    livedata['change_price'] = change_price;
                    livedata['change_percentage'] = change_percentage;
                    console.log(change_price,change_percentage);
                    // console.log(livedata);
                    this.setState({
                        stockData : livedata
                    });
                }
            }
        }
    }
    render() {
        if(this.state.stockData){

            const change = this.state.stockData.change_percentage;
            return (
                <span style={{color: '#22ee5b', marginLeft : '6px' , fontWeight : '700' }}>
                    <AnimatedDigit number={change} size={12} />
                </span>
            );
        }
        else
            return(
                <span style={{color: '#22ee5b' }}>&nbsp;0.00%</span>
            )
    }
}

export default RelateStocks;