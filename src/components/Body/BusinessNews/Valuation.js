import React from 'react';
import { Row, Col, Slider , RangeSlider } from 'rsuite';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,LabelList, Legend, ResponsiveContainer } from 'recharts';
import $ from 'jquery';
import '../../../scss/Valuation.scss';

function EarningValuation({ title, value, max, min, changeSliderValue}) {

    value = Nu(value); 
    max = Nu(max) || value + 100; 
    min = Nu(min) || 0;
    const [val, setValue] = React.useState(value);

    let stop = ((Math.ceil(val)-min)/(max-min))*100;
    let back = `linear-gradient(to right,#00a0e3 0%,#00a0e3 ${stop}%,#ecf0f1 ${stop}%,#ecf0f1 100%)`;


    return (
        <>
            <Row style={{ marginTop: 3, marginRight: 0, paddingRight: 0 }} className="slider__wrapper">
                {title && <p style={{ padding: '4px 0px 0px 6px' , fontSize : '12px' , fontWeight : '600' }}>{title}</p>}
                <Col md={18} sm={20} xs={13}>
                    <div style={{  }}>
                        <input 
                            className="valuation__slider" 
                            type="range" 
                            min={min} 
                            max={max} 
                            value={val} 
                            style={{background : back }}
                            onTouchEnd={e => {changeSliderValue(Nu(val))}} 
                            onMouseUp={e => {changeSliderValue(Nu(val))}} 
                            onChange={e=> {setValue(e.target.value)}}/>
                    </div>
                </Col>
                <Col md={1} sm={2} xs={7}>
                    {/* <InputNumber
                        min={min}
                        max={max}
                        value={val}
                        onChange={value => { setValue(Nu(value)) }}
                        onKeyDown={e => {
                            if(e.key === 'Enter'){
                                console.log('enter');
                                changeSliderValue(Nu(val));
                            }
                        }}
                        size="xs"
                        placeholder="xs"
                    /> */}
                    <input className="slider__value" readOnly value={val} />
                </Col>
            </Row>
        </>
    )

    function Nu(a) { return Number(a) }
    
}

function PriceUpAndLowBounds(props) {

    if (props) {

        return (
            <> 
                <div className="stock__price__section">
                    <p className="card__title">Price Upper and Lower Bounds</p>
                    <div className="price__bound__chart">
                        <BoundChart data={props.data}/>
                    </div>
                </div>
                <div className="stock__confidence">
                    <p className="card__title">Valuation Confidence</p>
                    <div>
                        <CustomSlider ValuationConfidence={props.ValuationConfidence}/>
                    </div>
                </div>
            </>
        )
    }
    return null
}

function CustomSlider(props){

        const printText = props.printText || ['Quite High', 'High', 'Inconclusive', 'Low', 'Quite Low'],
        steps = printText.length,
        value = props.ValuationConfidence;
        console.log('custom',value);
        // console.log(props);
           
        return (
            <div className="confidence__slider">
                <div style={{ height: 250 , width : 100 }}>
                    <RangeSlider

                        barClassName='custome-slider'
                        min={0}
                        max={steps-1}
                        value={[value,4]}
                        defaultValue={[4,4]}
                        className="custom-slider-Technical"
                        graduated
                        vertical
                        progress
                        tooltip={false}
                        renderMark={n =>
                            <span key={n + Math.random() + 5} style={ n === value ? {
                                fontWeight: "600" , fontSize : '14px' , color : '#00a0e3'
                            } : 
                            {
                                fontWeight: '500' , fontSize : '14px' , color : '#404040'
                            }}>{printText[n]}</span>
                        }
                        onChange={v => { console.log(v) }}
                    />
                </div>
            </div>
        );
}

function CustomizedAxisTick(props)
{
    const { x, y, payload } = props;

    return (
        <g transform={`translate(${x},${y})`}>
          <text
            x={0}
            y={0}
            dy={16}
            fontSize="12px"
            textAnchor="middle"
            fill="#666"
          >
            {payload.value}
          </text>
        </g>
      );
}

function CustomizedLabel(props)
{
    const { x, y, stroke, value } = props;
    return (
        <text x={x} y={y} dy={-10} fill={stroke} fontSize={10} textAnchor="middle">
          {value}
        </text>
      );
}

function BoundChart(props)
{

    if(props.data.length > 0)
    {

        return (
            <>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={props.data}
                        margin={{
                            top: 50,
                            right: 20,
                            left: 30,
                            bottom: 0
                    }}>
                    <XAxis dataKey="name" height={60} tick={<CustomizedAxisTick />} angle={140}/>
                    <YAxis hide={true}/>
                    <Tooltip />
                    <Line type="monotone" dataKey="high" stroke="#00a0e3" strokeWidth={2}>
                        <LabelList content={<CustomizedLabel />} />
                    </Line>
                    <Line type="monotone" dataKey="low" stroke="#e51a4b" strokeWidth={2}>
                        <LabelList content={<CustomizedLabel />} />
                    </Line>
                    
                    </LineChart>
                </ResponsiveContainer>
            </>
        )
    }
    else
    {
        return (
            <></>
        )
    }
    
}


const DefaultFactors = {
    'TTMNP' : 100.0,
    'TTMEPS' : 15.0,
    'NPG' : 20.0,
    'EPSG' : 20.0,
    'EPSF' : 1.80,
    'ROETTM' : 25.0,
    'EMHB' : 50.0,
    'EMLB' : 12.5,
    'DFP' : 4.5
}

const PriceUpLowLabels = ['T', 'T+1', 'T+2', 'T+3', 'T+4', 'T+5'];

const data_ValuationMethodology = [
    "Cumulative growth of TTM net profit is calculated based on past 3 years growth rate.",
    "TTM ROE is taken into consideration for calculation of earnings multiple higher bounds and lower bounds.",
    "Based on market history, 1x ROE and 2x ROE is taken as earnings multiple higher and lower bounds.",
    "Current repo rate from the RBI is taken as proxy for the discount factor.",
]

class Valuation extends React.PureComponent{
    constructor(props)
    {
        super(props);
        this.setEarningValuation = this.setEarningValuation.bind(this);
        this.setPriceBandFactors = this.setPriceBandFactors.bind(this);
        this.setPriceUpLowBounds = this.setPriceUpLowBounds.bind(this);
        this.setAnnualReturns = this.setAnnualReturns.bind(this);
        this.changeNPGValue = this.changeNPGValue.bind(this);
        this.changeEPSGValue = this.changeEPSGValue.bind(this);
        this.changeROEValue = this.changeROEValue.bind(this);
        this.changeEMHBValue = this.changeEMHBValue.bind(this);
        this.changeEMLBValue = this.changeEMLBValue.bind(this);
        this.changeIRDFValue = this.changeIRDFValue.bind(this);
        this.updateStates = this.updateStates.bind(this);
        this.state = {
            EarningValuation: [],
            PriceUpLowLabels: PriceUpLowLabels,
            ValuationMethodology: data_ValuationMethodology,
            ValuationFactors : {},
            PriceBandEPSFactors : {},
            PriceUpLowBounds : [],
            ValuationConfidence : 0,
            ThreeYearReturn : '',
            FiveYearReturn : ''
        }
    }

    componentDidMount()
    {
        this.setValuationFactor()
        .then(()=>{
            this.updateStates();
        });

    }

    //state setters

    async setValuationFactor()
    {

        // console.log('Valuation Factor Start');
        const HBoundMFactor = 2;
        const LBoundMFactor = 0.5;

        let IRatio = parseFloat((1/DefaultFactors['DFP'])/(1/DefaultFactors['DFP']));
        let HBound = DefaultFactors['ROETTM']*HBoundMFactor*IRatio;
        let LBound = DefaultFactors['ROETTM']*LBoundMFactor*IRatio;

        let VObj = {
            'NPG' : DefaultFactors['EPSG'] * DefaultFactors['EPSF'],
            'EPSG' : DefaultFactors['EPSG'],
            'NPEPSF' : parseFloat((DefaultFactors['NPG'] / DefaultFactors['EPSG']).toFixed(1)),
            'ROE' : DefaultFactors['ROETTM'],
            'EMHB' : HBound,
            'EMLB' : LBound,
            'IRDF' : DefaultFactors['DFP'],
            'IRDFR' : IRatio

        }

        this.setState({
            ValuationFactors : VObj
        });

        // console.log('Valuation Factor End');

    }

    async setEarningValuation()
    {

        // console.log('Earning Valuation Start');
        const maxFactor = 3;
        const ValFactors = this.state.ValuationFactors;
        // console.log(ValFactors);
        let EarningVal = [
            {
                title: 'Net Profit Growth',
                value: ValFactors['NPG'],
                max: DefaultFactors['NPG']*maxFactor,
                min: 0,
                changeSliderValue : this.changeNPGValue
            },
            {
                title: 'Earnings per Share Growth',
                value: ValFactors['EPSG'],
                max: DefaultFactors['EPSG']*maxFactor,
                min: 0,
                changeSliderValue : this.changeEPSGValue
            }, {
                title: 'ROE',
                value: ValFactors['ROE'],
                max: DefaultFactors['ROETTM']*maxFactor,
                min: 0,
                changeSliderValue : this.changeROEValue
            }, {
                title: 'Earnings multiple- Higher Bound',
                value: ValFactors['EMHB'],
                max: DefaultFactors['EMHB']*maxFactor,
                min: 0,
                changeSliderValue : this.changeEMHBValue
            }, {
                title: 'Earnings multiple- Lower Bound',
                value: ValFactors['EMLB'],
                max: DefaultFactors['EMLB']*maxFactor,
                min: 0,
                changeSliderValue : this.changeEMLBValue
            }, {
                title: 'Interest Rate/ Discount Factor',
                value: ValFactors['IRDF'],
                max: DefaultFactors['DFP']*maxFactor,
                min: 0,
                changeSliderValue : this.changeIRDFValue
            }
        ]

        this.setState({
            EarningValuation : EarningVal
        });

        // console.log('Earning Valuation End');
    }

    async setPriceBandFactors()
    {

        // console.log('Price Band Factors Start');

        const ValFactors = this.state.ValuationFactors;

        let SEPS = DefaultFactors['TTMEPS'];

        let PBObj = {
            'T' : SEPS
        }

        for(let i=1;i<=5 ; i++)
        {
            SEPS = parseFloat((SEPS * (1+(ValFactors['EPSG']/100))).toFixed(1));
            PBObj['T'+i] = SEPS;
        }

        this.setState({
            PriceBandEPSFactors : PBObj
        });

        // console.log('Price Band End');
    }

    async setPriceUpLowBounds()
    {

        // console.log('Price Up Low Bounds Start');
        
        let PULarr = [
            {
                name : 'T',
                high : 600,
                low : 600
            }
        ];
        let ValFactors = this.state.ValuationFactors;
        let PriceBands = this.state.PriceBandEPSFactors;

        // console.log(PriceBands);
        
        for(let i=1;i<=5;i++)
        {
            let bounds = {};
            let HighB = Math.round(ValFactors['EMHB']*PriceBands['T'+i]);
            let LowB = Math.round(ValFactors['EMLB']*PriceBands['T'+i]);
            bounds['name'] = 'T+'+i;
            bounds['high'] = HighB;
            bounds['low'] = LowB; 
            PULarr.push(bounds);
        }

        // console.log(PULarr)

        this.setState({
            PriceUpLowBounds : PULarr
        });

        // console.log('Price Up Low Bounds End');

    }

    async setEPSFactor()
    {

        // console.log('EPS Factor Start');

        let ValFactors = this.state.ValuationFactors;
        let EPS = ValFactors['NPEPSF'];
        let VC = 0;
        if(EPS>= 0.25 && EPS<= 0.50)
        {
            VC = 0;
        }
        else if(EPS> 0.50 && EPS<= 1.0)
        {
            VC = 1;
        }
        else if(EPS> 1.75 || EPS< 0.25)
        {
            VC = 2;
        }
        else if(EPS>1.0 && EPS<= 1.50)
        {
            VC = 3;
        }
        else if(EPS>1.50 && EPS<= 1.75)
        {
            VC = 4;
        }
        console.log(VC);
        this.setState({
            ValuationConfidence : VC
        });

        // console.log('EPS Factor End');

    }

    async setAnnualReturns()
    {
        // console.log('Annual Returns Start');
        
        let PriceBounds = this.state.PriceUpLowBounds;
        let Base = parseFloat(PriceBounds[0]['high']);
        console.log(Base);
        let num1 = 3;
        let num2 = 5;
        if(typeof Base  === 'number')
        {
            let ThreeY = parseFloat((((PriceBounds[num1]['high']+PriceBounds[num1]['low'])/2)/Base));
            let FiveY = parseFloat((((PriceBounds[num2]['high']+PriceBounds[num2]['low'])/2)/Base));


            let TYAR = parseFloat(((Math.pow((1+ThreeY),(1/3))-1)*100).toFixed(2));
            let FYAR = parseFloat(((Math.pow((1+FiveY),(1/3))-1)*100).toFixed(2));

            // console.log(ThreeY,FiveY,TYAR,FYAR);

            this.setState({
                ThreeYearReturn : TYAR,
                FiveYearReturn : FYAR
            });

        }
        else{
            this.setState({
                ThreeYearReturn : '',
                FiveYearReturn : ''
            });
        }

        // console.log('Annual Returns End');

    }

    //state changers

    changeNPGValue(val)
    {
        let ValFactors = this.state.ValuationFactors;

        let EPS = parseFloat((val/ValFactors['EPSG']).toFixed(1));

        ValFactors['NPG'] = val;
        ValFactors['NPEPSF'] = EPS;

        this.setState({
            ValuationFactors : ValFactors
        },()=>{
            this.updateStates();
        });
    }

    changeEPSGValue(val)
    {
        let ValFactors = this.state.ValuationFactors;

        let EPS = parseFloat((ValFactors['NPG']/val).toFixed(1));

        ValFactors['EPSG'] = val;
        ValFactors['NPEPSF'] = EPS;

        this.setState({
            ValuationFactors : ValFactors
        },()=>{
            this.updateStates();
        });
    }

    changeROEValue(val)
    {
        let ValFactors = this.state.ValuationFactors;

        const HBoundMFactor = 2;
        const LBoundMFactor = 0.5;

        let IRatio = ValFactors['IRDFR'];
        let HBound = parseFloat((val*HBoundMFactor*IRatio).toFixed(2));
        let LBound = parseFloat((val*LBoundMFactor*IRatio).toFixed(2));

        console.log(IRatio,HBound,LBound);

        ValFactors['ROE'] = val;
        ValFactors['EMHB'] = HBound;
        ValFactors['EMLB'] = LBound;
        // console.log(ValFactors);
        this.setState({
            ValuationFactors : ValFactors
        },()=>{
            this.updateStates();
        });

        // console.log(this.state.ValuationFactors,this.state.EarningValuation);
        
        // console.log(`ROE val ${val}`);
    }

    changeEMHBValue(val)
    {
        let ValFactors = this.state.ValuationFactors;
        ValFactors['EMHB'] = val;

        this.setState({
            ValuationFactors : ValFactors
        },()=>{
            this.updateStates();
        });
    }

    changeEMLBValue(val)
    {
        let ValFactors = this.state.ValuationFactors;
        ValFactors['EMLB'] = val;

        this.setState({
            ValuationFactors : ValFactors
        },()=>{
            this.updateStates();
        });
    }

    changeIRDFValue(val)
    {
        let ValFactors = this.state.ValuationFactors;

        let ROE = ValFactors['ROE'];

        const HBoundMFactor = 2;
        const LBoundMFactor = 0.5;

        let IRatio = parseFloat(1/val)/(1/DefaultFactors['DFP']);

        let HBound = parseFloat(ROE*HBoundMFactor*IRatio).toFixed(2);
        let LBound = parseFloat(ROE*LBoundMFactor*IRatio).toFixed(2);

        ValFactors['IRDF'] = val;
        ValFactors['IRDFR'] = IRatio;
        ValFactors['EMHB'] = HBound;
        ValFactors['EMLB'] = LBound;

        this.setState({
            ValuationFactors : ValFactors
        },()=>{
            this.updateStates();
        });
    }


    updateStates()
    {
        console.log('.......update start.......');
        this.setEarningValuation().then(()=>{
            this.setPriceBandFactors().then(()=>{
                this.setPriceUpLowBounds().then(()=>{
                    this.setEPSFactor().then(()=>{
                        this.setAnnualReturns().then(()=>{
                            console.log('.......update done......');
                        });
                    })
                })
            })
        });
    }

    render()
    {

        const data = this.state.EarningValuation;
        
        if(DefaultFactors['TTMNP'] < 0 || DefaultFactors['TTMEPS'] < 0)
        {
            return(
                <>
                    <div className="valuation__empty">
                        <div className="empty__text">
                            <p className="mb-4">Fundamental valuation using standard methodologies is not possible as financials 
                                    of the company do not allow for such a valuation.
                            </p>
                            <p>Kindly use your own judgement in arriving at a value. </p>
                        </div>
                    </div>
                    
                </>
            )
        }
        else
        {
            return(
                <>

                    <div className="stock__valuation">
                        <div className="stock__valuation__left">
                            <div className="stock__earning__valuation">
                                <p className="card__title">Earnings Valuation</p>
                                    {
                                        data.map((e, i) => {
                                            if (typeof e == 'object' && !Array.isArray(e)) {
                                                return <EarningValuation key={i + Math.random()} {...e} />
                                            } else return null
                                        })
                                    }
                                <div className="card__condition">
                                    <span style={{fontSize : '11px'}}>*</span> The above values have been set according to our estimates.
                                    You may set them as necessary according to your views.
                                </div>
                            </div>

                            <div className="stock__annual__returns">
                                <p className="card__title">Annual Returns</p>
                                <div className="annual__returns">
                                    <p>3 year potential Upside/ Downside</p>
                                    <span>{this.state.ThreeYearReturn}%</span>
                                </div>
                                <div className="annual__returns">
                                    <p>5 year potential Upside/ Downside</p>
                                    <span>{this.state.FiveYearReturn}%</span>
                                </div>
                            </div>
                            
                        </div>
                        <div className="stock__valuation__right">
                            <div className="stock__price__bounds">
                               {this.state.PriceUpLowBounds && 
                                <PriceUpAndLowBounds 
                                   labels={this.state.PriceUpLowLabels} 
                                   data={this.state.PriceUpLowBounds} 
                                   ValuationConfidence={this.state.ValuationConfidence}
                               /> }  
                            </div>
                            <div className="stock__methodology">
                                <p className="card__title">Valuation Methodology</p>
                                <div>
                                    {(this.state.ValuationMethodology || []).map((e, i) => <div key={i + 9 + Math.random()}>{i + 1}.&nbsp;{e}</div>)}
                                </div>
                            </div>  
                        </div>
                    </div>
                    
                    {/* <Row>
                        <div className="container m-auto mt-5 mb-5 p-3" style={{ border: '1px solid black', borderRadius: 10 , marginLeft : 0 , width : '90%'}}>
                            
                        </div>
                    </Row> */}
                </>
            )
        }
        
    }
}

export {Valuation};