import React from 'react';
import {IndicatorConfig} from '../../../../exports/IndicatorConfig';
import CustomSelect from '../../CustomChartComponents/CustomSelect/CustomSelect';
import CustomCheckBox from '../../CustomChartComponents/CustomCheckBox/CustomCheckBox';
import CustomColorPicker from '../../CustomChartComponents/CustomColorPicker/CustomColorPicker';
import CustomNumberBox from '../../CustomChartComponents/CustomNumberBox/CustomNumberBox';
import '../../../../css/IndicatorSettingPopup.css';
import CrossIcon from '../../../../assets/icons/crossicon.svg';

export class IndicatorSettingPopup extends React.PureComponent {

    constructor(props)
    {
        super(props);

        this.state = {
            IndicatorName : this.props.IndicatorName,
            IndicatorOptions : {},
            OptionsLoaded : false
        }

        this.setIndicatorConfig = this.setIndicatorConfig.bind(this);
    }

    componentDidMount()
    {
        this.setIndicatorConfig(this.state.IndicatorName)
    }

    getTypeIndex(type)
    {

        console.log(type)
        if(type === 'line')
        {
            return 0;
        }
        else if(type === 'area')
        {
            return 1;
        }
        else if(type === 'column')
        {
            return 2;
        }
        else if(type === 'stepline')
        {
            return 3;
        }
        else
        {
            return 0;
        }
    }

    setIndicatorConfig(indicator)
    {
        let IndicatorOptions = {};

        IndicatorConfig.forEach(ind => {
            if(ind.title === indicator)
            {
                IndicatorOptions = ind;
            }
        });

        this.setState({
            IndicatorOptions : IndicatorOptions,
            OptionsLoaded : true
        })
    }

    createContainer()
    {

        if(this.state.IndicatorOptions)
        {
            const {config} = this.state.IndicatorOptions;
            
            return config.map((c,indx)=>{
                if(c.type === 'checkbox')
                {
                    return (
                        <div className="indicator__setting__checkbox__wrapper">
                            <div className="indicator__setting__checkbox">
                                <CustomCheckBox 
                                    width={20} 
                                    height={20} 
                                    isChecked={c.value}
                                    onChangeValue={()=> {}}
                                />
                            </div>
                            <p className="indicator__setting__title">{c.label}</p>
                        </div>
                    )
                }
                else if(c.type === 'colorpicker')
                {
                    return (
                        <div className="indicator__setting__block">
                            <p className="indicator__setting__title">{c.label}</p>
                            <div className="indicator__setting__item">
                                <CustomColorPicker 
                                    width={120} 
                                    height={35} 
                                    size={25}
                                    defaultColor={c.value}
                                    onColorChange={()=> {}}    
                                />
                            </div>
                        </div>
                    )
                }
                else if(c.type === 'number')
                {
                    return (
                        <div className="indicator__setting__block">
                            <p className="indicator__setting__title">{c.label}</p>
                            <div className="indicator__setting__item">
                                <CustomNumberBox 
                                    width={180} 
                                    height={35} 
                                    defaultvalue={c.value}
                                    onChangeValue={()=> {}}
                                />
                            </div>
                        </div>
                    )
                }
                else if(c.type === 'dropdown')
                {
                    return (
                        <div className="indicator__setting__block">
                            <p className="indicator__setting__title">{c.label}</p>
                            <div className="indicator__setting__item">
                                <CustomSelect 
                                    width={180} 
                                    height={35} 
                                    defaultIndex={this.getTypeIndex(c.value)}
                                    onTypeChange={()=> {}}
                                    options={c.options}/>
                            </div>
                        </div>
                    )
                }
            });
        }
        else
        {
            return null;
        }

    }   

    render() {

        const {IndicatorOptions,OptionsLoaded} = this.state;
        console.log(IndicatorOptions)

        if(OptionsLoaded)
        {
            return (
                <div className="indicator__setting__popup">
                        <div className="indicator__setting__header">
                            <p className="indicator__code">{IndicatorOptions.title}</p>
                            <p className="indicator__name">{IndicatorOptions.name}</p>
                            <span className="indicator__setting__close">
                                <img src={CrossIcon} alt="X"/>
                            </span>
                        </div>
                        <div className="indicator__setting__container">
                            
                            {this.createContainer()}
                        </div>
                        <div className="indicator__setting__footer">
                            <button type="button" >Cancel</button>
                            <button type="button">Apply</button>
                        </div>
                </div>
            )
        }
        else
        {
            return <></>
        }
    }
}

export default IndicatorSettingPopup;
