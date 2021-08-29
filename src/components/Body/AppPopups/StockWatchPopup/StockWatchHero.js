import React from 'react';
import AnimatedDigit from '../../AnimatedDigit';
import { readMarketData,setChange } from '../../../../exports/FormatData';

const LIVEFEED_BASE_URL = process.env.REACT_APP_LIVEFEED_BASE_URL;


export class StockWatchHero extends React.PureComponent {

    constructor(props)
    {
        super(props);
        this.state={
            stockData : '',
            change : '',
            ws : null,
            FeedConnection : false,
        }
    }

    componentDidMount()
    {
        this.makeSocketConnection()
        .then(()=>{
            this.checkConnection();
        });
    }

    feedLiveData(ws)
    {

        let exchangecode = this.props.config.exchange && this.props.config.exchange.code;
        let stockcode = parseInt(this.props.config.code);

        // console.log(exchangecode,stockcode);

        ws.send(JSON.stringify({
            "a": "subscribe", 
            "v": [[exchangecode, stockcode]], 
            "m": "marketdata"
        }
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
                        let stockdata = this.state.stockData;
                        // console.log(stockdata.last_traded_price,stockdata.close_price,stockdata.open_price);
                        if(stockdata.last_traded_price === stockdata.close_price)
                        {

                            let compare = stockdata.open_price === 0 ? stockdata.close_price : stockdata.open_price;
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
                        let stockdata = convertedData.livedata;

                        if(stockdata.last_traded_price === stockdata.close_price)
                        {
                            let compare = stockdata.open_price === 0 ? stockdata.close_price : stockdata.open_price;
                            // console.log(compare)
                            const {change_price,change_percentage} = setChange(stockdata.last_traded_price,compare);

                            let livedata = stockdata;
                            livedata['change_price'] = change_price;
                            livedata['change_percentage'] = change_percentage;

                            convertedData = {
                                livedata
                            }
                        }
                    }
    
                    let livedata = convertedData.livedata;
                    // console.log(livedata.change_percentage);
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
                "v": [[exchangecode, stockcode]], 
                "m": "marketdata"
            }
            ));
        },10*1000)
    }

    async makeSocketConnection()
    {
        return new Promise((resolve,reject)=>{
            let ws = new WebSocket(LIVEFEED_BASE_URL);
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

        let {code,name,symbol,nse_code,bse_code,company,exchange} = this.props.config;

        let stockData = this.state.stockData;

        let change_price = parseFloat(stockData.change_price);
        let priceClass = change_price >= 0 ? 'positive' : 'negative';

        let stocksymbol = exchange.exchange === 'NSE' ? nse_code : bse_code;
        stocksymbol = stocksymbol ? stocksymbol : symbol;
        symbol = exchange.exchange === 'NSE' ? symbol : code;

        if(this.state.stockData)
        {
            return (
                <div className="Stock__watch__hero">
                    <div className="Stock__watch__hero__details">
                        <div>
                            <div className="Stock__watch__hero__status"></div>
                            <div className="Stock__watch__hero__name">{stocksymbol}</div>
                        </div>
                    </div>
                    <div className="Stock__watch__price">
                        <div className={priceClass+' Stock__watch__hero__change'} style={{display : 'flex'}}>
                                {stockData.change_percentage &&
                                    stockData.change_percentage.split('').map((n,i) => {
                                        return <AnimatedDigit 
                                            digit={n} 
                                            size={16} 
                                            key={i}
                                            digitMargin={0}
                                        />
                                })}
                            </div>
                    </div>
                </div>
            )
        }
        else
        {
            return null
        }
    }
}

export default StockWatchHero;
