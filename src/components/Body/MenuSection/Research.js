import React from 'react';
import {QuoteNav} from '../BusinessNews/QuoteNav';
import Researchsvg from '../../../assets/icons/research.svg';

class Research extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            field: 'macroeconomic'
        }
        this.TopSection = this.TopSection.bind(this)
    }
    TopSection() {
        return <div className="row" style={{ fontSize: 13 }}>
            <div className="col-3">
                <div style={{ marginTop: 5 }}>
                    <img src={Researchsvg} alt="Research" width={20} />
                    <span style={{ fontWeight: 'bold', fontSize: 12 }}>Research</span>

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

    CrNews({ heading, news, img, date, category, downloadLink }) {
        return (
            <div style={{ marginTop: 20, paddingTop: 5 }}>
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
                            <span>{date}</span>
                                &nbsp;&nbsp;
                        <span>Yottol Research </span>
                        </>}
                        {category && <> &nbsp;&nbsp;<span>Category : {category}</span> </>}
                    </div>
                    {downloadLink && <div className="col text-right">
                        <a href={downloadLink} style={{ fontWeight: 'bold', color: '#00a0e3', textDecoration: 'none' }} target="_blank" >Download Report</a>
                    </div>
                    }
                </div>
            </div>
        )
    }

    render() {
        return (
            <>
                <div className="container" style={{ width: 800, fontSize: 12, color: 'black' }}>
                    <this.TopSection />
                    <div className="row" style={{ marginTop: 30 }}>
                        <div className="col-7 GlobalScrollBar" style={{ maxHeight: 400 }}>
                            <this.CrNews
                                heading="Mysuru: Rs 20 lakh collected via fundraiser to help rebuild library owned by daily-wage worker"
                                news="After a library owned by a daily wage worker in Mysuru was burnt down on Friday, a fundraiser was set up to help him rebuild the library. As of Monday, Rs 20 lakh has been collected for the work."
                                date="13/04/2021"
                                img="https://akm-img-a-in.tosshub.com/indiatoday/images/story/202104/fire_0_1200x768.jpeg?PTv_hoNMcDMvGIN0OMyB5PpB4k0LrpCU&size=770:433"
                                downloadLink="https://akm-img-a-in.tosshub.com/indiatoday/images/story/202104/fire_0_1200x768.jpeg?PTv_hoNMcDMvGIN0OMyB5PpB4k0LrpCU&size=770:433"
                            />
                            <this.CrNews
                                heading="Mysuru: Rs 20 lakh collected via fundraiser to help rebuild library owned by daily-wage worker"
                                news="After a library owned by a daily wage worker in Mysuru was burnt down on Friday, a fundraiser was set up to help him rebuild the library. As of Monday, Rs 20 lakh has been collected for the work."
                                date="13/04/2021"
                                img="https://akm-img-a-in.tosshub.com/indiatoday/images/story/202104/fire_0_1200x768.jpeg?PTv_hoNMcDMvGIN0OMyB5PpB4k0LrpCU&size=770:433"
                                downloadLink="https://akm-img-a-in.tosshub.com/indiatoday/images/story/202104/fire_0_1200x768.jpeg?PTv_hoNMcDMvGIN0OMyB5PpB4k0LrpCU&size=770:433"
                            />
                            <this.CrNews
                                heading="Mysuru: Rs 20 lakh collected via fundraiser to help rebuild library owned by daily-wage worker"
                                news="After a library owned by a daily wage worker in Mysuru was burnt down on Friday, a fundraiser was set up to help him rebuild the library. As of Monday, Rs 20 lakh has been collected for the work."
                                date="13/04/2021"
                                img="https://akm-img-a-in.tosshub.com/indiatoday/images/story/202104/fire_0_1200x768.jpeg?PTv_hoNMcDMvGIN0OMyB5PpB4k0LrpCU&size=770:433"
                                downloadLink="https://akm-img-a-in.tosshub.com/indiatoday/images/story/202104/fire_0_1200x768.jpeg?PTv_hoNMcDMvGIN0OMyB5PpB4k0LrpCU&size=770:433"
                            />
                            <this.CrNews
                                heading="Mysuru: Rs 20 lakh collected via fundraiser to help rebuild library owned by daily-wage worker"
                                news="After a library owned by a daily wage worker in Mysuru was burnt down on Friday, a fundraiser was set up to help him rebuild the library. As of Monday, Rs 20 lakh has been collected for the work."
                                date="13/04/2021"
                                img="https://akm-img-a-in.tosshub.com/indiatoday/images/story/202104/fire_0_1200x768.jpeg?PTv_hoNMcDMvGIN0OMyB5PpB4k0LrpCU&size=770:433"
                                downloadLink="https://akm-img-a-in.tosshub.com/indiatoday/images/story/202104/fire_0_1200x768.jpeg?PTv_hoNMcDMvGIN0OMyB5PpB4k0LrpCU&size=770:433"
                            />
                            <this.CrNews
                                heading="Mysuru: Rs 20 lakh collected via fundraiser to help rebuild library owned by daily-wage worker"
                                news="After a library owned by a daily wage worker in Mysuru was burnt down on Friday, a fundraiser was set up to help him rebuild the library. As of Monday, Rs 20 lakh has been collected for the work."
                                date="13/04/2021"
                                img="https://akm-img-a-in.tosshub.com/indiatoday/images/story/202104/fire_0_1200x768.jpeg?PTv_hoNMcDMvGIN0OMyB5PpB4k0LrpCU&size=770:433"
                                downloadLink="https://akm-img-a-in.tosshub.com/indiatoday/images/story/202104/fire_0_1200x768.jpeg?PTv_hoNMcDMvGIN0OMyB5PpB4k0LrpCU&size=770:433"
                            />
                            <this.CrNews
                                heading="Mysuru: Rs 20 lakh collected via fundraiser to help rebuild library owned by daily-wage worker"
                                news="After a library owned by a daily wage worker in Mysuru was burnt down on Friday, a fundraiser was set up to help him rebuild the library. As of Monday, Rs 20 lakh has been collected for the work."
                                date="13/04/2021"
                                img="https://akm-img-a-in.tosshub.com/indiatoday/images/story/202104/fire_0_1200x768.jpeg?PTv_hoNMcDMvGIN0OMyB5PpB4k0LrpCU&size=770:433"
                                downloadLink="https://akm-img-a-in.tosshub.com/indiatoday/images/story/202104/fire_0_1200x768.jpeg?PTv_hoNMcDMvGIN0OMyB5PpB4k0LrpCU&size=770:433"
                            />
                        </div>
                        <div className="col-5">
                            <div style={{ fontWeight: 900 }}>Trending</div>
                            <div className="GlobalScrollBar" style={{ maxHeight: 400, marginTop: -20 }}>
                                <this.CrNews
                                    heading="Mysuru: Rs 20 lakh collected via fundraiser to help rebuild library owned by daily-wage worker"
                                    date="13/04/2021"
                                    category="Stock"
                                    downloadLink="https://akm-img-a-in.tosshub.com/indiatoday/images/story/202104/fire_0_1200x768.jpeg?PTv_hoNMcDMvGIN0OMyB5PpB4k0LrpCU&size=770:433"
                                />
                                <this.CrNews
                                    heading="Mysuru: Rs 20 lakh collected via fundraiser to help rebuild library owned by daily-wage worker"
                                    date="13/04/2021"
                                    category="Stock"
                                    downloadLink="https://akm-img-a-in.tosshub.com/indiatoday/images/story/202104/fire_0_1200x768.jpeg?PTv_hoNMcDMvGIN0OMyB5PpB4k0LrpCU&size=770:433"
                                />
                                <this.CrNews
                                    heading="Mysuru: Rs 20 lakh collected via fundraiser to help rebuild library owned by daily-wage worker"
                                    date="13/04/2021"
                                    category="Stock"
                                    downloadLink="https://akm-img-a-in.tosshub.com/indiatoday/images/story/202104/fire_0_1200x768.jpeg?PTv_hoNMcDMvGIN0OMyB5PpB4k0LrpCU&size=770:433"
                                />
                                <this.CrNews
                                    heading="Mysuru: Rs 20 lakh collected via fundraiser to help rebuild library owned by daily-wage worker"
                                    date="13/04/2021"
                                    category="Stock"
                                    downloadLink="https://akm-img-a-in.tosshub.com/indiatoday/images/story/202104/fire_0_1200x768.jpeg?PTv_hoNMcDMvGIN0OMyB5PpB4k0LrpCU&size=770:433"
                                />
                                <this.CrNews
                                    heading="Mysuru: Rs 20 lakh collected via fundraiser to help rebuild library owned by daily-wage worker"
                                    date="13/04/2021"
                                    category="Stock"
                                    downloadLink="https://akm-img-a-in.tosshub.com/indiatoday/images/story/202104/fire_0_1200x768.jpeg?PTv_hoNMcDMvGIN0OMyB5PpB4k0LrpCU&size=770:433"
                                />
                                <this.CrNews
                                    heading="Mysuru: Rs 20 lakh collected via fundraiser to help rebuild library owned by daily-wage worker"
                                    date="13/04/2021"
                                    category="Stock"
                                    downloadLink="https://akm-img-a-in.tosshub.com/indiatoday/images/story/202104/fire_0_1200x768.jpeg?PTv_hoNMcDMvGIN0OMyB5PpB4k0LrpCU&size=770:433"
                                />
                                <this.CrNews
                                    heading="Mysuru: Rs 20 lakh collected via fundraiser to help rebuild library owned by daily-wage worker"
                                    date="13/04/2021"
                                    category="Stock"
                                    downloadLink="https://akm-img-a-in.tosshub.com/indiatoday/images/story/202104/fire_0_1200x768.jpeg?PTv_hoNMcDMvGIN0OMyB5PpB4k0LrpCU&size=770:433"
                                />
                            </div>
                        </div>
                    </div>

                </div>

            </>
        )
    }
}

export default Research;
