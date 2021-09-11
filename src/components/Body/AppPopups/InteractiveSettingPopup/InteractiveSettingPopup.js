import React, { Component } from "react";
import '../../../../css/InteractiveSettingPopup.css';
import DeleteIcon from '../../../../assets/icons/delete.svg';
import ConfigColor from "./ConfigColor";
import ConfigStrokeType from "./ConfigStrokeType";
import ConfigWidth from "./ConfigWidth";

export class InteractiveSettingPopup extends Component {
	constructor(props) {
		super(props);
        this.state = {
            selectedInteractive : JSON.parse(JSON.stringify(this.props.selectedInteractive)),
            selectedtype : this.props.selectedtype
        }
        this.saveAppearance = this.saveAppearance.bind(this);
	}

    componentDidUpdate(prevProps)
    {
        if(this.props.isSelected !== prevProps.isSelected || this.props.interactiveFlag !== prevProps.interactiveFlag)
        {
            // console.log(this.props.selectedInteractive.appearance)
            this.setState({
                selectedInteractive : JSON.parse(JSON.stringify(this.props.selectedInteractive)),
                selectedtype : this.props.selectedtype
            })
        }
    }

    interactiveConfigList(type)
    {
        if(type === 'trends')
        {
            return [
                {
                    label : 'stroke',
                    type : 'color'
                },
                {
                    label : 'strokeWidth',
                    type : 'width'
                },
                {
                    label : 'strokeDasharray',
                    type : 'stroketype'
                },
                {
                    label : 'delete',
                    type : 'delete'
                }
            ];
        }
        else if(type === 'channels')
        {
            return [
                {
                    label : 'stroke',
                    type : 'color'
                },
                {
                    label : 'strokeWidth',
                    type : 'width'
                },
                {
                    label : 'fill',
                    type : 'color'
                },
                {
                    label : 'delete',
                    type : 'delete'
                }
            ];
        }
        else if(type === 'sdchannel')
        {
            return [
                {
                    label : 'stroke',
                    type : 'color'
                },
                {
                    label : 'strokeWidth',
                    type : 'width'
                },
                {
                    label : 'fill',
                    type : 'color'
                },
                {
                    label : 'delete',
                    type : 'delete'
                }
            ];
        }
        else if(type === 'retracements')
        {
            return [
                {
                    label : 'stroke',
                    type : 'color'
                },
                {
                    label : 'strokeWidth',
                    type : 'width'
                },
                {
                    label : 'delete',
                    type : 'delete'
                }
            ];
        }
        else if(type === 'fans')
        {
            return [
                {
                    label : 'stroke',
                    type : 'color'
                },
                {
                    label : 'strokeWidth',
                    type : 'width'
                },
                {
                    label : 'delete',
                    type : 'delete'
                }
            ];
        }
        else
        {
            return [];
        }
    }

    createConfig(interactive)
    {
        const appearance = interactive && interactive.appearance;
        const list = this.interactiveConfigList(this.state.selectedtype);
        // console.log(list);

        return list.map((l,i)=>{

            // console.log(l)
            // console.log(appearance[l.label])
            if(l.type === 'color')
            {
                return <div className="interactive_setting__block">
                    <ConfigColor 
                        width={200} 
                        size={20}
                        label={l.label}
                        defaultColor={appearance[l.label]}
                        onColorChange={(value)=> {this.saveAppearance(l.label,value)}}
                    />
                </div>
            }
            else if(l.type === 'width')
            {
                return <div className="interactive_setting__block">
                    <ConfigWidth 
                        title={appearance[l.label]}
                        width={120}
                        onTypeChange={(value)=> {this.saveAppearance(l.label,value)}}
                    />
                </div>
            }
            else if(l.type === 'stroketype')
            {
                return <div className="interactive_setting__block">
                    <ConfigStrokeType 
                        title="1" 
                        width={160} 
                        title={appearance[l.label]} 
                        onTypeChange={(value)=> {this.saveAppearance(l.label,value)}}
                    />
                </div>
            }
            else if(l.type === 'delete')
            {
                return <div className="interactive_setting__block" onClick={()=> this.props.deleteInteractive(this.state.selectedtype)}>
                    <img width={20} src={DeleteIcon} alt="X"/>
                </div>
            }
        });


    }

    saveAppearance(label,value)
    {
        const {selectedInteractive} = this.state;
        // console.log(selectedInteractive)
        const {appearance} = selectedInteractive;
        // console.log(appearance)
        appearance[label] = value;
        selectedInteractive['appearance'] = appearance;
        this.setState({
            selectedInteractive : selectedInteractive
        },()=>{
            console.log(this.state.selectedInteractive);
            this.props.saveInteractive(this.state.selectedInteractive)
        });
    }
	
    
	render() {

        const {isSelected} = this.props;
        const {selectedInteractive} = this.state;

        // console.log(isSelected,selectedInteractive)
		if(isSelected)
        {
            return (
                <div className="interactive__setting__popup">
                    {this.createConfig(selectedInteractive)}
                </div>
            );
        }
        else
        {
            return null
        }
	}
}


export default InteractiveSettingPopup;
