import React, { Component } from 'react';
import Axios from 'axios';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css


import LeftArrow from '../../../../assets/icons/LeftArrow.svg';
import { BaseLine } from './BackTestCharts';
import { Alert } from '../../CustomChartComponents/CustomAlert/CustomAlert';

const REQUEST_BASE_URL = process.env.REACT_APP_REQUEST_BASE_URL;


class BackTestResult extends Component {

    constructor(props) {
        super(props);
        this.state = {
            withBacktest: false
        }

        this.TopSection = this.TopSection.bind(this)
        this.ThTd = this.ThTd.bind(this)
        this.Thead = this.Thead.bind(this)
        this.Tbody = this.Tbody.bind(this)
        this.CrTable = this.CrTable.bind(this)
        this.SaveButton = this.SaveButton.bind(this)
        this.savePortfolio = this.savePortfolio.bind(this)
        this.confirmBox = this.confirmBox.bind(this)
    }


    TopSection() {
        return <div style={{ fontSize: 15, marginLeft: 10 }}>
            <div>
                <span style={{ color: '#00a0e3', fontWeight: 'bold' }}>Create Smallcase Strategy</span>
            </div>
        </div>
    }


    ThTd({ ele, type = "td", style = {}, props = {} }) {
        return (
            type === "td" ?
                <>
                    <td style={{ ...style }} {...props}>{ele}</td>
                </>
                :
                <>
                    <th style={{ ...style }} {...props}>{ele}</th>
                </>
        )
    }

    Thead({ child = [], type = "td", style = {} }) {
        return <thead style={{ fontWeight: 600, ...style }}>
            <tr>
                {child.map((v, i) => {
                    var mStyle = {}, ele = v
                    if (Array.isArray(v)) {
                        if (v[1]) {
                            if (v[1].style) mStyle = v.style;
                            if (v[1].type) type = v.type
                        }
                        ele = v[0]
                    }

                    let prop = {
                        key: i + Math.random() + 6,
                        style: {
                            minWidth: child[i + 1] ? 50 : 40,
                            paddingBottom: 5,
                            ...mStyle
                        }
                    }

                    return <this.ThTd
                        ele={ele}
                        type={type}
                        {...prop}
                    />


                })}
            </tr>
        </thead>
    }

    Tbody({ child = [], style = {} }) {
        return <tr style={{ ...style }}>
            {
                child.map((v, i) => {
                    if ('object' === typeof v && v.type === "th") return v;
                    else return <td key={i + Math.random() * 63}>{v}</td>;
                })

            }
        </tr>
    }

    CrTable({ text, table, style = { marginTop: 10 } }) {
        return <div style={{ ...style }}>
            <div style={{ fontWeight: 700 }}>{text}</div>
            <div style={{ marginTop: 20, marginLeft: 15 }}>
                {table}
            </div>
        </div>
    }

    SaveButton(){
        const { backTestResult } = this.props.state;
        return(
            <div className="row" style={{ fontSize: 13, fontWeight: 'bold', position: 'fixed', bottom: 30, left: '30%'}}>
                <div className="col-5" style={{cursor: 'pointer'}}
                    onClick={()=>{ this.setState({withBacktest: true}, ()=> {
                        this.confirmBox('Are you sure you want to save the smallCase portfolio along with backtest result? If you say yes, then your previous data, if any, will be overridden.')
                    }) } }>
                    Save Result
                </div>
                <div className='col-6' style={{cursor: backTestResult.length>0? 'not-allowed':'pointer', opacity: backTestResult.length>0? 0.3:1}}
                    onClick={()=>{ if(backTestResult<=0)    this.setState({withBacktest: false}, ()=> {
                        this.confirmBox('Do you want to save only the smallCase portfolio? If you say yes, only portfolio will be save without the backtest result and previous portfolio, if any, will be overwridden.')
                    })}}>
                    Create Without Result
                </div>
            </div>
        );
    }


    //createing table
    table1(){
        const {table1} = this.props;
        const {benchmark} = this.props.state;
        
        const getArr = (type) => {
            var arr = [];
            arr.push(<th style={{ paddingRight: 25, minWidth: 90 }} key={type + Math.random()}>{(type=='Compare')?benchmark:type}</th>)

            if(type =='Portfolio')  table1.forEach(el => arr.push(el.portfolio))
            else if(type =='Compare')    table1.forEach(el => arr.push(el.compare))

            arr.push(<span style={{ color: '#d63384' }}>{arr.pop().toString()}</span>)
            return arr
        }

        return(
            <this.CrTable text={"Discrete Performance since("+new Date(table1[table1.length-1].start).toLocaleString('en-US',{year:'numeric',month:'short',day:'numeric'})+")"}
                table={
                    <table>
                        <this.Thead type="td" child={[ "", "Mtd", "1m", "3m", "6m", "1y", "Sl" ]} />
                        <tbody style={{ marginTop: 20 }}>
                            <this.Tbody child={ getArr('Portfolio')} />
                            <this.Tbody child={ getArr('Compare')} />
                        </tbody>
                    </table>
                }   
            />
        )
    }


    table2(){
        const {table2} = this.props;
        const {benchmark} = this.props.state;

        const getArr = (type) => {
            var arr= [];
            if(type!='Date')    arr.push(<th style={{ paddingRight: 25, minWidth: 90 }} key={type + Math.random()}>{(type=='Compare')?benchmark:type}</th>)
            else    arr.push("")

            if(type =='Date')   table2.forEach(el => arr.push(el.end.split('-').shift()))
            else if(type =='Portfolio')  table2.forEach(el => arr.push(el.portfolio))
            else if(type =='Compare')    table2.forEach(el => arr.push(el.compare))

            return arr
        }

        return(
            <this.CrTable
                table={
                    <table>
                        <this.Thead type="td" child={ getArr('Date')} />
                        <tbody style={{ marginTop: 20 }}>
                            <this.Tbody child={ getArr('Portfolio')} />
                            <this.Tbody child={ getArr('Compare')} />
                        </tbody>
                    </table>
                } style={{ marginTop: 70 }}
            />
        )
    }


    table3(){
        const {table3} = this.props;
        const {benchmark} = this.props.state;

        const getArr = (type) => {
            var arr = [];
            arr.push(<th style={{ paddingRight: 25, minWidth: 90 }} key={type + Math.random()}>{(type=='Compare')?benchmark:type}</th>)

            if(type =='Portfolio')  table3.forEach(el => arr.push(el.portfolio))
            else if(type =='Compare')    table3.forEach(el => arr.push(el.compare))

            arr.push("","");
            return arr
        }

        return(
            <this.CrTable text="Quant Analytics"
                table={
                    <table>
                        <this.Thead type="td" child={[ "", "Annual Returns", "Annual Risk", "Sharpe Ratio", "Beta", "","" ]} />
                        <tbody style={{ marginTop: 20 }}>
                            <this.Tbody child={ getArr('Portfolio')} />
                            <this.Tbody child={ getArr('Compare')} />
                        </tbody>
                    </table>
                } style={{ marginTop: 50 }} />
        )
    }


    async savePortfolio(){

        let pan = 'ALQPD7054E';
        const { isStrategyExist, createdDate, strategy, methodology, objective, frequency, benchmark, price } = this.props.state;
        const { portfolio } = this.props;
        const { withBacktest } = this.state;

        const index = withBacktest? this.props.index : null;
        let success = (await Axios.post(`${REQUEST_BASE_URL}/update_smallCase_details`,
            { isStrategyExist, createdDate, pan, strategy, methodology, objective, frequency, benchmark, price, portfolio, withBacktest, index })).data.success;

        if(success) this.props.createdOrModified();
    }


    confirmBox(msg){
        confirmAlert({
            title: 'Confirmation',
            message: msg,
            buttons: [
                {   label: 'Yes',
                    onClick: () => { this.savePortfolio() }
                },
                {   label: 'No',
                    onClick: () => { return }
                }
            ]
        })
    }


    displayAlert = (msg) => {
        Alert({
            TitleText : 'Warning',
            Message : msg,
            AutoClose : {
                Active : true,
                Line : true,
                LineColor : '#00a0e3',
                Time : 3
            }
        })
    }


    
    render() {
        return (
            <>
                <div className="container" style={{ fontSize: 11 , color: 'black', paddingLeft: 20, marginTop: -10, paddingTop: 0}}>
                    <this.TopSection />

                    <div style={{fontWeight: 900, fontSize: 12, width: 'fit-content', position: 'fixed', top: 20, right: 50 }}>
                        <div style={{cursor: 'pointer'}} onClick={this.props.backButton}>
                            <img src={LeftArrow} alt="LeftArrow" style={{width: 11, marginRight: 2}} />
                            Back
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-6 GlobalScrollBar" style={{ maxHeight: 380, marginTop: 20 }}>
                            <div style={{ minHeight: 380, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <BaseLine data={this.props.index} benchmark={this.props.state.benchmark}/>
                            </div>
                        </div>
                        
                        <div className="col-6 GlobalScrollBar" style={{ maxHeight: 450, fontSize: 13, marginTop: 20 }}>
                            {this.table1()}
                            {this.table2()}
                            {this.table3()}
                        </div>

                    </div>
                    <this.SaveButton />
                </div> 
            </>
        );
    }
}


export default BackTestResult;