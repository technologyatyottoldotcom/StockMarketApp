import React from 'react';
import {readMarketData} from '../../../exports/FormatData';

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
            ws : null,
            FeedConnection : false,
            endpoint : 'wss://masterswift-beta.mastertrust.co.in/hydrasocket/v2/websocket?access_token=qaoSOB-l4jmwXlxlucY4ZTKWsbecdrBfC7GoHjCRy8E.soJkcdbrMmew-w1C0_KZ2gcQBUPLlPTYNbt9WLJN2g8'
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
        
        let stockData = this.state.stockData;

        let change_price = parseFloat(stockData.change_price);
        let priceClass = change_price >= 0 ? 'positive' : 'negative';

        let fullName;
        if(this.props.fullName.length > 20)
        {
            fullName = this.props.fullName.slice(0,20)+'...';
        }
        else
        {
            fullName = this.props.fullName;
        }

        return (
            <>
                <div className="app__StocksToWatch__stock" onClick={e => this.props.loadStock(this.props.ISIN)}>
                    <div className="StocksToWatch__stock__details">
                        <div>
                            <div className="StocksToWatch__stock__status"></div>
                            <div className="StocksToWatch__stock__name">{this.props.name}</div>
                        </div>
                        <div className="StocksToWatch__stock__fullname">{fullName}</div>
                    </div>
                    <div className="StocksToWatch__stock__favourite">
                        <span className={priceClass+' StocksToWatch__change__per'}>{stockData.change_percentage}</span>
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
