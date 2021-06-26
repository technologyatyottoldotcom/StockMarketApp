import React from 'react';
import './scss/index.scss';
import './css/App.css';
import ScripsHeader from './components/Header/ScripsHeader';
import ScripsBody from './components/Body/ScripsBody';
import ScripsFooter from './components/Footer/ScripsFooter';


class App extends React.Component
{

  constructor(props)
  {

    super(props);
    this.state = {
      isActive : false,
      active : null,
      stockDetails : {
        stockISIN : 'INE002A01018',
        stockCode : 2885,
        stockSymbol : 'RELI.NS',
        stockName : 'Reliance Industries Ltd.',
        stockNSECode : 'RELIANCE',
        stockBSECode : 500325,
        stockExchange : {
          exchange : 'NSE',
          code : 1,
          multiplier : 100
        },
        stockIndustry : 'Oil & Gas Operations'
      },
      search : ''
    }
    this.setActiveElement = this.setActiveElement.bind(this);
    this.selectedStock = this.selectedStock.bind(this);
  }

  setActiveElement(element,status)
  {
    this.setState({
      isActive : status,
      active : element
    });
    // console.log(element);
  }

  selectedStock(data)
  {
      console.log(data);
      let StockCode = data.code;
      if(StockCode && typeof StockCode === 'string' && StockCode!== '')
      {
        this.setState({

            stockDetails : {
              stockISIN : data.isin,
              stockCode : parseInt(StockCode),
              stockSymbol : data.ric_code,
              stockName : data.name,
              stockNSECode : data.nse_code,
              stockBSECode : data.bse_code,
              stockExchange : data.exchange,
              stockIndustry : data.industry
            }
            
        });
      }
  }

  render()
  {

    console.log(this.state.stockDetails);
    return (
      <div className="app">
        <ScripsHeader 
          setActiveElement={this.setActiveElement} selectedStock={this.selectedStock}/>
        <ScripsBody 
          stockDetails = {this.state.stockDetails}
          setActiveElement={this.setActiveElement} 
          isActive={this.state.isActive} 
          active={this.state.active}
          selectedStock={this.selectedStock}
        />
        <ScripsFooter />
      </div>
    );
  }
}

export default App;
