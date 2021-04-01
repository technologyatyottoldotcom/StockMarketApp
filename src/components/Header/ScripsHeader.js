import React from 'react';
import ScripsMenu from './ScripsMenu';
//icons
import BrandLogo from '../../assets/icons/yottol.png';
import Search from '../../assets/icons/search.svg';

class ScripsHeader extends React.Component
{
    render()
    {
        return <div className="app__header">
            <div className="brand__logo">
                <img src={BrandLogo} alt="Yottol"/>
            </div>
            <div className="brand__name">
                <p>Stocks</p>
            </div>
            <div className="stock__search">
                <div className="stock__search__icon">
                    <img src={Search} alt=""/>
                </div>
                <input placeholder="Search"/>
            </div>
            <ScripsMenu />
        </div>
    }
}

export default ScripsHeader;
