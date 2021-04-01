import React from 'react';
import { Row, Col, InputNumber, Slider } from 'rsuite';
import AI_ML_GENIE_LOGO from "../../../assets/icons/AIML.png";

class CustomSlider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.active - 1 || 0,
        };
    }
    render() {
        const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
            printText = this.props.printText || ['Strong Sell', 'Sell', 'Neutral', 'Buy', 'Strong Buy'],
            steps = printText.length,
            { value } = this.state;
        return (
            <div className="pt-4">
                <div style={{ width: this.props.width || 300, marginLeft: 20 }}>
                    <Slider
                        min={0}
                        max={steps - 1}
                        value={value}
                        className="custom-slider-Technical"
                        // handleStyle={{
                        //     backgroundColor: '#2196f3',
                        //     color: '#fff',
                        //     fontSize: 12,
                        //     width: 32,
                        //     height: 22
                        // }}
                        graduated
                        tooltip={false}
                        // handleTitle={labels[value]}
                        renderMark={n =>
                            <span key={n + Math.random() + 5} style={{ fontWeight: n === value ? "bold" : 'normal' , fontSize : '14px' }}>{printText[n]}</span>
                        }
                        onChange={v => { this.setState({ value: v }) }}
                    />
                </div>
            </div>
        );
    }
}

class TechnicalsSecondSection extends React.PureComponent {
    constructor(props) {
        super(props);
        this.firstSec = this.firstSec.bind(this)
        this.secSec = this.secSec.bind(this)
    }
    firstSec() {
        return (
            <>
                <div className="pb-5">
                    <h6>Short Term Technical View</h6>
                    <CustomSlider />
                </div>
                <div className="pb-5">
                    <h6>Long Term Technical View</h6>
                    <CustomSlider />
                </div>
                <div className="pb-5">
                    <h6>Relative Strength Index (RSI)</h6>
                    <CustomSlider printText={["Sell", "Buy"]} active={1} width={100} />
                </div>
                <div className="pb-5">
                    <h6>Moving Average Convergence Divergence (MACD)</h6>
                    <CustomSlider printText={["Sell", "Buy"]} active={1} width={100} />
                </div>
            </>
        )
    }

    secSec() {
        return (
            <>
                <div className="p-3 mt-4 border rounded" style={{fontSize : '14px'}}>
                    <p>  5 Day MA is&nbsp;
                <b> lower than </b>
                20 Day MA.
            </p>
                    <p>
                        10 Day MA is&nbsp;
                <b> lower than </b>
                20 Day MA
            </p>
                </div>
                <div className="p-3 mt-4 border rounded" style={{fontSize : '14px'}}>
                    <p>  5 Day MA is&nbsp;
                <b> lower than </b>
                20 Day MA.
            </p>
                    <p>
                        10 Day MA is&nbsp;
                <b> lower than </b>
                20 Day MA
            </p>
                </div>
            </>
        )
    }
    render() {
        return (
            <>
                <div>
                    <div className="row">
                        <div className="col-5 mr-5 ">
                            {this.firstSec()}
                        </div>

                        <div className="col-2">
                            {this.secSec()}
                        </div>

                        <div className="col-5 align-self-start ">
                            <div>
                                <div className="pb-4 text-center">
                                    <h6>Overall Technical View</h6>
                                    <div className="p-3">
                                        <CustomSlider />
                                    </div>
                                    <div className="mt-2 p-2">
                                        <p className='border rounded w-75 p-1' style={{ marginLeft: 50 , fontSize : '14px' }} >
                                            This indicator is based on the results of the
                                            four indicators on the left hand side.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="container pt-5">
                                <div className="row justify-content-center text-center">
                                    <div className="col-8 h5" style={{ fontWeight: 'bold' }}>
                                        AI & ML Genie
                                    </div>
                                </div>
                                <div className="row pt-3">
                                    <div className="col-4 p-0 m-0">
                                        <img src={AI_ML_GENIE_LOGO} width={150} className="img-fluid" alt="AI_ML_GENIE_LOGO" />
                                    </div>
                                    <div className="col text-center p-0 m-0" style={{ fontSize: 20 }}>
                                        <div>
                                            Price Target<br />
                                                for<br />
                                            <b>10 Days</b><br />
                                                is
                                            </div>
                                        <h2 style={{ fontWeight: 'bold' }}>Rs. 1,325</h2>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </>
        )
    }
}



class Technicals extends React.PureComponent {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <>
                {/* TechnicalsSecondSection */}
                <div style={{padding : '0px 0 20px 45px'}}>
                    <TechnicalsSecondSection />
                </div>

            </>
        )
    }
}


export { Technicals };