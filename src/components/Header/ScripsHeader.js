import React from 'react';
import Axios from 'axios';
import ScripsMenu from './ScripsMenu';
import BrandLogo from '../../assets/icons/yottol.png';
import Search from '../../assets/icons/search.svg';
import Pulse from '../Loader/Pulse';
import { Alert } from '../Body/CustomChartComponents/CustomAlert/CustomAlert';

const REQUEST_BASE_URL = process.env.REACT_APP_REQUEST_BASE_URL;;

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


class StockSuggestion extends React.PureComponent{


    constructor(props)
    {
        super(props);
    }

    render()
    {

        // console.log('RENDER' , this.props.search.length,this.props.suggestions.length)
        // console.log(this.props.suggestions.length);

        const {search,suggestions,loading} = this.props;

        // console.log(search,suggestions.length,loading)


        if(!loading)
        {

            const {cursor} = this.props;
            // console.log('CALL SUGGESTION')

            if(search.length > 0 && suggestions.length > 0)
            {
                return (
                    <>
                        {suggestions.map((s,index)=>{
                            let stocksymbol = s.exchange.exchange === 'NSE' ? s.nse_code : s.bse_code;
                            return <p 
                                key={s.code} 
                                onClick={e => {this.props.selectedStock(s);this.props.handleSelection()}}
                                className={cursor === index ? 'active' : ''}
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


class ScripsHeader extends React.Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            search : '',
            cursor : -1,
            loading : false,
            suggestions : []
        }
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
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
        // console.log(e.target.value);
        this.setState({
            search : e.target.value
        },()=>{
            if(this.state.search && this.state.search.length > 0)
            {
                this.setState({
                    suggestions : [],
                    cursor : -1,
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

    handleKeyDown(e) {
        const { cursor , suggestions } = this.state;

        if (e.keyCode === 38 && cursor >= 0) {
          this.setState( prevState => ({
            cursor: prevState.cursor - 1
          }))
        } else if (e.keyCode === 40 && cursor < suggestions.length - 1) {
          this.setState( prevState => ({
            cursor: prevState.cursor + 1
          }))
        }
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

    handleSelection()
    {
        this.setState({
            suggestions : [],
            search : ''
        })
    }

    render()
    {

        return <div className="app__header">
            <div className="brand__logo">
                <img src={BrandLogo} alt="Yottol"/>
            </div>
            <div className="brand__name">
                <p>Air</p>
            </div>
            <div className="stock__search" ref={this.setComponentRef}>
                <div className="stock__search__icon">
                    <img src={Search} alt=""/>
                </div>
                <input placeholder='Search' 
                    value={this.state.search} 
                    onChange={e => this.handleSearchChange(e)}
                    // onKeyDown={e => this.handleKeyDown(e)}
                />

                <div className="stock__suggestions">
                    <StockSuggestion 
                        search={this.state.search} 
                        loading={this.state.loading} 
                        suggestions={this.state.suggestions}
                        cursor={this.state.cursor} 
                        selectedStock={this.props.selectedStock} 
                        handleSelection={this.handleSelection}/>
                </div>
                
            </div>
            <ScripsMenu setActiveElement={this.props.setActiveElement}/>
        </div>
    }
}

export default ScripsHeader;
