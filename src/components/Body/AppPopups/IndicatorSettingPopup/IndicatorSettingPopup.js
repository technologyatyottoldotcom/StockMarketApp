import React from 'react';
import {IndicatorConfig,setIndicator,setIndicatorConfig} from '../../../../exports/IndicatorConfig';
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
            DefaultIndicatorOptions : {},
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

        type = type.split(' ').join('').toLowerCase();
        if(type === 'linechart')
        {
            return 0;
        }
        else if(type === 'areachart')
        {
            return 1;
        }
        else if(type === 'barchart')
        {
            return 2;
        }
        else if(type === 'steplinechart')
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
            DefaultIndicatorOptions : JSON.parse(JSON.stringify(IndicatorOptions)),
            OptionsLoaded : true
        })
    }

    createContainer()
    {

        if(this.state.IndicatorOptions)
        {

            // console.log(this.state.IndicatorOptions,this.state.DefaultIndicatorOptions)
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
                                    onChangeValue={(value)=> {setIndicatorConfig(this.state.IndicatorName,c.configname,value); this.props.saveIndicatorSettings()}}
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
                                    onColorChange={(color)=> {setIndicatorConfig(this.state.IndicatorName,c.configname,color); this.props.saveIndicatorSettings()}}    
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
                                    onChangeValue={(value)=> {setIndicatorConfig(this.state.IndicatorName,c.configname,value); this.props.saveIndicatorSettings()}}
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
                                    onTypeChange={(type)=> {setIndicatorConfig(this.state.IndicatorName,c.configname,type); this.props.saveIndicatorSettings()}}
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

    saveIndicator(indicator,indicatorOptions)
    {
        setIndicator(indicator,indicatorOptions);
    }

    render() {

        const {IndicatorName,DefaultIndicatorOptions,IndicatorOptions,OptionsLoaded} = this.state;
        // console.log(IndicatorOptions)

        if(OptionsLoaded)
        {
            return (
                <div className="indicator__setting__popup">
                        <div className="indicator__setting__header">
                            <p className="indicator__code">{IndicatorOptions.title}</p>
                            <p className="indicator__name">{IndicatorOptions.name}</p>
                            <span className="indicator__setting__close" onClick={()=> {this.props.closeIndicatorSettings()} }>
                                <img src={CrossIcon} alt="X"/>
                            </span>
                        </div>
                        <div className="indicator__setting__container">
                            {this.createContainer()}
                        </div>
                        <div className="indicator__setting__footer">
                            <button type="button" onClick={()=> {this.saveIndicator(IndicatorName,DefaultIndicatorOptions);this.props.closeIndicatorSettings()}}>Cancel</button>
                            <button type="button" onClick={()=> {this.props.closeIndicatorSettings()}}>Apply</button>
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
