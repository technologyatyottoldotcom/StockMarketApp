import React from 'react';
import ShakeHand from '../../../assets/icons/shakehand.svg';
import Order from '../../../assets/icons/order.svg';


const Title = _ => {
    return <svg xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(180deg)' }} width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
        <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
    </svg>
}

class Orders extends React.Component {


    constructor(props)
    {
        super(props);
        this.state={
            active : 'orders'
        }
    }


    CrRow({ col1, col2 }) {
        return <div className="row" style={{ marginTop: 5, fontWeight: 'bold' }}>
            <div className="col-2">{col1}</div>
            <div className="col-2">
                {col2}
            </div>
        </div>
    }
    THead({ th = [], style = {} }) {
        return th.map((v, i) => {
            if (Array.isArray(v)) {
                if (v[1] && v[1].style) {
                    v[1].style = {
                        ...(v[0] ? { borderBottom: '1px solid #ccc' } : {}),
                        ...style,
                        ...v[1].style
                    }
                }

                return <th key={Math.random() + i} {...v[1]}>{v[0]}</th>
            }
            else return <th key={Math.random() + i} style={{ padding: 5, borderBottom: v ? '1px solid #ccc' : '', ...style }}>{v}</th>

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

    render() {
        return (
            <>
             <div className="container" style={{ maxWidth: 1000, fontSize: 13, color: 'black' }}>

                    
                    <div className="row" style={{ marginLeft: 1, fontSize: 12, fontWeight: 'bold' }}>
                        <div className="col-1" style={{ maxWidth: 40 }}><img src={Order} alt="" height={20} width={20} /></div>
                        <div className="col-1" style={{ marginLeft: -15, marginTop: 2, fontWeight: 900, fontSize: 13  , cursor : 'pointer'}} onClick={()=> {this.setState({active : 'orders'})}}>Orders</div>
                        <div className="col-1" style={{ maxWidth: 40, marginTop: -5 }}><img src={ShakeHand} alt="ShakeHand" /></div>
                        <div className="col-1" style={{ marginLeft: -10, marginTop: 2, fontWeight: 900, fontSize: 13, color: '#ccc' , cursor : 'pointer' }} onClick={()=> {this.setState({active : 'trades'})}}>Trades</div>
                    </div>

                    {this.state.active === 'orders' && 
                        <div className="GlobalScrollBar" style={{ maxHeight: 250, marginTop: 20, marginLeft: 10 }}>
                            <table>
                                <thead>
                                    <tr>
                                        <this.THead th={[
                                            ["Name", { style: { minWidth: 130 } }],
                                            "Type", "Limit Price", "Side",
                                            "Quantity", ["Avg. Fill Price", { style: { minWidth: 110 } }], "Amount",
                                            ["Status", { style: { minWidth: 0 } }], ""
                                        ]} style={{ minWidth: 90 }} />
                                    </tr>
                                </thead>
                                <tbody>
                                    <this.Tbody td={[
                                        <this.Name name="RELIANCE.NS" fullName="Reliance Industry ltd." />,
                                        "Market",
                                        "-",
                                        "Buy",
                                        "280/300",
                                        "2103.36",
                                        "60,236.26",
                                        "Pending",
                                        <div style={{ marginLeft: 20 }}>Modify / Cancel</div>

                                    ]} />
                                    <this.Tbody td={[
                                        <this.Name name="RELIANCE.NS" fullName="Reliance Industry ltd." />,
                                        "Market",
                                        "-",
                                        "Buy",
                                        "280/300",
                                        "2103.36",
                                        "60,236.26",
                                        "Pending",
                                        <div style={{ marginLeft: 20 }}>Modify / Cancel</div>

                                    ]} />
                                    <this.Tbody td={[
                                        <this.Name name="RELIANCE.NS" fullName="Reliance Industry ltd." />,
                                        "Market",
                                        "-",
                                        "Buy",
                                        "280/300",
                                        "2103.36",
                                        "60,236.26",
                                        "Pending",
                                        <div style={{ marginLeft: 20 }}>Modify / Cancel</div>

                                    ]} />
                                    <this.Tbody td={[
                                        <this.Name name="RELIANCE.NS" fullName="Reliance Industry ltd." />,
                                        "Market",
                                        "-",
                                        "Buy",
                                        "280/300",
                                        "2103.36",
                                        "60,236.26",
                                        "Pending",
                                        <div style={{ marginLeft: 20 }}>Modify / Cancel</div>

                                    ]} />
                                    <this.Tbody td={[
                                        <this.Name name="RELIANCE.NS" fullName="Reliance Industry ltd." />,
                                        "Market",
                                        "-",
                                        "Buy",
                                        "280/300",
                                        "2103.36",
                                        "60,236.26",
                                        "Pending",
                                        <div style={{ marginLeft: 20 }}>Modify / Cancel</div>

                                    ]} />
                                    <this.Tbody td={[
                                        <this.Name name="RELIANCE.NS" fullName="Reliance Industry ltd." />,
                                        "Market",
                                        "-",
                                        "Buy",
                                        "280/300",
                                        "2103.36",
                                        "60,236.26",
                                        "Pending",
                                        <div style={{ marginLeft: 20 }}>Modify / Cancel</div>

                                    ]} />
                                    <this.Tbody td={[
                                        <this.Name name="RELIANCE.NS" fullName="Reliance Industry ltd." />,
                                        "Market",
                                        "-",
                                        "Buy",
                                        "280/300",
                                        "2103.36",
                                        "60,236.26",
                                        "Pending",
                                        <div style={{ marginLeft: 20 }}>Modify / Cancel</div>

                                    ]} />
                                    <this.Tbody td={[
                                        <this.Name name="RELIANCE.NS" fullName="Reliance Industry ltd." />,
                                        "Market",
                                        "-",
                                        "Buy",
                                        "280/300",
                                        "2103.36",
                                        "60,236.26",
                                        "Pending",
                                        <div style={{ marginLeft: 20 }}>Modify / Cancel</div>

                                    ]} />
                                </tbody>
                            </table>
                        </div>

                    }

                    {this.state.active === 'trades' && 
                        <div className="GlobalScrollBar" style={{ maxHeight: 250, marginTop: 20, marginLeft: 10 }}>
                            <table>
                                <thead>
                                    <tr>
                                        <this.THead th={[
                                            ["Name", { style: { minWidth: 130 } }],
                                            "Type", "Limit Price", "Side",
                                            "Quantity", ["Trade Price", { style: { minWidth: 100 } }], "Amount",
                                            <>Charges <Title /></> ,["Status", { style: { minWidth: 0 } }]
                                        ]}  style={{ minWidth: 90 }} />
                                    </tr>
                                </thead>
                                <tbody>
                                    <this.Tbody td={[
                                        <this.Name name="RELIANCE.NS" fullName="Reliance Industry ltd." />,
                                        "Market",
                                        "-",
                                        "Buy",
                                        "28",
                                        "2103.36",
                                        "60,236.26",
                                        "56.63",
                                        "Complete"
                                    ]} />
                                <this.Tbody td={[
                                        <this.Name name="RELIANCE.NS" fullName="Reliance Industry ltd." />,
                                        "Market",
                                        "-",
                                        "Buy",
                                        "28",
                                        "2103.36",
                                        "60,236.26",
                                        "56.63",
                                        "Complete"
                                    ]} />
                                    <this.Tbody td={[
                                        <this.Name name="RELIANCE.NS" fullName="Reliance Industry ltd." />,
                                        "Market",
                                        "-",
                                        "Buy",
                                        "28",
                                        "2103.36",
                                        "60,236.26",
                                        "56.63",
                                        "Complete"
                                    ]} />
                                    <this.Tbody td={[
                                        <this.Name name="RELIANCE.NS" fullName="Reliance Industry ltd." />,
                                        "Market",
                                        "-",
                                        "Buy",
                                        "28",
                                        "2103.36",
                                        "60,236.26",
                                        "56.63",
                                        "Complete"
                                    ]} />
                                    <this.Tbody td={[
                                        <this.Name name="RELIANCE.NS" fullName="Reliance Industry ltd." />,
                                        "Market",
                                        "-",
                                        "Buy",
                                        "28",
                                        "2103.36",
                                        "60,236.26",
                                        "56.63",
                                        "Complete"
                                    ]} />
                                    <this.Tbody td={[
                                        <this.Name name="RELIANCE.NS" fullName="Reliance Industry ltd." />,
                                        "Market",
                                        "-",
                                        "Buy",
                                        "28",
                                        "2103.36",
                                        "60,236.26",
                                        "56.63",
                                        "Complete"
                                    ]} />
                                    <this.Tbody td={[
                                        <this.Name name="RELIANCE.NS" fullName="Reliance Industry ltd." />,
                                        "Market",
                                        "-",
                                        "Buy",
                                        "28",
                                        "2103.36",
                                        "60,236.26",
                                        "56.63",
                                        "Complete"
                                    ]} />
                                    <this.Tbody td={[
                                        <this.Name name="RELIANCE.NS" fullName="Reliance Industry ltd." />,
                                        "Market",
                                        "-",
                                        "Buy",
                                        "28",
                                        "2103.36",
                                        "60,236.26",
                                        "56.63",
                                        "Complete"
                                    ]} />
                                    <this.Tbody td={[
                                        <this.Name name="RELIANCE.NS" fullName="Reliance Industry ltd." />,
                                        "Market",
                                        "-",
                                        "Buy",
                                        "28",
                                        "2103.36",
                                        "60,236.26",
                                        "56.63",
                                        "Complete"
                                    ]} />
                                </tbody>
                            </table>
                        </div>

                    }


                  
                </div>
            </>
        )
    }
}

export default Orders;
