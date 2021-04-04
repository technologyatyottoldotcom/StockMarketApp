import React from 'react';
import '../../../scss/Overview.scss';

class AnnualReports extends React.PureComponent{
    render(){
        const btnStyle={
            fontSize:'12px',
            fontWeight:'bold',
            background:'#2baae0',
            textAlign:'center',
            borderRadius:'45px',
            border:'none',
            padding:'2px 8px',
            cursor:'pointer',
            color : 'whitesmoke'
        }
        return(
            <>
              <div className='col-3'><b><small>Annual Reports</small></b></div>
              <button style={{...btnStyle,width:'60px',marginRight:'3px'}}>2016</button>
              <button style={{...btnStyle,width:'60px',marginRight:'3px'}}>2015</button>
              <button style={{...btnStyle,width:'60px',marginRight:'3px'}}>2014</button>
              <button style={{...btnStyle,width:'60px',marginRight:'3px'}}>2013</button>
            </>
        )
    }
}

class Snapshot extends React.PureComponent{
    render(){
        return(
            <>
                <div>
                    <div className="pt-4 pb-4 h5"><b>Snapshot</b></div>
                    <div>
                        <div className='row  snap-box'>
                            <div className="col-sm-4 snap-data">
                                <div><b>Market Cap</b></div>
                                <div>335,229 Cr.</div>
                            </div>
                            <div className="col-sm-4 snap-data">
                                <div><b>ROE</b></div>
                                <div>19.0 %</div>
                            </div>
                            <div className="col-sm-4 snap-data">
                                <div><b>Current ratio</b></div>
                                <div>1.23</div>
                            </div>
                        </div>
                        <div className='row  snap-box'>
                            <div className="col-sm-4 snap-data">
                                <div><b>Price to Earning</b></div>
                                <div>90.9</div>
                            </div>
                            <div className="col-sm-4 snap-data">
                                <div><b>ROE 3Yr</b></div>
                                <div>12.5 %</div>
                            </div>
                            <div className="col-sm-4 snap-data">
                                <div><b>Debt to equity</b></div>
                                <div>2.95</div>
                            </div>
                        </div>
                        <div className='row  snap-box'>
                            <div className="col-sm-4 snap-data">
                                <div><b>Price to book value</b></div>
                                <div>9.98</div>
                            </div>
                            <div className="col-sm-4 snap-data">
                                <div><b>ROCE</b></div>
                                <div>12.2 %</div>
                            </div>
                            <div className="col-sm-4 snap-data">
                                <div><b>Promoter holding</b></div>
                                <div>56.3 %</div>
                            </div>
                        </div>
                        <div className='row  snap-box'>
                            <div className="col-sm-4 snap-data">
                                <div><b>Dividend Yield</b></div>
                                <div>0.18 %</div>
                            </div>
                            <div className="col-sm-4 snap-data">
                                <div><b>ROCE 3Yr</b></div>
                                <div>12.5 %</div>
                            </div>
                        </div>
                        <div className='row  snap-box'>
                            <div className="col-sm-4 snap-data">
                                <div><b>Face Value</b></div>
                                <div>Rs. 2.00</div>
                            </div>
                            <div className="col-sm-4 snap-data">
                                <div><b>ROA</b></div>
                                <div>4.04 %</div>
                            </div>
                        </div>
                        <div className='row  snap-box'>
                            <div className="col-sm-4 snap-data">
                                <div><b>EPS</b></div>
                                <div>Rs. 61.2</div>
                            </div>
                            <div className="col-sm-4 snap-data">
                                <div><b>ROA 3Yr</b></div>
                                <div>3.92 %</div>
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
                <div className="h5"><b>About</b></div>
                <div style={{fontSize:'12px',paddingRight:'50px'}}>
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
                    <div className="h5"><b>Address</b></div>
                    <div style={{fontSize:"12px"}}>
                        Tower 5,<br />
                        3Rd To 6Th Floor International<br />
                        Infotech Park<br />
                        Vashi Station Complex<br />
                        400703 India<br />
                    </div>
                </div>
                <div className="pt-4">
                    <div style={{fontSize:'14px'}}><b>EXECUTIVE LEADERSHIP</b></div>
                    <div className="pt-2" style={{fontSize:"12px"}}>
                        Mukesh Dhirubhai Ambani
                        Chairman of the Board,
                        Managing Director
                                          </div>
                    <div className="pt-2" style={{fontSize:"12px"}}>
                        Alok Agarwal
                        Chief Financial Officer
                                          </div>
                    <div className="pt-2" style={{fontSize:"12px"}}>
                        Srikanth Venkatachari
                        Joint Chief Financial Officer
                                          </div>
                    <div className="pt-2" style={{fontSize:"12px"}}>
                        Savithri Parekh
                        Joint Company Secretary &
                        Compliance Officer
                                          </div>
                    <div className="pt-2" style={{fontSize:"12px"}}>
                        K. Sethuraman
                        Group Company Secretary,
                        Chief Compliance Officer
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
               <div className="container-fluid" style={{paddingLeft: '50px' }}>
                   <div className="row">
                       
                       <div className='col-sm-5'>
                             <Snapshot />
                       </div>



                      <div className="col-sm-7" >
                          <div className="row align-items-end"  style={{padding:0,margin:0,fontSize:"14px"}}>
                                <div className="col-sm-4" style={{padding:0,margin:0}}>
                                    <button style={{...btnStyle,width:'120px'}}>Oil & Gas</button>
                                </div>
                                <div className="col-auto">
                                <a href="http://www.ril.com" style={{color:'#645df9'}}>
                                    <span></span>
                                    ril.com
                                  </a>
                                </div>
                                <div className="col-auto">
                                <a href="https://www.bseindia.com/stock-share-price/reliance-industries-ltd/RELIANCE/500325/" style={{color:'#645df9'}}>
                                    <span></span>
                                    BSE: 500325
                                </a>
                                </div>
                                <div className="col-auto">
                                    <a href="https://www.nseindia.com/get-quotes/equity?symbol=RELIANCE" style={{color:'#645df9'}}>
                                        <span></span>
                                        NSE: RELIANCE
                                    </a>
                                </div>
                            </div>
                          <div className="row align-items-end justify-content-end pt-3">
                            <AnnualReports />
                          </div>
                          <div className="row pt-5"> 
                                <div className="col-sm-8">
                                   <About />
                                </div>
                                <div className="col">
                                    <Address />
                                </div>


                          </div>
                      </div>

                   </div>

               </div>
           </>
       )
    }
}

export {Overview}