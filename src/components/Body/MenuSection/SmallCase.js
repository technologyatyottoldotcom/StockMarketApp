import React from 'react';
import {QuoteNav} from '../BusinessNews/QuoteNav';
import Theme from '../../../assets/icons/theme.svg';
import SearchIcon from '../../../assets/icons/search.svg';
import Chess from '../../../assets/icons/chess.svg';
import Analysis from '../../../assets/icons/analysis.svg';
import BalanceBall from '../../../assets/icons/balance-ball.svg';
import SettingsGears from '../../../assets/icons/settings-gears.svg';
import ChevronDown from '../../../assets/icons/ChevronDown.svg';
import Objective from '../../../assets/icons/objective.svg';

class SmallCase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            field: 'macroeconomic'
        }
        this.TopSection = this.TopSection.bind(this)
        this.CrTable = this.CrTable.bind(this)
        this.CrNews = this.CrNews.bind(this)
        this.CrIcon = this.CrIcon.bind(this)
        this.CrRow = this.CrRow.bind(this)
        this.CrSecRow = this.CrSecRow.bind(this)
    }
    TopSection() {
        return <div className="row" style={{ fontSize: 13 }}>
            <div className="col-3">
                <div style={{ marginTop: 5 }}>
                    <img src={Theme} alt="Research" width={20} />
                    <span style={{ fontWeight: 'bold', fontSize: 13, marginLeft: 10 }}>SmallCase Investing</span>

                </div>

                <div className="input-icons" style={{ marginTop: 15 }}>
                    <img src={SearchIcon} alt="Research" className="icon" width={20} style={{ color: '#ccc' }} />
                    <input type="text" className="input-field" placeholder="Search" style={{ width: 250 }} />
                </div>

            </div>
            <div className="col">
                <div style={{ textAlign: 'right', lineHeight: .1, float: 'right' }}>
                    <div style={{ marginRight: 60, marginTop: 5 }}>
                        <QuoteNav onClick={(i, e) => { this.setState({ field: e.target.innerText?.toLowerCase()?.replace(/ /g, '') }) }} activeClassName="ResearchStocks-active-nav" className="ResearchStocks-nav" style={{ margin: 10, marginRight: 0, padding: 0, listStyleType: 'none', fontWeight: 'bold' }}>
                            <div active={1} style={{ marginRight: 10 }}>MacroEconomic</div>
                            <div style={{ marginRight: 10 }}>Industry</div>
                            <div style={{ marginRight: 10 }}>Stocks</div>
                            <div style={{ marginRight: 10 }}>Others</div>
                        </QuoteNav>
                    </div>
                </div>
            </div>
        </div>
    }

    CrTable({ headings = [], data = [] }) {
        return <>
            <div className="row" style={{ fontSize: 11 }}>
                {headings.map((v, i) => {
                    return <div className="col" key={1 + Math.random() + 3}>{v}</div>
                })}
            </div>
            <div className="row" style={{ fontWeight: 'bold' }}>
                {data.map((v, i) => {
                    return <div className="col" key={1 + Math.random() + 3}>{v}</div>
                })}
            </div>
        </>
    }

    CrNews({ heading, news }) {
        return <div>
            {heading && <div style={{ fontWeight: 'bold', fontSize: 14 }}>{heading}</div>}
            {news && <div>{news}</div>}
        </div>
    }

    CrIcon({ icon, text, textInline }) {
        return (
            <div style={{ fontWeight: 'bold' }}>
                {!textInline ? <>
                    {icon && <img src={icon} alt={text} width={20} />}
                    <div>{text}</div>
                </>
                    :
                    <div style={{ display: 'flex' }}>
                        {icon && <img src={icon} alt={text} width={20} />}
                        <div style={{ fontWeight: 'bold', marginLeft: 10, alignSelf: 'flex-end' }}>
                            {text}
                        </div>
                    </div>

                }
            </div>
        )
    }

    CrRow({ col1, col2 }) {
        return <div className="row" style={{ marginTop: 15 }}>
            <div className="col-4">{col1}</div>
            <div className="col" >{col2}</div>
        </div>
    }

    CrSecRow({ head, text }) {
        return <div style={{ marginTop: 15 }}>
            <div>{head}</div>
            <div>{text}</div>
        </div>
    }

    render() {
        return (
            <>
                <div className="container" style={{ width: 800, fontSize: 13, color: 'black' }}>
                    <this.TopSection />
                    <div className="row" style={{ marginTop: 30 }}>
                        <div className="col-6 GlobalScrollBar" style={{ maxHeight: 400 , marginRight : 30 }}>
                            <this.CrRow
                                col1={<this.CrIcon icon={Chess} text="Strategy" />}
                                col2={<this.CrNews
                                    heading="Nifty 50 Minimum Variance Strategy"
                                    news="A minimum Variance portfolio is an investing method that help your maximize returns and minimize risk. This involves diversifying your investments." />}
                            />
                            <this.CrRow
                                col1={<this.CrIcon icon={Analysis} text="Back Test Results " />}
                                col2={<this.CrTable
                                    headings={['Annual Returns', 'Annual Risk', 'Sharpe Ratio']}
                                    data={['15.63%', '16.36%', '0.83']}
                                />}
                            />

                            <div className="row" style={{ fontWeight: 'bold', paddingTop: 30, paddingBottom: 55 }}>
                                <div className="col" style={{ color: '#00a0e3' }}>Details</div>
                                <div className="col" style={{ textAlign: 'right', marginRight: 25 }}>Buy This Strategy</div>
                            </div>

                            <this.CrRow
                                col1={<this.CrIcon icon={Chess} text="Strategy" />}
                                col2={<this.CrNews
                                    heading="Nifty 50 Minimum Variance Strategy"
                                    news="A minimum Variance portfolio is an investing method that help your maximize returns and minimize risk. This involves diversifying your investments." />}
                            />
                            <this.CrRow
                                col1={<this.CrIcon icon={Analysis} text="Back Test Results " />}
                                col2={<this.CrTable
                                    headings={['Annual Returns', 'Annual Risk', 'Sharpe Ratio']}
                                    data={['15.63%', '16.36%', '0.83']}
                                />}
                            />

                        </div>
                        <div className="col-5 GlobalScrollBar" style={{ maxHeight: 400, marginTop: -20 }}>
                            <this.CrSecRow head={<this.CrIcon icon={Chess} text="Strategy" textInline />} text={<span style={{ color: '#00a0e3', fontWeight: 'bold' }}>Nifty 50 Minimum Variance Strategy</span>} />
                            <this.CrSecRow head={<this.CrIcon icon={BalanceBall} text="Rebalancing" textInline />} text="Monthly, Automatic" />
                            <this.CrSecRow head={<this.CrIcon icon={Objective} text="Objective" textInline />}
                                text="A minimum Variance portfolio is an investing method that help your maximize returns and minimize risk. This involves diversifying your investments." />
                            <this.CrSecRow head={<this.CrIcon icon={SettingsGears} text="Methodolody" textInline />}
                                text="A minimum Variance portfolio is an investing method that help your maximize returns and minimize risk. This involves diversifying your investments. A minimum Variance portfolio is an investing method that help your maximize returns and minimize risk. This involves diversifying your investments." />
                            <this.CrSecRow
                                head={
                                    <div className="row">
                                        <div className='col-9'>
                                            <this.CrIcon icon={Analysis} text="Back Test Results(Past 5 Years)" textInline />
                                        </div>
                                        <div className="col" style={{ padding: 0, fontWeight: 600, fontSize: 12 }}>
                                            Nifty 50 <img src={ChevronDown} alt="ChevronDown" width={20} />
                                        </div>
                                    </div>
                                }
                            />


                        </div>
                    </div>

                </div>

            </>
        )
    }
}

export default SmallCase;
