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

export class ConfigColor extends React.PureComponent {

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

    componentDidUpdate(prevProps)
    {
        if(this.props.defaultColor !== prevProps.defaultColor)
        {
            this.setState({
                heroColor : this.props.defaultColor
            });
        }
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

    getImage(type)
    {
        if(type.includes('fill'))
        {
            return <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.9669 7.66286L4.07868 0L2.83456 1.20857L4.93456 3.24857L0.390441 7.66286C-0.130147 8.16857 -0.130147 8.98286 0.390441 9.48L5.24338 14.1943C5.49926 14.4429 5.84338 14.5714 6.17868 14.5714C6.51397 14.5714 6.85809 14.4429 7.11397 14.1943L11.9669 9.48C12.4875 8.98286 12.4875 8.16857 11.9669 7.66286Z" fill="#404040"/>
                            <path d="M1.76471 8.39136L5.99118 4.28564L10.2177 8.39136H1.76471Z" fill="#ffffff"/>
                            <path d="M13.2353 10.2856C13.2353 10.2856 11.4706 12.1456 11.4706 13.2856C11.4706 14.2285 12.2647 14.9999 13.2353 14.9999C14.2059 14.9999 15 14.2285 15 13.2856C15 12.1456 13.2353 10.2856 13.2353 10.2856Z" fill="#404040"/>
                    </svg>
            
        }
        else if(type.includes('stroke'))
        {
            return <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.7419 3.56637C15.086 3.2223 15.086 2.6665 14.7419 2.32243L12.6775 0.258037C12.5127 0.0928387 12.2889 0 12.0556 0C11.8222 0 11.5984 0.0928387 11.4336 0.258037L9.70445 1.98719L13.0128 5.29552L14.7419 3.56637Z" fill="#404040"/>
                        <path d="M8.82223 2.86938L0 11.6916V14.9999H3.30834L12.1306 6.17771L8.82223 2.86938Z" fill="#404040"/>
                        <path d="M2.57609 13.2356H1.76445V12.424L8.82223 5.36621L9.63388 6.17785L2.57609 13.2356Z" fill="white"/>
                    </svg>
            
        }
        else
        {
            return <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.9669 7.66286L4.07868 0L2.83456 1.20857L4.93456 3.24857L0.390441 7.66286C-0.130147 8.16857 -0.130147 8.98286 0.390441 9.48L5.24338 14.1943C5.49926 14.4429 5.84338 14.5714 6.17868 14.5714C6.51397 14.5714 6.85809 14.4429 7.11397 14.1943L11.9669 9.48C12.4875 8.98286 12.4875 8.16857 11.9669 7.66286Z" fill="#404040"/>
                        <path d="M1.76471 8.39136L5.99118 4.28564L10.2177 8.39136H1.76471Z" fill="#ffffff"/>
                        <path d="M13.2353 10.2856C13.2353 10.2856 11.4706 12.1456 11.4706 13.2856C11.4706 14.2285 12.2647 14.9999 13.2353 14.9999C14.2059 14.9999 15 14.2285 15 13.2856C15 12.1456 13.2353 10.2856 13.2353 10.2856Z" fill="#404040"/>
                    </svg>
            
        }
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

        const {width,size,label} = this.props;
        const {isOpen,heroColor} = this.state;

        return (
            <div className="custom-color-picker" ref={this.setComponentRef}>
                <div className="custom-color-picker-header" onClick={()=>{this.togglePicker()}}>
                    {this.getImage(label)}

                    <span className="custom-picked-color" style={{backgroundColor : heroColor }}></span>
                </div>
                {isOpen ? 
                    <div className="custom-color-picker-container" style={{width : width}}>
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

export default ConfigColor;
