import React from 'react';
import {CreateTable} from './CreateTable';

class PL extends React.PureComponent{
    render(){
        return(
            <>
                <div>
                    <b>Condensed </b> Detailed
                </div>
                 <CreateTable type={this.props.type} field={this.props.field} stockcode={this.props.stockcode} />
            </>
        )
    }

}

export {PL};