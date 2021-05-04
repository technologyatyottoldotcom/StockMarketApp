import React from 'react';
import $ from 'jquery';
import ChartClock from './ChartClock';
import AnimatedDigit from './AnimatedDigit';
import StockChart from './StockChart';
import StockCompare from './StockCompare';
import Indicator from './Indicator';
import IndicatorInfo from './IndicatorInfo';
import Interactive from './Interactive';
import Zoom from '../../assets/icons/zoom.svg';
import Compare from '../../assets/icons/compare.svg';
import IndicatorIcon from '../../assets/icons/indicator.svg';
import CrossIcon from '../../assets/icons/crossicon.svg';
import Line from '../../assets/icons/line.svg';
import Area from '../../assets/icons/area.svg';
import Candles from '../../assets/icons/candles.svg';
import Column from '../../assets/icons/bar.svg';
import JumpLine from '../../assets/icons/jumpline.svg';
import Range from '../../assets/icons/range.svg';
import OHLC from '../../assets/icons/OHLC.svg';
import Marker from '../../assets/icons/marker.svg';
import Stick from '../../assets/icons/stick.svg';
import Renko from '../../assets/icons/renko.svg';
import Kagi from '../../assets/icons/kagi.svg';
import Point from '../../assets/icons/point.svg';
import SearchIcon from '../../assets/icons/searchCompare.svg';
import SettingIcon from '../../assets/icons/settings.svg';
import PlusIcon from '../../assets/icons/plus.svg';
import MinusIcon from '../../assets/icons/minus.svg';
import LineSegment from '../../assets/icons/linesegment.svg';
import InfiniteLine from '../../assets/icons/infiniteline.svg';
import Ray from '../../assets/icons/ray.svg';
import FibRet from '../../assets/icons/fibonacciretracement.svg';
import GannFan from '../../assets/icons/gannfan.svg';
import { timeParse } from "d3-time-format";
import MSFTArray from '../../data/MSFT';
import IBMArray from '../../data/IBM';
import ORCLArray from '../../data/ORCL';
import CSCOArray from '../../data/CSCO';
import Spinner from '../Loader/Spinner';



export class ChartContainer extends React.PureComponent {


    constructor(props)
    {
        super(props);
        this.setInitialSize = this.setInitialSize.bind(this);
        this.OpenIndicatorInfo = this.OpenIndicatorInfo.bind(this);
        this.CloseIndicatorInfo = this.CloseIndicatorInfo.bind(this);
        this.changeIndicatorType = this.changeIndicatorType.bind(this);
        this.addStockData = this.addStockData.bind(this);
        this.state = {
            chartTypeOpen : false,
            indicatorOpen : false,
            compareOpen : false,
            interactiveOpen : false,
            indicatorInfoOpen : false,
            chartType : 'line',
            chartData : [],
            chartDataTemp : [],
            compareStockArray : [],
            TotalCharts : 1,
            IndicatorChartTypeArray : [],
            indicatorInfoType : '',
            indicatorType : 'none',
            chartWidth : 0,
            chartHeight : 0,
            zoom : false,
            range : 'D',
            chartTypeIcon : Line,
            interactiveType : 'line',
            trendLineType : 'none',
        }
    }

    componentDidMount()
    {
        this.setInitialSize();
        this.loadData();
    }

    async loadData()
    {

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
            chartData : tempDataArray,
            chartDataTemp : tempDataArray
        });
    }

    setInitialSize()
    {
        let wd = $('.stock__chart').width();
        let ht = $('.stock__chart').height();
        this.setState({
            chartWidth : wd,
            chartHeight : ht,
        });
    }

    addStockData(stock)
    {

        let objCName = stock+'Close';
        let stockArray = [];
        let tempDataArray = [];

        if(stock === 'IBM')
        {
            stockArray = IBMArray;
        }
        else if(stock === 'ORCL')
        {
            stockArray = ORCLArray;
        }
        else if(stock === 'CSCO')
        {
            stockArray = CSCOArray;
        }

        let baseArray = this.state.chartData;

        baseArray.forEach((d,index) => {

            let dobj = {
                date : d['date'],
                open : d['open'],
                high : d['high'],
                low : d['low'],
                close : d['close'],
                volume : d['volume'],
            }
            dobj[objCName] = parseFloat(stockArray[index][4]) 

            tempDataArray.push(dobj);
        });

        // this.setState({
        //     chartDataTemp : tempDataArray
        // });
    }

    changeChart(type)
    {
        console.log(type);
        this.setState({
            chartType : type
        });
        if(type === 'area')
        {
            this.state.chartTypeIcon = Area;
        }
        else if(type === 'candlestick')
        {
            this.state.chartTypeIcon = Candles;
        }
        else if(type === 'column')
        {
            this.state.chartTypeIcon = Column;
        }
        else if(type === 'jumpLine')
        {
            this.state.chartTypeIcon = JumpLine;
        }
        else if(type === 'line')
        {
            this.state.chartTypeIcon = Line;
        }
        else if(type === 'rangeArea')
        {
            this.state.chartTypeIcon = Range;
        }
        else if(type === 'ohlc')
        {
            this.state.chartTypeIcon = OHLC;
        }
        else if(type === 'marker')
        {
            this.state.chartTypeIcon = Marker;
        }
        else if(type === 'stick')
        {
            this.state.chartTypeIcon = Stick;
        }
        else if(type === 'renko')
        {
            this.state.chartTypeIcon = Renko;
        }
        else if(type === 'kagi')
        {
            this.state.chartTypeIcon = Kagi;
        }
        else if(type === 'point')
        {
            this.state.chartTypeIcon = Point;
        }
        $('.stock__chart__types>div').removeClass('active');
        $('.stock__chart__types>div[data-chart="'+type+'"]').addClass('active');
    }

    changeRange(type)
    {
        this.setState({
            range : type
        });
        $('.chart__range>div').removeClass('active__range');
        $('.chart__range>div[data-range="'+type+'"]').addClass('active__range');
    }

    changeIndicatorType(type)
    {
        this.setState({
            indicatorType : type,
            TotalCharts : this.state.TotalCharts+1,
            IndicatorChartTypeArray : [...this.state.IndicatorChartTypeArray,type]
        });
    }

    ToggleChartType()
    {
        if(this.state.chartTypeOpen)
        {
            $('.stock__chart__types').removeClass('active');
            this.setState({
                chartTypeOpen : false
            });
        }
        else
        {
            $('.stock__chart__types').addClass('active');
            this.setState({
                chartTypeOpen : true
            });
        }
    }

    OpenIndicatorPopup()
    {
        if(!this.state.indicatorOpen)
        {
            $('.Indicator__popup').addClass('active');
            $('.Compare__popup').removeClass('active');
            $('.Interactive__popup').removeClass('active');
            this.setState({
                indicatorOpen : true,
                compareOpen : false,
                interactiveOpen : false
            });
        }
    }

    CloseIndicatorPopup()
    {
        if(this.state.indicatorOpen)
        {
            $('.Indicator__popup').removeClass('active');
            this.setState({
                indicatorOpen : false
            });
        } 
    }

    OpenIndicatorInfo(type)
    {
        console.log('open info',type);
        if(!this.state.indicatorInfoOpen)
        {
            $('.Indicator__info').addClass('active');
            this.setState({
                indicatorInfoOpen : true,
                indicatorInfoType : type
            });
        }
    }

    CloseIndicatorInfo()
    {
        // console.log('open info');
        if(this.state.indicatorInfoOpen)
        {
            $('.Indicator__info').removeClass('active');
            this.setState({
                indicatorInfoOpen : false
            });
        }
    }

    OpenComparePopup()
    {
        if(!this.state.compareOpen)
        {
            $('.Compare__popup').addClass('active');
            $('.Interactive__popup').removeClass('active');
            $('.Indicator__popup').removeClass('active');

            this.setState({
                compareOpen : true,
                indicatorOpen : false,
                interactiveOpen : false
            });
        }
    }

    CloseComparePopup()
    {
        if(this.state.compareOpen)
        {
            $('.Compare__popup').removeClass('active');
            this.setState({
                compareOpen : false
            });
        } 
    }

    OpenInteractivePopup()
    {
        if(!this.state.interactiveOpen)
        {
            $('.Interactive__popup').addClass('active');
            $('.Indicator__popup').removeClass('active');
            $('.Compare__popup').removeClass('active');
            this.setState({
                interactiveOpen : true,
                compareOpen : false,
                indicatorOpen : false
            });
        }
    }

    CloseInteractivePopup()
    {
        if(this.state.interactiveOpen)
        {
            $('.Interactive__popup').removeClass('active');
            this.setState({
                interactiveOpen : false
            });
        } 
    }

    changeInteractiveType(Itype,Stype)
    {
        this.setState({
            interactiveType : Itype,
            trendLineType : Stype,
            interactiveOpen : false
        });
        $('.Interactive__popup').removeClass('active');
    }

    OpenZoomMode()
    {
        console.log('zoom');
        if(this.state.zoom)
        {
            $('.app__header').removeClass('app__header__zoom');
            $('.app__body').removeClass('app__body__zoom');
            $('.app__footer').removeClass('app__footer__zoom');
            $('.key__statistics').removeClass('key__statistics__zoom');
            $('.app__body__left').removeClass('app__body__left__zoom');
            $('.app__body__right').removeClass('app__body__right__zoom');
            $('.app__body__top').removeClass('app__body__top__zoom');
            $('.app__body__bottom').removeClass('app__body__bottom__zoom');
            $('.chart__container').removeClass('chart__container__zoom');
            
            $('.chart__container__stock__options').removeClass('active');
            $('.cash__position').removeClass('cash__position__zoom');
            $('.ks__container__full').css('display','none');
            $('.ks__container__half').css('display','flex');
        
            this.setState({
                zoom : false,
                chartWidth : $('.stock__chart').width(),
                chartHeight : $('.stock__chart').height()
            });
            console.log('zoom out',$('.stock__chart').height(),$('.stock__chart').width());
        }
        else
        {
            $('.app__header').addClass('app__header__zoom');
            $('.app__body').addClass('app__body__zoom');
            $('.app__footer').addClass('app__footer__zoom');
            $('.key__statistics').addClass('key__statistics__zoom');
            $('.chart__container').addClass('chart__container__zoom');
            $('.app__body__left').addClass('app__body__left__zoom');
            $('.app__body__right').addClass('app__body__right__zoom');
            $('.app__body__top').addClass('app__body__top__zoom');
            $('.app__body__bottom').addClass('app__body__bottom__zoom');
            $('.cash__position').addClass('cash__position__zoom');
            $('.chart__container__stock__options').addClass('active');
            $('.ks__container__full').css('display','flex');
            $('.ks__container__half').css('display','none');

            this.setState({
                zoom : true,
                chartWidth : $('.stock__chart').width(),
                chartHeight : $('.stock__chart').height()
            });

            console.log('zoom in',$('.stock__chart').height(),$('.stock__chart').width());

           
            
        }
       
    }

    render() {

        // console.log('Rendering chart...');

        // console.log(this.props.data);
        let stockData = this.props.stockData;

        let TradePrice = stockData.last_traded_price;
        let dPrice = (TradePrice+'').split('.')[0];
        let fPrice = (TradePrice+'').split('.')[1];

        let change_price = parseFloat(stockData.change_price);
        let change_percentage = parseFloat(stockData.change_percentage);

        // console.log(change_price,change_percentage)

        let priceClass = change_price >= 0 ? 'positive' : 'negative';
        
        // console.log(this.props.isLoaded)
        if(this.props.isLoaded)
        {
            return (

                <>
                <div className="Indicator__popup">
                    <div className="Indicator__title__name">
                        <p>Indicators & Strategies</p>
                        <span id="Indicator__close" onClick={this.CloseIndicatorPopup.bind(this)}>
                            <img src={CrossIcon} alt="X"/>
                        </span>
                        <IndicatorInfo CloseIndicatorInfo={this.CloseIndicatorInfo} indicatorInfoType={this.state.indicatorInfoType}/>
                    </div>
                    <div className="Indicator__options">
                        <Indicator IndicatorName="Simple Moving Average (SMA)" IndicatorInfo={this.OpenIndicatorInfo} IndicatorType={this.changeIndicatorType} InfoType="SMA"/>
                        <Indicator IndicatorName="Weighted Moving Average (WMA) " IndicatorInfo={this.OpenIndicatorInfo} IndicatorType={this.changeIndicatorType} InfoType="WMA"/>
                        <Indicator IndicatorName="Exponential Moving Average (EMA)" IndicatorInfo={this.OpenIndicatorInfo} IndicatorType={this.changeIndicatorType} InfoType="EMA"/>
                        <Indicator IndicatorName="Triangular Moving Average (TMA)" IndicatorInfo={this.OpenIndicatorInfo} IndicatorType={this.changeIndicatorType} InfoType="TMA"/>
                        <Indicator IndicatorName="Bollinger Bands (BBands)" IndicatorInfo={this.OpenIndicatorInfo} IndicatorType={this.changeIndicatorType} InfoType="BB"/>
                        <Indicator IndicatorName="Moving Average Convergence/Divergence (MACD)" IndicatorInfo={this.OpenIndicatorInfo} IndicatorType={this.changeIndicatorType} InfoType="MACD"/>
                        <Indicator IndicatorName="Relative Strength Index (RSI)" IndicatorInfo={this.OpenIndicatorInfo} IndicatorType={this.changeIndicatorType} InfoType="RSI"/>
                        <Indicator IndicatorName="Average True Range (ATR)" IndicatorInfo={this.OpenIndicatorInfo} IndicatorType={this.changeIndicatorType} InfoType="ATR"/>
                        <Indicator IndicatorName="Stochastic Oscillator (Slow)" IndicatorInfo={this.OpenIndicatorInfo} IndicatorType={this.changeIndicatorType} InfoType="SOSlow"/>
                        <Indicator IndicatorName="Stochastic Oscillator (Fast)" IndicatorInfo={this.OpenIndicatorInfo} IndicatorType={this.changeIndicatorType} InfoType="SOFast"/>
                        <Indicator IndicatorName="Stochastic Oscillator (Full)" IndicatorInfo={this.OpenIndicatorInfo} IndicatorType={this.changeIndicatorType} InfoType="SOFull"/>
                        <Indicator IndicatorName="Force Index (FI)" IndicatorInfo={this.OpenIndicatorInfo} IndicatorType={this.changeIndicatorType} InfoType="FI"/>
                        <Indicator IndicatorName="Elder Ray Indicator (ERI)" IndicatorInfo={this.OpenIndicatorInfo} IndicatorType={this.changeIndicatorType} InfoType="ERI"/>
                        <Indicator IndicatorName="Elder Ray Indicator Bull Power (ERI)" IndicatorInfo={this.OpenIndicatorInfo} IndicatorType={this.changeIndicatorType} InfoType="ERIBull"/>
                        <Indicator IndicatorName="Elder Ray Indicator Bear Power (ERI)" IndicatorInfo={this.OpenIndicatorInfo} IndicatorType={this.changeIndicatorType} InfoType="ERIBear"/>
                        <Indicator IndicatorName="Elder Ray Impulse (ERIMP)" IndicatorInfo={this.OpenIndicatorInfo} IndicatorType={this.changeIndicatorType} InfoType="ERIMP"/>
                        <Indicator IndicatorName="Parabolic SAR (PSAR)" IndicatorInfo={this.OpenIndicatorInfo} IndicatorType={this.changeIndicatorType} InfoType="PSAR"/>
    
                    </div> 
                </div>
    
                <div className="Compare__popup">
                    <div className="Compare__title__name">
                        <p>Compare Symbol</p>
                        <span id="Compare__close" onClick={this.CloseComparePopup.bind(this)}>
                            <img src={CrossIcon} alt="X"/>
                        </span>
                    </div>
                    <div className="Compare__stock__search">
                        <div className="Compare__stock__search__icon">
                            <img src={SearchIcon} alt=""/>
                        </div>
                        <div className="Compare__stock__search__input">
                            <input placeholder="Search"/>
                        </div>
                    </div>
                    <div className="Compare__options">
                        <StockCompare Name="ORCL" AddStock={this.addStockData}/>
                        <StockCompare Name="IBM" AddStock={this.addStockData}/>
                        <StockCompare Name="CSCO" AddStock={this.addStockData}/>
                    </div>
                </div>
    
                <div className="Interactive__popup">
                    <div className="Interactive__title__name">
                        <p>Interactive</p>
                        <span id="Interactive__close" onClick={this.CloseInteractivePopup.bind(this)}>
                            <img src={CrossIcon} alt="X"/>
                        </span>
                    </div>
                    <div className="Interactive__options">
                        <div className="Interactive__option__block">
                            <p>Line and Ray</p>
                            <div>
                                <Interactive IImage={LineSegment} Name="Line Segment" Itype="line" Stype="LINE" changeInteractive={this.changeInteractiveType.bind(this)}/>
                                <Interactive IImage={InfiniteLine} Name="Infinite Line" Itype="line" Stype="XLINE" changeInteractive={this.changeInteractiveType.bind(this)}/>
                                <Interactive IImage={Ray} Name="Ray" Itype="line" Stype="RAY" changeInteractive={this.changeInteractiveType.bind(this)}/>
                            </div>
                        </div>
                        <div className="Interactive__option__block">
                            <p>Channel</p>
                            <div>
                                <Interactive IImage={LineSegment} Name="Trend Channel" Itype="channel" Stype="" changeInteractive={this.changeInteractiveType.bind(this)}/>
                                <Interactive IImage={LineSegment} Name="Standard Deviation Channel" Itype="SDchannel" Stype="" changeInteractive={this.changeInteractiveType.bind(this)}/>
                            </div>
                        </div>
                        <div className="Interactive__option__block">
                            <p>Retracement</p>
                            <div>
                                <Interactive IImage={FibRet} Name="Fibonacci Retracement" Itype="FibRet" Stype="" changeInteractive={this.changeInteractiveType.bind(this)}/>
                            </div>
                        </div>
                        <div className="Interactive__option__block">
                            <p>Fan</p>
                            <div>
                                <Interactive IImage={GannFan} Name="Gann Fan" Itype="GannFan" Stype="" changeInteractive={this.changeInteractiveType.bind(this)}/>
                            </div>
                        </div>
                    </div> 
                </div>
    
                <div className="chart__container" >
    
                    <div className="chart__container__stock__options">
                        <div className="chart__options">
                            <div className="chart__option__block chart__stock__name" >
                                <span>RELIANCE</span>
                            </div>
                            <div className="chart__option__block">
                                <span>D</span>
                            </div>
                            <div className="chart__option__block chart__stock__type__change" onClick={this.ToggleChartType.bind(this)}>
                                <span><img src={this.state.chartTypeIcon} alt="C" id="chart__type__icon"/></span>
                                <div className="stock__chart__types">
                                    <div data-chart="area" onClick={this.changeChart.bind(this,'area')}><img src={Area} alt="+"/><span>Area</span></div>
                                    <div data-chart="candlestick" onClick={this.changeChart.bind(this,'candlestick')}><img src={Candles} alt="+"/><span>Candlestick</span></div>
                                    <div data-chart="column" onClick={this.changeChart.bind(this,'column')}><img src={Column} alt="+"/><span>Column</span></div>
                                    <div data-chart="jumpLine" onClick={this.changeChart.bind(this,'jumpLine')}><img src={JumpLine} alt="+"/><span>Jump Line</span></div>
                                    <div data-chart="line" className="active" onClick={this.changeChart.bind(this,'line')}><img src={Line} alt="+"/><span>Line</span></div>
                                    <div data-chart="rangeArea" onClick={this.changeChart.bind(this,'rangeArea')}><img src={Range} alt="+"/><span>Range Area</span></div>
                                    <div data-chart="ohlc" onClick={this.changeChart.bind(this,'ohlc')}><img src={OHLC} alt="+"/><span>OHLC</span></div>
                                    <div data-chart="marker" onClick={this.changeChart.bind(this,'marker')}><img src={Marker} alt="+"/><span>Marker</span></div>
                                    <div data-chart="stick" onClick={this.changeChart.bind(this,'stick')}><img src={Stick} alt="+"/><span>Stick</span></div>
                                    <div data-chart="renko" onClick={this.changeChart.bind(this,'renko')}><img src={Renko} alt="+"/><span>Renko</span></div>
                                    <div data-chart="kagi" onClick={this.changeChart.bind(this,'kagi')}><img src={Kagi} alt="+"/><span>Kagi</span></div>
                                    <div data-chart="point" onClick={this.changeChart.bind(this,'point')}><img src={Point} alt="+"/><span>Point & Figure</span></div>
                                </div>
                            </div>
                            <div className="chart__option__block" onClick={this.OpenComparePopup.bind(this)}>
                                <img src={Compare} alt="+"/><span>Compare</span>
                            </div>
                            <div className="chart__option__block" onClick={this.OpenIndicatorPopup.bind(this)}>
                                <img src={IndicatorIcon} alt="+"/><span>Indicator</span>
                            </div>
                            <div className="chart__option__block" onClick={this.OpenInteractivePopup.bind(this)}>
                                <img src={IndicatorIcon} alt="+"/><span>Interactive</span>
                            </div>
                        </div>
                        
                    </div>
    
                    <div className="stock__info__chart">
                        <div className="stock__info">
                            <div className="stock__details">
                                <p className="stock__name__code">
                                    <span id="stock__code">{this.props.stockDetails.stockSymbol}</span>
                                </p>
                                <div className="stock__type">
                                    <img src={SettingIcon} alt="s"/>
                                    <p>Oil & Gas</p>
                                </div>
                            </div>
                            <div id="stock__full__name">
                                <span>{this.props.stockDetails.stockName}</span>
                            </div>
                            <div className="stock__price__purchase">
                                <div className="stock__price__details">
                                    <div className="price__decimals" style={{display : 'flex'}}>
                                        {dPrice &&
                                        dPrice.split('').map((n,i) => {
                                            return <AnimatedDigit digit={n} transform={30} key={i}/>
                                        })}
                                    </div>
                                    <div className="price__fraction" style={{display : 'flex'}}>
                                        {fPrice &&
                                        fPrice.split('').map((n,i) => {
                                            return <AnimatedDigit digit={n} transform={20} key={i}/>
                                        })}
                                    </div>
                                    
                                </div>
                                <div className="stock__purchase">
                                    <div className="buy__stock"><img src={PlusIcon} alt=""/></div>
                                    <div className="sell__stock"><img src={MinusIcon} alt=""/></div>
                                </div>
                            </div>
                            <div className="stock__price__change">
                            
                                <div className={priceClass +' stock__performance__amount'} style={{display : 'flex'}}>
                                    {stockData.change_price &&
                                        stockData.change_price.split('').map((n,i) => {
                                            return <AnimatedDigit digit={n} transform={18} key={i}/>
                                    })}
                                </div>
                                <div className={priceClass +' stock__performance__percentage'} style={{display : 'flex'}}>
                                    ({stockData.change_percentage &&
                                        stockData.change_percentage.split('').map((n,i) => {
                                            return <AnimatedDigit digit={n} transform={18} key={i}/>
                                    })})
                                </div>
                                
                                {/* <ChartClock /> */}
                            </div>
                        </div>
                        <div className="stock__chart">
                            <StockChart 
                                key={1} 
                                data={this.props.data} 
                                range={this.state.range} 
                                width={this.state.chartWidth} 
                                height={this.state.chartHeight} 
                                zoom={this.state.zoom} 
                                chartType={this.state.chartType}
                                IndicatorType={this.state.indicatorType}
                                TotalCharts={this.state.TotalCharts}
                                IndicatorChartTypeArray={this.state.IndicatorChartTypeArray}
                                trendLineType={this.state.trendLineType} 
                                interactiveType={this.state.interactiveType}
                            />
                        </div>
                    </div>
                    
                    
                    <div className="chart__range" >
                        <div data-range="1D" className="chart__range__value" onClick={this.changeRange.bind(this,'1D')}>1D</div>
                        <div data-range="5D" className="chart__range__value" onClick={this.changeRange.bind(this,'5D')}>5D</div>
                        <div data-range="1M" className="chart__range__value" onClick={this.changeRange.bind(this,'1M')}>1M</div>
                        <div data-range="6M" className="chart__range__value active__range" onClick={this.changeRange.bind(this,'6M')}>6M</div>
                        <div data-range="YTD" className="chart__range__value" onClick={this.changeRange.bind(this,'YTD')}>YTD</div>
                        <div data-range="1Y" className="chart__range__value" onClick={this.changeRange.bind(this,'1Y')}>1Y</div>
                        <div data-range="5Y" className="chart__range__value" onClick={this.changeRange.bind(this,'5Y')}>5Y</div>
                        <div data-range="Max" className="chart__range__value" onClick={this.changeRange.bind(this,'Max')}>Max</div>
                    </div>
                    <div className="chart__zoom" onClick={this.OpenZoomMode.bind(this)}>
                        <img src={Zoom} alt="zoom"/> 
                    </div>
                </div>
                </>
            )
        }
        else
        {
            return <div className="chart__container">
                <Spinner size={40}/>
            </div>
        }
    }
}

export default ChartContainer;
