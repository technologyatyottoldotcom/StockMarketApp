import React from 'react';
import '../../css/AnimatedDigit.css';

class Digit extends React.PureComponent
{
    render() {

        let digits = [9,8,7,6,5,4,3,2,1,0];
        let transform = 0;


        let isDigit = false;
        if(digits.filter(d => d==this.props.digit).length > 0)
        {
            isDigit = true;
            transform = this.props.size;
        }


        return (
            <div className="price__digit" style={{
                height : this.props.size+'px',
                margin : '0 '+this.props.digitMargin+'px'
            }}>
                
                    {isDigit
                        ?
                        <div className="price__digit__column" style={{transform : 'translateY(-'+(9-this.props.digit)*(transform)+'px)'}}> 
                            {digits.map((d,i)=>{
                                return (
                                        this.props.digit == d ? 
                                            <span key={i} className="digit__box" style={{opacity : 1,height:this.props.size+'px'}}>{d}</span> : 
                                            <span key={i} className="digit__box" style={{opacity : 0.2,height:this.props.size+'px'}}>{d}</span>
                                    )
                            })}
                        </div>

                        : <div className="price__digit__column">
                            <span className="digit__box" style={{height:this.props.size+'px'}}>{this.props.digit}</span>
                          </div>
                    }

            </div>
        )
    }
}

class AnimatedDigit extends React.PureComponent {

    render() {

        const {number,size,digitMargin} = this.props;

        if(number && typeof number === 'string')
        {
            return(
                <div style={{display : 'flex'}}>
                    {
                        number.split('').map((n,i) => {
                            return <Digit digit={n} key={i} size={size} digitMargin={digitMargin}/>
                        })
                    }
                </div>
            )
        }
        else
        {
            return null;
        }
        
    }
}

export default AnimatedDigit;
