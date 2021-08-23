let IndicatorConfig = [
    {
        title : 'SMA',
        name : 'Simple Moving Average',
        config : [
        
            {
                configname : 'windowsize',
                label : 'Window Size',
                type : 'number',
                value : 20
            },
            {
                configname : 'charttype',
                label : 'Chart Type',
                type : 'dropdown',
                options : ['Line Chart','Area Chart','Bar Chart','Step Line Chart'],
                value : 'Line Chart'
            },
            {
                configname : 'stroke',
                label : 'Color',
                type : 'colorpicker',
                value : '#1dd1a1'
            },
            {
                configname : 'hide',
                label : 'Hide Indicator',
                type : 'checkbox',
                value : false
            },
            {
                configname : 'pricelabel',
                label : 'Price Label',
                type : 'checkbox',
                value : true
            },
            {
                configname : 'stocklabel',
                label : 'Stock Label',
                type : 'checkbox',
                value : true
            }
            
        ]
    },
    {
        title : 'WMA',
        name : 'Weighted Moving Average',
        config : [
        
            {
                configname : 'windowsize',
                label : 'Window Size',
                type : 'number',
                value : 20
            },
            {
                configname : 'charttype',
                label : 'Chart Type',
                type : 'dropdown',
                options : ['Line Chart','Area Chart','Bar Chart','Step Line Chart'],
                value : 'Line Chart'
            },
            {
                configname : 'stroke',
                label : 'Color',
                type : 'colorpicker',
                value : '#ee5253'
            },
            {
                configname : 'hide',
                label : 'Hide Indicator',
                type : 'checkbox',
                value : false
            },
            {
                configname : 'pricelabel',
                label : 'Price Label',
                type : 'checkbox',
                value : true
            },
            {
                configname : 'stocklabel',
                label : 'Stock Label',
                type : 'checkbox',
                value : true
            }
            
        ]
    },
    {
        title : 'EMA',
        name : 'Exponential Moving Average',
        config : [
        
            {
                configname : 'windowsize',
                label : 'Window Size',
                type : 'number',
                value : 20
            },
            {
                configname : 'charttype',
                label : 'Chart Type',
                type : 'dropdown',
                options : ['Line Chart','Area Chart','Bar Chart','Step Line Chart'],
                value : 'Line Chart'
            },
            {
                configname : 'stroke',
                label : 'Color',
                type : 'colorpicker',
                value : '#ff9f43'
            },
            {
                configname : 'hide',
                label : 'Hide Indicator',
                type : 'checkbox',
                value : false
            },
            {
                configname : 'pricelabel',
                label : 'Price Label',
                type : 'checkbox',
                value : true
            },
            {
                configname : 'stocklabel',
                label : 'Stock Label',
                type : 'checkbox',
                value : true
            }
            
        ]
    },
    {
        title : 'TMA',
        name : 'Triangular Moving Average',
        config : [
        
            {
                configname : 'windowsize',
                label : 'Window Size',
                type : 'number',
                value : 20
            },
            {
                configname : 'charttype',
                label : 'Chart Type',
                type : 'dropdown',
                options : ['Line Chart','Area Chart','Bar Chart','Step Line Chart'],
                value : 'Line Chart'
            },
            {
                configname : 'stroke',
                label : 'Color',
                type : 'colorpicker',
                value : '#f1c40f'
            },
            {
                configname : 'hide',
                label : 'Hide Indicator',
                type : 'checkbox',
                value : false
            },
            {
                configname : 'pricelabel',
                label : 'Price Label',
                type : 'checkbox',
                value : true
            },
            {
                configname : 'stocklabel',
                label : 'Stock Label',
                type : 'checkbox',
                value : true
            }
            
        ]
    },
    {
        title : 'BB',
        name : 'Bollinger Bands',
        config : [
            {
                configname : 'windowsize',
                label : 'Window Size',
                type : 'number',
                value : 20
            },
            {
                configname : 'topstroke',
                label : 'Top Stroke',
                type : 'colorpicker',
                value : '#0097e6'
            },
            {
                configname : 'middlestroke',
                label : 'Middle Stroke',
                type : 'colorpicker',
                value : '#2e86de'
            },
            {
                configname : 'bottomstroke',
                label : 'Bottom Stroke',
                type : 'colorpicker',
                value : '#0097e6'
            },
            {
                configname : 'fillcolor',
                label : 'Fill Color',
                type : 'colorpicker',
                value : '#48dbfb'
            },
            {
                configname : 'hide',
                label : 'Hide Indicator',
                type : 'checkbox',
                value : false
            },
            {
                configname : 'pricelabel',
                label : 'Price Label',
                type : 'checkbox',
                value : true
            },
            {
                configname : 'stocklabel',
                label : 'Stock Label',
                type : 'checkbox',
                value : true
            }
            
        ]
    },
    {
        title : 'MACD',
        name : 'Moving Average Convergence/Divergence',
        config : [
            {
                configname : 'fastlength',
                label : 'Fast Length',
                type : 'number',
                value : 10
            },
            {
                configname : 'slowlength',
                label : 'Slow Length',
                type : 'number',
                value : 26
            },
            {
                configname : 'signal',
                label : 'Signal Smoothing',
                type : 'number',
                value : 9
            },
            {
                configname : 'macdline',
                label : 'MACD Line',
                type : 'colorpicker',
                value : '#1dd1a1'
            },
            {
                configname : 'signalline',
                label : 'Signal Line',
                type : 'colorpicker',
                value : '#ee5253'
            },
            {
                configname : 'divergence',
                label : 'Divergence',
                type : 'colorpicker',
                value : '#00a0e3'
            },
            {
                configname : 'hide',
                label : 'Hide Indicator',
                type : 'checkbox',
                value : false
            },
            {
                configname : 'pricelabel',
                label : 'Price Label',
                type : 'checkbox',
                value : true
            },
            {
                configname : 'stocklabel',
                label : 'Stock Label',
                type : 'checkbox',
                value : true
            }
            
        ]
    },
    {
        title : 'RSI',
        name : 'Relative Strength Index',
        config : [
        
            {
                configname : 'windowsize',
                label : 'Window Size',
                type : 'number',
                value : 10
            },
            {
                configname : 'upperband',
                label : 'Upper Band',
                type : 'number',
                value : 70
            },
            {
                configname : 'middleband',
                label : 'Middle Band',
                type : 'number',
                value : 50
            },
            {
                configname : 'lowerband',
                label : 'Lower Band',
                type : 'number',
                value : 30
            },
            {
                configname : 'outsidethreshold',
                label : 'Outside Threshold',
                type : 'colorpicker',
                value : '#ee5253'
            },
            {
                configname : 'insidethreshold',
                label : 'Inside Threshold',
                type : 'colorpicker',
                value : '#1dd1a1'
            },
            {
                configname : 'hide',
                label : 'Hide Indicator',
                type : 'checkbox',
                value : false
            },
            {
                configname : 'pricelabel',
                label : 'Price Label',
                type : 'checkbox',
                value : true
            },
            {
                configname : 'stocklabel',
                label : 'Stock Label',
                type : 'checkbox',
                value : true
            }
            
        ]
    },
    {
        title : 'ATR',
        name : 'Average True Range',
        config : [
        
            {
                configname : 'windowsize',
                label : 'Window Size',
                type : 'number',
                value : 10
            },
            {
                configname : 'charttype',
                label : 'Chart Type',
                type : 'dropdown',
                options : ['Line Chart','Area Chart','Bar Chart','Step Line Chart'],
                value : 'Line Chart'
            },
            {
                configname : 'stroke',
                label : 'Color',
                type : 'colorpicker',
                value : '#f1c40f'
            },
            {
                configname : 'hide',
                label : 'Hide Indicator',
                type : 'checkbox',
                value : false
            },
            {
                configname : 'pricelabel',
                label : 'Price Label',
                type : 'checkbox',
                value : true
            },
            {
                configname : 'stocklabel',
                label : 'Stock Label',
                type : 'checkbox',
                value : true
            }
            
        ]
    },
    {
        title : 'SOSlow',
        name : 'Stochastic Oscillator (Slow)',
        config : [
        
            {
                configname : 'windowsize',
                label : 'Window Size',
                type : 'number',
                value : 10
            },
            {
                configname : 'kwindowsize',
                label : 'K Window Size',
                type : 'number',
                value : 3
            },
            {
                configname : 'dline',
                label : 'D Line',
                type : 'colorpicker',
                value : '#ee5253'
            },
            {
                configname : 'kline',
                label : 'K Line',
                type : 'colorpicker',
                value : '#1dd1a1'
            },
            {
                configname : 'hide',
                label : 'Hide Indicator',
                type : 'checkbox',
                value : false
            },
            {
                configname : 'pricelabel',
                label : 'Price Label',
                type : 'checkbox',
                value : true
            },
            {
                configname : 'stocklabel',
                label : 'Stock Label',
                type : 'checkbox',
                value : true
            }
            
        ]
    },
    {
        title : 'SOFast',
        name : 'Stochastic Oscillator (Fast)',
        config : [
        
            {
                configname : 'windowsize',
                label : 'Window Size',
                type : 'number',
                value : 10
            },
            {
                configname : 'kwindowsize',
                label : 'K Window Size',
                type : 'number',
                value : 1
            },
            {
                configname : 'dline',
                label : 'D Line',
                type : 'colorpicker',
                value : '#ee5253'
            },
            {
                configname : 'kline',
                label : 'K Line',
                type : 'colorpicker',
                value : '#1dd1a1'
            },
            {
                configname : 'hide',
                label : 'Hide Indicator',
                type : 'checkbox',
                value : false
            },
            {
                configname : 'pricelabel',
                label : 'Price Label',
                type : 'checkbox',
                value : true
            },
            {
                configname : 'stocklabel',
                label : 'Stock Label',
                type : 'checkbox',
                value : true
            }
            
        ]
    },
    {
        title : 'SOFull',
        name : 'Stochastic Oscillator (Full)',
        config : [
        
            {
                configname : 'windowsize',
                label : 'Window Size',
                type : 'number',
                value : 10
            },
            {
                configname : 'kwindowsize',
                label : 'K Window Size',
                type : 'number',
                value : 3
            },
            {
                configname : 'dwindowsize',
                label : 'D Window Size',
                type : 'number',
                value : 4
            },
            {
                configname : 'dline',
                label : 'D Line',
                type : 'colorpicker',
                value : '#ee5253'
            },
            {
                configname : 'kline',
                label : 'K Line',
                type : 'colorpicker',
                value : '#1dd1a1'
            },
            {
                configname : 'hide',
                label : 'Hide Indicator',
                type : 'checkbox',
                value : false
            },
            {
                configname : 'pricelabel',
                label : 'Price Label',
                type : 'checkbox',
                value : true
            },
            {
                configname : 'stocklabel',
                label : 'Stock Label',
                type : 'checkbox',
                value : true
            }
            
        ]
    },
    {
        title : 'FI',
        name : 'Force Index',
        config : [
            {
                configname : 'stroke',
                label : 'Color',
                type : 'colorpicker',
                value : '#2e86de'
            },
            {
                configname : 'fillcolor',
                label : 'Fill Color',
                type : 'colorpicker',
                value : '#48dbfb'
            },
            {
                configname : 'hide',
                label : 'Hide Indicator',
                type : 'checkbox',
                value : false
            },
            {
                configname : 'pricelabel',
                label : 'Price Label',
                type : 'checkbox',
                value : true
            },
            {
                configname : 'stocklabel',
                label : 'Stock Label',
                type : 'checkbox',
                value : true
            }
            
        ]
    },
    {
        title : 'ERI',
        name : 'Elder Ray Indicator',
        config : [
            {
                configname : 'bullpower',
                label : 'Bull Power Color',
                type : 'colorpicker',
                value : '#1dd1a1'
            },
            {
                configname : 'bearpower',
                label : 'Bear Power Color',
                type : 'colorpicker',
                value : '#ee5253'
            },
            {
                configname : 'hide',
                label : 'Hide Indicator',
                type : 'checkbox',
                value : false
            },
            {
                configname : 'pricelabel',
                label : 'Price Label',
                type : 'checkbox',
                value : true
            },
            {
                configname : 'stocklabel',
                label : 'Stock Label',
                type : 'checkbox',
                value : true
            }
            
        ]
    },
    {
        title : 'ERIBull',
        name : 'Elder Ray Indicator Bull Power',
        config : [
            {
                configname : 'bullpower',
                label : 'Bull Power Color',
                type : 'colorpicker',
                value : '#1dd1a1'
            },
            {
                configname : 'hide',
                label : 'Hide Indicator',
                type : 'checkbox',
                value : false
            },
            {
                configname : 'pricelabel',
                label : 'Price Label',
                type : 'checkbox',
                value : true
            },
            {
                configname : 'stocklabel',
                label : 'Stock Label',
                type : 'checkbox',
                value : true
            }
            
        ]
    },
    {
        title : 'ERIBear',
        name : 'Elder Ray Indicator Bear Power',
        config : [
            {
                configname : 'bearpower',
                label : 'Bear Power Color',
                type : 'colorpicker',
                value : '#ee5253'
            },
            {
                configname : 'hide',
                label : 'Hide Indicator',
                type : 'checkbox',
                value : false
            },
            {
                configname : 'pricelabel',
                label : 'Price Label',
                type : 'checkbox',
                value : true
            },
            {
                configname : 'stocklabel',
                label : 'Stock Label',
                type : 'checkbox',
                value : true
            }
            
        ]
    },
];

function setIndicatorConfig(indicator,option,value)
{

    // console.log('SMA')
    let indicatorindx = IndicatorConfig.findIndex(ind=> ind.title === indicator);

    // console.log(IndicatorConfig[indicatorindx]['config']);

    if(indicatorindx!== -1)
    {
        let IndicatorOptions = IndicatorConfig[indicatorindx];

        let config = IndicatorOptions['config'];

        let optionindx = config.findIndex((c)=> c.configname === option);

        if(optionindx!== -1)
        {
            config[optionindx]['value'] = value;
        }

        IndicatorOptions['config'] = config; 

        IndicatorConfig[indicatorindx] = IndicatorOptions;

        // console.log(IndicatorConfig[indicatorindx]['config']);
        
    }

}

function getConfigValue(config,option)
{
    let obj = config.find((c) => c.configname === option);

    return obj && obj!== null ? obj['value'] : null;
}

function getIndicatorConfig(indicator)
{
    let data = {}
    let IndicatorOptions = IndicatorConfig.find(ind => ind.title === indicator);
    const config = IndicatorOptions['config'];

    config.forEach((c,indx)=>{
        data[c.configname] = c.value;
    })

    return data;
}

function setIndicator(indicator,indicatorOptions)
{
    let indicatorindx = IndicatorConfig.findIndex(ind=> ind.title === indicator);

    if(indicatorindx !== -1)
    {
        IndicatorConfig[indicatorindx] = indicatorOptions;
    }
}




export {IndicatorConfig,setIndicator,setIndicatorConfig,getConfigValue,getIndicatorConfig}