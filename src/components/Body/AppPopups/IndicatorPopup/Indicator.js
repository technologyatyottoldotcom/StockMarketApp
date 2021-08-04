import React from 'react';

export class Indicator extends React.PureComponent {
    render() {

        const {IndicatorName,IndicatorInfo,ChangeIndicatorType,InfoType,Indicator} = this.props;

        return (
            <div className="Indicator__option__block">
                <div className="indicator__option__title"  onClick={()=>{
                // ChangeIndicatorType(InfoType,Indicator);
                ChangeIndicatorType(Indicator);
            }}>
                    <p>{IndicatorName}</p>
                </div>
                <div>
                    <span onClick={()=>IndicatorInfo(InfoType)} data-info={InfoType}>?</span>
                </div>
            </div>
        )
    }
}

export default Indicator;
