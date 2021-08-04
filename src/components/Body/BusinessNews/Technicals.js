import React from 'react';
import '../../../scss/Technicals.scss';
import learning from "../../../assets/icons/learning.svg";
import AI from '../../../assets/icons/ai.svg';
import CustomSlider from '../CustomChartComponents/CustomSlider/CustomSlider';


const marksa = [
    {
      value: -2,
      label: 'Strong Sell',
    },
    {
      value: -1,
      label: 'Sell',
    },
    {
      value: 0,
      label: 'Neutral',
    },
    {
        value: 1,
        label: 'Buy',
    },
    {
        value: 2,
        label: 'Strong Buy',
    },
];

const marksb = [
    {
      value: -2,
      label: 'Sell',
    },
    {
        value: 0,
        label: 'Neutral',
      },
    {
      value: 2,
      label: 'Buy',
    },
];


class TechnicalsViews extends React.PureComponent {
    render()
    {
        // console.log(this.props.targets);

        const targets = this.props.targets;
        return (
            <>
                <div className="bn__stock__tech__view">
                    <div className="bn__stock__slider__wrapper">
                        <p className="bn__stock__view__title">Short Term Technical View</p>
                        <div className="bn__stock__slider">
                            <CustomSlider min={-2} max={2} value={targets.STTV.point || 0} marks={marksa}/>
                        </div>
                    </div>
                    <div className="bn__stock__text">
                        <p>EMA(5) {targets.STTV.text1 && targets.STTV.text1} EMA(10)</p>
                        <p>EMA(10) {targets.STTV.text2 && targets.STTV.text2} EMA(20)</p>
                    </div>
                </div>
                <div className="bn__stock__tech__view">
                    <div className="bn__stock__slider__wrapper">
                        <p className="bn__stock__view__title">Long Term Technical View</p>
                        <div className="bn__stock__slider">
                            <CustomSlider min={-2} max={2} value={targets.LTTV.point || 0} marks={marksa}/>
                        </div>
                    </div>
                    <div className="bn__stock__text">
                        <p>EMA(20) {targets.LTTV.text1 && targets.LTTV.text1} EMA(50)</p>
                        <p>EMA(50) {targets.LTTV.text2 && targets.LTTV.text2} EMA(100)</p>
                    </div>
                </div>
                <div className="bn__stock__tech__view">
                    <div className="bn__stock__slider__wrapper">
                        <p className="bn__stock__view__title">Relative Strength Index (RSI)</p>
                        <div className="bn__stock__slider">
                            <CustomSlider min={-2} max={2} value={targets.RSIV.point || 0} marks={marksa} short={false}/>
                        </div>
                    </div>
                </div>

                <div className="bn__stock__tech__view small">
                    <div className="bn__stock__slider__wrapper">
                        <p className="bn__stock__view__title">Moving Average Convergence Divergence (MACD)</p>
                        <div className="bn__stock__slider">
                            <CustomSlider min={-2} max={2} value={targets.MACDV.point || 0} marks={marksb} short={true}/>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}


class TechnicalsTargets extends React.PureComponent {

    convertIntoPriceFormat(num,frac=1)
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

    render()
    {

        const targets = this.props.targets;


        return (
            <>
                <div className="bn__stock__tech__view">
                    <div className="bn__stock__slider__wrapper">
                        <p className="bn__stock__view__title">Short Term Technical View</p>
                        <div className="bn__stock__slider">
                            <CustomSlider min={-2} max={2} value={targets.OVERV.point || 0} marks={marksa}/>
                        </div>
                    </div>
                    <div className="bn__stock__text">
                        <p>This indicator is based on the results of the four indicators on the left hand side.</p>
                    </div>
                </div>
                <div className="bn__stock__target__price">
                    <div className="bn__stock__target__genie">
                        <img src={AI} alt="AI_ML_GENIE_LOGO" />
                        <p>AI & ML Genie</p>
                    </div>
                    {targets.FPV.Enough ? 
                        
                        <div className="bn__stock__target__value">
                            <p>Price Target For 
                                <br /> 
                                <span>{targets.FPV.Days} Days</span> 
                                <br /> 
                                is 
                                <br />
                                <span>Rs. {this.convertIntoPriceFormat(targets.FPV.FutureAmount)} </span>
                                <span className={targets.FPV.FuturePer >= 0 ? "bn__stock__target__change positive" : "bn__stock__target__change negative"}>({this.convertIntoPriceFormat(targets.FPV.FuturePer)}%)</span>
                            </p>
                            <p className={targets.FPV.Confidence >= 0.9 ? "bn__stock__target__predictibility positive" : "bn__stock__target__predictibility negative"}>
                                (Predictibility : <span>{targets.FPV.Confidence >= 0.9 ? 'High' : 'Low'}</span>)
                            </p>
                        </div>

                        :

                        <div className="bn__stock__target__value">
                            <p className="bn__stock__target__empty">Not Enough Data To Predict</p>
                        </div>
                        
                    }
                </div>
                
            </>
        )
    }
}


export class Technicals extends React.PureComponent {

    constructor(props)
    {
        super(props);
    }

    render() {

        const technicals = this.props.technicals;

        if(!technicals.loading)
        {
            return (
                    <>
                        <div className="bn__stock__technicals">
                            <div className="bn__stock__views">
                                <TechnicalsViews targets={technicals.targets}/>
                            </div>

                            <div className="bn__stock__target">
                                <TechnicalsTargets targets={technicals.targets}/>
                            </div>
                        </div>
                    </>
            )
        }
        else
        {
            return (
                <div className="bn__stock__technicals">
                    <p>Loading ...</p>
                </div>
            )
        }
        
    }
}

export default Technicals;