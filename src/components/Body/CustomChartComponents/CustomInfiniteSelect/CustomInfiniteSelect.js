import React from 'react';
import '../../../../css/CustomSelect.css';
import ArrowUp from '../../../../assets/icons/ArrowUp.svg';
import ArrowDown from '../../../../assets/icons/ArrowDown.svg';
import SyncIcon from '../../../../assets/icons/sync.svg';
import SyncActiveIcon from '../../../../assets/icons/syncactive.svg';

class CustomInfiniteSelect extends React.PureComponent {
    

    constructor(props)
    {
        super(props);
        this.state = {
            isListOpen : false,
            focused : false,
            valuechanged : false,
            titletext : '',
            basevalue : this.props.basevalue,
            sidetext : this.props.sidetext || '',
            optionslist : [],
            optionsloaded : false,
            selectedIndex : this.props.defaultIndex,
        }

        // this.inputBox = React.createRef();

        this.generateList = this.generateList.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        
        this.closeSelect = this.closeSelect.bind(this);
        this.selectOption = this.selectOption.bind(this);
        this.setComponentRef = this.setComponentRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    setComponentRef(node)
    {
        this.ComponentRef = node;
    }

    handleClickOutside(event) {

        if (this.ComponentRef && !this.ComponentRef.contains(event.target)) {
            this.closeSelect();
        }
    }

    componentDidMount()
    {
        this.generateList();
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentDidUpdate(prevProps){


        if(this.props.basevalue !== prevProps.basevalue)
        {      
            this.setState({
                basevalue : this.props.basevalue
            });
        }

        if(this.props.sidetext !== prevProps.sidetext)
        {
            this.setState({
                basevalue : this.props.basevalue,
                sidetext : this.props.sidetext
            })
        }
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    generateList()
    {
        let {steps,precision} = this.props;
        let {basevalue} = this.state;
        const optionsarray = [];

        basevalue = parseFloat(basevalue);
        steps = parseFloat(steps);

        for(let i=1;i<=2;i++)
        {
            optionsarray.push((parseFloat(basevalue) - (i*parseFloat(steps))).toFixed(precision));
        }

        optionsarray.reverse();

        optionsarray.push(basevalue.toFixed(precision));

        for(let i=1;i<=2;i++)
        {
            optionsarray.push((parseFloat(basevalue) + (i*parseFloat(steps))).toFixed(precision));
        }
        
        this.setState({
            optionslist : optionsarray,
            optionsloaded : true
        });

    }

    handleScroll(e)
    {
        const {optionslist} = this.state;
        const {steps,precision} = this.props;

        // console.log(e);

        if(e.deltaY > 0)
        {
            this.setState({
                optionslist : optionslist.map((opt)=> (parseFloat(opt) + parseFloat(steps)).toFixed(precision))
            });
        }
        else
        {
            if(!optionslist.includes(0.00))
            {
                this.setState({
                    optionslist : optionslist.map((opt)=> (parseFloat(opt) - parseFloat(steps)).toFixed(precision))
                });
            }
        }
    }

    handleFocus()
    {
        this.setState({
            focused : true
        },()=>{
            this.props.setDefaultOrderPrice();
        })
        
    }

    handleInputChange(e)
    {
        // console.log(e.target.value);
        let value = !isNaN(parseFloat(e.target.value)) && isFinite(e.target.value);
        if(value || e.target.value === '' || e.target.value === '-')
        {
            this.props.onValueChange(e.target.value);
        }

    }

    selectOption(indx,value)
    {
        this.props.onValueChange(value);
        this.closeSelect();
    }

    openSelect()
    {
        this.setState({
            isListOpen : true,
        },()=>{
            this.generateList();
            this.props.setDefaultOrderPrice();
        });
    }

    closeSelect()
    {
        this.setState({
            isListOpen : false,
            focused : false
        },()=>{
            this.props.setUpdateFlag();
        });
    }


    render() {

        const {width,height,sync,syncactive} = this.props;
        const {focused,isListOpen,optionslist,optionsloaded,basevalue,sidetext} = this.state;

        let titletext;


        if(focused)
        {
            titletext = basevalue;
        }
        else
        {
            titletext = sidetext !== '' ? sidetext + (basevalue >= 0 ? ' + ' : ' - ') + Math.abs(basevalue) : basevalue;
        }

        return (
            <div className="custom-select" style={{width : width , height : height}} ref={this.setComponentRef}>
                <div className="custom-select-header">
                    <span className="custom-select-title">
                        <input 
                                value={titletext} 
                                onFocus={()=> {this.handleFocus()}}
                                onChange={(e)=> {this.handleInputChange(e)}}
                            />
                    </span>
                    <span className="custom-select-options">
                        {isListOpen ? 
                            <img width={26} height={26} src={ArrowUp} alt="" onClick={()=>{this.closeSelect()}}/> :
                            <img width={26} height={26} src={ArrowDown} alt="" onClick={()=>{this.openSelect()}}/>
                        }
                        {sync ?

                        <>
                            { syncactive ? 
                                <img width={24} height={24} src={SyncActiveIcon} alt="" onClick={()=>{this.props.SyncLiveData()}}/>
                                :
                                <img width={24} height={24} src={SyncIcon} alt="" onClick={()=>{this.props.SyncLiveData()}}/>}
                        </>
                        :
                        <></>
                           
                        }
                    </span>
                </div>
                {isListOpen && optionsloaded ? 
                    <div className="custom-select-container" onWheel={(e)=>{this.handleScroll(e)}}>
                        {optionslist.map((option,indx)=>{

                            return <span key={indx} 
                                    className={option == basevalue ? "custom-select-option option-selected" : "custom-select-option"} 
                                    onClick={()=>{
                                        this.selectOption(indx,option)
                                    }}>

                                        {sidetext !== '' ? 

                                            <>
                                                {sidetext}{option >=0 ? ' + ': ' - '}{Math.abs(option)}
                                            </>
                                            :
                                            <>
                                                {option}
                                            </>
                                        
                                        }

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

export default CustomInfiniteSelect;
