import React from 'react'

class AnimatedDigit extends React.Component {

    render() {

        let digits = [9,8,7,6,5,4,3,2,1,0];
        let transform = 0;


        let isDigit = false;
        if(digits.filter(d => d==this.props.digit).length > 0)
        {
            isDigit = true;
            transform = this.props.transform;
        }


        return (
            <div className="price__digit">
                
                    {isDigit
                        ?
                        <div className="price__digit__column" style={{transform : 'translateY(-'+(9-this.props.digit)*(transform)+'px)'}}> 
                            {digits.map((d,i)=>{
                                return (
                                        this.props.digit == d ? <span key={i} className="digit__box" style={{opacity : 1}}>{d}</span> : <span key={i} className="digit__box" style={{opacity : 0.2}}>{d}</span>
                                    )
                            })}
                        </div>

                        : <div className="price__digit__column">
                            <span className="digit__box">{this.props.digit}</span>
                          </div>
                    }

            </div>
        )
    }
}

export default AnimatedDigit;
