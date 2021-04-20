import React from 'react';

class CreditRatings extends React.PureComponent{
    render(){
        return(
            <>
               <div style={{fontSize:12}}>
                    <div className="pt-2">
                        <div><a href="/" style={{color:'black'}}>Rating Update</a></div>
                        <small className="text-secondary">5 Feb from crisil</small>
                   </div>
                   <div className="pt-2">
                     <div><a href="/" style={{color:'black'}}>Rating Update</a></div>
                        <small className="text-secondary">1 Dec 2020 from crisil</small>
                   </div>
                   <div className="pt-2">
                      <div><a href="/" style={{color:'black'}}>Rating Update</a></div>
                   </div>
                   <div className="pt-2">
                      <div><a href="/" style={{color:'black'}}>Rating Update</a></div>
                      <small className="text-secondary">1 Dec 2020 from crisil</small>
                   </div>
                   <div className="pt-2">
                       <div><a href="/" style={{color:'black'}}>Rating Update</a></div>
                        <small className="text-secondary">1 Oct 2020 from icra</small>
                   </div>
                   <div className="pt-2">
                      <div><a href="/" style={{color:'black'}}>Rating Update</a></div>
                        <small className="text-secondary">1 Oct 2020 from icra</small>
                   </div>
                   <div className="pt-2">
                        <div><a href="/" style={{color:'black'}}>Rating Update</a></div>
                        <small className="text-secondary">1 Oct 2020 from icra</small>
                   </div><div className="pt-2">
                      <div><a href="/" style={{color:'black'}}>Rating Update</a></div>
                        <small className="text-secondary">1 Oct 2020 from icra</small>
                   </div>
               </div>
            </>
        )
    }
}

export {CreditRatings}