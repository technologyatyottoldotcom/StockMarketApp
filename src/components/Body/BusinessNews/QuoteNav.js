import React from 'react';
import '../../../scss/QuoteNav.scss';

class Nav extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            navspecialAttr : ['className','activeClassName','children','onClick'],
            childSpecialAttr : ['render','component','active'],
            active : null,
            isHovered : null,
        }
        this.Hover = this.Hover.bind(this);
    }
Hover(e){
 this.setState({isHovered: e});
}
    render(){
     var navprop = {}
     for(let k in (this.props?.props || {}))if(!((this.state.navspecialAttr || []).find(ke=>ke===k)))navprop[k]=this.props?.props[k];

      return(
        <ul className="menu__row row">
          {(this.props.components || [])?.map((e,i)=>
              {
                if(e?.props){ 
                  let p = e?.props , ele = {} , activeClassName = this.props?.props?.activeClassName || 'active-nav-0' ,
                   sActive = this.state?.active 
                   for(let k in (e || {})){
                       if(k?.toLowerCase()==='props'){
                        let ke = {}
                        for(let pk in e[k])if(!(this.state.childSpecialAttr || []).find(ke=>ke===pk))ke[pk] = e[k][pk] ;
                        ele['props'] = ke;
                       }else ele[k]=e[k];
                    }
                    var ActiveElem = Boolean((sActive===null ? p?.active : sActive===e) || this.state.isHovered === e )
                   return <li 
                            onMouseEnter={_=>this.Hover(e)}
                            onMouseLeave={_=>this.Hover(null)}
                            onClick={d=>{typeof this.props?.props.onClick==='function'&&this.props?.props.onClick(i,d);this.setState({active:e});this.props.click(e)}} 
                            className={`col-auto ${this.props?.props?.className || ''} ${p.className || ''} ${ActiveElem ? activeClassName : ''}`} 
                            key={i+Math.random()*9999+Date.now()} {...navprop}>{ele}
                          </li>
                  }else return null
                }
              )
                }
           </ul>
        )
    }
}


class Quote extends React.PureComponent{
    render(){
        return(
            <>
               <div className="row">
               {
                  (this.props?.components || []).map((el,i)=>{
                     let e = el?.props , className = e?.className , active = e?.active ,f = e?.render || e?.component , pActive = this.props?.active , mActive = pActive===null ? active : pActive===el;
                     if(f)return <div key={i+Math.random()*9999+Date.now()} className={`${className||''}`} style={{display: ( mActive ) ?  'block' : 'none'}}>{typeof f==='function' ? f() : typeof f==='object' && f }</div>
                     else return null
                    })
                }
               </div>
            </>
        )
    }
}

/**
 * @QuoteNav 
 * @props ReactHTMLAttributes 
 * @props activeClassName 
 * @props onClick : ReactHTMLAttributes (@return index,element)
 * 
 * @children 
 * @props ReactHTMLAttributes 
 * @props  render | component : ReactComponent 
 * @props active : Boolean
 */

class QuoteNav extends React.Component{
    constructor(props){
        super(props);
        this.state = {
           components  : (Array.isArray(this.props?.children) ? this.props?.children : [this.props?.children]) || [],
           active      : null
        }
    }
    
  render(){
        return(
            <>
               <Nav props={this.props} components={this.state.components} click={e=>this.setState({active:e})} />
               <Quote components={this.state.components} active={this.state.active} />
            </>
        )
    }
}


export {QuoteNav}