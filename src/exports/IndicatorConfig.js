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
    }
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



module.exports = {IndicatorConfig,setIndicatorConfig}