
import React from 'react';
import Axios from 'axios';
import { readMarketData , setChange } from '../../../../exports/FormatData';
import AnimatedDigit from '../../AnimatedDigit';

const REQUEST_BASE_URL = process.env.REACT_APP_REQUEST_BASE_URL;
const LIVEFEED_BASE_URL = process.env.REACT_APP_LIVEFEED_BASE_URL;

class TableRow extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            ws : null,
            FeedConnection : false,
            stockData : '',
            data : this.props.data,
            code : '',
            exchange : ''
        }
    }

    componentDidMount()
    {
        this.getStockConfig()
        .then(()=>{
            this.makeSocketConnection()
            .then(()=>{
                this.checkConnection();
            })
        })
    }

    getStockConfig()
    {
        return new Promise((resolve,reject)=>{
            let stockcode = this.state.data.StockCode;

            Axios.get(`${REQUEST_BASE_URL}/StockFromSymbol/${stockcode}`)
            .then((response)=>{
                response = response.data;
                if(!response.error && response.message === 'success')
                {
                    let stock = response.stock;
                    this.setState({
                        code : parseInt(stock.code),
                        exchange : parseInt(stock.exchange)
                    });

                    resolve(stock)

                }
            })
            .catch((error)=>{
                reject(error);
            })
        })

    }

    async makeSocketConnection()
    {
        return new Promise((resolve,reject)=>{
            let ws = new WebSocket(LIVEFEED_BASE_URL);
            ws.onopen = ()=>{
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

    feedLiveData(ws)
    {
        const index = this.props.index;
        let change_per;
        // console.log('subscribe',this.state.stockDetails.stockCode);
        ws.send(JSON.stringify({
            "a": "subscribe", 
            "v": [[this.state.exchange, this.state.code]], 
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
                    change_per = livedata.change_percentage;
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
                    // console.log(change_price,change_percentage);
                    // console.log(livedata);
                    change_per = livedata.change_percentage;
                    this.setState({
                        stockData : livedata
                    });
                }
            }

            this.props.setIndividualChange(index,change_per);
        }

        setInterval(()=>{
            ws.send(JSON.stringify({
                "a": "h", 
                "v": [[this.state.exchange, this.state.code]], 
                "m": ""}
            ));
        },10*1000)

       

    }

    Tbody({ td = [], style }) {
        return (
            <tr style={{ margin: 15, ...style }}>
                {
                    td.map((v, i) => {
                        return <td key={i} style={{ padding: 5 }}>{v}</td>
                    })
                }
            </tr>
        )
    }

    Name({ name, fullName }) {
        return (
            <>
                <div className="portfolio__stock__code">
                    <div className="stock__status"></div>
                    <div className="stock__code">{name}</div>
                </div>
                <div className="portfolio__stock__name">{fullName}</div>
            </>)
    }

    Symbol({ type, onClickOrder }) {
        return <button className="increase-circle" type={type} onClick={onClickOrder}
                    style={{ backgroundColor: (type === '+' ? '#00a0e3' : '#E51A4B'),
                            borderRadius: '50%',
                            width: 20, height: 20, color: 'white',  
                            textAlign: 'center'}}>{type}</button>
    }

    onClickOrder = (e) =>{
        this.props.addOrderArr(this.props.index, e.target.innerHTML);
    }

    render() {

        const {data, newWeight, orderArr, index} = this.props;
        const curr = (num) => parseFloat(num).toLocaleString('en-IN', {style: 'currency',currency: 'INR'});

        let stockData = this.state.stockData;
        let change_price = parseFloat(stockData.change_price);
        let priceClass = change_price >= 0 ? true : false;

        return (
            <this.Tbody td={[
                <this.Name name={data.StockCode} fullName={data.StockName} />
                ,
                data.Quantity,
                curr(data.AverageCost),
                curr(data.CurrentPrice),
                curr(data.CostValue),
                curr(data.CurrentValue),
                <span style={{ fontWeight: 'bold', color: "#19E683" }}>{data.TotalReturn}%</span>,
                <span style={{ fontWeight: 'bold', color: priceClass ? "#19E683" : "#e51a4b" , display : 'flex'}}>
                    {stockData.change_percentage &&
                        stockData.change_percentage.split('').map((n,i) => {
                            return <AnimatedDigit 
                                digit={n} 
                                size={16} 
                                key={i}
                                digitMargin={0}
                            />
                    })}
                </span>,
                data.PortfolioWeight+'%'+((newWeight!=0)?('('+newWeight+'%)'):''),
                curr(orderArr[index]*data.CurrentPrice),
                orderArr[index],
                <this.Symbol type="+" onClickOrder={this.onClickOrder} />,
                <this.Symbol type="-" onClickOrder={this.onClickOrder} />

            ]} />
        );
    }
}

export default TableRow;