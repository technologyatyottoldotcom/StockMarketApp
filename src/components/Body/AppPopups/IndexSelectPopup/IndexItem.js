import React from 'react';
import CustomCheckBox from '../../CustomChartComponents/CustomCheckBox/CustomCheckBox';
import SwapUp from '../../../../assets/icons/swapup.svg';
import SwapDown from '../../../../assets/icons/swapdown.svg';
import CloseItem from '../../../../assets/icons/closesmall.svg';


class IndexItem extends React.PureComponent {
    render() {

        const {name,order,index,selected,totalselected,disabled,options,toggleIndexState,swapIndexState} = this.props;

        // console.log(name,selected)
        // console.log(name,order,totalselected);

        return (
            <div className="index__select__item">
                <div className="index__check">
                    <CustomCheckBox 
                        width={20} 
                        height={20} 
                        isChecked={selected}
                        disabled={disabled}
                        onChangeValue={(value) => {toggleIndexState(index,value)}}
                    />
                </div>
                <span className="index__name">{name}</span>
                {options && 
                    <div className="index__options">
                        {order !== 1 && 
                            <span className="index__option__wrapper" onClick={()=> swapIndexState(index,order,true)}>
                                <img src={SwapUp} alt=""/>
                            </span>
                        }
                        {order !== totalselected && 
                            <span className="index__option__wrapper" onClick={()=> swapIndexState(index,order,false)}>
                                <img src={SwapDown} alt=""/>
                            </span>
                        }
                        <span className="index__option__wrapper" onClick={() => {toggleIndexState(index,false)}}>
                            <img src={CloseItem} alt=""/>
                        </span>
                    </div>
                }
            </div>
        )
    }
}

export default IndexItem;
