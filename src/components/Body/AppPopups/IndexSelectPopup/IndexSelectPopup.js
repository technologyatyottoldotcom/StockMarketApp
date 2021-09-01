import React from 'react';
import IndexItem from './IndexItem';
import '../../../../css/IndexSelectPopup.css';
import CrossIcon from '../../../../assets/icons/crossicon.svg';

class IndexSelectPopup extends React.PureComponent {

    constructor(props)
    {
        super(props);
        this.state = {
            Loading : true,
            Selected : [],
            Unselected : []
        }

        this.separateIndices = this.separateIndices.bind(this);
    }

    componentDidMount()
    {
        this.separateIndices();
    }

    componentDidUpdate(prevProps)
    {
        if(this.props.indexflag !== prevProps.indexflag)
        {
            this.separateIndices();
        }
    }

    separateIndices()
    {
        const {IndicesList} = this.props;
        let Selected = [],Unselected = [];

        IndicesList.forEach(ele => {
            ele.order > 0 ? Selected.push(ele) : Unselected.push(ele);
        });

        Selected.sort((a,b)=> (
           a.order - b.order 
        ));

        Unselected.sort((a,b)=> (
            a.index > b.index ? 1 : -1
        ));

        this.setState({
            Selected,
            Unselected,
            Loading : false
        })

    }

    render() {

        const {resetactive,StatusConfig,closePopup,toggleIndexState,swapIndexState,saveIndexConfigs,resetIndexConfigs} = this.props;

        const {Loading,Selected,Unselected} = this.state;

        // console.log(Selected,Unselected);

        const totalselected = Selected.length;

        // console.log(resetactive)

        if(!Loading)
        {
            return (
                <div className="index__select__popup">
                    <div className="index__select__header">
                        <p>Select Symbol</p>
                        <span className="index__list__total">{totalselected}/5 Selected</span>
                        
                        <span className="index__select__close" onClick={()=> {closePopup()}}>
                                <img src={CrossIcon} alt="X"/>
                        </span>
                    </div>
                    <div className="index__select__container">
                        
                        {Selected.map((ind,i)=>{

                            {/* console.log(ind); */}
                            return <IndexItem 
                                key={i+Math.random()*100}
                                name={ind.name} 
                                order={ind.order}
                                index={ind.index}
                                selected={ind.order > 0 ? true : false} 
                                totalselected={totalselected}
                                disabled={false}
                                options={true}
                                toggleIndexState={toggleIndexState}
                                swapIndexState={swapIndexState}
                            />
                        })}

                        {Unselected.map((ind,i)=>{
                            return <IndexItem 
                                key={i+Math.random()*100}  
                                name={ind.name} 
                                order={ind.order}
                                index={ind.index}
                                selected={ind.order > 0 ? true : false} 
                                totalselected={totalselected}
                                disabled={totalselected === 5 ? true : false}
                                options={false}
                                toggleIndexState={toggleIndexState}
                                swapIndexState={swapIndexState}
                            />
                        })}
                        
                    </div>
                    <div className="index__select__footer">
                        <p className={"popup__status "+StatusConfig.type+""}>{StatusConfig.status}</p>
                        <div>
                            <button className={resetactive ? "reset" : "reset disabled"} type="button" onClick={()=> resetIndexConfigs()}>Reset</button>
                            <button type="button" onClick={()=> saveIndexConfigs()}>Save</button>
                        </div>
                    </div>
                </div>
            )
        }
        else
        {
            return <p>Loading...</p>
        }
        
    }
}

export default IndexSelectPopup;
