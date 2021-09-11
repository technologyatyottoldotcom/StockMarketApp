import React from 'react';

export class ScripsMenu extends React.PureComponent {

    render() {
        const menuItems = ['Portfolios','Orders','SmallCase','Research','Exit'];
        return (
            <div className="app__menu">
                {menuItems.map((item,i)=>{
                    return <span onClick={()=> this.props.setActiveElement(item,true)} key={i+Math.random()*9999 + Date.now()}>{item}</span>
                })}
            </div>
        )
    }
}

export default ScripsMenu
