import React from 'react';
import Axios from 'axios';
import Pulse from '../../../Loader/Pulse';
import CloseIcon from '../../../../assets/icons/closeicon.svg';


const REQUEST_BASE_URL = process.env.REACT_APP_REQUEST_BASE_URL;

class HighLightText extends React.PureComponent{

    constructor(props)
    {
        super(props);
    }

    render()
    {
        const text = this.props.text;
        const query = this.props.query;
        const customClass = this.props.customClass;
        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return <span> { parts.map((part, i) => 
            <span key={i} 
                  className={part.toLowerCase() === query.toLowerCase() ? `${customClass}` : '' }>
                { part.toUpperCase() }
            </span>)
        } </span>;
        // return <span>{text}</span>
    }
}

class StockSuggestion extends React.PureComponent{


    constructor(props)
    {
        super(props);
    }

    render()
    {

        const {search,suggestions,loading} = this.props;

        if(!loading)
        {
            if(search.length > 0 && suggestions.length > 0)
            {
                return (
                    <>
                        {suggestions.map((s,index)=>{
                            let stocksymbol = s.exchange.exchange === 'NSE' ? s.nse_code : s.bse_code;
                            return <p 
                                key={s.code} 
                                onClick={e => {this.props.selectedStock(s);this.props.handleSelection()}}
                                >
                                <span>{stocksymbol}</span>
                                <HighLightText text={s.company} query={search} customClass="search__highlight"/>
                                <span>{s.exchange.exchange}</span>
                            </p>
                        })}
                    </>
                )
            }
            else
            {
                return null;
            }
            
        }
        else
        {
            return <div className="search__loader">
                <Pulse />
                <p>Loading Stocks Please Wait ...</p>
            </div>
        }
    }
}

class StockOrderSearch extends React.PureComponent {

    constructor(props)
    {
        super(props);
        this.state = {
            search : '',
            loading : false,
            suggestions : []
        }

        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleSelection = this.handleSelection.bind(this);
        this.setComponentRef = this.setComponentRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }
    
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    setComponentRef(node)
    {
        this.ComponentRef = node;
    }

    handleSearchChange(e)
    {
        // console.log(e.target.value);
        this.setState({
            search : e.target.value
        },()=>{
            if(this.state.search && this.state.search.length > 0)
            {
                this.setState({
                    suggestions : [],
                    loading : true,
                },()=>{
                    this.getSuggestions();
                });
                
            }
            else
            {
                // console.log('-----EMPTY-----')
                this.setState({
                    suggestions : [],
                    loading : false,
                })
            }
        });
    }

    handleClickOutside(event) {
        if (this.ComponentRef && !this.ComponentRef.contains(event.target)) {

            
            this.setState({
                search : '',
                suggestions : [],
                loading : false,
            },()=>{
                this.props.closeSearchBox();
            })
        }
    }

    handleSelection()
    {
        this.setState({
            suggestions : [],
            search : ''
        })
    }

    getSuggestions()
    {
        Axios.get(`${REQUEST_BASE_URL}/stock/${this.state.search}`)
        .then((response) => {
            // console.log(response.data);
            let suggestions = response.data.suggestions;
            this.setState({
                loading : false,
                suggestions : suggestions
            })
        })
        .catch((error)=>{
            console.log(error);
        })
    }

    render() {

        // console.log(this.state.suggestions)

        return (
            <div className="stock__order__search" ref={this.setComponentRef}>
                <div className="stock__order__search__section">
                    <input placeholder="Search Stock" value={this.state.search} onChange={e => this.handleSearchChange(e)}/>
                    <div onClick={()=> {this.handleSelection()}}>
                        <img src={CloseIcon} alt=""/>
                    </div>
                </div>
                <div className="stock__order__search__container">
                    <StockSuggestion 
                        search={this.state.search} 
                        loading={this.state.loading} 
                        suggestions={this.state.suggestions}
                        selectedStock={this.props.selectedStock} 
                        handleSelection={this.handleSelection}
                    />
                </div>
            </div>
        )
    }
}

export default StockOrderSearch;
