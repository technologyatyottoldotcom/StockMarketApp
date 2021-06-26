import React from 'react';
import { CreateTable } from './CreateTable';
import { RightNav } from "./RightNav"

class CashFlow extends React.PureComponent {
    constructor(props){
        super(props);
        this.state = {
            action : 1
        }
    }
    
    render() {
        return (
            <>
              <RightNav childrens={['Condensed', 'Detailed']} active={this.state.action} setAction={i=>{this.setState({ action : i })}} />
              <CreateTable type={this.props.type} field={this.props.field} action={this.state.action ? 'detailed' : 'condensed'} stockcode={this.props.stockcode} />
            </>
        )
    }

}

export { CashFlow };