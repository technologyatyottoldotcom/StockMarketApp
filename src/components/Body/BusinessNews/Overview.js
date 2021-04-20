import React from 'react';
import Website from '../../../assets/icons/website.svg';
import '../../../scss/Overview.scss';

class AnnualReports extends React.PureComponent{
    render(){
        return(
            <>
              <p>Annual Reports</p>
              <div>
                <button>2016</button>
                <button>2017</button>
                <button>2018</button>
                <button>2019</button>
                <button>2020</button>
              </div>
            </>
        )
    }
}

class Snapshot extends React.PureComponent{
    render(){
        return(
            <>
                <div className="bn__stock__navigation">
                    <img src={Website} alt="w"/>
                    <a target="_blank" href="http://www.ril.com">
                        <p>Website</p>
                    </a>
                    <a target="_blank" href="https://www.bseindia.com/stock-share-price/reliance-industries-ltd/RELIANCE/500325/">
                        <p>NSE</p>
                    </a>
                    <a target="_blank" href="https://www.nseindia.com/get-quotes/equity?symbol=RELIANCE">
                        <p>BSE</p>
                    </a>
                </div>
                <div className="bn__stock__snapbox">
                    <p>Snapshot</p>
                    <div className="bn__stock__data">
                        
                        <div className='snap__box'>
                            <div className="snap__data">
                                <div>Market Cap</div>
                                <div>1,236.56 Cr.</div>
                            </div>
                            <div className="snap__data">
                                <div>Price to Earnings</div>
                                <div>36.56</div>
                            </div>
                            <div className="snap__data">
                                <div>Price to Book</div>
                                <div>36.56</div>
                            </div>
                            <div className="snap__data">
                                <div>Dividend Yield</div>
                                <div>6.56 %</div>
                            </div>
                            <div className="snap__data">
                                <div>Face Value</div>
                                <div>Rs. 10.00</div>
                            </div>
                            <div className="snap__data">
                                <div>EPS</div>
                                <div>Rs. 36.56</div>
                            </div>
                            <div className="snap__data">
                                <div>Debt to Equity</div>
                                <div>156.23 %</div>
                            </div>
                            <div className="snap__data">
                                <div>Promoter Holding</div>
                                <div>75.25 %</div>
                            </div>
                           
                            
                        </div>
                        <div className='snap__box'>
                            <div className="snap__data">
                                <div>ROE (TTM)</div>
                                <div>36.56 %</div>
                            </div>
                            <div className="snap__data">
                                <div>ROE (3 Yr)</div>
                                <div>36.56 %</div>
                            </div>
                            <div className="snap__data">
                                <div>ROA (TTM)</div>
                                <div>36.56 %</div>
                            </div>
                            <div className="snap__data">
                                <div>ROA (3Yr)</div>
                                <div>36.56 %</div>
                            </div>
                            <div className="snap__data">
                                <div>ROCE (TTM)</div>
                                <div>36.56 %</div>
                            </div>
                            <div className="snap__data">
                                <div>ROCE (3 Yr)</div>
                                <div>36.56 %</div>
                            </div>
                            <div className="snap__data">
                                <div>Current Ratio</div>
                                <div>2.56</div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

class About extends React.PureComponent{
    render(){
        return(
            <>
                <p>About</p>
                <div>
                    3i Infotech Limited is an information technology (IT)
                    company. The Company provides a set of Internet
                    protocol (IP)-based software solutions with a range of
                    IT services. The Company operates through two segments
                    : IT Solutions and Transaction Services. The IT Solutions
                    segment includes sale of IT products developed by the
                    Company and provides IT services to various companies
                    on an outsourcing business model. The IT product
                    business includes packaged applications for the banking,
                    insurance, capital markets, asset and wealth management
                    (BFSI) space and an enterprise resource planning (ERP)
                    suite. Its IT services include system integration and IT
                    consulting through its business process outsourcing (BPO)
                    operations. The Transaction Services segment covers
                    management of back office operations for BFSI clients.
                    Through transaction service offerings, the Company
                    provides clients with services, such as human resources
                    and payroll management services, securitization
                    and contact center services.
                 </div>
            </>
        )
    }
}

class Address extends React.PureComponent{
    render(){
        return (
            <>
                <div>
                    <p>Address</p>
                    <div style={{fontSize:"12px"}}>
                        Tower 5,<br />
                        3Rd To 6Th Floor International<br />
                        Infotech Park<br />
                        Vashi Station Complex<br />
                        400703 India<br />
                    </div>
                </div>
                <div>
                    <p>Executive Leadership</p>
                    <div>
                        <span>Mukesh Dhirubhai Ambani</span>
                        <span>Chairman of the Board,
                        Managing Director</span>
                    </div>
                    <div>
                        <span>Alok Agarwal</span>
                        <span>Chief Financial Officer</span>
                    </div>
                    <div>
                        <span>Srikanth Venkatachari</span>
                        <span>Joint Chief Financial Officer</span>
                    </div>
                    <div>
                        <span>Savithri Parekh</span>
                        <span>Joint Company Secretary &
                        Compliance Officer</span>
                    </div>
                    <div>
                        <span>K. Sethuraman</span>
                        <span>Group Company Secretary,
                        Chief Compliance Officer</span>
                    </div>
                </div>

            </>
        )
    }
}


class Overview extends React.PureComponent {
    render() {
        const btnStyle={
            fontSize:'12px',
            fontWeight:'bold',
            background:'#2baae0',
            textAlign:'center',
            borderRadius:'45px',
            border:'none',
            padding:'4px 8px',
            cursor:'pointer',
            color : 'whitesmoke'
        }
       return (
           <>
               <div className="bn__stock__overview">
                       
                       <div className='bn__stock__price'>
                             <Snapshot />
                       </div>

                      <div className="bn__stock__details" >
                          <div className="bn__stock__report">
                            <AnnualReports />
                          </div>
                          <div className="bn__stock__info"> 
                                <div className="bn__stock__about">
                                   <About />
                                </div>
                                <div className="bn__stock__address">
                                    <Address />
                                </div>
                          </div>
                      </div>


               </div>
           </>
       )
    }
}

export {Overview}