import React from 'react';
import {Switch,Route,Link} from "react-router-dom";
import '../css/HeroPage.css';
import YottolLogo from '../assets/images/yottol.png';
import HeroIntro from './HeroComponents/HeroIntro';
import HeroAbout from './HeroComponents/HeroAbout';
import HeroStocks from './HeroComponents/HeroStocks';
import HeroTrading from './HeroComponents/HeroTrading';
import HeroReach from './HeroComponents/HeroReach';
import HeroHelp from './HeroComponents/HeroHelp';
import HeroFAQ from './HeroComponents/HeroFAQ';

class HeroPage extends React.PureComponent {
    render() {
        return (
            <div className="app__hero__page">
               <div className="app__hero__header">
                   <div className="hero__header__menu">
                        <div className="hero__header__logo">
                            <a href="https://www.yottol.com" target="_blank">
                                <img src={YottolLogo} alt="" width={40}/>
                            </a>
                            <span>
                                <Link to="/">Air</Link>
                            </span>
                        </div>
                        <div className="hero__header__nav">
                            <span>
                                <Link to="/About">About Us</Link>
                            </span>
                            <span>
                                <Link to="/Stocks">Stocks</Link>
                            </span>
                            <span>
                                <Link to="/Trading">Trading Basics</Link>
                            </span>
                            <span>
                                <Link to="/Reach">Reach Us</Link> 
                            </span>
                            <span>
                                <Link to="/Help">Help</Link>
                            </span>
                            <span>
                                <Link to="/FAQ">FAQs</Link>
                            </span>
                        </div>
                   </div>
                   <div className="hero__header__buttons">
                        <div>
                            <span>
                                <Link to="/app">Login</Link> 
                            </span>
                        </div>
                        <div>
                            <span>Sign-Up</span>
                        </div>
                   </div>
               </div>
               <div className="app__hero__body">
                   <Switch>
                       <Route path="/" exact>
                            <HeroIntro />
                       </Route>
                       <Route path="/About">
                            <HeroAbout />
                       </Route>
                       <Route path="/Stocks">
                            <HeroStocks />
                       </Route>
                       <Route path="/Trading">
                            <HeroTrading />
                       </Route>
                       <Route path="/Reach">
                            <HeroReach />
                       </Route>
                       <Route path="/Help">
                            <HeroHelp />
                       </Route>
                       <Route path="/FAQ">
                            <HeroFAQ />
                       </Route>
                   </Switch>
               </div>
            </div>
        )
    }
}

export default HeroPage;
