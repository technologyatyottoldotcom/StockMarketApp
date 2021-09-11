import React, { Component } from 'react';
import Axios from 'axios';

import Pulse from '../../../Loader/Pulse';
import LeftArrow from '../../../../assets/icons/LeftArrow.svg';
import StockMan from '../../../../assets/icons/undraw_Stock_prices_re_js33.svg';
import Cross from '../../../../assets/icons/cross.svg';
import {Alert} from '../../CustomChartComponents/CustomAlert/CustomAlert';
import PortfolioSearchBar from '../PortfolioComponents/SearchBar';

const REQUEST_BASE_URL = process.env.REACT_APP_REQUEST_BASE_URL;

class EditPortfolios extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            data: [],
            active: true
        }

        this.TBody = this.TBody.bind(this);
        this.THead = this.THead.bind(this);
        this.TFooter = this.TFooter.bind(this);
        this.TopSection = this.TopSection.bind(this);
        this.deleteStock = this.deleteStock.bind(this);
        this.addPortfolioWeight = this.addPortfolioWeight.bind(this);
        this.addTableRow = this.addTableRow.bind(this);
        this.UpdatePortfolio = this.UpdatePortfolio.bind(this);
    }


    async componentDidMount(){
        const {strategy} = this.props;
        let pan = 'ALQPD7054E'
        const response = (await Axios.post(`${REQUEST_BASE_URL}/fetch_smallCase_portfolios`, {strategy, pan })).data
        console.log(response.portfolio);
        this.setState({
            isLoaded: true,
            data: response.portfolio
        })
    }


    TopSection() {
        return <div className="smallcase__strategy__header">
            <span>Edit Smallcase Strategy</span>
            <div onClick={this.props.backButton}>
                <img src={LeftArrow} alt="LeftArrow" style={{width: 11, marginRight: 2}} />
                <span>Back</span>
            </div>
        </div>
    }

    THead() {
        return(
            <div className="edit__table__row">
                <div key={0}>Name</div>
                <div key={1}>Old Wt (%)</div>
                <div key={2}>New Wt (%)</div>
                <div key={3}></div>
            </div>
        )

    }

    TBody({ style, addPortfolioWeight }) {

        const data = this.state.data;

        let table = [];

        data.map((v, i) => {
            table.push(
                <div className="edit__table__row">
                    <div>
                        <this.Name name={v.StockCode} fullName={v.StockName} />
                    </div>
                    <div> {v.OldWeight}</div>
                    <div >
                        <input className="backtest_portfolio_input"
                                onChange={e=> addPortfolioWeight(e, i)}
                                value={v.PortfolioWeight}/>
                    </div>
                    <div>
                        {v.StockCode=="CASH"?
                            <span style={{fontSize:11, color: '#8e8e8e', fontWeight: 600, marginLeft: '1ch'}}>{`(min 2%)`}</span>
                            :
                            <span className="stock__remove"
                                onClick={()=> this.deleteStock(i)}><img src={Cross} alt="cross" style={{width: 8, height: 8}} /></span>}
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
            <div className="edit__table__row">
                <div>
                    Total
                </div>
                <div></div>
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


    deleteStock(index){
        let {data} = this.state;

        let deleteStockWeight = parseFloat(data[index].PortfolioWeight);
        
        let weightSum = 0;
        for(let i=0; i<data.length; i++)     weightSum += parseFloat(data[i].PortfolioWeight);

        console.log(weightSum)
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
                OldWeight: "0",
                isin: stock.isin,
                dateCreated: data[0].dateCreated
            }
    
            data.push(obj);
            this.setState({data});
        }
    }


    addPortfolioWeight(e, index){

        console.log(this.state);
        let { data } = this.state;

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


    async UpdatePortfolio(){

        let pan = 'ALQPD7054E';
        const { strategy } = this.props;
        const portfolio = this.state.data;
        let success = (await Axios.post(`${REQUEST_BASE_URL}/update_smallCase_portfolios`, { pan, strategy, portfolio })).data.success;
        
        if(success) this.setState({ active: false })
    }

    

    
    render() {

        let weightSum = 0;
        for(let i=0; i<this.state.data.length; i++)     weightSum += parseFloat(this.state.data[i].PortfolioWeight);

        if(!this.state.active)
            return(
                <div>
                    <div className="smallcase__strategy__container" style={{fontWeight: 900, fontSize: 12}}>   
                            <div className="smallcase__strategy__header">
                                <span>Edit Smallcase Strategy</span>
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
                {!this.state.isLoaded?
                    <div style={{minHeight: 500, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <div style={{display: 'flex', justifyContent: 'content', alignItems: 'center', flexDirection: 'column'}}>
                            <Pulse />
                            <p style={{fontSize: 15}} className={this.state.opacityMsg?'fadeIn':'fadeOut'}>Fetching...</p>
                        </div>
                    </div>
                :
                    <div className="smallcase__strategy__container" style={{ fontSize: 11 }}>
                        <this.TopSection />

                        <div className="smallcase__strategy__body__wrapper">
                            <div className="strategy__portfolio__table__wrapper">
                                <div className="strategy__portfolio__table">
                                    <div className="strategy__portfolio__table__header">
                                        <this.THead />
                                    </div>
                                    <div className="strategy__portfolio__table__body">
                                        <this.TBody addPortfolioWeight={this.addPortfolioWeight}/>
                                    </div>
                                    <div className="strategy__portfolio__table__footer">
                                        <this.TFooter />
                                    </div>  
                                </div>
                            </div>
                            <div className="strategy__portfolio__stock__wrapper">
                                    <div className="strategy__portfolio__stock__options">
                                        <PortfolioSearchBar addTableRow={this.addTableRow}/>
                                    </div>
                            </div>
                        </div>

                        <div className="smallcase__strategy__footer">
                            <div className="strategy__footer__button" onClick={this.UpdatePortfolio}>
                                Update Portfolios
                            </div>
                        </div>
                    </div>
                }
            </>
        );
    }
}

export default EditPortfolios;