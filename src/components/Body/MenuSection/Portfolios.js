import React from 'react';
import Axios from 'axios';
import Coin from '../../../assets/icons/coins.svg';
import BriefCase from '../../../assets/icons/suitcase.svg';
import ChevronDown from '../../../assets/icons/ChevronDown.svg';
import "../../../css/MenuSection/Portfolio.css";
import AnimatedDigit from '../AnimatedDigit';
import TableRow from './PortfolioComponents/TableRow';
import { ReCalculateWeight } from '../../../exports/ReCalculateWeight';
import PerformanceAnalytics from './PortfolioComponents/PerformanceAnalytics';
import Pulse from '../../Loader/Pulse';
import SearchBar from './PortfolioComponents/SearchBar';
import { Alert } from '../CustomChartComponents/CustomAlert/CustomAlert';

const REQUEST_BASE_URL = process.env.REACT_APP_REQUEST_BASE_URL;


class Portfolios extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            data : [],
            portfolioWeightArr : [],
            orderArr : [],
            newWeight : [],
            changeArr : [],
            cashPos : null,
            tradeVolume : 0,
            sum : null,
            totalReturnToday : '',
            totalReturnChange : ' ',
            totalReturnPositive : false,
            isLoaded : false,
            activeElement : 0,
            dataLen : 0,
        }
        this.addOrderArr = this.addOrderArr.bind(this);
        this.portfolioHome = this.portfolioHome.bind(this);
        this.performanceAnalyse = this.performanceAnalyse.bind(this);
        this.addTableRow = this.addTableRow.bind(this);
        this.setIndividualChange = this.setIndividualChange.bind(this);
    }

    componentDidMount(){
        Axios.get(`${REQUEST_BASE_URL}/portfolio`).then(response => {
            let arr = new Array(response.data.portfolioData.length).fill(0);
            this.setState({
                data : response.data.portfolioData,
                dataLen : response.data.portfolioData.length,
                orderArr : arr,
                newWeight : arr,
                changeArr : new Array(response.data.portfolioData.length).fill(0),
                cashPos : 13254,
                sum : response.data.sum,
                isLoaded : true,
            })
        })
        .then(()=>{

            let pwa = [];
            const data = this.state.data;
            data.forEach((d)=>{
                pwa.push(parseFloat(d.PortfolioWeight));
            });

            this.setState({
                portfolioWeightArr : pwa
            });
        })
    }

    setIndividualChange(index,value)
    {
        if(value && value !== undefined)
        {
            value = parseFloat(value.split('%')[0]);
            let changeArr = this.state.changeArr;
            changeArr[index] = value;
            this.setState({
                changeArr : changeArr
            });
        }

        this.calculateReturns();
    }

    calculateReturns()
    {
        const changeArr = this.state.changeArr;
        const pwArr = this.state.portfolioWeightArr;
        const currValue = this.state.sum.currentValueSum;

        let totalReturns = 0;

        changeArr.forEach((c,indx)=>{
            if(c && c!== undefined && pwArr[indx] && pwArr[indx]!== undefined)
            {
                totalReturns += (c*pwArr[indx]);
            }
        });

        totalReturns =parseFloat((totalReturns/100).toFixed(2));
        let totalChange = ((totalReturns*currValue)/100).toFixed(2);
        let totalReturnPositive = totalReturns >= 0 ? true : false;

        totalReturns = totalReturns + '%';

        this.setState({
            totalReturnToday : totalReturns,
            totalReturnChange : totalChange,
            totalReturnPositive
        });


    }

    CashPos({ cashPos, tradeVolume }) {
        const curr = (num) => parseFloat(num).toLocaleString('en-IN', {style: 'currency',currency: 'INR'});
        return (
            <>
                <div className="portfolio__cash__title">
                    <img src={Coin} alt="Coin" />
                    <span>Cash Position</span>
                </div>
                <div className="portfolio__cash__value">
                    <span>{curr(cashPos)}</span>
                    {(tradeVolume!=0)?<span className="portfolio__trade__value"> ({curr(cashPos-tradeVolume)})</span>:''}
                </div>
            </>
        )
    }

    PortfolioNme() {
        return (
            <>
                <div className="portfolio__title">
                    <img src={BriefCase} alt="Briefacase" />
                    <span>Portfolio Name</span>
                </div>
                <div className="portfolio__name__value">
                    <span>Growth Portfolio</span> 
                    <img src={ChevronDown} alt="ChevronDown" />
                </div>
            </>
        )
    }

    CreatePriceCol({ heading, change, changePer, positive }) {
        const curr = (num) => parseFloat(num).toLocaleString('en-IN', {style: 'currency',currency: 'INR'});
        let changeAmount = curr(change);
        return (
            <>
                    <p className="portfolio__curr__price">{curr(heading)}</p>
                    <div className="portfolio__change">
                        {changeAmount && <span className="portfolio__change__value" style={{ color : positive ? '#19E683' : '#e51a4b'}}>                 
                            <AnimatedDigit number={changeAmount} size={16} digitMargin={0}/>     
                            
                        </span> }
                        {changePer && <span className="portfolio__change__per" style={{ color : positive ? '#19E683' : '#e51a4b'}}>
                            <AnimatedDigit number={changePer} size={16} digitMargin={0}/>     
                        </span>
                        }
                    </div>
            </>
        )
    }

    THead({ th = [] }) {
        return th.map((v, i) => {
            if (Array.isArray(v)) {
                if (v[1].style) {
                    v[1].style['borderBottom'] = '1px solid #ccc'
                }

                return <th key={i} {...v[1]} >{v[0]}</th>
            }
            else return <th key={i} style={{ padding :'2px 5px', borderBottom: v ? '1px solid #e7e7e7' : ''}}>{v}</th>

        })
    }

    Tbody({ td = [], style }) {
        return (
            <tr style={{ margin: 15, ...style }}>
                {
                    td.map((v, i) => {
                        return <td key={i} style={{ padding: '2px 5px' }}>{v}</td>
                    })
                }
            </tr>
        )
    }

    Button({performanceAnalyse}){
        return(
                <>
                    <div>
                        <button>Download Report</button>
                        <button onClick={performanceAnalyse}>Perfomance Analysis</button>
                    </div>
                    <div>
                        <button>Place Portfolio Order</button>
                    </div>
                </>
        )
    }

    portfolioHome(){
        this.setState({
            activeElement : 0
        })
    }

    performanceAnalyse(){
        this.setState({
            activeElement : 2
        })
    }

    addOrderArr(index, type ){

        const {orderArr, data, cashPos} = this.state;
        this.setState({insufficientCash: false});

        (type === '+') ? orderArr[index] += 1 : orderArr[index] -= 1;

        if(-orderArr[index] > data[index].Quantity){
            orderArr[index] += 1
            Alert({
                TitleText : 'Warning',
                Message : 'Cannot sell more than current holding.',
                Band : true,
                BandColor : '#E51A4B',
                BoxColor : '#ffffff',
                TextColor : '#000000',
                AutoClose : {
                    Active : true,
                    Line : true,
                    LineColor : '#E51A4B',
                    Time : 5
                }
            })

        } else{

            const {newWeight, tradeVolume} = ReCalculateWeight(data, orderArr);
    
            if(cashPos-tradeVolume < 0){
                orderArr[index] -= 1
                Alert({
                    TitleText : 'Warning',
                    Message : 'Net cash postion cannot be negative. Add SELL order to BUY more.',
                    Band : true,
                    BandColor : '#00a0e3',
                    BoxColor : '#ffffff',
                    TextColor : '#000000',
                    AutoClose : {
                        Active : true,
                        Line : true,
                        LineColor : '#00a0e3',
                        Time : 5
                    }
                })

            }
            else{
                this.setState({
                    newWeight, tradeVolume, orderArr
                })
            }   
        }

    }

    createTable = () => {

        const {data} = this.state;

        let table = [];
        data.forEach((row, i) => {
            table.push(<TableRow 
                        key={i} 
                        index={i} 
                        newWeight={this.state.newWeight[i]} 
                        data={row} 
                        orderArr={this.state.orderArr} 
                        addOrderArr={this.addOrderArr}
                        setIndividualChange={this.setIndividualChange}
                        />)
        })

        return table;
    }

    async addTableRow(stock){
        
        let {data, orderArr, newWeight, dataLen} = this.state;
        
        let code = (stock.exchange.exchange.toLowerCase()=='nse')? stock.nse_code : stock.bse_code;

        if(!(data.map(el => el.StockCode).includes(code))){
            const obj = {
                StockCode: code,
                StockName: stock.name,
                Quantity: 0,
                AverageCost: 0,
                CostValue: 0,
                CurrentPrice: (await Axios.get(`${REQUEST_BASE_URL}/stock_price/${stock.exchange.exchange.toLowerCase()}/${code}`)).data.CLOSE,
                CurrentValue: 0,
                PortfolioWeight: 0,
                TotalReturn: 0
            }
    
            data.push(obj);
            dataLen = data.length;
            orderArr[dataLen-1] = 0;
            newWeight[dataLen-1] = 0;
    
            this.setState({
                data, newWeight, orderArr, dataLen
            })
        }
    }


    render() {
        const {sum, isLoaded, cashPos, tradeVolume, activeElement, insufficientCash,totalReturnToday,totalReturnChange} = this.state;
 

        const curr = (num) => parseFloat(num).toLocaleString('en-IN', {style: 'currency',currency: 'INR'});
        if(!isLoaded){
            return(
            <div className="portfolio__container loader" >
                <Pulse />
                <p>Loading Portfolio...</p>
            </div>)
        }else{
            if(activeElement == 0)
                return (
                    <>
                        <div className="portfolio__container">
                            
                            <div className="portfolio__header">
                                <div className="portfolio__details">
                                    <div className="portfolio__name">
                                        <this.PortfolioNme />
                                    </div>
                                    <div className="portfolio__value">
                                        <this.CreatePriceCol
                                            heading={sum.currentValueSum}
                                            change={totalReturnChange}
                                            changePer={totalReturnToday}
                                            positive={this.state.totalReturnPositive}
                                        />
                                    </div>
                                </div>
                                <div className="portfolio__cash__position">
                                    <this.CashPos 
                                        cashPos={cashPos}
                                        tradeVolume={tradeVolume}
                                    
                                    />
                                </div>
                                <div className="portfolio__search__box" >
                                    <SearchBar addTableRow={this.addTableRow}/>
                                </div>
                            </div>
                            <div className="GlobalScrollBar portfolio__table">
                                <table>
                                    <thead>
                                        <tr>
                                            <this.THead th={[
                                                "Name",
                                                "Quantity",
                                                <span><small>Avg.</small>  Buy Price</span>,
                                                "Curr Price", "Inv Cost", "Curr Value", "Return",
                                                "Today", "Port. Wt.", "Trade Vol.", "Order", "", ""
                                            ]} />
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {this.createTable()}
        
                                        {/* total */}
                                        <this.Tbody td={[
                                            <div style={{ fontWeight: 'bold' }}>Total</div>,
                                            "", "", "",
                                            <div style={{ fontWeight: 'bold' }}>{curr(sum.costValueSum)}</div>,
                                            <div style={{ fontWeight: 'bold' }}>{curr(sum.currentValueSum)}</div>,
                                            <span style={{ fontWeight: 'bold', color: "#19E683" }}>{sum.totalReturnSum}%</span>,
                                            <span style={{ fontWeight: 'bold', color: "#19E683" }}>
                                                <AnimatedDigit number={totalReturnToday} size={16} digitMargin={0}/>    
                                            </span>,
                                            <div style={{ fontWeight: 'bold' }}>100%</div>,
                                            ""
                                        ]} style={{ borderTop: '1px solid #ccc' }} />
        
                                    </tbody>
                                </table>
                            </div>
                            {(tradeVolume!=0)?
                                <span className="total__trade__value">
                                    Total trade Value: {curr(tradeVolume)}
                                </span> 
                                : 
                                ''
                            }
                        </div>

                        

                        <div className="portfolio__buttons">
                            <this.Button performanceAnalyse={this.performanceAnalyse} />
                        </div>
                    </>
                )
            else if(activeElement == 2)
                return(<PerformanceAnalytics portfolioHome={this.portfolioHome} currentValue={sum.currentValueSum}/>)
        }
    }
}

export default Portfolios;
