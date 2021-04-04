import React from 'react';
import Logout from '../../assets/icons/logout.svg';

export class ScripsFooter extends React.Component {
    render() {
        return (
            <div className="app__footer">
                <div className="app__footer__menu">
                    <span>About us</span>
                    <span>Trading Basics</span>
                    <span>Reach us</span>
                    <span>Help</span>
                    <span>FAQs</span>
                </div>
                <div className="app__logout">
                    <img src={Logout} alt="" />
                    <p>Logout</p>
                </div>
            </div>
        )
    }
}

export default ScripsFooter;
