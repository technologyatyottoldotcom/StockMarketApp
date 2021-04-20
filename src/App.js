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
      stockCode : 2885,
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

  selectedStock(event,value)
  {
      if(value && typeof value === 'string' && value!== '')
      {
        const stockArr = value.split(':');
        console.log(stockArr);
        this.setState({
            stockCode : parseInt(stockArr[stockArr.length-1])
        });
      }
  }

  
  

  render()
  {
    return (
      <div className="app">
        <ScripsHeader 
          setActiveElement={this.setActiveElement} selectedStock={this.selectedStock}/>
        <ScripsBody stockCode={this.state.stockCode} setActiveElement={this.setActiveElement} isActive={this.state.isActive} active={this.state.active}/>
        <ScripsFooter />
      </div>
    );
  }
}

export default App;
