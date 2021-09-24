import React from 'react';
import Logout from '../../assets/icons/logout.svg';
import AddCircle from '../../assets/icons/addcircle.svg';

export class ScripsFooter extends React.PureComponent {

    constructor(props)
    {
        super(props);
        this.state = {
            showmenu : false,
        }
        this.setComponentRef = this.setComponentRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    setComponentRef(node)
    {
        this.ComponentRef = node;
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }
    
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside(event) {

        console.log('clcick');
        console.log(this.ComponentRef);
        console.log(this.ComponentRef.contains(event.target));

        if (this.ComponentRef && !this.ComponentRef.contains(event.target)) {

            this.setState({
                showmenu : false
            },()=>{
                console.log(this.state.showmenu)
            });
        }
    }

    render() {

        const {showmenu} = this.state;

        return (
            <div className="app__footer"  ref={this.setComponentRef}>
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
                        <div onClick={()=>{this.setState({showmenu : true})}}>
                            <span>More</span>
                            <img src={AddCircle} width={20} alt="+" />
                        </div>
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
