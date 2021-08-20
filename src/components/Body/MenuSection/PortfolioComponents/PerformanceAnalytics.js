import React from "react";
import Axios from 'axios';
import Briefacase from '../../../../assets/icons/Briefcase.svg';
import XCrossmark from '../../../../assets/icons/X-crossmark.svg'
import ChevronDown from '../../../../assets/icons/ChevronDown.svg'
import { PiChart, PositiveAndNegativeBarChart, BaseLine } from "./PerformanceAnalyticsCharts.js"
import Spinner from "../../../Loader/Spinner";
import Pulse from "../../../Loader/Pulse";
import "../../../../css/Fade.css";

const REQUEST_BASE_URL = process.env.REACT_APP_REQUEST_BASE_URL;

export class PerformanceAnalytics extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded : false,
            isIndexLoaded : false,
            table1 : [],
            table2 : [],
            table3 : [],
            index : [],
            compareTo : null,
            industry : [],
            marketCap : [],
            loadingMsg: 'Calculating...',
            opacityMsg: true,
        }

        this.ThTd = this.ThTd.bind(this)
        this.Thead = this.Thead.bind(this)
        this.Tbody = this.Tbody.bind(this)
        this.CrTable = this.CrTable.bind(this)
        this.changeCompareTo = this.changeCompareTo.bind(this)
    }

    componentDidMount(){

        //this section is to set interval of msg while loading...
        this.changeLoadingMsg()

        //the fetching data and setting state start from here
        Axios.get(`${REQUEST_BASE_URL}/compare`).then(response => {
            this.setState({
                isLoaded : true,
                isIndexLoaded : true,
                table1 : response.data.table1,
                table2 : response.data.table2,
                table3 : response.data.table3,
                index : response.data.indexObj,
                compareTo : response.data.compareTo.split('_').join(' ')
            })
        });

        Axios.get(`${REQUEST_BASE_URL}/sector`).then(response => {
            this.setState({
                industry : response.data.industryTable,
                marketCap : response.data.marketCapTable
            })
        })
    }


    componentDidUpdate(prevProp, prevState){
        if(prevState.isLoaded && prevState.compareTo != this.state.compareTo){
            let index = this.state.compareTo.split(' ').join('_');
            Axios.post(`${REQUEST_BASE_URL}/compare/${index}`).then(response => {
                this.setState({
                    table1 : response.data.table1,
                    table2 : response.data.table2,
                    table3 : response.data.table3,
                    index : response.data.indexObj,
                    compareTo : response.data.compareTo.split('_').join(' '),
                    isIndexLoaded : true
                })
            })
        }
    }

    PortfolioNme() {
        return (
            <>
                <div style={{ display: 'flex', marginTop: 25 }}>
                    <div>
                        <img src={Briefacase} alt="Briefacase" />
                    </div>
                    <div style={{ color: '#8e8888', marginLeft: 8, fontSize: 12, alignSelf: 'flex-end' }}>
                        Portfolio Name
                </div>
                </div>
                <div style={{ textAlign: 'left', fontWeight: "bold", fontSize: 13 }}>
                    Growth Portfolio
                </div>
            </>
        )
    }

    CreatePriceCol({ heading, change, changePer, color = "#19E683" }) {
        const curr = (num) => parseFloat(num).toLocaleString('en-IN', {style: 'currency',currency: 'INR'});
        return (
            <>
                <div style={{ fontSize: 9, fontWeight: 'bold', textAlign: 'left' }}>
                    <div style={{ fontSize: 14 }}>
                        {curr(heading)}
                    </div>
                    <div style={{ color: color }}>
                        {curr(change)} 
                        {changePer && <span style={{ fontSize: 11, fontWeight: 800 }}>{`(${changePer})`}</span>}
                    </div>
                </div>
            </>
        )
    }

    NavPerformance({changeCompareTo}) {

        const options = ['Nifty 50', 'Nifty 100', 'Nifty 200'];
        const getList = () => {
            var list =[]
            options.forEach(el => {
                list.push(<option value={el}>{el}</option>)
            })
            return list
        }
        return <div className="row" style={{ fontSize: 13 }}>
            <div className="col-6" style={{ fontWeight: 'bold' }}>NAV Performance</div>
            <select style={{width: 'fit-content', height: 'fit-content', border: 0, outline: 'none'}} onChange={changeCompareTo}>
                {getList()}
            </select>
            {/*<div className="col-6" style={{ textAlign: 'right', fontWeight: 600 }}> Nifty 50  <img src={ChevronDown} alt="ChevronDown" />
            </div> */}
        </div>
    }

    changeCompareTo(e){
        this.setState({
            compareTo: e.target.value,
            isIndexLoaded : false
        })
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


    //createing table
    table1(){
        const {table1, compareTo, isIndexLoaded} = this.state;
        
        const getArr = (type) => {
            var arr = [];
            arr.push(<th style={{ paddingRight: 25, minWidth: 90 }} key={type + Math.random()}>{(type=='Compare')?compareTo:type}</th>)

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
                            <this.Tbody child={ (!isIndexLoaded)? ['Loading...'] : getArr('Compare')} />
                        </tbody>
                    </table>
                }   
            />
        )
    }


    table2(){
        const {table2, compareTo, isIndexLoaded} = this.state;

        const getArr = (type) => {
            var arr= [];
            if(type!='Date')    arr.push(<th style={{ paddingRight: 25, minWidth: 90 }} key={type + Math.random()}>{(type=='Compare')?compareTo:type}</th>)
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
                            <this.Tbody child={ (!isIndexLoaded)? ['Loading...'] : getArr('Compare')} />
                        </tbody>
                    </table>
                } style={{ marginTop: 70 }}
            />
        )
    }


    table3(){
        const {table3, compareTo, isIndexLoaded} = this.state;

        const getArr = (type) => {
            var arr = [];
            arr.push(<th style={{ paddingRight: 25, minWidth: 90 }} key={type + Math.random()}>{(type=='Compare')?compareTo:type}</th>)

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
                            <this.Tbody child={ (!isIndexLoaded)? ['Loading...'] : getArr('Compare')} />
                        </tbody>
                    </table>
                } style={{ marginTop: 50 }} />
        )
    }


    changeLoadingMsg(){

        let displayMsg = setInterval(()=>{
            if(this.state.isLoaded){
                clearInterval(displayMsg)
            }
            else{
                this.setState({loadingMsg: (this.state.loadingMsg=='Calculating...')? 'This may take a moment':'Calculating...'})
            }
        }, 3000);

        let displayOpacity = setInterval(() => {
            if(this.state.isLoaded){
                clearInterval(displayOpacity)
            }
            else{
                this.setState({opacityMsg: (this.state.opacityMsg==false)? true: false})
            }
        }, 1500);

    }


    render() {
        const {isLoaded, index, industry, marketCap, loadingMsg} = this.state;
        const {portfolioHome, currentValue} = this.props;

        if(!isLoaded)
            return(
                <div style={{minHeight: 500, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <div style={{display: 'flex', justifyContent: 'content', alignItems: 'center', flexDirection: 'column'}}>
                        <Pulse />
                        <p className={this.state.opacityMsg?'fadeIn':'fadeOut'}>{loadingMsg}</p>
                    </div>
                </div>
                )
        else{
            return (
                <>
                    <div className="container" style={{ maxWidth: 900 }}>
                        <div style={{ lineHeight: .5, cursor: 'pointer', float: 'right', width: 'fit-content', marginRight: 8}} onClick={portfolioHome}>
                            <span style={{ fontWeight: 800, fontSize: 12, border: 'solid 1px #CED0CD',
                                            borderRadius: 20 ,padding: '0 10px 0 10px', backgroundColor: '#F4F6F4'}}>Back</span>
                        </div>

                        <div className="row" style={{ marginTop: -20 }}>
                            <div className="col-6">
                                <div style={{ fontWeight: 800, fontSize: 13 }}>
                                    Portfolio Analytics
                                </div>
                                <div className="row" style={{ marginTop: -15, maxWidth: 350 }}>
                                    <div className="col">
                                        <this.PortfolioNme />
                                    </div>
                                    <div className="col" style={{ alignSelf: 'flex-end' }}>
                                        <this.CreatePriceCol
                                            heading={currentValue}
                                            change="+106000000.78"
                                            changePer="+0.95%"
                                        />
                                    </div>
                                </div>
                                <div className="row" style={{ marginTop: 15, maxWidth: 350 }}>
                                    <div className="col-10">
                                        <this.NavPerformance changeCompareTo={this.changeCompareTo}/>
                                    </div>
                                </div>

                                {/* charts div */}
                                <div className="GlobalScrollBar" style={{ maxHeight: 450, marginTop: 15 }}>
                                    <div style={{minHeight: 200, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                        {(!this.state.isIndexLoaded)? <Pulse /> : <BaseLine data={index} />}
                                    </div>
                                    <div style={{ marginTop: 45 }}>
                                        <p style={{ fontWeight: 'bold', marginBottom: -10 }}>Sector Allocation</p>
                                        <PiChart data={industry} radius={[55, 70]}/>
                                    </div>
                                    <div style={{ marginTop: 10 }}>
                                        <p style={{ fontWeight: 'bold', marginBottom: -5 }}>Sector Attribution (Since Imception)</p>
                                        <PiChart data={marketCap} radius={[30, 45]}/>
                                    </div>
                                </div>


                            </div>

                            <div className="col-6 GlobalScrollBar" style={{ maxHeight: 450, fontSize: 13, marginTop: 85 }}>

                                {this.table1()}
                                {this.table2()}
                                {this.table3()}

                            </div>
                        </div>

                    </div>
                </>
            )
        }
    }
}

export default PerformanceAnalytics
