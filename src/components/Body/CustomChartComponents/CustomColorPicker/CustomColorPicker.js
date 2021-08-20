import React from 'react';
import '../../../../css/CustomColorPicker.css';

const colors = [
    ['#212529','#343a40','#495057','#6c757d','#ced4da','#e9ecef'],
    ['#590d22','#ba181b','#c9184a','#ff0a54','#ff4d6d','#ff758f'],
    ['#47126b','#571089','#6411ad','#6d23b6','#822faf','#973aa8'],
    ['#012a4a','#013a63','#01497c','#014f86','#2a6f97','#468faf'],
    ['#2196f3','#42a5f5','#64b5f6','#90caf9','#bbdefb','#e3f2fd'],
    ['#14746f','#248277','#358f80','#469d89','#56ab91','#67b99a'],
    ['#006400','#007200','#008000','#38b000','#88d4ab','#99e2b4'],
    ['#ff7b00','#ff9500','#ffaa00','#ffc300','#ffdd00','#ffea00']
];

export class CustomColorPicker extends React.PureComponent {

    constructor(props)
    {
        super(props);
        this.state = {
            isOpen : false,
            heroColor : this.props.defaultColor
        }
        this.togglePicker = this.togglePicker.bind(this);
        this.selectColor = this.selectColor.bind(this);
        this.closePicker = this.closePicker.bind(this);
        this.setComponentRef = this.setComponentRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }
    
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    setComponentRef(node)
    {
        this.ComponentRef = node;
    }

    handleClickOutside(event) {
        if (this.ComponentRef && !this.ComponentRef.contains(event.target)) {
            this.setState({
                isOpen : false
            })
        }
    }

    selectColor(color)
    {
        this.setState({
            heroColor : color
        });
        this.props.onColorChange(color);
    }

    togglePicker()
    {
        this.setState((prevState)=>({
            isOpen : !prevState.isOpen
        }))
    }
    
    closePicker()
    {
        this.setState({
            isOpen : false
        })
    }

    render() {

        const {width,height,size} = this.props;
        const {isOpen,heroColor} = this.state;

        return (
            <div className="custom-color-picker" style={{width : width , height : height}} ref={this.setComponentRef}>
                <div className="custom-color-picker-header" onClick={()=>{this.togglePicker()}}>
                    <span className="custom-picked-color" style={{width : size  , height : size , backgroundColor : heroColor}}></span>
                    <span className="custom-color-choose">Choose</span>
                </div>
                {isOpen ? 
                    <div className="custom-color-picker-container" >
                        <div className="custom-picker-box">
                            <div className="custom-color-wrapper">
                                {colors.map((color,i)=>{
                                    return <div className="custom-color-row">
                                        {color.map((c,j)=>{
                                            return <p 
                                                className="custom-color" 
                                                key={i*10 + j} 
                                                style={{backgroundColor : c}}
                                                onClick={()=> {this.selectColor(c)}}
                                                >

                                                </p> 
                                        })}
                                    </div>
                                })}
                            </div>
                        </div>
                    </div>
                    :
                    <></>
                }
            </div>
        )
    }
}

export default CustomColorPicker;
