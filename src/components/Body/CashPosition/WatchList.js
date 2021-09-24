import React from 'react';
import RLDD from 'react-list-drag-and-drop/lib/RLDD';
import Eraser from '../../../assets/icons/eraser.svg';
import AddCircle from '../../../assets/icons/addcircle.svg';
import Cross from '../../../assets/icons/cross.svg'
import Pulse from '../../Loader/Pulse';

class WatchList extends React.PureComponent {

    constructor(props) {
        super(props);

        this.TopSection = this.TopSection.bind(this);
        this.CreateRow = this.CreateRow.bind(this)
        this.itemRenderer = this.itemRenderer.bind(this);
        this.handleRLDDChange = this.handleRLDDChange.bind(this); 
    }


    TopSection() {
        return (
            <>
                <div className="cp__watchlist__edit" onClick={()=> { this.props.openPopup() }}>
                    <img src={AddCircle} alt=""/>
                    <span>Add Symbol</span>
                </div>
            </>
        )
    }

    CreateRow({ item, index }) {
        return (
            <div className="share__profile__wrapper">
                <div className="share__profile" style={{ cursor: 'pointer' }}>
                    <div className="sp__profile">
                        <div className="sp__status"></div>
                        <div>
                            <div className="sp__name">{item.StockCode}</div>
                            <div className="sp__fullname">{item.StockName}</div>
                        </div>
                    </div>
                    <div className="sp__price">
                        <div className="sp__income">₹30,000.56</div>
                        <div className="cp__change">+3,060.00<span>(+0.95%)</span>
                        </div>
                    </div>
                    <div className="sp__remove">
                        <span onClick={()=> this.props.deleteItem(index)}>
                            <img src={Cross} alt="cross" style={{width: 8, height: 8}} />
                        </span>
                    </div>
                </div>
            </div>

        )
    }

    itemRenderer(item, index){
        return(
            <this.CreateRow item={item} index={index} />
        );
    }

    handleRLDDChange(reorderedItems) {
        this.props.itemChangePosition(reorderedItems);
    }

    render() {
        console.log(this.props.items);
        const { watchlistloaded , items} = this.props;
        if(watchlistloaded)
        {
            return (
                <>
                    <div className="cp__watchlist">
                        <p>Watchlist</p>
                        <this.TopSection />
                    </div>
    
                    <div className="cp__shares__container">
                        <RLDD
                            items={items}
                            itemRenderer={this.itemRenderer}
                            onChange={this.handleRLDDChange}
                        />
                    </div>
                </>
            )
        }
        else
        {
            return <div className="cp__watchlist__loading">
                    <Pulse />
                    <p>Loading Watchlist...</p>
                </div>
        }
    }
}


export default WatchList;

