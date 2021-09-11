import React, { Component } from 'react';
import Axios from 'axios';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css


import PortfolioSearchBar from '../PortfolioComponents/SearchBar';
import RightArrow from '../../../../assets/icons/RightArrow.svg';
import UpArrow from '../../../../assets/icons/UpArrow.svg';
import DownArrow from '../../../../assets/icons/DownArrow.svg';
import LeftArrow from '../../../../assets/icons/LeftArrow.svg';
import StockMan from '../../../../assets/icons/undraw_Stock_prices_re_js33.svg';
import Cross from '../../../../assets/icons/cross.svg';
import {Alert} from '../../CustomChartComponents/CustomAlert/CustomAlert';
import download from '../../../../stockImport.csv'
import Pulse from '../../../Loader/Pulse'
// import { PiChart, PositiveAndNegativeBarChart, BaseLine } from '../PortfolioBoxonents/PerformanceAnalyticsCharts'
import BackTestResult from './BackTestResult';

const REQUEST_BASE_URL = process.env.REACT_APP_REQUEST_BASE_URL;


class AddBackTestStock extends Component {

    constructor(props) {
        super(props);
        this.state = {
            active: true,
            data: [],
            isBacktesting: false,
            isIndexLoaded : false,
            table1 : [],
            table2 : [],
            table3 : [],
            index : [],
            opacityMsg: true,
        }

        this.Name = this.Name.bind(this);
        this.TBody = this.TBody.bind(this);
        this.TFooter = this.TFooter.bind(this);
        this.CsvRow = this.CsvRow.bind(this);
        this.BackTestSection = this.BackTestSection.bind(this);
        this.addTableRow = this.addTableRow.bind(this)
        this.addPortfolioWeight = this.addPortfolioWeight.bind(this)
        this.importFile = this.importFile.bind(this)
        this.deleteStock = this.deleteStock.bind(this)
        this.BackTest = this.BackTest.bind(this)
        this.changeOpacityMsg = this.changeOpacityMsg.bind(this)
        this.confirmBox = this.confirmBox.bind(this);
        this.TopSection = this.TopSection.bind(this);
    }


    componentDidMount(){

        let { portfolios, createdDate } = this.props.state;

        if(portfolios.length > 0){
            portfolios.forEach(element => {
                element.PortfolioWeight = parseFloat(element.PortfolioWeight);
            });
        }else{
            portfolios = [{StockCode: 'CASH', StockName: 'Cash', PortfolioWeight: '100', isin: 'Cash', dateCreated: new Date(createdDate)}]
        }


        this.setState({ data: portfolios });
    }


    TopSection() {
        return <div className="smallcase__strategy__header">
           <span>Create Smallcase Strategy</span>
           <div onClick={this.props.smallCaseHome}>
               <img src={LeftArrow} alt="LeftArrow" style={{width: 11, marginRight: 2}} />
               <span>Back</span>
           </div>
       </div>
   }

    THead() {
        return(
            <div className="table__row">
                <div key={0}>Name</div>
                <div key={1}>Port. Wt (%)</div>
                <div key={2}></div>
            </div>
        )

    }

    TBody({ style, addPortfolioWeight }) {

        const data = this.state.data;

        let table = [];

        data.map((v, i) => {
            table.push(
                <div className="table__row">
                    <div>
                        <this.Name name={v.StockCode} fullName={v.StockName} />
                    </div>
                    <div>
                        <input className="backtest_portfolio_input" 
                                onChange={e=> addPortfolioWeight(e, i)}
                                value={v.PortfolioWeight} />
                    </div>
                    <div>
                        {v.StockCode=="CASH" ?
                            <span style={{fontSize:11, color: '#8e8e8e', fontWeight: 600, marginLeft: '1ch'}}>{`(min 2%)`}</span>
                            :
                            <span className="stock__remove" onClick={()=> this.deleteStock(i)}>
                                <img src={Cross} alt="cross"/>
                            </span>}
                    </div>
                </div>
            )
        })

        return table;
    }

    TFooter()
    {
        let weightSum = 0;
        for(let i=0; i<this.state.data.length; i++){
            weightSum += parseFloat(this.state.data[i].PortfolioWeight);
        }

        return (
            <div className="table__row">
                <div>
                    Total
                </div>
                <div>
                    {weightSum}
                    <span style={{fontSize:9, color: '#8e8e8e', fontWeight: 600 , display : 'block'}}>Needs to add to 100%</span>
                </div>
                <div></div>
            </div>
        )
    }

    Name({ name, fullName }) {
        return (
            <>
                <div className="strategy__table__stock">
                    <span className="strategy__table__stock__code">{name}</span>
                    <span className="strategy__table__stock__name">{fullName}</span>
                </div>
            </>)
    }


    CsvRow({importFile}){

        return(
            <div className="strategy__stock__buttons">
                <div onClick={importFile}>
                    Import csv
                    <img src={UpArrow} alt="UpArrow" style={{width: 10, marginLeft: 2}} />
                </div>
                <div>
                    <a style={{textDecoration: 'none', color:'black'}} href={download} download="format.csv">Download Format</a>
                    <img src={DownArrow} alt="DownArrow" style={{width: 10, marginLeft: 2}} />
                </div>
            </div>
        )
    }



    BackTestSection(){

        const { backTestResult } = this.props.state;

        return(
            <div className="strategy__performance__buttons" style={{ fontSize: 13, marginTop: 10}}>
                <div onClick={this.BackTest}>
                    Run Backtest
                    <img src={RightArrow} alt="RightArrow"/>
                </div>
                <div style={{cursor: backTestResult.length>0? 'not-allowed':'pointer', opacity: backTestResult.length>0? 0.3:1}}
                    onClick={()=> {
                        if(backTestResult.length<=0) this.confirmBox('Are you sure, you want to save smallCase portfolio without running backtest? If you say yes, then your previous portfolio, if any, will be overridden.')
                    }}>
                    Proceed Without Backtest
                    <img src={RightArrow} alt="RightArrow" />
                </div>
            </div>
        )
    }


    deleteStock(index){
        let {data} = this.state;

        let deleteStockWeight = parseFloat(data[index].PortfolioWeight);

        let weightSum = 0;
        for(let i=0; i<data.length; i++)     weightSum += parseFloat(data[i].PortfolioWeight);

        if(weightSum-deleteStockWeight <= 100)
            data[0].PortfolioWeight += 100-(weightSum-deleteStockWeight);

        data.splice(index, 1);

        this.setState({data})
    }


    addTableRow(stock){

        let {data} = this.state;
        
        let code = (stock.exchange.exchange.toLowerCase()=='nse')? stock.nse_code : stock.bse_code;

        if(!(data.map(el => el.StockCode).includes(code))){
            const obj = {
                StockCode: code,
                StockName: stock.name,
                PortfolioWeight: "0",
                isin: stock.isin,
                dateCreated: data[0].dateCreated
            }
    
            data.push(obj);
            this.setState({data});
        }

        console.log(this.state.data)
    }


    addPortfolioWeight(e, index){

        let {data} = this.state;

        if(index!=0){
            
            const oldVal = data[index].PortfolioWeight==""||data[index].PortfolioWeight=="."? 0:parseFloat(data[index].PortfolioWeight);
            const newVal = e.target.value==""||e.target.value=="."? 0:parseFloat(e.target.value);
            const diff = newVal-oldVal;

            let weightSum = 0;
            for(let i=0; i<data.length; i++)     weightSum += parseFloat(data[i].PortfolioWeight);

            data[index].PortfolioWeight = newVal;

            if(weightSum <= 100){
                if((parseFloat(data[0].PortfolioWeight)-diff>=2 && Math.abs(diff)>=0.1) || (diff<0)){
                    data[0].PortfolioWeight = parseFloat(data[0].PortfolioWeight)-diff;
                    data[index].PortfolioWeight = newVal;
                }else{
                    data[index].PortfolioWeight = oldVal;
                }
            }else{
                if(diff <= 0){
                    if(weightSum+diff>=100){
                        if(Math.abs(diff)>=0.1)
                            data[index].PortfolioWeight = newVal;
                        else
                            data[index].PortfolioWeight = oldVal;
                    }
                    else{
                        if(Math.abs(diff)>=0.1){
                            data[0].PortfolioWeight = data[0].PortfolioWeight+(100-(weightSum+diff));
                            data[index].PortfolioWeight = newVal;
                        }
                        else
                            data[index].PortfolioWeight = oldVal;
                    }
                }
                else
                    data[index].PortfolioWeight = oldVal;
            }


            if(e.target.value.charAt(e.target.value.length-1)=="."){
                if(e.target.value.charAt(e.target.value.length-2)=="."){
                    data[index].PortfolioWeight = newVal.toString()+"."
                }else{
                    data[index].PortfolioWeight = e.target.value;
                }
            }
        }

        this.setState({ data: data }); 
    }


    importFile(e){
        e.preventDefault();
        const fileSelector = document.createElement('input');
        fileSelector.setAttribute('type', 'file');
        fileSelector.setAttribute('accept', '.csv, .xls, .xlsx');
        fileSelector.click();

        fileSelector.onchange = (evt) => {

            const file = evt.target.files[0];
            const reader = new FileReader();

            reader.readAsBinaryString(file);
            reader.onload = (event) => {
                const doc = event.target.result;
                this.validateCsv(doc);
            };
        }
    }


    async validateCsv(doc){
        let row = doc.split('\r\n');
        if(row[row.length-1]=="")   row.pop();

        let newData = [];

        let col = row[0].split(',');

        if(col[0]!="STOCKCODE"||col[1]!="WEIGHT%"){
            this.displayAlert("File import not in correct format.");
            return;
        }
        else{

            col = row[1].split(',');
            if(col[0]!="CASH"){
                this.displayAlert("CASH needs to be in first row.");
                return;
            }
            else if(parseFloat(col[1])<2){
                this.displayAlert("Minimum CASH percentage cannot be less than 2%.");
                return;
            }else{

                for(let i=1; i<row.length; i++){     
                    col = row[i].split(',');
                    if(isNaN(parseFloat(col[1])))   continue;

                    newData.push({
                        StockCode: col[0],
                        PortfolioWeight: parseFloat(col[1])
                    })
                }
            }


        }

        let weightSum = 0;
        for(let i=0; i<newData.length; i++)     weightSum += parseFloat(newData[i].PortfolioWeight);

        if(weightSum != 100)
            this.displayAlert("Total weight must be 100%.")
        else{
            newData = (await Axios.post(`${REQUEST_BASE_URL}/validate_import`, newData)).data.portfolio;
            if(!newData)
                this.displayAlert("Please check the STOCKCODE and try again.");
            else
                this.setState({ data: newData })
        }


        console.log(this.state.data)
    }

    async BackTest(){

        const {data} = this.state;
        let { frequency, benchmark } = this.props.state;

        let weightSum = 0;
        for(let i=0; i<data.length; i++)     weightSum += parseFloat(data[i].PortfolioWeight);

        if(weightSum!=100){
            this.displayAlert("Total weight must be 100%");
            return;
        }
        else if(data[0].StockCode!='Cash'&&data[0].StockCode!='CASH'){
            this.displayAlert("CASH needs to be in first row.");
            return;
        }
        else if(parseFloat(data[0].PortfolioWeight)<2){
            this.displayAlert("Minimum CASH percentage cannot be less than 2%.");
            return;
        }
        else if(data.length<3){
            this.displayAlert("Number of stocks must be atleast 3. Please add/import some stocks.");
            return;
        }

        this.setState({ isBacktesting: true });
        this.changeOpacityMsg();

        let result = (await Axios.post(`${REQUEST_BASE_URL}/backtest`, {data: data, benchmark: benchmark, frequency: frequency})).data

        if(!result.status){
            let msg = "";
            for(let i=0; i<result.STOCKCODE.length; i++)   msg += (i==result.STOCKCODE.length-1)? result.STOCKCODE[i] : result.STOCKCODE[i]+", ";
            this.displayAlert("STOCKCODE: "+msg+" does not have data for backtest. Minimum years for each stock must be 3 years.");
        }
        else{
            this.setState({
                isIndexLoaded: true,
                index: result.indexObj,
                table1: result.table1,
                table2: result.table2,
                table3: result.table3,
            })
        }

        this.setState({ isBacktesting: false });
    }

    async savePortfolio(){

        let pan = 'ALQPD7054E';
        const { isStrategyExist, createdDate, strategy, methodology, objective, frequency, benchmark, price } = this.props.state;
        const portfolio = this.state.data;
        const withBacktest = false;
        const index = null;
        let success = (await Axios.post(`${REQUEST_BASE_URL}/update_smallCase_details`,
            { isStrategyExist, createdDate, pan, strategy, methodology, objective, frequency, benchmark, price, portfolio, withBacktest, index })).data.success;
        
        if(success) this.setState({ active: false });
    }

    confirmBox(msg){
        confirmAlert({
            title: 'Confirmation',
            message: msg,
            buttons: [
                {   label: 'Yes',
                    onClick: () => { this.savePortfolio() }
                },
                {   label: 'No',
                    onClick: () => { return }
                }
            ]
        })
    }


    displayAlert = (msg) => {
        console.log('hello');
        Alert({
            TitleText : 'Warning',
            Message : msg,
            AutoClose : {
                Active : true,
                Line : true,
                LineColor : '#00a0e3',
                Time : 3
            }
        })
    }

    changeOpacityMsg(){

        let displayOpacity = setInterval(() => {
            if(!this.state.isBacktesting){
                clearInterval(displayOpacity)
            }
            else{
                this.setState({opacityMsg: (this.state.opacityMsg==false)? true: false})
            }
        }, 1500);
    }

    
    render() {

        if(!this.state.active)
            return(
                <div>
                    <div className="smallcase__strategy__container" style={{fontWeight: 900, fontSize: 12}}>   
                            <div className="smallcase__strategy__header">
                                <span>Create Smallcase Strategy</span>
                                <div onClick={this.props.smallCaseHome}>
                                    <img src={LeftArrow} alt="LeftArrow" style={{width: 11, marginRight: 2}} />
                                    <span>Back</span>
                                </div>
                            </div>
                        </div>
                    <div className="smallcase__success__page">
                        <div>
                            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                                <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                            </svg>
                        </div>
                        <span className="success__message">SmallCase Portfolios Updated Successfully</span>
                    </div>
                </div>)

        return (
            <>
                {!this.state.isIndexLoaded?
                    <div className="smallcase__strategy__container" style={{ fontSize: 11 }}>
                        <this.TopSection />

                        {!this.state.isBacktesting?

                            <div className="smallcase__strategy__body__wrapper">
                                <div className="strategy__portfolio__table__wrapper">

                                    <div className="strategy__portfolio__table">
                                        <div className="strategy__portfolio__table__header">
                                            <this.THead />
                                        </div>
                                        <div className="strategy__portfolio__table__body">
                                            <this.TBody  addPortfolioWeight={this.addPortfolioWeight}/>
                                        </div>
                                        <div className="strategy__portfolio__table__footer">
                                            <this.TFooter />
                                        </div>  
                                    </div>

                                    <this.BackTestSection />


                                </div>
                                
                                <div className="strategy__portfolio__stock__wrapper">
                                    <div className="strategy__portfolio__stock__options">
                                        <PortfolioSearchBar addTableRow={this.addTableRow}/>
                                        <this.CsvRow importFile={this.importFile}/>
                                    </div>

                                    <img src={StockMan} alt="StockMan"/>
                                </div>

                            </div>
                            
                        :
                            <div style={{minHeight: 500, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <div style={{display: 'flex', justifyContent: 'content', alignItems: 'center', flexDirection: 'column'}}>
                                    <Pulse />
                                    <p style={{fontSize: 15}} className={this.state.opacityMsg?'fadeIn':'fadeOut'}>Backtesting...</p>
                                </div>
                            </div>
                        }
                    </div>
                :
                    <BackTestResult
                        state={this.props.state}
                        portfolio={this.state.data}
                        index={this.state.index}
                        table1={this.state.table1}
                        table2={this.state.table2}
                        table3={this.state.table3}
                        createdOrModified={() => this.setState({ active: false })}
                        backButton={()=> this.setState({ isIndexLoaded: false })} />
                }
            </>
        );
    }
}


export default AddBackTestStock;