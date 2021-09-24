import React from 'react';
import {BrowserRouter as Router,Switch,Route} from "react-router-dom";
import './scss/index.scss';
import './css/App.css';
import HeroPage from './components/HeroPage';
import MainPage from './components/MainPage';


class App extends React.Component
{

  render()
  {
    // console.log(this.state.stockDetails);
    return (
      <div className="app">
        <Router>
          <Switch>
            <Route path="/app" exact>
              <MainPage />
            </Route>
            <Route path="/">
              <HeroPage />
            </Route>
            
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
