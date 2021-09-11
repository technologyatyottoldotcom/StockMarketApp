import React from 'react';
import ArrowUp from '../../../../assets/icons/ArrowUp.svg';
import ArrowDown from '../../../../assets/icons/ArrowDown.svg';
import Calculator from '../../../../assets/icons/calculator.svg';
import '../../../../css/CustomNumberBox.css';

class CustomNumberBox extends React.PureComponent {

    constructor(props)
    {
        super(props);

        this.state = {
            value : this.props.defaultvalue || 1,
            subtype : this.props.subtype || "arrows",
            isCalculatorOpen : false
        }

        this.setComponentRef = this.setComponentRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleUpDown = this.handleUpDown.bind(this);
        this.toggleCalculator = this.toggleCalculator.bind(this);
        this.closeCalculator = this.closeCalculator.bind(this);
    }

    setComponentRef(node)
    {
        this.ComponentRef = node;
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }
    
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleUpDown(up,change=1)
    {
        let value = up ? parseInt(this.state.value) +change : parseInt(this.state.value) -change;

        this.setState({
            value
        },()=>{
            this.props.onChangeValue(this.state.value);
        });
    }

    handleChange(e)
    {
        let value = parseInt(e.target.value.replace(/[^0-9]*/g,''));
        this.setState({
            value : value
        },()=>{
            this.props.onChangeValue(this.state.value);
        });

        
    }

    toggleCalculator()
    {
        this.setState((prevState)=>({
            isCalculatorOpen : !prevState.isCalculatorOpen
        }));
    }

    closeCalculator()
    {
        this.setState({
            isCalculatorOpen : false
        })
    }

    handleClickOutside(event) {

        if (this.ComponentRef && !this.ComponentRef.contains(event.target)) {
            this.closeCalculator();
        }
    }

    render() {

        const {width,height} = this.props;
        const {subtype,isCalculatorOpen} = this.state;

        return (
            <div className="custom-numberbox" style={{width : width , height : height}} ref={this.setComponentRef}>
                <div className="custom-numberbox-container">
                    <div className="numberbox-input">
                        <input type="number" value={this.state.value} onInput={(e)=> this.handleChange(e)}/>
                    </div>
                    {subtype === "arrows" ? 
                        <div className="numberbox-arrows">
                            <div className="numberbox-arrow numberbox-arrow-up" onClick={()=> this.handleUpDown(true)}>
                                <img src={ArrowUp} alt="+"/>
                            </div>
                            <div className="numberbox-arrow numberbox-arrow-down" onClick={()=> this.handleUpDown(false)}>
                                <img src={ArrowDown} alt="-"/>
                            </div>
                        </div>
                        :
                        <div className="numberbox-calculator">
                            <div className="numberbox-calculator-wrapper" onClick={()=> {this.toggleCalculator()}}>
                                <img src={Calculator}/>
                            </div>
                            {isCalculatorOpen && 
                                <div className="number-box-calculator-options">
                                    <div className="calculator-option negative-list">
                                        <div onClick={()=> {this.handleUpDown(false,1)}}>
                                            <span className="signs">-</span>
                                        </div>
                                        <div onClick={()=> {this.handleUpDown(false,5)}}>
                                            <span>5</span>
                                        </div>
                                        <div onClick={()=> {this.handleUpDown(false,25)}}>
                                            <span>25</span>
                                        </div>
                                        <div onClick={()=> {this.handleUpDown(false,500)}}>
                                            <span>500</span>
                                        </div>
                                    </div>
                                    <div className="calculator-option positive-list">
                                        <div onClick={()=> {this.handleUpDown(true,1)}}>
                                            <span className="signs">+</span>
                                        </div>
                                        <div onClick={()=> {this.handleUpDown(true,5)}}>
                                            <span>5</span>
                                        </div>
                                        <div onClick={()=> {this.handleUpDown(true,100)}}>
                                            <span>100</span>
                                        </div>
                                        <div onClick={()=> {this.handleUpDown(true,1000)}}>
                                            <span>1000</span>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default CustomNumberBox;
