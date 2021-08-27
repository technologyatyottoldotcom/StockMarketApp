import React from 'react';
import '../../../../css/CustomSelect.css';

const options = ['1','2','3','4','5'];

class ConfigWidth extends React.PureComponent {
    

    constructor(props)
    {
        super(props);
        this.state = {
            isListOpen : false,
            title : this.props.title,
        }
        this.toggleSelect = this.toggleSelect.bind(this);
        this.closeSelect = this.closeSelect.bind(this);
        this.selectOption = this.selectOption.bind(this);
    }

    componentDidUpdate(prevProps){
        const { isListOpen } = this.state;

        if(this.props.title !== prevProps.title)
        {
            this.setState({
                title : this.props.title
            });
        }
      
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
            this.props.onTypeChange(parseInt(value));
        });
    }

    closeSelect()
    {
        this.setState({
            isListOpen : false
        })
    }

    render() {

        const {width} = this.props;
        const {isListOpen,title} = this.state;


        return (
            <div className="custom-select" >
                <div className="custom-select-header" onClick={()=>{this.toggleSelect()}}>
                    <span className="custom-width-select-title">
                        <p style={{ height : `${title}px`}}></p>
                    </span>
                    
                </div>
                {isListOpen ? 
                    <div className="custom-select-container" style={{width : width}}>
                        {options.map((option,indx)=>{
                            return <span key={indx} 
                                    className={title === option ? "custom-width-select-option option-selected" : "custom-width-select-option"} 
                                    onClick={()=>{
                                        this.selectOption(indx,option)
                                    }}
                                    >
                                    <p style={{width : '80%' , height : `${option}px`}}></p>
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

export default ConfigWidth;
