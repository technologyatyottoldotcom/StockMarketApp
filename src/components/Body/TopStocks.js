import React from 'react';
import UpperStock from './UpperStock';

class TopStocks extends React.Component {
    render() {

        const {data , dataArray} = this.props;

        return (
            <div className="top__stocks container-fluid HomeTopChart__Scrollbar d-flex p-0">
                {
						dataArray ?
							(dataArray || []).map((v, i) => {
								if (v && typeof v == 'object') {
									return <UpperStock {...v} 
										data={data} //This is a temporary basis data 
									/>

								} else return null
							})
							:
							<UpperStock {...this.props} />
				}
            </div>
        )
    }
}

export default TopStocks;
