import React from 'react';
import Axios from 'axios';
import Pulse from '../../../Loader/Pulse';

const REQUEST_BASE_URL = process.env.REACT_APP_REQUEST_BASE_URL;

class CreditRatings extends React.PureComponent{

    constructor(props)
    {
        super(props);
        this.state = {
            data : {},
            loading : true,
        }
    }

    componentDidMount()
    {
        this.axiosRequest();
    }

    componentDidUpdate(prevProps)
    {
        if(prevProps.stockcode !== this.props.stockcode)
        {
        this.setState({
            data : {},
            loading : true
        });
        this.axiosRequest();
        }
    }

    axiosRequest()
    {
        Axios({
            method: 'GET',
            url: `${REQUEST_BASE_URL}/creditrating/${this.props.stockcode}`,
            responseType: 'json',
            onDownloadProgress: (pEvnt) => {
                this.setState({loading: Math.round((pEvnt.loaded * 100) / pEvnt.total)})
            },
        })
        .then((response)=>{
            let res = response.data;
            this.setState({
                data : res.credit,
                loading : false
            });
        })
        .catch((error)=>{
            console.log(error);
        })
    }

    checkCompany(line)
    {
        let words = ['icra','care','crisil','fitch'];

        words.forEach((word)=>{
            if(line.includes(word))
            {
                line = line.replace(word,word.toUpperCase());
            }
        });

        return line;

    }

    render(){
        if(!this.state.loading)
        {

            const data = this.state.data;
            return(
                <>
                    <p className="credit__title">Credit Ratings</p>

                        {data.length > 0 ? 
                            <div className="bn__stock__credit">

                                {data.map((d,indx)=>{
                                    return (
                                        <>
                                            {d.title && 
                                                <>
                                                    <div key={indx} className="bn__credit__block">
                                                        <a href={d.link} className="bn__credit__title">{d.title}</a> 
                                                        <p className="bn__credit__text">{this.checkCompany(d.date)}</p>
                                                    </div>
                                                </>
                                            }
                                        </>
                                    )
                                })}
                            
                            </div>
                            
                            :

                            <div className="credit__empty">
                                <p>No Data To Show</p>
                            </div>
                        }
                    
                </>
            )
        }

        else
        {
            return (
                <div className="credit__loader">
                    <Pulse />
                </div>
            )
        }
    }
}

export {CreditRatings}