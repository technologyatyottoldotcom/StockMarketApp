import React from 'react';
import { CreateTable } from './CreateTable';
import { RightNav } from "./RightNav"

class Ratio extends React.PureComponent {
    render() {
        return (
            <>
                <div className="container-fluid" style={{ background: '', paddingLeft: '35px' }}>
                    <RightNav childrens={['Ratio', 'Detailed']} active={1} />
                    <CreateTable type={this.props.type} field={this.props.field} stockcode={this.props.stockcode} />
                </div>
            </>
        )
    }

}

export { Ratio };