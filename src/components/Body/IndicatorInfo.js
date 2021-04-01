import React from 'react';
import CrossIcon from '../../assets/icons/crossicon.svg';

export class IndicatorInfo extends React.Component {
    render() {

        const {CloseIndicatorInfo,indicatorInfoType} = this.props;
        // console.log(indicatorInfoType);
        let IndicatorName;
        let IndicatorData;

        if(indicatorInfoType === 'SMA')
        {
            IndicatorName = 'Simple Moving Average (SMA)';
            IndicatorData = <>
                            <div>
                                <p className="Indicator__info__data__title">
                                    Description
                                </p>
                                <p className="Indicator__info__data__value">
                                    A Simple Moving Average is a trending indicator that is displayed 
                                    as a single line that shows the mean price during a specified period of time. 
                                    For example, a 20-day SMA shows the average stock price during the last 20 
                                    trading periods (including the current period).
                                </p>
                            </div>
                            <div>
                                <p className="Indicator__info__data__title">
                                    Usage
                                </p>
                                <p className="Indicator__info__data__value">
                                    Simple Moving Averages are used by traders to detect the trend of the stock and 
                                    to identify possible levels of support and resistance. If the Simple Moving Average is 
                                    trending higher and the price is above it, the stock is considered to be in an uptrend, in 
                                    other case - if it is trending lower and the price is below it, the stock is considered to be 
                                    in a downtrend. Also, when the price is above an uptrending SMA line, the Simple Moving Average 
                                    can act as a possible support level. In the same way, when the price below a downtrending 
                                    SMA line - the Simple Moving Average can act as a possible resistance level.
                                </p>
                            </div>
                            </>;
        }
        else if(indicatorInfoType === 'WMA')
        {
            IndicatorName = 'Weighted Moving Average (WMA)';
        }
        else if(indicatorInfoType === 'EMA')
        {
            IndicatorName = 'Exponential Moving Average (EMA)';
        }
        else if(indicatorInfoType === 'TMA')
        {
            IndicatorName = 'Triangular Moving Average (TMA)';
        }
        else if(indicatorInfoType === 'BB')
        {
            IndicatorName = 'Bollinger Bands (BBands)';
        }
        else if(indicatorInfoType === 'MACD')
        {
            IndicatorName = 'Moving Average Convergence/Divergence (MACD)';
        }
        else if(indicatorInfoType === 'RSI')
        {
            IndicatorName = 'Relative Strength Index (RSI)';
        }
        else if(indicatorInfoType === 'ATR')
        {
            IndicatorName = 'Average True Range (ATR)';
        }
        else if(indicatorInfoType === 'SOSlow')
        {
            IndicatorName = 'Stochastic Oscillator (Slow)';
        }
        else if(indicatorInfoType === 'SOFast')
        {
            IndicatorName = 'Stochastic Oscillator (Fast)';
        }
        else if(indicatorInfoType === 'SOFull')
        {
            IndicatorName = 'Stochastic Oscillator (Full)';
        }
        else if(indicatorInfoType === 'FI')
        {
            IndicatorName = 'Force Index (FI)';
        }
        else if(indicatorInfoType === 'ERI')
        {
            IndicatorName = 'Elder Ray Indicator (ERI)';
        }
        else if(indicatorInfoType === 'ERIBull')
        {
            IndicatorName = 'Elder Ray Indicator Bull Power (ERI)';
        }
        else if(indicatorInfoType === 'ERIBear')
        {
            IndicatorName = 'Elder Ray Indicator Bear Power (ERI)';
        }
        else if(indicatorInfoType === 'ERIMP')
        {
            IndicatorName = 'Elder Ray Impulse (ERIMP)';
        }
        else if(indicatorInfoType === 'PSAR')
        {
            IndicatorName = 'Parabolic SAR (PSAR)';
        }


        return (
            <div className="Indicator__info">
            <div className="Indicator__info__name">
                <p>{IndicatorName}</p>
                <span id="Indicator__Info__close" onClick={CloseIndicatorInfo}><img src={CrossIcon} alt="X"/></span>
            </div>
            <div className="Indicator__info__data">
                {IndicatorData}
            </div>
        </div>
        )
    }
}

export default IndicatorInfo;
