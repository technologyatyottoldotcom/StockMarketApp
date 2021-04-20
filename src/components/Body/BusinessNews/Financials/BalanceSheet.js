import React from 'react';
import { CreateTable } from './CreateTable';
import { RightNav } from "./RightNav"

class BalanceSheet extends React.PureComponent {
    render() {
        return (
            <>
                <RightNav childrens={['Balance', 'Detailed']} active={1} />
                <CreateTable type={this.props.type} field={this.props.field} stockcode={this.props.stockcode} />
            </>
        )
    }

}

export { BalanceSheet };