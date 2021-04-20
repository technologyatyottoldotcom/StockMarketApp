import React from 'react';
import Axios from 'axios';
import ScripsMenu from './ScripsMenu';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import BrandLogo from '../../assets/icons/yottol.png';
import Search from '../../assets/icons/search.svg';
import {
    fade,
    ThemeProvider,
    withStyles,
    makeStyles,
    createMuiTheme,
  } from '@material-ui/core/styles';

  const CssTextField = withStyles({
    root: {
      '& label.Mui-focused': {
        color: 'green',
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: 'green',
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: 'red',
        },
        '&:hover fieldset': {
          borderColor: 'yellow',
        },
        '&.Mui-focused fieldset': {
          borderColor: 'green',
        },
      },
    },
  })(TextField);

class ScripsHeader extends React.Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            search : null,
            suggestions : []
        }
        this.handleSearchChange = this.handleSearchChange.bind(this);
    }

    handleSearchChange(e)
    {
        console.log(e.target.value);
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
            console.log(response.data);
            this.setState({
                suggestions : response.data.suggestions
            })
        })
        .catch((error)=>{
            console.log(error);
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
                {/* <div className="stock__search__icon">
                    <img src={Search} alt=""/>
                </div> */}
                
                <Autocomplete
                    id="free-solo-demo"
                    freeSolo
                    options={this.state.suggestions.map((option) => `${option.company} : ${option.code}`)}
                    style={{width : '100%'}}
                    onChange={this.props.selectedStock}
                    renderInput={(params) => (
                        <>
                                <TextField {...params} fullWidth label="Search" onChange={e => this.handleSearchChange(e)}/>
                        </>
                       
                    )}
                />
                
            </div>
            <ScripsMenu setActiveElement={this.props.setActiveElement}/>
        </div>
    }
}

export default ScripsHeader;
