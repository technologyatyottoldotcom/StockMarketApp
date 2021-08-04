import React from 'react';
import { CreateTable } from './CreateTable';

class Shareholding extends React.PureComponent {
    render() {
        return (
            <>
                <CreateTable action={1} type={this.props.type} field={this.props.field} stockcode={this.props.stockcode} setFromType={this.props.setFromType}/>
            </>
        )
    }

}

export { Shareholding };