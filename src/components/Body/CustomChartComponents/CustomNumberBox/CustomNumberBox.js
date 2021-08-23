import React from 'react';
import ArrowUp from '../../../../assets/icons/ArrowUp.svg';
import ArrowDown from '../../../../assets/icons/ArrowDown.svg';
import '../../../../css/CustomNumberBox.css';

class CustomNumberBox extends React.PureComponent {

    constructor(props)
    {
        super(props);

        this.state = {
            value : this.props.defaultvalue
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleUpDown = this.handleUpDown.bind(this);
    }

    handleUpDown(up)
    {
        let value = up ? parseInt(this.state.value) + 1 : parseInt(this.state.value) - 1;

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

    render() {

        const {width,height} = this.props;

        return (
            <div className="custom-numberbox" style={{width : width , height : height}}>
                <div className="custom-numberbox-container">
                    <div className="numberbox-input">
                        <input type="number" value={this.state.value} onInput={(e)=> this.handleChange(e)}/>
                    </div>
                    <div className="numberbox-arrows">
                        <div className="numberbox-arrow numberbox-arrow-up" onClick={()=> this.handleUpDown(true)}>
                            <img src={ArrowUp} alt="+"/>
                        </div>
                        <div className="numberbox-arrow numberbox-arrow-down" onClick={()=> this.handleUpDown(false)}>
                            <img src={ArrowDown} alt="-"/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default CustomNumberBox;
