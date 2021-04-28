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
        stockCode : 2885,
        stockSymbol : 'RELI.NS',
        stockName : 'Reliance Industries Ltd.',
        stockNSECode : 'RELIANCE',
        stockBSECode : 500325
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
      // console.log(data.code);
      // console.log(data.symbol);
      console.log(data);
      let StockCode = data.code;
      console.log(data,StockCode)
      if(StockCode && typeof StockCode === 'string' && StockCode!== '')
      {
        // const stockArr = value.split(':');
        // console.log(stockArr);
        // console.log(data);
        this.setState({

            stockDetails : {
              stockCode : parseInt(StockCode),
              stockSymbol : data.symbol,
              stockName : data.name,
              stockNSECode : data.nse_code,
              stockBSECode : data.bse_code
            }
            
        });
      }
  }

  
  

  render()
  {
    return (
      <div className="app">
        <ScripsHeader 
          setActiveElement={this.setActiveElement} selectedStock={this.selectedStock}/>
        <ScripsBody 
          stockDetails = {this.state.stockDetails}
          setActiveElement={this.setActiveElement} 
          isActive={this.state.isActive} 
          active={this.state.active}
        />
        <ScripsFooter />
      </div>
    );
  }
}

export default App;
