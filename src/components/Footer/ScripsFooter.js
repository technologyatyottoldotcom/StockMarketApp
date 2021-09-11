import React from 'react';
import Logout from '../../assets/icons/logout.svg';

export class ScripsFooter extends React.PureComponent {

    constructor(props)
    {
        super(props);
        this.state = {
            showmenu : false,
        }
    }

    render() {

        const {showmenu} = this.state;

        return (
            <div className="app__footer">
                {showmenu ? 
                    <div className="app__footer__menu">
                        <span>About us</span>
                        <span>Trading Basics</span>
                        <span>Reach us</span>
                        <span>Help</span>
                        <span>FAQs</span>
                    </div>
                    :
                    <div className="app__footer__menu">
                        <span onClick={()=>{this.setState({showmenu : true})}}>More</span>
                    </div>
                }
                {/* <div className="app__logout">
                    <img src={Logout} alt="" />
                    <p>Logout</p>
                </div> */}
            </div>
        )
    }
}

export default ScripsFooter;
