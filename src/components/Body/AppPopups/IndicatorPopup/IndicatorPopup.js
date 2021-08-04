import React from 'react';
import $ from 'jquery';
import IndicatorInfo from './IndicatorInfo';
import Indicator from './Indicator';
import IndicatorsList from './IndicatorsList';
import CrossIcon from '../../../../assets/icons/crossicon.svg';


export class IndicatorPopup extends React.PureComponent {

    constructor(props)
    {
        super(props);
        this.state = {
            indicatorInfoOpen : false,
            indicatorInfoType : '',
        }

        this.OpenIndicatorInfo = this.OpenIndicatorInfo.bind(this);
        this.CloseIndicatorInfo = this.CloseIndicatorInfo.bind(this);
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

    render() {
        return (
            <div className="Indicator__popup">
                <div className="Indicator__title__name">
                    <p>Indicators & Strategies</p>
                    <span id="Indicator__close" onClick={()=> {this.props.CloseIndicatorPopup()}}>
                        <img src={CrossIcon} alt="X"/>
                    </span>
                    
                </div>
                <div className="Indicator__options">
                    <IndicatorInfo CloseIndicatorInfo={this.CloseIndicatorInfo} indicatorInfoType={this.state.indicatorInfoType}/>
                    {IndicatorsList.map((indicator,indx)=>{
                        return <>
                            <Indicator key={indx} IndicatorName={indicator.IndicatorName} IndicatorInfo={this.OpenIndicatorInfo} ChangeIndicatorType={this.props.ChangeIndicatorType} Indicator={indicator} InfoType={indicator.InfoType}/>
                        </>
                    })}

                </div> 
            </div>
        )
    }
}

export default IndicatorPopup;
