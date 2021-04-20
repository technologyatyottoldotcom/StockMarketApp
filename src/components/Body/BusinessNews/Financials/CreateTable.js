import React from 'react';
import Axios from 'axios';

// create the data tables of Financials , Cash-Flow , etc.
class CreateTable extends React.PureComponent{
    constructor(props){
        super(props);
        this.state={
            data : null,
            loading : null,
            type : this.props.type,
            field : this.props.field,
            stockcode : this.props.stockcode,
            oldProps : {}
        }

        this.numberWithCommas = this.numberWithCommas.bind(this)
        this.axiosRequest = this.axiosRequest.bind(this)
    }

componentDidMount(){
    this.axiosRequest()
}

axiosRequest(){
    Axios({
        method: 'GET',
        url: `http://localhost:3001/${this.state.type}/${this.state.field}/${this.state.stockcode}`,
        responseType: 'json',
        onDownloadProgress: (pEvnt) => {
          this.setState({loading: Math.round((pEvnt.loaded * 100) / pEvnt.total)})
        },
    })
    .then(
        (response) => {
            console.log(response.data)
            this.setState({
                data: response.data,
                loading : null,
            })  
        }
    )
    .catch(
        (error) => {
            this.setState({
                loading : null
            })
            console.log("AxiosRequest_error = ",error)
        }
    );
}

numberWithCommas(n) {
  let p = n.toString().split(".");
  p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
 return p.join(".");

}
  render(){
      var d = this.state.data
      d = d && typeof d === 'object' && d
      return(
          <>
            <div className="GlobalScrollBar financials__table__data" style={{ maxHeight : '80%', width : '100%' }}>
            <table className="create-table" style={{fontSize:'10px'}}>
              <thead>
                  <tr>
                      <th></th>
                       {
                        d && d.fields?.map((e,i)=>{
                            e = e?.replace(/_/g,' ')?.replace(/\b\w/g, l => l.toUpperCase()).replace(/ /g,"-")
                            return e && e !== 'StockCode' && e !== 'FieldName' ? (<th key={i+e}>{e}</th>) : null 
                        })
                      }
                  </tr>
              </thead>
              <tbody>
                  {
                      d && d.values?.map((e,i)=>{
                         if(typeof e==='object'){
                            return (
                                <tr key={i+Math.random()*999+Date.now()}>
                                    {
                                        e?.map((e,i)=>{
                                            if(i){
                                                return <td key={i+Math.random()*999+Date.now()+e}>{(e && e!==' ' && e!==null) ? this.numberWithCommas(e) :'--'}</td>
                                            }else return null
                                        })
                                    }
                                </tr>
                            ) 
                         }else return "Data Not Found"
                      })
                  }
              </tbody>
          </table>         
         
            </div>
          </>
      )
  }
}

export {CreateTable};
