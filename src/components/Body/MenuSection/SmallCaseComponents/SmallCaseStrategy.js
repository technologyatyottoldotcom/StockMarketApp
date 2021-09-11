import React from 'react';
import Axios from 'axios';
import Theme from '../../../../assets/icons/theme.svg';
import SearchIcon from '../../../../assets/icons/search.svg';
import Chess from '../../../../assets/icons/chess.svg';
import Analysis from '../../../../assets/icons/analysis.svg';
import BalanceBall from '../../../../assets/icons/balance-ball.svg';
import SettingsGears from '../../../../assets/icons/settings-gears.svg';
import ChevronDown from '../../../../assets/icons/ChevronDown.svg';
import Objective from '../../../../assets/icons/objective.svg';
import Compare from '../../../../assets/icons/CompareArrow.svg';
import Thinking from '../../../../assets/icons/undraw_Code_thinking_re_gka2.svg';
import RightArrow from '../../../../assets/icons/RightArrow.svg';
import LeftArrow from '../../../../assets/icons/LeftArrow.svg';
import Price from '../../../../assets/icons/price.svg'
import Pulse from '../../../Loader/Pulse'
import AddBackTestStock from './AddBackTestStock';
import EditPortfolios from './EditPortfolios';

import CustomSelect from '../../CustomChartComponents/CustomSelect/CustomSelect';

const REQUEST_BASE_URL = process.env.REACT_APP_REQUEST_BASE_URL;


class SmallCaseStrategy extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            strategyName: [],
            newStrategy: false,
            active: null,
            isStrategyExist: false,
            createdDate: null,
            strategy: '',
            objective: '',
            methodology: '',
            benchmark: '',
            frequency: '',
            price: '',
            portfolios: [],
            backTestResult: [],
            isChecking: false,
            opacityMsg: true
        }
        this.TopSection = this.TopSection.bind(this)
        this.Row = this.Row.bind(this)
        this.setValue = this.setValue.bind(this)
        this.validateInput = this.validateInput.bind(this)
        this.checkDatabase = this.checkDatabase.bind(this)
        this.changeOpacityMsg = this.changeOpacityMsg.bind(this)
    }


    async componentDidMount(){
        console.log('SEND')
        let strategyName = (await Axios.get(`${REQUEST_BASE_URL}/fetch_strategy`)).data;
        console.log(strategyName);
        this.setState({ strategyName });
    }

    TopSection() {
         return <div className="smallcase__strategy__header">
            <span>Create Smallcase Strategy</span>
            <div onClick={this.props.smallCaseHome}>
                <img src={LeftArrow} alt="LeftArrow" style={{width: 11, marginRight: 2}} />
                <span>Back</span>
            </div>
        </div>
    }


    Row({ icon, text, type, name, setValue }) {

        const benchmarkOptions = ['Nifty 50', 'Nifty 100', 'Nifty 200'];
        const frequencyOptions = ['12 Month', 'Year End', 'Quarter End', 'Month End']

        // const getList = () => {

        //     let list =[]
        //     let options = (name=="strategy")? this.state.strategyName:(name=="benchmark")? benchmarkOptions:frequencyOptions;

        //     options.forEach(el => {
        //         list.push(<option value={el} selected={this.state.benchmark==el||this.state.frequency==el? true:false}>{el}</option>)
        //     })
            
        //     if(name=="strategy")    list.unshift(<option value="New Strategy" style={{fontWeight: 700}}>New Strategy</option>)
        //     return list;
        // }

        const getList = ()=>{

            let list =[]
            let options = (name=="strategy")? this.state.strategyName:(name=="benchmark")? benchmarkOptions:frequencyOptions;

            if(name=="strategy")    list.push('New Strategy');

            options.forEach(el => {
                list.push(el)
            })
            
            return list;
        }

        const getListIndex = ()=>{

            let list = getList();
            let listindx = list.findIndex((li)=>{
                return li === this.state.benchmark || li === this.state.frequency || li === this.state.strategy
            });


            return listindx;
        }

        let divStyle = { height: type=="inputBox"? 100:'', borderRadius: 3, fontWeight: 'bold', 
                        boxShadow: type=="inputBox"? '2px 2px 2px var(--shadow-primary) , -2px -2px 2px var(--shadow-primary)':'' }

        let selectStyle = { fontWeight: name=='strategy'?900:400, color: '#8e8e8e', marginLeft: 10, alignSelf: 'flex-end', border: 'none',
                            outline: 'none', width: '100%' }

        let divTextarea = { color: '#404040', marginLeft: 15, alignSelf: 'flex-end', width: '100%', height: type=="inputBox"? 90:'',
                            overflow: 'hidden', outline: 'none', border: 'none', resize: 'none',
                            fontWeight: name=='strategy'? 900:400, fontSize: 11 }
        let errorStyle = { color: 'red', fontSize: 10, fontWeight: 600, opacity: 0 }

        return (
            (type=="selectBox")? 
            
                <div className="strategy__select__container">

                    <div className="strategy__select__header">
                        {icon && <img src={icon} alt={text} width={20} />}
                        <span>{name}</span>
                    </div>

                    <div className="strategy__select__box">
                        <CustomSelect 
                            width={200} 
                            height={40} 
                            options={getList()} 
                            defaultIndex={getListIndex()}
                            title="Select" 
                            onTypeChange={(value) => setValue(value,name)}
                        />
                    </div>
                    
                    <span style={errorStyle} className="errSpan" id={name}>Please select {name}</span>
                </div>
            : (type=="inputBox")?

                <div className="strategy__select__container">
                    <div className="strategy__select__header">
                        {icon && <img src={icon} alt={text} width={20} />}
                        <span>{name}</span>
                    </div>

                    <div className="strategy__text__box">
                            <textarea className="text_area_small_case"
                                placeholder={text} 
                                maxLength="200"
                                value={name=='objective'? this.state.objective:this.state.methodology}
                                onChange={(e)=> setValue(e, name)}>    
                            </textarea>
                    </div>
                    
                    <span style={errorStyle} className="errSpan" id={name}>{name[0].toUpperCase()+name.slice(1)} cannot be less than 25 characters</span>
                </div>
            :
                <div className="strategy__select__container">

                    <div className="strategy__select__header">  
                        {icon && <img src={icon} alt={text} width={20} />}
                        <span>{name}</span>
                    </div>

                    <div className="strategy__input__box">
                            <input className="text_area_small_case"
                                placeholder={text} maxLength="50" type={name=="price"? "number":""}
                                value={name=='price'? this.state.price:this.state.strategy}
                                onChange={(e)=> setValue(e, name)}
                                onBlur={(e)=> this.checkDatabase(e, name)}>    
                            </input>
                    </div>
                    
                    <span style={errorStyle} className="errSpan" id={name}>{name[0].toUpperCase()+name.slice(1)} {name=='price'? 'cannot be less than 50':'cannot be empty'}</span>
                </div>

        )
    }

    async checkDatabase(e, name){

        if(name != 'strategy')  return;
        let pan = 'ALQPD7054E';

        this.setState({isChecking: true})
        this.changeOpacityMsg();

        const result = (await Axios.post(`${REQUEST_BASE_URL}/check_strategy`, {pan: pan, strategy: e.target ? e.target.value : e})).data;

        if(result.details){

            for(let span of document.getElementsByClassName('errSpan'))    span.style.opacity = '0';

            // console.log(result.details);

            this.setState({
                isStrategyExist: true,
                createdDate: result.details.createdDate,
                strategy: result.details.strategy,
                objective: result.details.objective,
                methodology: result.details.methodology,
                benchmark: result.details.benchmark,
                frequency: result.details.frequency,
                price: result.details.price,
                portfolios: result.portfolios,
                backTestResult: result.backTestResult,
            })
        }else{
            this.setState({
                isStrategyExist: false,
                createdDate: new Date().getFullYear()+"-"+("0"+(new Date().getMonth() +　1)).slice(-2)+"-"+("0"+(new Date().getDate())).slice(-2),
                objective: '',
                methodology: '',
                benchmark: '',
                frequency: '',
                price: '',
                portfolios: [],
                backTestResult: []
            })
        }

        // console.log(this.state)

        this.setState({isChecking: false});
    }

    setValue(e,name){

        // console.log(e,name)

        document.getElementById(name).style.opacity = '0';

        if(name=='strategy' && e=='New Strategy'){
            this.setState({ newStrategy:true });
            this.setState({
                strategy: "",
                objective : "",
                methodology : "",
                benchmark : "",
                frequency : "",
                price : ""
            });
            return;
        }
    
        switch(name){
            case 'strategy':
                this.state.newStrategy ? this.setState({strategy: e.target.value}) : this.setState({strategy: e});
                if(!this.state.newStrategy)
                {
                    this.checkDatabase(e,name)
                }
                break;
            case 'objective':
                this.setState({objective: e.target.value});   break;
            case 'methodology':
                this.setState({methodology: e.target.value});   break;
            case 'benchmark':
                this.setState({benchmark: e});   break;
            case 'frequency':
                this.setState({frequency: e});    break;
            case 'price':
                this.setState({price: e.target.value>100000? 100000:e.target.value});     break;
        }
    }

    validateInput(){

        const state = this.state;
        let isValid = true;
        let data = new Object();

        for(let name in state){
            if(name=='strategy'||name=='objective'||name=='methodology'||name=='benchmark'||name=='frequency'||name=='price'){

                if(name!='active'){
                    if(state[name]=='' || (name=='price'&&parseInt(state[name])<50) || ((name=='objective'||name=='methodology')&&state[name].length<20)){
                        document.getElementById(name).style.opacity = '1';
                        isValid=false;
                    }else
                        data[name] = state[name];    
                }
            }
        }

        console.log(data);

        if(isValid)     this.setState({active: 'Backtest'})
    }

    changeOpacityMsg(){

        let displayOpacity = setInterval(() => {
            if(!this.state.isChecking){
                clearInterval(displayOpacity)
            }
            else{
                this.setState({opacityMsg: (this.state.opacityMsg==false)? true: false})
            }
        }, 1500);
    }

    render() {

        let { isStrategyExist } = this.state;

        if(this.state.active=='Backtest')
            return(<AddBackTestStock 
                    state={this.state}
                    backButton={()=> this.setState({active: null})} 
                    smallCaseHome={this.props.smallCaseHome} />);
        else if(this.state.active=='EditPortfolios')
            return(<EditPortfolios 
                    strategy={this.state.strategy}
                    smallCaseHome={this.props.smallCaseHome}
                    backButton={()=> this.setState({active: null})} />)

        return (
            <>

                <div className="smallcase__strategy__container">
                    <this.TopSection />
                    <div className="smallcase__strategy__body__wrapper" style={{opacity: this.state.isChecking? 0.5:1}}>
                        {this.state.isChecking ? 
                            
                            <div className="smallcase__strategy__body loader">
                                <Pulse />
                                <p className={this.state.opacityMsg?'fadeIn loading__text':'fadeOut loading__text'}>Checking...</p>
                            </div>

                            :

                            <div className="smallcase__strategy__body">
                                    <div className="smallcase__strategy__form">
                                        <this.Row 
                                            icon={Chess} 
                                            text="Strategy Name (max 50 char)" 
                                            type={this.state.newStrategy?"":"selectBox"} 
                                            name={'strategy'} 
                                            setValue={this.setValue}
                                        />
                                        <this.Row 
                                            icon={Objective} 
                                            text="Objective (max 200 characters)" 
                                            type={"inputBox"} 
                                            name={'objective'} 
                                            setValue={this.setValue}
                                        />
                                        <this.Row 
                                            icon={SettingsGears} 
                                            text="Methodology (max 200 characters)" 
                                            type={"inputBox"} 
                                            name={'methodology'} 
                                            setValue={this.setValue}
                                        />

                                        <this.Row 
                                            icon={Compare} 
                                            text="Select Benchmark" 
                                            type={"selectBox"} 
                                            name={'benchmark'} 
                                            setValue={this.setValue}
                                        />
                                        
                                        <this.Row 
                                            icon={BalanceBall} 
                                            text="Select Rebalancing Frequency" 
                                            type={"selectBox"} 
                                            name={'frequency'} 
                                            setValue={this.setValue}
                                        />

                                        <this.Row 
                                            icon={Price} 
                                            text="Price (max Rs.100,000)" 
                                            type={""} name={'price'} 
                                            setValue={this.setValue}
                                        />
                                        
                                    </div>
                                    <div className="smallcase__strategy__image">
                                        <img src={Thinking} alt="Thinking" />
                                    </div>
                            </div>
                            
                        }
                    </div>
                    <div className="smallcase__strategy__footer">
                        <div className="strategy__footer__button" onClick={()=> this.validateInput()}>
                            Next
                            <img src={RightArrow} alt="RightArrow" style={{width: 10, marginLeft: 2}} />
                        </div>
                        <div className="strategy__footer__button" 
                            style={{cursor: isStrategyExist?'pointer':'not-allowed', opacity: isStrategyExist?1:0.3}}
                            onClick={()=> {if(isStrategyExist) this.setState({ active: 'EditPortfolios'})}}>
                            Edit Portfolios
                        </div>
                    </div>
                        
                    </div>

                {/* <div className="container" style={{ width: 800, fontSize: 13, color: 'black', marginLeft: 20 }}>
                    <this.TopSection />
                    <div style={{fontWeight: 900, fontSize: 12, width: 'fit-content', position: 'fixed', top: 20, right: 50 }}>
                        <div style={{cursor: 'pointer'}} onClick={this.props.smallCaseHome}>
                            <img src={LeftArrow} alt="LeftArrow" style={{width: 11, marginRight: 2}} />
                            Back
                        </div>
                    </div>
                        
                    <div className="row" style={{marginTop: 10, opacity: this.state.isChecking? 0.5:1}}>
                        {this.state.isChecking?
                            <div style={{minHeight: 500, position: 'fixed', zIndex: 1 , display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: 1}}>
                                <div style={{display: 'flex', justifyContent: 'content', alignItems: 'center', flexDirection: 'column'}}>
                                    <Pulse />
                                    <p style={{fontSize: 15}} className={this.state.opacityMsg?'fadeIn':'fadeOut'}>Checking...</p>
                                </div>
                            </div> : ''}
                        <div className="col-6 GlobalScrollBar" style={{mrarginRight: 30, fontSize: 11, boxShadow: '2px 2px 2px var(--shadow-primary) , -2px -2px 2px var(--shadow-primary)', borderRadius: 3}}>
                            <div className="row" style={{width: '100%', margin: '10px 0 0 0' }}>
                                <this.Row icon={Chess} text="Strategy Name (max 50 char)"  type={this.state.newStrategy?"":"selectBox"} name={'strategy'} setValue={this.setValue}/>
                            </div>
                            <div className="row" style={{width: '100%', margin: '5px 0 0 0' }}>
                                <this.Row icon={Objective} text="Objective (max 200 characters)" type={"inputBox"} name={'objective'} setValue={this.setValue}/>
                            </div>
                            <div className="row" style={{width: '100%', margin: '5px 0 0 0' }}>
                                <this.Row icon={SettingsGears} text="Methodology (max 200 characters)" type={"inputBox"} name={'methodology'} setValue={this.setValue}/>
                            </div>
                            <div className="row" style={{width: '100%', margin: '5px 0 0 0' }}>
                                <this.Row icon={Compare} text="Select Benchmark" type={"selectBox"} name={'benchmark'} setValue={this.setValue}/>
                            </div>
                            <div className="row" style={{width: '100%', margin: '5px 0 0 0' }}>
                                <this.Row icon={BalanceBall} text="Select Rebalancing Frequency" type={"selectBox"} name={'frequency'} setValue={this.setValue}/>
                            </div>
                            <div className="row" style={{width: '100%', margin: '5px 0 0 0' }}>
                                <this.Row icon={Price} text="Price (max Rs.100,000)" type={""} name={'price'} setValue={this.setValue}/>
                            </div>

                        </div>
                        <div className="col-6 GlobalScrollBar" style={{ maxHeight: 400, marginTop: 20 }}>
                            <img src={Thinking} alt="Thinking" style={{width: '80%', marginTop: 20, float: 'right'}}/>
                        </div>

                        <div style={{fontWeight: 900, fontSize: 12, width: 'fit-content', position: 'fixed', bottom: 10}}>
                            <div style={{cursor: 'pointer'}} onClick={()=> this.validateInput()}>
                                Next
                                <img src={RightArrow} alt="RightArrow" style={{width: 10, marginLeft: 2}} />
                            </div>
                        </div>
                        <div style={{fontWeight: 900, fontSize: 12, width: 'fit-content', position: 'fixed', bottom: 10, right: 30}}>
                            <div style={{cursor: isStrategyExist?'pointer':'not-allowed', opacity: isStrategyExist?1:0.3}}
                                onClick={()=> {if(isStrategyExist) this.setState({ active: 'EditPortfolios'})}}>
                                Edit Portfolios
                            </div>
                        </div>

                    </div>
                </div> */}

            </>
        )
    }
}

export default SmallCaseStrategy;
