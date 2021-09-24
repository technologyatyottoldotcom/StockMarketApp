import React from 'react';
import Axios from 'axios';
import Coins from '../../../assets/icons/coins.svg';
import SuitCase from '../../../assets/icons/suitcase.svg';
import PortfolioValueIcon from '../../../assets/icons/portfoliovalue.svg';
import PortfolioChangeIcon from '../../../assets/icons/portfoliochange.svg';
import Hand from '../../../assets/icons/hand.svg';
import Eraser from '../../../assets/icons/eraser.svg';

const REQUEST_BASE_URL = process.env.REACT_APP_REQUEST_BASE_URL;



class PortfolioView extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            portfolio: [],
            sum: null,
            isLoaded: false,
            changeName: false,
            newName: '',
        }

        this.CreateTable = this.CreateTable.bind(this);
        this.EditName = this.EditName.bind(this);
        this.validateInput = this.validateInput.bind(this);
    }

    componentDidMount(){
        let { portfolioName } = this.props;
        // console.log('request');
        Axios.post(`${REQUEST_BASE_URL}/portfolio`, { portfolioName }).then(response => {
            console.log(response);
            this.setState({
                portfolio : response.data.portfolioData,
                sum : response.data.sum,
                isLoaded: true,
            })
        })
    }
    

    CashPos() {
        return (
            <>
                <div className="portfolio__cashposition">
                    <div className="cp__title">
                        <img src={Coins} alt=""/>
                        <span>Cash Position</span>
                    </div>
                    <div className="cp__value">
                        <span>Rs.&nbsp;</span>
                        <span style={{ fontSize: 20 }}>13,254.00</span>
                    </div>
                    
                </div>
                
            </>
        )
    }

    PortfolioDetails({image,title,value}) {
        return (
            <>
                <div className="cp__deatils__row">
                    <div className="cp__deatils__title">
                        <img src={image} alt=""/>
                        <p>{title}</p>
                    </div>
                    <div className="cp__deatils__value">
                        <span>{value}</span>
                    </div>
                </div>
                
            </>
        )
    }

    CreateRow({code, name, price, average, quantity, change, changePer}) {
        return (
            <div className="share__profile__wrapper">
                <div className="share__profile">
                    <div className="sp__profile">
                        <div className="sp__status"></div>
                        <div>
                            <div className="sp__name">{code}</div>
                            <div className="sp__fullname">{name}</div>
                        </div>
                    </div>
                    <div className="sp__price">
                        <div className="sp__income">{price}</div>
                        <div className="cp__change">{change}<span>({changePer})</span></div>
                    </div>
                </div>
                <div className="sp__quantity">
                    <div className="sp__quantity__value">
                        <img src={Hand} alt=""/><span>&nbsp;{quantity}</span>
                    </div>
                    <div className="sp__average">{average}</div>
                </div>
            </div>

        )
    }

    CreatePriceCol({ portfolioName, change, changePer }) {
        return (
            <>
                <div id="cp__portfolio__name">
                    {portfolioName}
                </div>
                <div className="cp__change">{change} <span>({changePer})</span>
                </div>
            </>
        )
    }

    EditName(){
        const { newName } = this.state;
        const { portfolioName } = this.props;
        return(
            <>
                <div className="edit__portfolio__name">
                    <input type="text" className="input__portfolio__name" value={newName} placeholder={portfolioName} onChange={(e) => this.validateInput(e)} />
                    <button onClick={() => {this.props.saveChangedName(portfolioName, newName); this.setState({newName: '', changeName: false}) }}>OK</button>
                    <button onClick={() => this.setState({ changeName: false, newName: '' })}>Cancel</button>
                </div>
            </>
        )
    }

    CreateTable(){
        const { portfolio } = this.state;
        const curr = (num) => parseFloat(num).toLocaleString('en-IN', {style: 'currency',currency: 'INR'})
        return portfolio.map((elem, i) => {
            return <this.CreateRow 
                        code={elem.StockCode}
                        name={elem.StockName}
                        quantity={elem.Quantity}
                        average={curr(elem.AverageCost)}
                        price={curr(elem.CurrentValue)}
                        change={"+1,035.20"}
                        changePer="+0.96%"   />
        })
    }

    validateInput(e){
        let input = e.target.value.toString().split(/[^a-zA-Z0-9 ]/).join('');
        if(input.length<=25)    this.setState({ newName: input })
    }


    render() {
        const { sum, isLoaded} = this.state;
        const curr = (num) => parseFloat(num).toLocaleString('en-IN', {style: 'currency',currency: 'INR'})

        if(!isLoaded)   
        {
            return(
                <div className="cashposition__portfolio__loading">
                    <p>Loading Portfolio...</p>
                </div>
            );

        }
        else
        {
            return (
                <>
                        <this.CashPos />
                        <div className="cashposition__portfolio">
                            <this.PortfolioDetails image={SuitCase} title="Portfolio Name" value={this.props.portfolioName} />
                            <this.PortfolioDetails image={PortfolioValueIcon} title="Portfolio Value" value="+106,000,78.00" />
                            <this.PortfolioDetails image={PortfolioChangeIcon} title="Portfolio Change" value="+0.95%" />
                        </div>
                        
                        <div className="cp__portfolio__details">
                            {this.state.changeName? <this.EditName /> : null }
                        </div>
    
                        <div className="cp__shares__container cp__portfolio__container" >
                            <this.CreateTable />
                        </div>
                    
                </>
            )
        }
        
    }
}

export default PortfolioView;
