import React from 'react';
import { Row, Col, InputNumber, Slider } from 'rsuite';
import $ from 'jquery';

function EarningValuation({ title, value, max, min, changeSliderValue}) {

    value = Nu(value); 
    max = Nu(max) || value + 100; 
    min = Nu(min) || 0;
    const [val, setValue] = React.useState(value);

    let stop = ((Math.ceil(val)-min)/(max-min))*100;

    let back = `linear-gradient(to right,#00a0e3 0%,#00a0e3 ${stop}%,#ecf0f1 ${stop}%,#ecf0f1 100%)`;

    return (
        <>
            <Row style={{ marginTop: 3, marginRight: 0, paddingRight: 0 , paddingLeft : '10px' }}>
                {title && <p style={{ padding: 6 }}>{title}</p>}
                <Col md={14} sm={20} xs={13}>
                    <div style={{  }}>
                        {/* <Slider
                            progress
                            min={min}
                            max={max}
                            value={val}
                            // value={value}
                            onChange={value => { setValue(Nu(value)) }}
                            // onChange={val => { changeSliderValue(Nu(val)) }}
                            // onMouseUp={e => {changeSliderValue(Nu(val))}}
                            // onMouseDown={e => {console.log('down')}}
                        /> */}
                        <input 
                            className="valuation__slider" 
                            type="range" 
                            min={min} 
                            max={max} 
                            value={val} 
                            style={{background : back}}
                            onTouchEnd={e => {changeSliderValue(Nu(val))}} 
                            onMouseUp={e => {changeSliderValue(Nu(val))}} 
                            onChange={e=> {setValue(e.target.value)}}/>
                    </div>
                </Col>
                <Col md={2} sm={2} xs={7} style={{ width: 100 }}>
                    <InputNumber
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
                    />
                </Col>
            </Row>
        </>
    )

    function Nu(a) { return Number(a) }
    
}

function PriceUpAndLowBounds(props) {

    const Slid = ({ labels,price,startArr,heightArr }) => {
        return (
            <>
                <div className="row pt-2 pb-3">
                    {
                        labels.map((e, i) => {
                            return (
                                <>
                                    <div className="col text-center bound__labels" key={i + e + Math.random()}>
                                        {e}
                                    </div>
                                </>
                            )
                        })
                    }
                </div>
                <div className="row price__bounds">
                    {
                        labels.map((e, i) => {

                            let p = price[i],
                                t = typeof p
                            return (
                                <>
                                    <div className={`col price__bounds__outer`} key={i + Math.random() * 6} style={{padding : '0px'}}>
                                        <div style={{fontSize : '14px' , fontWeight : 700 , marginBottom : startArr[i]+20+'px'}} className="price__bounds__inner">
                                            <span className="bound__label label__up">{t !== 'object' ? p : p[1]}</span>
                                            <div style={{ height: heightArr[i]}} className="PriceUpAndLowBounds">
                                                <div className="pul__inner"></div>
                                            </div>
                                            <span className="bound__label label__down">{t === 'object' && p[0]}</span>
                                        </div>
                                    </div>
                                </>
                            )
                        })
                    }
                </div>
            </>
        )
    }
    if (props) {

        // console.log(props);
        let maxArea = $('.price__bounds').height()-50;
        let maxValue = 0;
        let ratioFactor;
        let startArr = [] , heightArr=[];
        props.data.map((arr)=>{
            if(typeof arr === 'number')
            {
                maxValue = arr> maxValue ? arr : maxValue;
            }
            else if(typeof arr === 'object')
            {
                maxValue = Math.max(...arr)> maxValue ? Math.max(...arr) : maxValue;
            }
        });

        ratioFactor = maxValue>maxArea ? parseFloat((maxValue/maxArea).toFixed(2)) : 1;

        // console.log(maxArea,maxValue,ratioFactor);

        props.data.map((arr,i)=>{
            if(typeof arr === 'number')
            {
                startArr.push(parseFloat((arr/ratioFactor).toFixed(2)));
                heightArr.push(10);
            }
            else
            {
                startArr.push(parseFloat((arr[0]/ratioFactor).toFixed(2)));
                heightArr.push(parseFloat((Math.abs(arr[1]-arr[0])/ratioFactor).toFixed(2)));
            }
        });

        // console.log(startArr,heightArr);



        return (
            <>
                <Row>
                    <Col md={13} lg={16}>
                        <h6>Price Upper and Lower Bounds</h6>
                        <div className="container">
                            <Slid labels={props.labels} price={props.data} startArr={startArr} heightArr={heightArr}/>
                        </div>
                    </Col>
                    <Col md={8} lg={8} >
                        <h6>Valuation Confidence</h6>
                        <div className="pt-4" style={{ marginLeft: 70, height: 330 }}>
                            <CustomSlider ValuationConfidence={props.ValuationConfidence}/>
                        </div>
                    </Col>
                </Row>
            </>
        )
    }
    return null
}

function CustomSlider(props){

        const printText = props.printText || ['Quite High', 'High', 'Inconclusive', 'Low', 'Quite Low'],
        steps = printText.length,
        value = props.ValuationConfidence;
        // console.log('custom',value);
        // console.log(props);
           
        return (
            <div className="pt-2">
                <div style={{ height: 300 }}>
                    <Slider
                        min={0}
                        max={steps - 1}
                        value={value}
                        className="custom-slider-Technical"
                        graduated
                        vertical
                        tooltip={false}
                        renderMark={n =>
                            <span key={n + Math.random() + 5} style={{ fontWeight: n === value ? "bold" : 'normal' , fontSize : '14px' }}>{printText[n]}</span>
                        }
                        onChange={v => { console.log(v) }}
                    />
                </div>
            </div>
        );
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
        
        let PULarr = [600];
        let ValFactors = this.state.ValuationFactors;
        let PriceBands = this.state.PriceBandEPSFactors;

        // console.log(PriceBands);
        
        for(let i=1;i<=5;i++)
        {
            let bounds = [];
            let HighB = Math.round(ValFactors['EMHB']*PriceBands['T'+i]);
            let LowB = Math.round(ValFactors['EMLB']*PriceBands['T'+i]);
            bounds.push(LowB,HighB);
            PULarr.push(bounds);
        }


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
        this.setState({
            ValuationConfidence : VC
        });

        // console.log('EPS Factor End');

    }

    async setAnnualReturns()
    {
        // console.log('Annual Returns Start');
        
        let PriceBounds = this.state.PriceUpLowBounds;
        let Base = typeof PriceBounds[0] === 'number' ? PriceBounds[0] : '';
        // console.log(Base);
        let num1 = 3;
        let num2 = 5;
        if(typeof Base  === 'number')
        {
            let ThreeY = parseFloat((((PriceBounds[num1][0]+PriceBounds[num1][1])/2)/Base));
            let FiveY = parseFloat((((PriceBounds[num2][0]+PriceBounds[num2][1])/2)/Base));


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
                    <div className="container pl-5 pr-5" style={{color : '#00a0e3'}}>
                        <Row className="p-5 text-center">
                            <h4 className="mb-4">Fundamental valuation using standard methodologies is not possible as financials 
                                of the company do not allow for such a valuation.
                            </h4>
                            <h4>Kindly use your own judgement in arriving at a value. </h4>
                        </Row>
                    </div>
                    
                </>
            )
        }
        else
        {
            return(
                <>
                    <Row style={{paddingLeft:'35px'}}>
                        <Col md={10}>
                            <h5 style={{ fontWeight: 'bold', padding: 10 }}>Earnings Valuation</h5>
                            {
                                
                                data.map((e, i) => {
                                    if (typeof e == 'object' && !Array.isArray(e)) {
                                        return <EarningValuation key={i + Math.random()} {...e} />
                                    } else return null
                                })
                            }
                            {/* <EarningValuation data={this.state.EarningValuation}/> */}
                            <div style={{ padding: '20px 0 0 0',fontSize:'14px' }}>
                                The above values have been set according to our estimates.<br />
                                You may set them as necessary according to your views.
                            </div>
                        </Col>
                        <Col md={10} lg={14}>
                            <PriceUpAndLowBounds 
                                labels={this.state.PriceUpLowLabels} 
                                data={this.state.PriceUpLowBounds} 
                                ValuationConfidence={this.state.ValuationConfidence}
                            />
                            <div className="mt-2" style={{ width : '70%' }}>
                                <h6 style={{padding : '6px'}}>Annual Returns</h6>
                                <div className="annual__returns">
                                    <p>3 year potential Upside/ Downside</p>
                                    <span>{this.state.ThreeYearReturn}%</span>
                                </div>
                                <div className="annual__returns">
                                    <p>5 year potential Upside/ Downside</p>
                                    <span>{this.state.FiveYearReturn}%</span>
                                </div>
                            </div>
                            
                        </Col>
                    </Row>
                    <Row>
                        <div className="container m-auto mt-5 mb-5 p-3" style={{ border: '1px solid black', borderRadius: 10 , marginLeft : 0 , width : '90%'}}>
                            <p style={{fontSize : '20px' , fontWeight : 700}}>Valuation Methodology</p>
                            <div style={{fontSize : '14px' , fontWeight : 500}}>
                                {(this.state.ValuationMethodology || []).map((e, i) => <div key={i + 9 + Math.random()}>{i + 1}.&nbsp;{e}</div>)}
                            </div>
                        </div>
                    </Row>
                </>
            )
        }
        
    }
}

export {Valuation};