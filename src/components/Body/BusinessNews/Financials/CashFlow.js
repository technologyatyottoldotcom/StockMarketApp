import React from 'react';
import { CreateTable } from './CreateTable';
import { RightNav } from "./RightNav"

class CashFlow extends React.PureComponent {
    render() {
        return (
            <>
                <RightNav childrens={['CashFlow', 'Detailed']} active={1} />
                <CreateTable type={this.props.type} field={this.props.field} stockcode={this.props.stockcode} />
            </>
        )
    }

}

export { CashFlow };