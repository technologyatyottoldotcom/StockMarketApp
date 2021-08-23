import { ema, wma, sma, tma , bollingerBand , macd , rsi , atr , stochasticOscillator , forceIndex, elderRay , elderImpulse , sar , change , compare} from "react-stockcharts/lib/indicator";
import {LineSeries,AreaSeries,BarSeries,CandlestickSeries,ScatterSeries ,OHLCSeries,KagiSeries,RenkoSeries,PointAndFigureSeries, SquareMarker,CircleMarker , BollingerSeries , MACDSeries , RSISeries ,StochasticSeries ,StraightLine ,ElderRaySeries , SARSeries , VolumeProfileSeries} from 'react-stockcharts/lib/series';
import { IndicatorConfig,getIndicatorConfig } from "./IndicatorConfig";


const SMAConfig = getIndicatorConfig('SMA');
console.log(SMAConfig)

const SMA = sma()
        .options({windowSize : 20 , sourcePath: "close"})
        .skipUndefined(true)
        .merge((d,c) => {d.sma = c;})
        .accessor(d => d.sma)
        .stroke('#1dd1a1');

const WMA = wma()
        .options({windowSize : 20 , sourcePath: "close"})
        .skipUndefined(true)
        .merge((d,c) => {d.wma = c;})
        .accessor(d => d.wma)
        .stroke('#ee5253');

const EMA = ema()
        .options({windowSize : 20 , sourcePath: "close"})
        .skipUndefined(true)
        .merge((d,c) => {d.ema = c;})
        .accessor(d => d.ema)
        .stroke('#ff9f43');

const TMA = tma()
        .options({windowSize : 20 , sourcePath: "close"})
        .skipUndefined(true)
        .merge((d,c) => {d.tma = c;})
        .accessor(d => d.tma)
        .stroke('#f1c40f');

const BB = bollingerBand()
        .options({windowSize : 20 , sourcePath: "close"})
        .skipUndefined(true)
		.merge((d, c) => {d.bb = c;})
        .accessor(d => d.bb);
            
const macdCalculator = macd()
			.options({
				fast: 10,
				slow: 26,
				signal: 9,
			})
			.merge((d, c) => {d.macd = c;})
            .accessor(d => d.macd);
        
const rsiCalculator = rsi()
			.options({ windowSize: 10 })
			.merge((d, c) => {d.rsi = c;})
            .accessor(d => d.rsi);
            
const atrCalculator = atr()
			.options({ windowSize: 10 })
			.merge((d, c) => {d.atr = c;})
            .accessor(d => d.atr);
            
const slowSTO = stochasticOscillator()
			.options({ windowSize: 10, kWindowSize: 3 })
			.merge((d, c) => {d.slowSTO = c;})
            .accessor(d => d.slowSTO);
            
const fastSTO = stochasticOscillator()
			.options({ windowSize: 10, kWindowSize: 1 })
			.merge((d, c) => {d.fastSTO = c;})
            .accessor(d => d.fastSTO);
            
const fullSTO = stochasticOscillator()
			.options({ windowSize: 10, kWindowSize: 3, dWindowSize: 4 })
			.merge((d, c) => {d.fullSTO = c;})
            .accessor(d => d.fullSTO);
            
const fi = forceIndex()
			.merge((d, c) => {d.fi = c;})
            .accessor(d => d.fi);
            
const fiEMA = ema()
			.id(1)
			.options({ windowSize: 10, sourcePath: "fi" })
			.merge((d, c) => {d.fiEMA13 = c;})
            .accessor(d => d.fiEMA13);

const elder = elderRay();

const elderImpulseCalculator = elderImpulse()
			.macdSource(macdCalculator.accessor())
            .emaSource(EMA.accessor());
            
const defaultSar = sar()
			.options({
                accelerationFactor : 0.02, 
                maxAccelerationFactor : 0.2
			})
			.merge((d, c) => {d.sar = c;})
            .accessor(d => d.sar);
            
const changeCalculator = change();


const compareCalculator = compare()
        .options({
            basePath : 'close',
            mainKeys : ['open','high','low','close'],
            compareKeys : ['close','IBMClose']
        })
        .accessor(d => d.compare)
		.merge((d, c) => { d.compare = c; });



function getIndicatorData(indicator,chartdata)
{
    let tempData,indicatorSeries,chartIndicatorY;

    switch(indicator)
    {
        case 'SMA':
            tempData = SMA(chartdata);
            chartIndicatorY = SMA.accessor();
            indicatorSeries =  <LineSeries yAccessor={SMA.accessor()} stroke={SMA.stroke()} strokeWidth ={2}/>;
            break;
        case 'WMA':
            tempData = WMA(chartdata);
            chartIndicatorY = WMA.accessor();
            indicatorSeries =  <LineSeries yAccessor={WMA.accessor()} stroke={WMA.stroke()} strokeWidth ={2}/>;
            break;
        case 'EMA':
            tempData = EMA(chartdata);
            chartIndicatorY = EMA.accessor();
            indicatorSeries =  <LineSeries yAccessor={EMA.accessor()} stroke={EMA.stroke()} strokeWidth ={2}/>;
            break;
        case 'TMA':
            tempData = TMA(chartdata);
            chartIndicatorY = TMA.accessor();
            indicatorSeries =  <LineSeries yAccessor={TMA.accessor()} stroke={TMA.stroke()} strokeWidth ={2}/>;
            break;
        case 'BB':
            tempData = BB(chartdata);
            chartIndicatorY = (d) =>[d.open,d.close];
            indicatorSeries =  <BollingerSeries yAccessor={d => d.bb} stroke={{top : '#c0392b' , middle : '#2c3e50' , bottom : '#c0392b'}} fill="#e67e22" opacity={0.5} />;
            break;
        case 'MACD':
            tempData = macdCalculator(chartdata);
            chartIndicatorY = macdCalculator.accessor();
            indicatorSeries = <MACDSeries yAccessor={d => d.macd} stroke={{macd : '#ff7675' , signal : '#00b894'}} fill={{divergence : '#3498db'}} width={3} zeroLineOpacity={0.8} widthRatio={1}/>;
            break;
        case 'RSI':
            tempData = rsiCalculator(chartdata);
            chartIndicatorY = [0,100];
            indicatorSeries = <RSISeries yAccessor={d => d.rsi} stroke={{line: "#000000" , top: "#000000" , middle: "#000000", bottom: "#000000", outsideThreshold: "#ff7675", insideThreshold: "#00b894"}} strokeWidth={{outsideThreshold : 2 , insideThreshold : 2 , top: 0.7, middle: 0.7, bottom: 0.7}}/>
            break;
        case 'ATR':
            tempData = atrCalculator(chartdata);
            chartIndicatorY = atrCalculator.accessor();
            indicatorSeries = <LineSeries yAccessor={atrCalculator.accessor()} stroke='#2ecc71' strokeWidth={2}/>
            break;
        case 'SOSlow':
            tempData = slowSTO(chartdata);
            chartIndicatorY = [0,100];
            indicatorSeries = <StochasticSeries yAccessor={d => d.slowSTO} stroke={{top : '#000000' , middle : '#000000' , bottom : '#000000' , dLine : '#e67e22' , kLine : '#1abc9c'}} refLineOpacity={0.7}/>;
            break;
        case 'SOFast':
            tempData = fastSTO(chartdata);
            chartIndicatorY = [0,100];
            indicatorSeries = <StochasticSeries yAccessor={d => d.fastSTO} stroke={{top : '#000000' , middle : '#000000' , bottom : '#000000' , dLine : '#e67e22' , kLine : '#1abc9c'}} refLineOpacity={0.7}/>
            break;
        case 'SOFull':
            tempData = fullSTO(chartdata);
            chartIndicatorY = [0,100];
            indicatorSeries = <StochasticSeries yAccessor={d => d.fullSTO} stroke={{top : '#000000' , middle : '#000000' , bottom : '#000000' , dLine : '#e67e22' , kLine : '#1abc9c'}} refLineOpacity={0.7}/>
            break;
        case 'FI':
            tempData = fiEMA(fi(chartdata));
            chartIndicatorY = fi.accessor();
            indicatorSeries = <>
                <AreaSeries baseAt={scale => scale(0)} yAccessor={fiEMA.accessor()} fill='#e67e22' stroke='#e74c3c' />
                <StraightLine yValue={0} />
            </>
            break;
        case 'ERI':
            tempData = elder(chartdata);  
            chartIndicatorY = [0,elder.accessor()];
            indicatorSeries = <ElderRaySeries yAccessor={elder.accessor()} bullPowerFill='#00b894' bearPowerFill='#ff7675' opacity={1} widthRatio={0.1}/>
            break;
        case 'ERIBull':
            tempData = elder(chartdata); 
            chartIndicatorY = [0,d => elder.accessor()(d) && elder.accessor()(d).bullPower];
            indicatorSeries = <>
                <BarSeries yAccessor={d => elder.accessor()(d) && elder.accessor()(d).bullPower} baseAt={(xScale, yScale, d) => yScale(0)} fill="#00b894" width={3} opacity={1} />
                <StraightLine yValue={0} />
            </> 
            break;
        case 'ERIBear':
            tempData = elder(chartdata); 
            chartIndicatorY = [0, d => elder.accessor()(d) && elder.accessor()(d).bearPower];
            indicatorSeries = <>
                <BarSeries yAccessor={d => elder.accessor()(d) && elder.accessor()(d).bullPower} baseAt={(xScale, yScale, d) => yScale(0)} fill="#ff7675" width={3} opacity={1} />
                <StraightLine yValue={0} />
            </> 
            break;
        case 'ERIMP':
            tempData = elderImpulseCalculator(macdCalculator(EMA(chartdata))); 
            chartIndicatorY = macdCalculator.accessor();
            indicatorSeries = <MACDSeries yAccessor={d => d.macd} stroke={{macd : '#ff7675' , signal : '#00b894'}} fill={{divergence : '#3498db'}} width={3} zeroLineOpacity={0.8} widthRatio={1}/>
            break;
        case 'PSAR':
            tempData = defaultSar(chartdata); 
            indicatorSeries = <SARSeries yAccessor={d => d.sar} fill={{
                falling: "#4682B4",
                rising: "#15EC2E",
            }}/>;
            break;
        case 'vlmp':
            tempData = EMA(chartdata);
            chartIndicatorY = [d => [d.high, d.low]];
            indicatorSeries = <VolumeProfileSeries fill='#000000'/>;
            break;
        default :
            break;

    }

    return [tempData,chartIndicatorY,indicatorSeries];

    
    
}

function getIndicatorSymbol(s)
{
    switch(s){
        case 'SMA':
            return SMA;
        case 'WMA':
            return WMA;
        case 'EMA':
             return EMA;
        case 'TMA':
            return TMA;
        case 'BB':
            return BB;
        case 'MACD':
            return macdCalculator;
        case 'RSI':
            return rsiCalculator;
        case 'ATR':
            return atrCalculator;
        case 'SOSlow':
            return slowSTO;
        case 'SOFast':
            return fastSTO;
        case 'SOFull':
            return fullSTO;
        case 'FI':
            return fiEMA;
        case 'ERI':
            return elder;
        case 'ERIBull':
            return elder;
        case 'ERIBear':
           return elder;
        case 'ERIMP':
           return elderImpulseCalculator;
        case 'PSAR':
            return defaultSar;
        case 'vlmp':
            return EMA;
        default :
            break;
    }
}

function getIndicatorSymbolData(s,data)
{
    switch(s){
        case 'SMA':
            return SMA(data);
        case 'WMA':
            return WMA(data);
        case 'EMA':
             return EMA(data);
        case 'TMA':
            return TMA(data);
        case 'BB':
            return BB(data);
        case 'MACD':
            return macdCalculator(data);
        case 'RSI':
            return rsiCalculator(data);
        case 'ATR':
            return atrCalculator(data);
        case 'SOSlow':
            return slowSTO(data);
        case 'SOFast':
            return fastSTO(data);
        case 'SOFull':
            return fullSTO(data);
        case 'FI':
            return fiEMA(fi(data));
        case 'ERI':
            return elder(data);
        case 'ERIBull':
            return elder(data);
        case 'ERIBear':
           return elder(data);
        case 'ERIMP':
           return elderImpulseCalculator(macdCalculator(EMA(data)));
        case 'PSAR':
            return defaultSar(data);
        case 'vlmp':
            return ema;
        default :
            break;
    }
}

function CalculateIndicatorData(indicators,chartdata)
{
    let data = chartdata;
    indicators.map((i,indx)=>{
        data = getIndicatorSymbolData(i,data);
    });
    
    return data;
}

function getMaxArray(indicators)
{

    let maxArray = [];
    indicators.map((i,indx)=>{
        maxArray.push(getIndicatorSymbol(i));
    });

    console.log(maxArray);

    return maxArray;
}


export {SMA,WMA,EMA,TMA,BB,macdCalculator,rsiCalculator,atrCalculator,slowSTO,fastSTO,fullSTO,fi,fiEMA,elder,elderImpulseCalculator,defaultSar,changeCalculator,compareCalculator,getIndicatorData,getMaxArray,CalculateIndicatorData}