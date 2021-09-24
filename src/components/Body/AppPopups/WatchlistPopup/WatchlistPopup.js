import React from 'react';
import Axios from 'axios';
import Search from '../../../../assets/icons/search.svg';
import CloseIcon from '../../../../assets/icons/crossicon.svg';
import Pulse from '../../../Loader/Pulse';
import Plus from '../../../../assets/icons/plus.svg';

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
        return <span> { parts.map((part, i) => 
            <span key={i} 
                  className={part.toLowerCase() === query.toLowerCase() ? `${customClass}` : '' }>
                { part.toUpperCase() }
            </span>)
        } </span>;
        // return <span>{text}</span>
    }
}

class StockSuggestion extends React.PureComponent {
    constructor(props)
    {
        super(props)
    }

    render()
    {
        const { search,suggestions,addItem } = this.props;

        if(search.length > 0)
        {
            if(suggestions.length > 0)
            {
    
                return (
                    <>
                        {this.props.suggestions.map((s,index)=>{
                                return <p style={{fontSize: 10, padding: 0, alignItems:'center'}}
                                    key={s.code} 
                                    onClick={e => {addItem(this.props.suggestions[index])}}>
                                        <span style={{paddingLeft: 10}}>{s.symbol}</span> 
                                        <HighLightText text={s.company} query={search} customClass="search__highlight"/>
                                        <span>{s.exchange.exchange}</span>
                                </p>
                        })}
                    </>
                )
            }
            else
            {
                return (
                    <div className="stock__suggestions__loader">
                        <Pulse />
                        <span>Loading Stocks please wait...</span>
                    </div>
                )
            }
        }
        else
        {
            return (
                <div className="stock__suggestions__loader">
                    <span className="stock__suggestions__empty">
                        Nothing to show...
                    </span>
                </div>
            )
        }

        
    }
}

class WatchlistPopup extends React.Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            loading : true,
            search : '',
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
                loading : true,
                search : '',
                suggestions : [],
            })
            this.props.closePopup();
        }
    }

    handleSearchChange(e)
    {
        this.setState({
            search : e.target.value,
            loading : true,
        },()=>{
            if(this.state.search && this.state.search.length > 0)
            {
                this.setState({
                    suggestions : [],
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
        const { addItem } = this.props;

        return(
            <div className="watchlist__popup__overlay">
                <div className="watchlist__popup" ref={this.setComponentRef}>
                    <div className="watclist__popup__header">
                        <p>Add Symbol To Watchlist</p>
                        <span className="watchlist__popup__close" onClick={() => {this.props.closePopup();}}>
                            <img src={CloseIcon} alt="X"/>
                        </span>
                    </div>
                    <div className="watclist__popup__body">
                        <div className="stock__search">
                            <img src={Search} alt="" />
                            <input placeholder='Add Symbol' value={this.state.search} onChange={e => this.handleSearchChange(e)}/>    
                        </div>
                        <div className="stock__suggestions">
                            <StockSuggestion 
                                search={this.state.search}
                                loading={this.state.loading}
                                suggestions={this.state.suggestions} 
                                handleSelection={this.handleSelection} 
                                addItem={addItem}
                            />
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default WatchlistPopup;



