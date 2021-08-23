import React from 'react';
import Axios from 'axios';
import Search from '../../../../assets/icons/search.svg';
import Pulse from '../../../Loader/Pulse';
import Plus from '../../../../assets/icons/plus.svg'

const REQUEST_BASE_URL = process.env.REACT_APP_REQUEST_BASE_URL || `http://localhost:9000`;

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
        console.log(customClass)
        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return <span style={{fontSize : '8px', flex : '5'}}> { parts.map((part, i) => 
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
        super(props)
    }

    render()
    {
        const {addTableRow} = this.props;

        const {search,suggestions,loading} = this.props;

        if(!loading)
        {

            if(search.length > 0 && suggestions.length > 0)
            {
                return (
                    <>
                        {this.props.suggestions.map((s,index)=>{
                            let stocksymbol = s.exchange.exchange === 'NSE' ? s.nse_code : s.bse_code;
                            return <p style={{fontSize: 8, padding: 0, alignItems:'center'}}
                                key={s.code} 
                                onClick={e => {addTableRow(this.props.suggestions[index])}}>
                                    <span style={{fontSize : '10px',flex : '3',paddingLeft: '5px'}}>{stocksymbol}</span> 
                                    <HighLightText text={s.company} query={search} customClass="search__highlight"/>
                                    <span style={{fontSize : '10px',flex : '1'}}>{s.exchange.exchange}</span>
                                    <span style={{fontSize: 15, color: '#00a0e3', fontWeight: 'bold',flex : '1'}}>+</span>
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
                <p>Loading...</p>
            </div>
        }
    }
}

class PortfolioSearchBar extends React.PureComponent
{

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


    handleClickOutside(event) {
        if (this.ComponentRef && !this.ComponentRef.contains(event.target)) {
            this.setState({
                search : '',
                suggestions : [],
                loading : false,
            })
        }
    }

    handleSearchChange(e)
    {
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
                this.setState({
                    suggestions : [],
                    loading : false,
                })
            }
        });
    }

    getSuggestions()
    {
        Axios.get(`${REQUEST_BASE_URL}/stock/${this.state.search}`)
        .then((response) => {
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

    handleSelection()
    {
        this.setState({
            suggestions : [],
            search : ''
        })
    }

    

    render()
    {
        const {addTableRow} = this.props;

        return <div className="app__header" style={{padding: 0 }}>
            <div className="stock__search" ref={this.setComponentRef} style={{boxShadow: 'none', borderBottom: 'solid 1px #ccc', borderRadius: 0}} >
                <div className="stock__search__icon" style={{marginLeft: 0}}>
                    <img src={Search} alt=""/>
                </div>
                <input placeholder='Add Symbol' value={this.state.search} onChange={e => this.handleSearchChange(e)}/>

                <div className="stock__suggestions">
                    <StockSuggestion 
                        search={this.state.search} 
                        suggestions={this.state.suggestions} 
                        loading={this.state.loading}
                        handleSelection={this.handleSelection} 
                        addTableRow={addTableRow}
                    />
                </div>
            </div>
        </div>
    }
}

export default PortfolioSearchBar;
