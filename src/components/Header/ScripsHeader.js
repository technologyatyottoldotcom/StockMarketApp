import React from 'react';
import Axios from 'axios';
import ScripsMenu from './ScripsMenu';
import BrandLogo from '../../assets/icons/yottol.png';
import Search from '../../assets/icons/search.svg';

class StockSuggestion extends React.Component{
    constructor(props)
    {
        super(props)
    }

    render()
    {
        if(this.props.suggestions.length > 0)
        {
            // console.log(this.props.suggestions)

            return (
                <>
                    {this.props.suggestions.map((s,index)=>{
                        return <p 
                            key={s.code} 
                            onClick={e => {this.props.selectedStock({
                                code : s.code,
                                symbol : s.ric_code,
                                nse_code : s.nse_code,
                                bse_code : s.bse_code,
                                name : s.name
                            });this.props.handleSelection()}}>
                                <span>{s.symbol}</span> 
                                <span>{s.company}</span> 
                                <span>{s.exchange}</span>
                        </p>
                    })}
                </>
            )
        }
        else
        {
            return null
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
            suggestions : []
        }
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleSelection = this.handleSelection.bind(this);
    }

    handleSearchChange(e)
    {
        // console.log(e.target.value);
        this.setState({
            search : e.target.value
        },()=>{
            if(this.state.search && this.state.search.length > 0)
            {
                this.getSuggestions();
            }
        });
    }

    getSuggestions()
    {
        Axios.get(`http://localhost:3001/stock/${this.state.search}`)
        .then((response) => {
            // console.log(response.data);
            this.setState({
                suggestions : response.data.suggestions
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
                <p>Stocks</p>
            </div>
            <div className="stock__search">
                <div className="stock__search__icon">
                    <img src={Search} alt=""/>
                </div>
                <input placeholder='search' value={this.state.search} onChange={e => this.handleSearchChange(e)}/>

                <div className="stock__suggestions">
                    <StockSuggestion suggestions={this.state.suggestions} selectedStock={this.props.selectedStock} handleSelection={this.handleSelection}/>
                </div>
                {/* <Autocomplete
                    id="free-solo-demo"
                    // freeSolo
                    options={this.state.suggestions}
                    style={{width : '100%'}}
                    onChange={this.props.selectedStock}
                    getOptionLabel={option => option.company}
                    renderOption={(option) => {
                        <>
                            <span>{option.code}</span>
                        </>
                    }}
                    renderInput={(params) => (
                        <>
                                <TextField
                                    {...params} 
                                    fullWidth 
                                    label="Search" 
                                    onChange={e => this.handleSearchChange(e)}    
                                />
                        </>
                       
                    )}
                /> */}
                
            </div>
            <ScripsMenu setActiveElement={this.props.setActiveElement}/>
        </div>
    }
}

export default ScripsHeader;
