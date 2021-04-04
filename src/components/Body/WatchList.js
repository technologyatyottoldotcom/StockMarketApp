import React from 'react';
import '../../css/WatchList.css';

const SVGIMG1 = {
    Star: ({ isFav = false }) => {
        const [hover, setHover] = React.useState(isFav)
        const Attr = {
            style: { cursor: 'pointer' },
            onMouseEnter: _ => setHover(true),
            onMouseLeave: _ => !isFav && setHover(false),
            onClick: _ => { isFav = !isFav }
        }


        return (
            (isFav || hover) ?
                <svg {...Attr} xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill='yellow' viewBox="0 0 16 16">
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                </svg>
                :
                <svg {...Attr} xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="#ccc" viewBox="0 0 16 16">
                    <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
                </svg>
        )
    },
    ChevronExpand: _ => {
        return (
            <svg style={{ transform: 'rotate(88deg)' }} xmlns="http://www.w3.org/2000/svg" width={25} height={20} fill="currentColor" viewBox="0 0 16 16">
                <path d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z" />
            </svg>
        )
    }
}

class WatchList extends React.Component {

    

    CreateSection({ name, fullName, changePer, color = "#19E683", isFavorite = false }) {
        return (
            <>
                <div className="app__watchlist__stock">
                    <div className="watchlist__stock__details">
                        <div>
                            <div className="watchlist__stock__status"></div>
                            <div className="watchlist__stock__name">{name}</div>
                        </div>
                        <div className="watchlist__stock__fullname">{fullName}</div>
                    </div>
                    <div className="watchlist__stock__favourite">
                        <span>{changePer}</span>
                        <span className="watchlist__stock__star">
                            {<SVGIMG1.Star isFav={isFavorite} />}
                        </span>
                    </div>
                </div>



            </>
        )
    }
    render() {
        return (
            <>
                <div className="app__watchlist">
                    <div className="app__watchlist__header">
                        <div className="app__watchlist__title">
                            People also watch
                        </div>
                        <div className="app__watchlist__icon">
                            <SVGIMG1.ChevronExpand />
                        </div>
                    </div>


                    <div className="app__watchlist__container">
                        <this.CreateSection
                            name="NSE:HDFCBANK"
                            fullName="HDFC Bank Limited."
                            changePer="+4.9%"
                        />

                        <this.CreateSection
                            name="NSE:HDFCBANK"
                            fullName="HDFC Bank Limited."
                            changePer="+4.9%"
                        />

                        <this.CreateSection
                            name="NSE:HDFCBANK"
                            fullName="HDFC Bank Limited."
                            changePer="+4.9%"
                        />

                    </div>

                </div>
            </>
        )
    }
}

export default WatchList;
