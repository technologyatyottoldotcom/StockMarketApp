import React from 'react';
import SettingIcon from '../../../assets/icons/settings.svg';
import PlusIcon from '../../../assets/icons/plus.svg';
import MinusIcon from '../../../assets/icons/minus.svg';
import { QuoteNav } from './QuoteNav';
import { Overview } from './Overview';
import { Financials } from './Financials/Financials';
import { Technicals } from "./Technicals";
import {Valuation} from './Valuation';
import { Feed } from "./Feed";

class BusinessNews extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            field: 'overview'
        }
    }

    render() {
        var field = this.state.field
        console.log('type = ', field)
        return (
            <>
                <div className="business__container">

                        <div className="container__header">
                            <div className="stock__info">
                                <div className="stock__details">
                                    <p className="stock__name__code">
                                        <span id="stock__code">RELIANCE.NS</span>
                                    </p>
                                    <div className="stock__type">
                                        <img src={SettingIcon} alt="s"/>
                                        <p>Oil & Gas</p>
                                    </div>
                                </div>
                                <div id="stock__full__name">
                                    <span>Reliance Industries Ltd.</span>
                                </div>
                                <div className="stock__price__purchase">
                                    <div className="stock__price__details">
                                        <span className="price__decimals">2,103</span>
                                        <span className="price__fraction">00</span>
                                    </div>
                                    <div className="stock__purchase">
                                        <div className="buy__stock"><img src={PlusIcon} alt=""/></div>
                                        <div className="sell__stock"><img src={MinusIcon} alt=""/></div>
                                    </div>
                                </div>
                                <div className="stock__price__change">
                                    <span className="stock__performance__amount">-3.91</span>
                                    <span className="stock__performance__percentage">(-0.85%)</span>
                                </div>
                            </div>
                            <div className="business__news__menu">
                                <QuoteNav onClick={(i, e) => this.setState({ field: e.target.dataset.field?.toLowerCase()?.replace(/ /g, '') })} activeClassName="active-nav-0">
                                    <div active={field === 'overview'} data-field="overview">Overview</div>
                                    <div active={field === 'financials'} data-field="financials">Financials</div>
                                    <div data-field="valuation">Valuation</div>
                                    <div active={field === 'technicals'} data-field="technicals">Technicals<span style={{fontSize:"12px"}}> (AI & ML)</span></div>
                                    <div data-field="feed">Feed</div>
                                </QuoteNav>
                            </div>
                        </div>

                        <div className="business__news__box">
                            {field === 'overview' && <Overview />}
                            {field === 'financials' && <Financials />}
                            {field === 'valuation' && <Valuation />}
                            {field === 'technicals' && <Technicals />}
                            {field === 'feed' && <Feed />}
                        </div>

                </div>
            </>
        )
    }
}

export { BusinessNews }