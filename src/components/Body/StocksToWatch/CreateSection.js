import React from 'react';
import AnimatedDigit from '../AnimatedDigit';
import {readMarketData,setChange} from '../../../exports/FormatData';

const LIVEFEED_BASE_URL = process.env.REACT_APP_LIVEFEED_BASE_URL;

const SVGIMG1 = {
    Star: ({ isFav = false }) => {
        const [hover, setHover] = React.useState(isFav)
        const Attr = {
            style: { cursor: 'pointer' },
            onMouseEnter: _ => setHover(true),
            onMouseLeave: _ => !isFav && setHover(false),
            onClick: _ => { isFav = !isFav }
        }


        return (
            (isFav || hover) ?
                <svg {...Attr} xmlns="http://www.w3.org/2000/svg" width={14} height={14} fill='yellow' viewBox="0 0 16 16">
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                </svg>
                :
                <svg {...Attr} xmlns="http://www.w3.org/2000/svg" width={14} height={14} fill="#ccc" viewBox="0 0 16 16">
                    <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
                </svg>
        )
    },
}

export class CreateSection extends React.PureComponent {

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
                "m": ""
            }
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

    render() {
        
        let {symbol,name} = this.props.config;

        let stockData = this.state.stockData;


        // console.log(stockData);


        let change_price = parseFloat(stockData.change_price);
        let priceClass = change_price >= 0 ? 'positive' : 'negative';

        let fullName;
        if(name.length > 20)
        {
            fullName = name.slice(0,20)+'...';
        }
        else
        {
            fullName = name;
        }

        return (
            <>
                <div className="app__StocksToWatch__stock" onClick={e => this.props.selectedStock(this.props.config)}>
                    <div className="StocksToWatch__stock__details">
                        <div>
                            <div className="StocksToWatch__stock__status"></div>
                            <div className="StocksToWatch__stock__name">{symbol}</div>
                        </div>
                        <div className="StocksToWatch__stock__fullname">{fullName}</div>
                    </div>
                    <div className="StocksToWatch__stock__favourite">
                        <span className={priceClass+' StocksToWatch__change__per'} style={{display : 'flex'}}>
                        {stockData.change_percentage &&
                            stockData.change_percentage.split('').map((n,i) => {
                                return <AnimatedDigit 
                                digit={n} 
                                size={16} 
                                key={i}
                                digitMargin={0}
                            />
                        })}
                        </span>
                        <span className="StocksToWatch__stock__star">
                            {<SVGIMG1.Star isFav={this.props.isFavorite} />}
                        </span>
                    </div>
                </div>
            </>
        )
    }
}

export default CreateSection
