import React from 'react'

export class Statistics extends React.PureComponent {
    render() {

        const {name,value,type} = this.props;

        return (
            <div className="statistics">
                <p className="ks__name">{name}</p>
                {type === 'range' ? 
                    <p className="ks__value">
                        {value[0] && <span>{value[0]}</span>}
                        <span className="range__line"></span>
                        {value[1] && <span>{value[1]}</span>}
                    </p>
                    :
                    <p className="ks__value">{value}</p> 
                }
            </div>
        )
    }
}

export default Statistics;
