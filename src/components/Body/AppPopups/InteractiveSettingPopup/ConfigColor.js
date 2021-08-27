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
            return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.9559 10.2171L5.43824 0L3.77941 1.61143L6.57941 4.33143L0.520588 10.2171C-0.173529 10.8914 -0.173529 11.9771 0.520588 12.64L6.99118 18.9257C7.33235 19.2571 7.79118 19.4286 8.23824 19.4286C8.68529 19.4286 9.14412 19.2571 9.48529 18.9257L15.9559 12.64C16.65 11.9771 16.65 10.8914 15.9559 10.2171Z" fill="#404040"/>
                    <path d="M2.35294 11.1886L7.98823 5.71436L13.6235 11.1886H2.35294Z" fill="#ffffff"/>
                    <path d="M17.6471 13.7144C17.6471 13.7144 15.2941 16.1944 15.2941 17.7144C15.2941 18.9715 16.3529 20.0001 17.6471 20.0001C18.9412 20.0001 20 18.9715 20 17.7144C20 16.1944 17.6471 13.7144 17.6471 13.7144Z" fill="#404040"/>
                </svg>
        }
        else if(type.includes('stroke'))
        {
            return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.6559 4.75516C20.1147 4.2964 20.1147 3.55534 19.6559 3.09658L16.9034 0.344049C16.6836 0.123785 16.3853 0 16.0741 0C15.763 0 15.4646 0.123785 15.2448 0.344049L12.9393 2.64959L17.3504 7.06069L19.6559 4.75516Z" fill="#404040"/>
                <path d="M11.763 3.82593L0 15.5889V20H4.41112L16.1741 8.23703L11.763 3.82593Z" fill="#404040"/>
                <path d="M3.43479 17.6473H2.3526V16.5651L11.763 7.15479L12.8452 8.23698L3.43479 17.6473Z" fill="white"/>
            </svg>
        }
        else
        {
            return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.9559 10.2171L5.43824 0L3.77941 1.61143L6.57941 4.33143L0.520588 10.2171C-0.173529 10.8914 -0.173529 11.9771 0.520588 12.64L6.99118 18.9257C7.33235 19.2571 7.79118 19.4286 8.23824 19.4286C8.68529 19.4286 9.14412 19.2571 9.48529 18.9257L15.9559 12.64C16.65 11.9771 16.65 10.8914 15.9559 10.2171Z" fill="#404040"/>
                    <path d="M2.35294 11.1886L7.98823 5.71436L13.6235 11.1886H2.35294Z" fill="#ffffff"/>
                    <path d="M17.6471 13.7144C17.6471 13.7144 15.2941 16.1944 15.2941 17.7144C15.2941 18.9715 16.3529 20.0001 17.6471 20.0001C18.9412 20.0001 20 18.9715 20 17.7144C20 16.1944 17.6471 13.7144 17.6471 13.7144Z" fill="#404040"/>
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
