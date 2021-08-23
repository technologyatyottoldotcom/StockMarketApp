import React from 'react';
import '../../../../css/CompareSettingPopup.css';
import CustomSelect from '../../CustomChartComponents/CustomSelect/CustomSelect';
import CustomColorPicker from '../../CustomChartComponents/CustomColorPicker/CustomColorPicker';
import CustomWidthSelect from '../../CustomChartComponents/CustomWidthSelect/CustomWidthSelect';
import CustomCheckBox from '../../CustomChartComponents/CustomCheckBox/CustomCheckBox';
import CrossIcon from '../../../../assets/icons/crossicon.svg';


class CompareSettingPopup extends React.PureComponent {


    constructor(props)
    {
        super(props);

        this.state = {
            StockCompareSettings : this.props.StockCompareSettings,
            OldStockCompareSettings : JSON.parse(JSON.stringify(this.props.StockCompareSettings))
        }

        this.applyConfig = this.applyConfig.bind(this);
        this.saveConfig = this.saveConfig.bind(this);
        this.setColor = this.setColor.bind(this);
        this.setChartType = this.setChartType.bind(this);
        this.setChartWidth = this.setChartWidth.bind(this);
        this.setPriceLabel = this.setPriceLabel.bind(this);
        this.setChartHide = this.setChartHide.bind(this);
        this.setStockLabel = this.setStockLabel.bind(this);
    }

    getChartType(type)
    {

        type = type.split(' ').join('').toLowerCase();
        if(type === 'linechart')
        {
            return 'line'
        }
        else if(type === 'areachart')
        {
            return 'area';
        }
        else if(type === 'barchart')
        {
            return 'column';
        }
        else if(type === 'steplinechart')
        {
            return 'stepline';
        }
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

    applyConfig()
    {
        const {StockCompareSettings} = this.state;
        this.setState({
                OldStockCompareSettings : JSON.parse(JSON.stringify(StockCompareSettings))
        });
        this.props.closeCompareSettings(StockCompareSettings);
    }

    saveConfig(StockCompareSettings)
    {

        // console.log(StockCompareSettings.config);
        // console.log(this.state.OldStockCompareSettings.config)
        this.setState({
            StockCompareSettings
        });

        this.props.saveCompareSettings(StockCompareSettings);
    }

    setColor(color)
    {
        const {StockCompareSettings} = this.state;
        StockCompareSettings['color'] = color;
        StockCompareSettings['config']['color'] = color;

        this.saveConfig(StockCompareSettings);
    }

    setChartWidth(width)
    {
        const {StockCompareSettings} = this.state;
        StockCompareSettings['config']['chartwidth'] = width;

        this.saveConfig(StockCompareSettings);
    }

    setChartType(type)
    {
        const {StockCompareSettings} = this.state;
        StockCompareSettings['config']['charttype'] = this.getChartType(type);
        this.saveConfig(StockCompareSettings);
    }

    setPriceLabel(label)
    {
        const {StockCompareSettings} = this.state;
        StockCompareSettings['config']['pricelabel'] = label;
        this.saveConfig(StockCompareSettings);
    }

    setChartHide(hide)
    {
        const {StockCompareSettings} = this.state;
        StockCompareSettings['hide'] = hide;
        StockCompareSettings['config']['hide'] = hide;
        this.saveConfig(StockCompareSettings);
    }

    setStockLabel(label)
    {
        const {StockCompareSettings} = this.state;
        StockCompareSettings['config']['stocklabel'] = label;
        this.saveConfig(StockCompareSettings);
    }

    render() {

        const {StockCompareSettings,OldStockCompareSettings} = this.state;
        // console.log(StockCompareSettings.config,OldStockCompareSettings.config);

        const config = StockCompareSettings.config && StockCompareSettings.config;

        if(this.props.zoom)
        {
            return (
                <div className="compare__setting__popup">
                    <div className="compare__setting__header">
                        <p className="compare__code">{StockCompareSettings.symbol}</p>
                        <p className="compare__company">{StockCompareSettings.name}</p>
                        <span className="compare__setting__close" onClick={e => this.applyConfig()}>
                            <img src={CrossIcon} alt="X"/>
                        </span>
                    </div>
                    <div className="compare__setting__container">
                        <div className="compare__setting__block">
                            <p className="compare__setting__title">Chart Type</p>
                            <div className="compare__setting__item">
                                <CustomSelect 
                                width={180} 
                                height={35} 
                                defaultIndex={this.getTypeIndex(config.charttype)}
                                onTypeChange={this.setChartType}
                                options={['Line Chart','Area Chart','Bar Chart','Step Line Chart']}/>
                            </div>
                        </div>
                        <div className="compare__setting__block">
                            <p className="compare__setting__title">Chart Color</p>
                            <div className="compare__setting__item">
                                <CustomColorPicker 
                                    width={120} 
                                    height={35} 
                                    size={25}
                                    defaultColor={config.color}
                                    onColorChange={this.setColor}    
                                />
                            </div>
                        </div>
                        <div className="compare__setting__block">
                            <p className="compare__setting__title">Chart Width</p>
                            <div className="compare__setting__item">
                                <CustomWidthSelect 
                                    width={180} 
                                    height={35} 
                                    title={config.chartwidth}
                                    defaultIndex={1}
                                    onTypeChange={this.setChartWidth}
                                    options={['1','2','4','5','6']}
                                />
                            </div>
                        </div>
                        <div className="compare__setting__checkbox__wrapper">
                            <div className="compare__setting__checkbox">
                                <CustomCheckBox 
                                    width={20} 
                                    height={20} 
                                    isChecked={config.hide}
                                    onChangeValue={this.setChartHide}
                                />
                            </div>
                            <p className="compare__setting__title">Hide Chart</p>
                        </div>
                        <div className="compare__setting__checkbox__wrapper">
                            <div className="compare__setting__checkbox">
                                <CustomCheckBox 
                                    width={20} 
                                    height={20} 
                                    isChecked={config.pricelabel}
                                    onChangeValue={this.setPriceLabel}
                                />
                            </div>
                            <p className="compare__setting__title">Price Label</p>
                        </div>
                        <div className="compare__setting__checkbox__wrapper">
                            <div className="compare__setting__checkbox">
                                <CustomCheckBox 
                                    width={20} 
                                    height={20} 
                                    isChecked={config.stocklabel}
                                    onChangeValue={this.setStockLabel}        
                                />
                            </div>
                            <p className="compare__setting__title">Stock Label</p>
                        </div>
                    </div>
                    <div className="compare__setting__footer">
                        <button type="button" onClick={e => this.props.closeCompareSettings(OldStockCompareSettings)}>Cancel</button>
                        <button type="button" onClick={e => this.applyConfig()}>Apply</button>
                    </div>
                </div>
            )
        }
        else
        {
            return null;
        }
    }
}

export default CompareSettingPopup;
