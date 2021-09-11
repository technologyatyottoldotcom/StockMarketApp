import React from 'react';
import '../../../../css/CustomSelect.css';
import ArrowUp from '../../../../assets/icons/ArrowUp.svg';
import ArrowDown from '../../../../assets/icons/ArrowDown.svg';

class CustomSelect extends React.PureComponent {
    

    constructor(props)
    {
        super(props);
        this.state = {
            isListOpen : false,
            title : this.props.options[this.props.defaultIndex] || this.props.title,
            selectedIndex : this.props.defaultIndex
        }
        this.toggleSelect = this.toggleSelect.bind(this);
        this.closeSelect = this.closeSelect.bind(this);
        this.selectOption = this.selectOption.bind(this);
    }

    componentDidUpdate(prevProps){

        if(this.props.defaultIndex !== prevProps.defaultIndex)
        {
            this.setState({
                title : this.props.options[this.props.defaultIndex] || this.props.title
            });
        }

        const { isListOpen } = this.state;
      
        setTimeout(() => {
            if(isListOpen){
              window.addEventListener('click', this.closeSelect)
            }
            else{
              window.removeEventListener('click', this.closeSelect)
            }
        }, 0)
    }

    toggleSelect()
    {
        this.setState((prevState)=>({
            isListOpen : !prevState.isListOpen
        }))
    }

    selectOption(indx,value)
    {
        this.setState({
            title : value,
            selectedIndex : indx
        },()=>{
            this.toggleSelect();
            this.props.onTypeChange(value)
        });
    }

    closeSelect()
    {
        this.setState({
            isListOpen : false
        })
    }

    render() {

        const {width,height,options} = this.props;
        const {isListOpen,selectedIndex} = this.state;

        return (
            <div className="custom-select" style={{width : width , height : height}}>
                <div className="custom-select-header" onClick={()=>{this.toggleSelect()}}>
                    <span className="custom-select-title">{this.state.title}</span>
                    <span>
                        {isListOpen ? 
                            <img width={20} height={20} src={ArrowUp} alt=""/> :
                            <img width={20} height={20} src={ArrowDown} alt=""/>
                        }
                    </span>
                </div>
                {isListOpen ? 
                    <div className="custom-select-container">
                        {options.map((option,indx)=>{
                            return <span key={indx} 
                                    className={selectedIndex === indx ? "custom-select-option option-selected" : "custom-select-option"} 
                                    onClick={()=>{
                                        this.selectOption(indx,option)
                                    }}>
                                    {option}
                                    </span>
                        })}
                    </div>
                    :
                    <></>
                }
            </div>
        )
    }
}

export default CustomSelect;
