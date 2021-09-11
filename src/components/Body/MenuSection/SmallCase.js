import React from 'react';
import Theme from '../../../assets/icons/theme.svg';
import SearchIcon from '../../../assets/icons/search.svg';
import Chess from '../../../assets/icons/chess.svg';
import Analysis from '../../../assets/icons/analysis.svg';
import BalanceBall from '../../../assets/icons/balance-ball.svg';
import SettingsGears from '../../../assets/icons/settings-gears.svg';
import ChevronDown from '../../../assets/icons/ChevronDown.svg';
import Objective from '../../../assets/icons/objective.svg';
import SmallCaseStrategy from './SmallCaseComponents/SmallCaseStrategy';
import "../../../css/MenuSection/SmallCase.css";

class SmallCase extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            field: 'macroeconomic',
            active: null,
        }
        this.TopSection = this.TopSection.bind(this)
        this.StrategyCard = this.StrategyCard.bind(this);
    }

    TopSection() {

        return <>
            <div className="smallcase__header">
                <div className="smallcase__title">
                    <img src={Theme} alt="Research" width={20} />
                    <span>SmallCase Investing</span>
                </div>
                <div className="smallcase__menu">
                    <div className="smallcase__stratergy__button" onClick={()=> this.setState({active : 'Strategy'})}>
                        SmallCase Strategy  
                    </div>
                </div>
            </div>
            <div className="smallcase__search__wrapper">
                <div className="smallcase__search__box">
                    <img src={SearchIcon} alt="Q" width={20}  />
                    <input type="text" className="input-field" placeholder="Search" />
                </div>
            </div>
        </>
    }

    StrategyCard({heading , news , data = []})
    {
        return <>
            <div className="smallcase__strategy__card">
                <div className="strategy__info">
                    <div className="strategy__icon__box">
                        <img src={Chess} alt=""/>
                        <span>Startegy</span>
                    </div>
                    <div className="strategy__headings__box">
                        <p className="strategy__heading">{heading}</p>
                        <p className="strategy__news">{news}</p>
                    </div>
                </div>
                <div className="strategy__data">
                    <div className="strategy__icon__box">
                        <img src={Analysis} alt=""/>
                        <span>Back Test Results</span>
                    </div>
                    <div className="strategy__data__table">
                       {data.map((d,i)=>{
                           return <>
                                <div>
                                    <p className="title">{d.title}</p>
                                    <p className="value">{d.value}</p>
                                </div>
                                
                           </>
                       })}
                    </div>
                </div>
                <div className="strategy__options">
                    <p>Details</p>
                    <div className="strategy__buy__button">
                        Buy This Strategy
                    </div>
                </div>
            </div>
        </>
    }


    render() {

        if(this.state.active === 'Strategy')    
            return(<SmallCaseStrategy smallCaseHome={()=> this.setState({active : null})}/>)

        return (
            <>

                <div className="smallcase__container">
                    <this.TopSection />
                    <div className="smallcase__body">
                        <div className="smallcase__strategy__wrapper">
                            <this.StrategyCard 
                                heading="Nifty 50 Minimum Variance Strategy"
                                news="A minimum Variance portfolio is an investing method that help your maximize returns and minimize risk. This involves diversifying your investments."
                                data={[
                                    {
                                        title : 'Annual Returns',
                                        value : '15.63%'
                                    },
                                    {
                                        title : 'Annual Risk',
                                        value : '16.36%'
                                    },
                                    {
                                        title : 'Sharpe Ratio',
                                        value : '0.83'
                                    }
                                ]}
                            />
                            <this.StrategyCard 
                                heading="Nifty 50 Minimum Variance Strategy"
                                news="A minimum Variance portfolio is an investing method that help your maximize returns and minimize risk. This involves diversifying your investments."
                                data={[
                                    {
                                        title : 'Annual Returns',
                                        value : '15.63%'
                                    },
                                    {
                                        title : 'Annual Risk',
                                        value : '16.36%'
                                    },
                                    {
                                        title : 'Sharpe Ratio',
                                        value : '0.83'
                                    }
                                ]}
                            />
                            <this.StrategyCard 
                                heading="Nifty 50 Minimum Variance Strategy"
                                news="A minimum Variance portfolio is an investing method that help your maximize returns and minimize risk. This involves diversifying your investments."
                                data={[
                                    {
                                        title : 'Annual Returns',
                                        value : '15.63%'
                                    },
                                    {
                                        title : 'Annual Risk',
                                        value : '16.36%'
                                    },
                                    {
                                        title : 'Sharpe Ratio',
                                        value : '0.83'
                                    }
                                ]}
                            />
                            <this.StrategyCard 
                                heading="Nifty 50 Minimum Variance Strategy"
                                news="A minimum Variance portfolio is an investing method that help your maximize returns and minimize risk. This involves diversifying your investments."
                                data={[
                                    {
                                        title : 'Annual Returns',
                                        value : '15.63%'
                                    },
                                    {
                                        title : 'Annual Risk',
                                        value : '16.36%'
                                    },
                                    {
                                        title : 'Sharpe Ratio',
                                        value : '0.83'
                                    }
                                ]}
                            /> 
                        </div>
                        <div className="smallcase__strategy__details">
                            <div className="strategy__details__box">
                                <div className="details__header">
                                    <img src={Chess} alt="" />
                                    <span>Strategy</span>
                                </div>
                                <div className="details__content strategy__name">
                                    <p>Nifty 50 Minimum Variance Strategy</p>
                                </div>
                            </div>
                            <div className="strategy__details__box">
                                <div className="details__header">
                                    <img src={BalanceBall} alt="" />
                                    <span>Rebalancing</span>
                                </div>
                                <div className="details__content">
                                    <p>Monthly, Automatic</p>
                                </div>
                            </div>
                            <div className="strategy__details__box">
                                <div className="details__header">
                                    <img src={Objective} alt="" />
                                    <span>Objective</span>
                                </div>
                                <div className="details__content">
                                    <p>A minimum variance portfolio is an investing method that help your maximize returns and minimize risk. This involves diversifying your investments.</p>
                                </div>
                            </div>
                            <div className="strategy__details__box">
                                <div className="details__header">
                                    <img src={SettingsGears} alt="" />
                                    <span>Methodolody</span>
                                </div>
                                <div className="details__content">
                                    <p>To build a minimum variance portfolio, we stick with low-volatility investments or a combination of volatile investments with low
                                    correlation to each other, such as technlogy and apparel.The latter portfolio is a common scenario for building a minimum variance portfolio.
                                    Investments that have low correlation are those that perform differently compared to the prevalling market and economics environment.
                                    The strategy is a great example of diversification.</p>
                                </div>
                            </div>
                            <div className="strategy__details__box">
                                <div className="details__header">
                                    <img src={Analysis} alt="" />
                                    <span>Back Test Results(Past 3 Years)</span>
                                </div>
                                <div className="details__content">
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                

            </>
        )
    }
}

export default SmallCase;
