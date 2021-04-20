import React from 'react';
import Coin from '../../../assets/icons/coins.svg';
import BriefCase from '../../../assets/icons/suitcase.svg';
import ChevronDown from '../../../assets/icons/ChevronDown.svg';

class Portfolios extends React.Component {

    CashPos() {
        return (
            <>
                <div style={{ display: 'flex' }}>
                    <div>
                        <img src={Coin} height={20} width={20} alt="Coin" />
                    </div>
                    <div style={{ color: '#8e8888', marginLeft: 8, fontSize: 10, alignSelf: 'flex-end' }}>
                        Cash Position
                </div>
                </div>
                <div style={{ textAlign: 'left', fontWeight: 300 }}>
                    <span style={{ fontSize: 13 }}>Rs.&nbsp;</span>
                    <span style={{ fontSize: 20 }}>13,254.00</span>
                </div>
            </>
        )
    }

    PortfolioNme() {
        return (
            <>
                <div style={{ display: 'flex' }}>
                    <div>
                        <img src={BriefCase} height={20} width={20} alt="Briefacase" />
                    </div>
                    <div style={{ color: '#8e8888', marginLeft: 8, fontSize: 12, alignSelf: 'flex-end' }}>
                        Portfolio Name
                </div>
                </div>
                <div style={{ textAlign: 'left', fontWeight: "bold" }}>
                    Growth Portfolio <img src={ChevronDown} alt="ChevronDown" />
                </div>
            </>
        )
    }

    CreatePriceCol({ heading, change, changePer, color = "#19E683" }) {
        return (
            <>
                <div style={{ fontSize: 10, fontWeight: 'bold', textAlign: 'left' }}>
                    <div style={{ fontSize: 14 }}>
                        {heading}
                    </div>
                    <div style={{ color: color }}>
                        {change} 
                        {changePer && <span style={{ fontSize: 11, fontWeight: 800 }}>{changePer}</span>}
                    </div>
                </div>
            </>
        )
    }

    THead({ th = [] }) {
        return th.map((v, i) => {
            if (Array.isArray(v)) {
                if (v[1].style) {
                    v[1].style['borderBottom'] = '1px solid #ccc'
                }

                return <th key={Math.random() + i} {...v[1]}>{v[0]}</th>
            }
            else return <th key={Math.random() + i} style={{ padding: 5, borderBottom: v ? '1px solid #ccc' : '' }}>{v}</th>

        })
    }

    Tbody({ td = [], style }) {
        return (
            <tr style={{ margin: 15, ...style }}>
                {
                    td.map((v, i) => {
                        return <td key={Math.random() + i} style={{ padding: 5 }}>{v}</td>
                    })
                }
            </tr>
        )
    }

    Name({ name, fullName }) {
        return (
            <>
                <div style={{ fontSize: 12, display: 'flex' }}>
                    <div style={{ marginTop: 8, width: 5, height: 5, borderRadius: '100%', background: '#00a0e3' }}></div>
                    <div style={{ marginLeft: 4, fontSize: 14, fontWeight: 700 }}>{name}</div>
                </div>
                <div style={{
                    width: 100,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    textAlign: 'left', marginLeft: 8, color: '#9ea0a2', fontSize: 11
                }}>{fullName}</div>
            </>)
    }

    Symbol({ type }) {
        return <div className="increase-circle" style={{ backgroundColor: (type === '+' ? '#00a0e3' : '#E51A4B') }}>{type}</div>
    }

    render() {
        return (
            <>
                <div className="container" style={{ fontSize: 13, color: 'black' }}>
                    {/* <div style={{ textAlign: 'right', lineHeight: .1, alignSelf: 'flex-end', cursor: 'pointer' }}>
                        <img src={XCrossmark} alt="X-Crossmark" />
                    </div> */}
                    <div className="row">
                        <div className="col-4">
                            <div className="row">
                                <div className="col">
                                    <this.PortfolioNme />
                                </div>
                                <div className="col" style={{ alignSelf: 'flex-end' }}>
                                    <this.CreatePriceCol
                                        heading="Rs. 21,123,131.00"
                                        change="+106,000,000.78"
                                        changePer="(+.95%)"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col" style={{ alignSelf: 'flex-end' }}>
                            <this.CashPos />
                        </div>
                    </div>
                    <div className="GlobalScrollBar" style={{ maxHeight: 400 }}>
                        <table>
                            <thead >
                                {/* borderBottom: '1px solid #ccc' */}
                                <tr>
                                    <this.THead th={[
                                        "Name",
                                        "Quantity",
                                        <span><small>Avg.</small>  Buy Price</span>,
                                        "Curr Price", "Inv Cost", "Curr Value", "Return",
                                        "Today", "Port. Wt.", "Order", "", ""
                                    ]} />
                                </tr>
                            </thead>
                            <tbody>
                                <this.Tbody td={[
                                    <this.Name name="RELIANCE.NS" fullName="Reliance Industry ltd." />
                                    ,
                                    "10,003",
                                    "2103.06",
                                    "2250.60",
                                    "210,336,2530",
                                    "210,336,2530",
                                    <span style={{ fontWeight: 'bold', color: "#19E683" }}>10.3%</span>,
                                    <span style={{ fontWeight: 'bold', color: "#19E683" }}>1.2%</span>,
                                    "10.3%",
                                    "0",
                                    <this.Symbol type="+" />,
                                    <this.Symbol type="-" />

                                ]} />
                                <this.Tbody td={[
                                    <this.Name name="RELIANCE.NS" fullName="Reliance Industry ltd." />
                                    ,
                                    "10,003",
                                    "2103.06",
                                    "2250.60",
                                    "210,336,2530",
                                    "210,336,2530",
                                    <span style={{ fontWeight: 'bold', color: "#19E683" }}>10.3%</span>,
                                    <span style={{ fontWeight: 'bold', color: "#19E683" }}>1.2%</span>,
                                    "10.3%",
                                    "0",
                                    <this.Symbol type="+" />,
                                    <this.Symbol type="-" />

                                ]} />
                                <this.Tbody td={[
                                    <this.Name name="RELIANCE.NS" fullName="Reliance Industry ltd." />
                                    ,
                                    "10,003",
                                    "2103.06",
                                    "2250.60",
                                    "210,336,2530",
                                    "210,336,2530",
                                    <span style={{ fontWeight: 'bold', color: "#19E683" }}>10.3%</span>,
                                    <span style={{ fontWeight: 'bold', color: "#19E683" }}>1.2%</span>,
                                    "10.3%",
                                    "0",
                                    <this.Symbol type="+" />,
                                    <this.Symbol type="-" />

                                ]} />
                                <this.Tbody td={[
                                    <this.Name name="RELIANCE.NS" fullName="Reliance Industry ltd." />
                                    ,
                                    "10,003",
                                    "2103.06",
                                    "2250.60",
                                    "210,336,2530",
                                    "210,336,2530",
                                    <span style={{ fontWeight: 'bold', color: "#19E683" }}>10.3%</span>,
                                    <span style={{ fontWeight: 'bold', color: "#19E683" }}>1.2%</span>,
                                    "10.3%",
                                    "0",
                                    <this.Symbol type="+" />,
                                    <this.Symbol type="-" />

                                ]} />
                                <this.Tbody td={[
                                    <this.Name name="RELIANCE.NS" fullName="Reliance Industry ltd." />
                                    ,
                                    "10,003",
                                    "2103.06",
                                    "2250.60",
                                    "210,336,2530",
                                    "210,336,2530",
                                    <span style={{ fontWeight: 'bold', color: "#19E683" }}>10.3%</span>,
                                    <span style={{ fontWeight: 'bold', color: "#19E683" }}>1.2%</span>,
                                    "10.3%",
                                    "0",
                                    <this.Symbol type="+" />,
                                    <this.Symbol type="-" />

                                ]} />
                                <this.Tbody td={[
                                    <this.Name name="RELIANCE.NS" fullName="Reliance Industry ltd." />
                                    ,
                                    "10,003",
                                    "2103.06",
                                    "2250.60",
                                    "210,336,2530",
                                    "210,336,2530",
                                    <span style={{ fontWeight: 'bold', color: "#19E683" }}>10.3%</span>,
                                    <span style={{ fontWeight: 'bold', color: "#19E683" }}>1.2%</span>,
                                    "10.3%",
                                    "0",
                                    <this.Symbol type="+" />,
                                    <this.Symbol type="-" />

                                ]} />
                                <this.Tbody td={[
                                    <this.Name name="RELIANCE.NS" fullName="Reliance Industry ltd." />
                                    ,
                                    "10,003",
                                    "2103.06",
                                    "2250.60",
                                    "210,336,2530",
                                    "210,336,2530",
                                    <span style={{ fontWeight: 'bold', color: "#19E683" }}>10.3%</span>,
                                    <span style={{ fontWeight: 'bold', color: "#19E683" }}>1.2%</span>,
                                    "10.3%",
                                    "0",
                                    <this.Symbol type="+" />,
                                    <this.Symbol type="-" />

                                ]} />
                                <this.Tbody td={[
                                    <this.Name name="RELIANCE.NS" fullName="Reliance Industry ltd." />
                                    ,
                                    "10,003",
                                    "2103.06",
                                    "2250.60",
                                    "210,336,2530",
                                    "210,336,2530",
                                    <span style={{ fontWeight: 'bold', color: "#19E683" }}>10.3%</span>,
                                    <span style={{ fontWeight: 'bold', color: "#19E683" }}>1.2%</span>,
                                    "10.3%",
                                    "0",
                                    <this.Symbol type="+" />,
                                    <this.Symbol type="-" />

                                ]} />
                                <this.Tbody td={[
                                    <this.Name name="RELIANCE.NS" fullName="Reliance Industry ltd." />
                                    ,
                                    "10,003",
                                    "2103.06",
                                    "2250.60",
                                    "210,336,2530",
                                    "210,336,2530",
                                    <span style={{ fontWeight: 'bold', color: "#19E683" }}>10.3%</span>,
                                    <span style={{ fontWeight: 'bold', color: "#19E683" }}>1.2%</span>,
                                    "10.3%",
                                    "0",
                                    <this.Symbol type="+" />,
                                    <this.Symbol type="-" />

                                ]} />
                                <this.Tbody td={[
                                    <this.Name name="RELIANCE.NS" fullName="Reliance Industry ltd." />
                                    ,
                                    "10,003",
                                    "2103.06",
                                    "2250.60",
                                    "210,336,2530",
                                    "210,336,2530",
                                    <span style={{ fontWeight: 'bold', color: "#19E683" }}>10.3%</span>,
                                    <span style={{ fontWeight: 'bold', color: "#19E683" }}>1.2%</span>,
                                    "10.3%",
                                    "0",
                                    <this.Symbol type="+" />,
                                    <this.Symbol type="-" />

                                ]} />


                                {/* total */}
                                <this.Tbody td={[
                                    <div style={{ fontWeight: 'bold' }}>Total</div>,
                                    "",
                                    "",
                                    "",
                                    <div style={{ fontWeight: 'bold' }}>210,33650</div>,
                                    <div style={{ fontWeight: 'bold' }}>210,33650</div>,
                                    <span style={{ fontWeight: 'bold', color: "#19E683" }}>10.3%</span>,
                                    <span style={{ fontWeight: 'bold', color: "#19E683" }}>1.2%</span>,
                                    <div style={{ fontWeight: 'bold' }}>100%</div>,
                                    ""
                                ]} style={{ borderTop: '1px solid #ccc' }} />

                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        )
    }
}

export default Portfolios;
