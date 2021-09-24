import React from 'react';
import Axios from 'axios';
import $ from 'jquery';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import PortfolioView from './PortfolioView';
import WatchList from './WatchList';
import WatchlistPopup from '../AppPopups/WatchlistPopup/WatchlistPopup';
import CustomSelect from '../CustomChartComponents/CustomSelect/CustomSelect';
import '../../../css/CashPosition.css';


const REQUEST_BASE_URL = process.env.REACT_APP_REQUEST_BASE_URL;



class CashPosition extends React.PureComponent {

    constructor(props)
    {
        super(props);
        this.state={
            cashPosition : 'Watchlist',
            watchlistloaded : false,
            items: [],
            itemsLength: 0,
            popup : false,
            pan : 'ALQPD7054E',
            Portfolios: [],
        }

        this.addItem = this.addItem.bind(this);
        this.openPopup = this.openPopup.bind(this);
        this.closePopup = this.closePopup.bind(this)
        this.itemChangePosition = this.itemChangePosition.bind(this)
        this.deleteItem = this.deleteItem.bind(this)
        this.saveChangedName = this.saveChangedName.bind(this)
        this.confirmBox = this.confirmBox.bind(this);
    }

    async componentDidMount(){

        let { pan } = this.state;
        console.log(pan);
        let items = (await Axios.post(`${REQUEST_BASE_URL}/fetch_watchlist`, { pan })).data.watchlist;
        console.log(items);
        this.setState({
            items, itemsLength: items.length,watchlistloaded : true
        }, () => {
            this.saveItems()
        });

        Axios.get(`${REQUEST_BASE_URL}/fetch_portfolio`).then(response => {
            this.setState({ Portfolios: response.data });
        });
    }

    async saveItems(){
        let { pan } = this.state;
        this.runInterval = setInterval(async() => {
            let success = this.state.items.length>=1? (await Axios.post(`${REQUEST_BASE_URL}/push_watchlist`, { pan, items: this.state.items })).data.success: false;
            console.log('watchlist updated:' + success);
        }, 180000);

    }    

    LoadCashPosition(value)
    {
        this.setState({cashPosition : value}, ()=>{
            if(value==='Watchlist')  this.saveItems();
            else    this.runInterval && clearInterval(this.runInterval);
        })
    }


    addItem(item){
        let { items, itemsLength, pan } = this.state;
        let code = item.exchange.exchange=='NSE'? item.nse_code:item.bse_code;
        if(!(items.map(el => el.StockCode).includes(code))){
            items.push({
                StockCode: code,
                StockName: item.name,
                id: itemsLength+1
            })
        }
        Axios.post(`${REQUEST_BASE_URL}/push_watchlist`, { pan, items })
        this.setState({ items, itemsLength: itemsLength+1 })
    }

    deleteItem(index){
        let { items, itemsLength, pan } = this.state;
        items.splice(index, 1);
        Axios.post(`${REQUEST_BASE_URL}/push_watchlist`, { pan, items })
        this.setState({ items, itemsLength: itemsLength-1 })
    }

    openPopup(){
        this.setState({ popup: true });
    }

    closePopup(){
        this.setState({ popup: false });
    }

    itemChangePosition(reorderedItems){
        this.setState({ items: reorderedItems });
    }

    saveChangedName(oldName, newName){
        newName = newName.trim();
        if(newName.length<=0){
            return;
        }
        else if(this.state.Portfolios.map(el => el).includes(newName)){
            return;
        }
        else{
            this.confirmBox("Are you sure you want to change the Portfolio name? This will permanently change your portfolio", oldName, newName);
        }
    }

    confirmBox(msg, oldName, newName){
        confirmAlert({
            title: 'Confirmation',
            message: msg,
            buttons: [
                {   label: 'Yes',
                    onClick: () => { 
                        Axios.post(`${REQUEST_BASE_URL}/change_portfolio_name`, { oldName, newName }).then(response => {
                        this.setState({ Portfolios: response.data, cashPosition: newName });
                        })
                    }
                },
                {   label: 'No',
                    onClick: () => { return }
                }
            ]
        })
    }

    render() {

        if(this.state)
        {

            let portfolios = [];
            portfolios.push('Watchlist');
            this.state.Portfolios.map((p,i) => {
                portfolios.push(p);
            });
            return (
                <>
                {this.state.popup? <WatchlistPopup addItem={this.addItem} closePopup={this.closePopup}/> : null}
                <div className="cash__position">
                    <div className="cp__dropdown">
                        <CustomSelect 
                            width={160} 
                            height={40} 
                            options={portfolios} 
                            defaultIndex={0}
                            onTypeChange={(value)=> {this.LoadCashPosition(value)}}
                        />
                    </div>
                    <div className="cp__data">
                        {this.state.cashPosition === 'Watchlist'? 
                            <WatchList 
                            watchlistloaded={this.state.watchlistloaded}
                            items={this.state.items} 
                            itemsLength={this.state.itemsLength} 
                            openPopup={this.openPopup}
                            deleteItem={this.deleteItem}
                            itemChangePosition={this.itemChangePosition} /> 
                            : 
                            <PortfolioView 
                            portfolioName={this.state.cashPosition}
                            saveChangedName={this.saveChangedName} />
                        }
                    </div>
                </div>
            </>
            )
        }
        else
        {
            return null;
        }
    }
}

export default CashPosition;
