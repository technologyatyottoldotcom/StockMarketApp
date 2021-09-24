import React from 'react';
import Axios from 'axios';
import Researchsvg from '../../../assets/icons/research.svg';
import Pulse from '../../Loader/Pulse';
import Search from '../../../assets/icons/search.svg';
import RelateStocks from './RelateStocks';

const REQUEST_BASE_URL = process.env.REACT_APP_REQUEST_BASE_URL;

let topOption = ["Macroeconomic", "Industry", "Stocks", "Others"];

class Research extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            field: '',
            news: [],
            trending: [],
            filter: null,
            ws : null,
            FeedConnection : false,
        }
        this.TopSection = this.TopSection.bind(this)
        this.NewsTable = this.NewsTable.bind(this)
        this.changeField = this.changeField.bind(this)
        this.CrNews = this.CrNews.bind(this)
        this.TrendingTable = this.TrendingTable.bind(this)
        this.incrementDownload = this.incrementDownload.bind(this)
        this.reachedBottom = this.reachedBottom.bind(this)
        this.filterStocks = this.filterStocks.bind(this)
    }

    componentDidMount(){
        this.changeField("macroeconomic", 0);
        Axios.post(`${REQUEST_BASE_URL}/research_trending`, { len: 0 }).then(response => {
            console.log(response.data)
            this.setState({ trending: response.data });
        })
    }

    changeField(field, len){
        Axios.post(`${REQUEST_BASE_URL}/research_news`, { field, len }).then(response => {
            this.setState({
                field: field,
                news: response.data,
                filter: null
            })
        })
    }

    TopSection() {
        let { field } = this.state;
        return(
            <>
                <div className="row" style={{ fontSize: 13, marginBottom: 20 }}>
                    <div className="col-3">
                        <div style={{ marginTop: 5 }}>
                            <img src={Researchsvg} alt="Research" width={20} />
                            <span style={{ fontWeight: 'bold', fontSize: 12 }}>Research</span>

                        </div>

                    </div>
                    <div className="col">
                        <div style={{ textAlign: 'right', lineHeight: .1, float: 'right' }}>
                            <div style={{ marginRight: 60, marginTop: 5 }}>
                                <div style={{ margin: 10, marginRight: 0, padding: 0, fontWeight: 'bold', display: 'flex', fontSize: 'small'}}>
                                    {topOption.map(el =>  (
                                        <div style={{ marginRight: 10, cursor: 'pointer', color: el.toLowerCase()==field?'#00a0e3':'' }} 
                                            onClick={(e)=> {console.log(field); this.changeField(el.toLowerCase(), 0)}}>{el}</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.field==='stocks'?
                    <p style={{fontWeight: 700, width: '30%', boxShadow: '2px 2px 2px var(--shadow-primary) , -2px -2px 2px var(--shadow-primary)'}}>
                        <span className="stock__search__icon" style={{margin: 5}}>
                            <img src={Search} width={20} alt=""/>
                        </span>
                        <input type="text" placeholder="Search" style={{ height: 30, border: 'none', outline: 'none', paddingLeft: 5}}
                            onBlur={(e) => this.filterStocks(e)} />
                    </p>
                    : null 
                }
            </>
        )
    }
    

    CrNews({ heading, news, img, date, category, downloadLink, related }) {
        return (
            <div style={{ marginTop: 20, paddingTop: 5 }}>
                <div style={{ fontSize: 'x-small', margin: 3, display : 'flex'}}>
                    {related.split(',').map(el => (
                        <p style={{padding: '0 3ch 0 0', display : 'flex', alignItems : 'center'}}>{isNaN(el)?'NSE':'BSE'}:{el} <RelateStocks el={el} /></p>
                    ))}
                </div>
                
                <div className="row">
                    {img && <div className="col-3" style={{ alignSelf: 'center' }}>
                        <img src={img} width={100} style={{ height: 100, maxHeight: 300, borderRadius: 5 }} />
                    </div>
                    }
                    <div className="col">
                        <div style={{ fontWeight: 'bold' }}> {heading} </div>
                        {news && <div>{news}</div>}
                    </div>
                </div>
                <div className="row" style={{ marginTop: 15 }}>
                    <div className="col-8" style={{ fontWeight: 600 }}>
                        {date && <>
                            <span>{(new Date(date)).toLocaleDateString('en-IN')}</span>
                                &nbsp;&nbsp;
                        <span>Yottol Research </span>
                        </>}
                    </div>
                    {category && <p>Category : {category}</p>}
                    {downloadLink && <div className="col text-right" onClick={() => this.incrementDownload(date)}>
                        <a href={downloadLink} style={{ fontWeight: 'bold', color: '#00a0e3', textDecoration: 'none' }} target="_blank" >Download Report</a>
                    </div>
                    }
                </div>
            </div>
        )
    }

    incrementDownload(date){
        Axios.post(`${REQUEST_BASE_URL}/increment_download`, { date: date, field: this.state.field })
    }

    NewsTable(){
        let { news } = this.state;
        return(
            news.map(el => (
                <this.CrNews
                    heading={el.title}
                    news={el.description}
                    date={el.publishedDate}
                    img={el.imageLink}
                    downloadLink={el.reportLink}
                    related={el.relatedStocks}
                /> )
            )
        )
    }

    TrendingTable(){
        let { trending, field } = this.state;
        return(
            trending.map(el => (
                <this.CrNews
                    heading={el.title}
                    date={el.publishedDate}
                    category={el.classification}
                    downloadLink={el.reportLink}
                    related={el.relatedStocks}
                /> )
            )
        )
    }

    filterStocks(e){
        const { field } = this.state;
        const filter = e.target.value.toUpperCase()
        Axios.post(`${REQUEST_BASE_URL}/research_news`, { field, filter , len: 0 }).then(response => {
            this.setState({ news: response.data, filter })
        })

        e.target.value = null
    }

    reachedBottom(e, type){
        const { field, news, trending, filter } = this.state;
        let len = type==='news'? news.length:trending.length;

        const bottom = e.target.scrollHeight - e.target.scrollTop < e.target.clientHeight+1;
        if (bottom) {
                Axios.post(`${REQUEST_BASE_URL}/research_${type}`, { field, len, filter }).then(response => {
                    if(type==='news')   this.setState({ news: response.data })
                    else    this.setState({ trending: response.data })
                })
        }
    }

    render() {
        const { field } = this.state;

        if(field=='')   return<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 600}}><Pulse /></div>
        return (
            <>
                <div className="container" style={{ width: '98%', fontSize: 12, color: 'black' }}>
                    <this.TopSection />
                    <div className="row" style={{ marginTop: 15 }}>
                        <div className="col-7 GlobalScrollBar" style={{ maxHeight: 450 }} onScroll={(e) => this.reachedBottom(e, 'news')} >
                            {this.NewsTable()}
                            <div style={{display: 'flex', justifyContent: 'center', padding: 20}}><Pulse /></div>
                        </div>
                        <div className="col-5">
                            <div style={{ fontWeight: 900, backgroundColor: 'white', border: 'solid 2px white', position: 'sticky' }}>Trending</div>
                            <div className="GlobalScrollBar" style={{ maxHeight: 450, marginTop: -20 }} onScroll={(e) => this.reachedBottom(e, 'trending')} >
                                {this.TrendingTable()}
                                <div style={{display: 'flex', justifyContent: 'center', padding: 20}}><Pulse /></div>
                            </div>
                        </div>
                    </div>

                </div>

            </>
        )
    }
}

export default Research;
