import React from 'react';
import {Link} from "react-router-dom";
import StockPlatform from '../../assets/images/stockplatform.jpg';

class HeroIntro extends React.PureComponent {
    render() {
        return (
            <div className="hero__body__intro">
                <div className="intro__content">
                     <h2>Helping out with Stocks</h2>
                     <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                     Donec cursus nibh et molestie auctor. Nam hendrerit, velit vel varius vestibulum, 
                     lacus enim pharetra enim, quis posuere ante urna non neque. Donec egestas volutpat elit non euismod. 
                     Vivamus sodales ex in enim cursus, ut imperdiet dui mattis.</p>
                     <div className="intro__button">
                         <span>
                            <Link to="/app">Login</Link> 
                         </span>
                     </div>
                </div>
                <div className="intro__img">
                     <img src={StockPlatform} alt="" width={100}/>
                </div>
            </div>
        )
    }
}

export default HeroIntro;
