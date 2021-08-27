import React from 'react';
import '../../../../css/CustomSelect.css';

const options = ['1','2','3','4'];

const list = [
    {
        img : <svg width="22" height="2" viewBox="0 0 22 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="22" height="2" fill="#404040"/>
              </svg>,
        title : 'Solid',
        value : 'Solid'
    },
    {
        img : <svg width="22" height="2" viewBox="0 0 22 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="2" height="2" fill="#404040"/>
                <rect x="4" width="2" height="2" fill="#404040"/>
                <rect x="4" width="2" height="2" fill="#404040"/>
                <rect x="8" width="2" height="2" fill="#404040"/>
                <rect x="12" width="2" height="2" fill="#404040"/>
                <rect x="16" width="2" height="2" fill="#404040"/>
                <rect x="20" width="2" height="2" fill="#404040"/>
            </svg>,
        title : 'Dashed',
        value : 'Dash'
    },
    {
        img : <svg width="22" height="2" viewBox="0 0 22 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="2" height="2" rx="1" fill="#404040"/>
                    <rect x="4" width="2" height="2" rx="1" fill="#404040"/>
                    <rect x="4" width="2" height="2" rx="1" fill="#404040"/>
                    <rect x="8" width="2" height="2" rx="1" fill="#404040"/>
                    <rect x="12" width="2" height="2" rx="1" fill="#404040"/>
                    <rect x="16" width="2" height="2" rx="1" fill="#404040"/>
                    <rect x="20" width="2" height="2" rx="1" fill="#404040"/>
               </svg>,
        title : 'Dotted',
        value : 'Dot'
    },
    {
        img : <svg width="22" height="2" viewBox="0 0 22 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="22" height="2" fill="#404040"/>
            </svg>,
        title : 'Long Dash',
        value : 'LongDash'
    }
]

class ConfigStrokeType extends React.PureComponent {
    
    constructor(props)
    {
        super(props);
        this.state = {
            isListOpen : false,
            title : this.props.title,
            titleImage : this.getRelevantImage(this.getRelevantTitle(this.props.title))
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
                title : this.props.title,
                titleImage : this.getRelevantImage(this.getRelevantTitle(this.props.title))
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

    getRelevantTitle(type)
    {
        const option = list.find((l,i)=> l.value === type);
        return option.title;
    }

    getRelevantImage(type)
    {
        // console.log(type)
        const option = list.find((l,i)=> l.title === type);
        // console.log(option);
        return option.img;
    }

    selectOption(indx,title,value)
    {
        this.setState({
            title : title,
            titleImage : this.getRelevantImage(title),
            selectedIndex : indx
        },()=>{
            this.toggleSelect();
            this.props.onTypeChange(value);
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
        const {isListOpen,title,titleImage} = this.state;


        return (
            <div className="custom-select" >
                <div className="custom-select-header" onClick={()=>{this.toggleSelect()}}>
                    <span className="custom-width-select-title">
                        {titleImage}
                    </span>
                    
                </div>
                {isListOpen ? 
                    <div className="custom-select-container" style={{width : width}}>
                       
                        {list.map((l,indx)=>{
                            return <span key={indx} 
                                    className={title === l.title ? "custom-width-select-option option-selected" : "custom-width-select-option"}
                                    onClick={()=>{
                                        this.selectOption(indx,l.title,l.value)
                                    }}
                                    >
                                    <span className="custom-width-select-image">{l.img}</span>
                                    <span className="custom-width-select-text">{l.title}</span>
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

export default ConfigStrokeType;
