import React from 'react';
import '../../../../css/CustomCheckBox.css';
import Done from '../../../../assets/icons/Done.svg';


export class CustomCheckBox extends React.PureComponent {

    constructor(props)
    {
        super(props);
        this.state = {
            isChecked : this.props.isChecked
        }
    }

    toggleCheckBox()
    {
        this.setState((prevState)=>({
            isChecked : !prevState.isChecked
        }),()=>{
            this.props.onChangeValue(this.state.isChecked);
        });
        
    }

    render() {

        const {width,height,disabled} = this.props;
        const {isChecked} = this.state;

        return (
            <div 
                className={isChecked ? "custom-checkbox checked" : disabled ? "custom-checkbox disabled" : "custom-checkbox"} 
                style={{width : width , height : height }}
                onClick={disabled ? ()=> {} : ()=>{this.toggleCheckBox()}}            >
                {isChecked ? 
                    
                    <img src={Done} alt="" width={width - 4} height={height- 4}/>
                    :
                    <></>
                }
            </div>
        )
    }
}

export default CustomCheckBox;
