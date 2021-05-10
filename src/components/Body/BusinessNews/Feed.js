import React from 'react';
import '../../../scss/Feed.scss';
import { Popover, Whisper , Dropdown , Loader } from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css';


import Axios from 'axios';

const REQUEST_BASE_URL = 'localhost';

const MonthNames = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sep','Oct','Nov','Dec']

const SVGLOGOS = {
  Verified(p) {
    return (
      <svg viewBox="0 0 24 24" width={17} height={17} aria-label="Verified-account" ><g><path fill={p.color || '#35a3f1'} d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"></path></g></svg>
    )
  },
  Location({ text }) {
    return (
      <>
        <svg viewBox="0 0 24 24" width={16} height={16} ><g><path d="M12 14.315c-2.088 0-3.787-1.698-3.787-3.786S9.913 6.74 12 6.74s3.787 1.7 3.787 3.787-1.7 3.785-3.787 3.785zm0-6.073c-1.26 0-2.287 1.026-2.287 2.287S10.74 12.814 12 12.814s2.287-1.025 2.287-2.286S13.26 8.24 12 8.24z"></path><path d="M20.692 10.69C20.692 5.9 16.792 2 12 2s-8.692 3.9-8.692 8.69c0 1.902.603 3.708 1.743 5.223l.003-.002.007.015c1.628 2.07 6.278 5.757 6.475 5.912.138.11.302.163.465.163.163 0 .327-.053.465-.162.197-.155 4.847-3.84 6.475-5.912l.007-.014.002.002c1.14-1.516 1.742-3.32 1.742-5.223zM12 20.29c-1.224-.99-4.52-3.715-5.756-5.285-.94-1.25-1.436-2.742-1.436-4.312C4.808 6.727 8.035 3.5 12 3.5s7.192 3.226 7.192 7.19c0 1.57-.497 3.062-1.436 4.313-1.236 1.57-4.532 4.294-5.756 5.285z"></path></g></svg>
        {text || ''}
      </>
    )
  },
  Calendar({ text }) {
    return (
      <>
        <svg viewBox="0 0 24 24" width={16} height={16} ><g><path d="M19.708 2H4.292C3.028 2 2 3.028 2 4.292v15.416C2 20.972 3.028 22 4.292 22h15.416C20.972 22 22 20.972 22 19.708V4.292C22 3.028 20.972 2 19.708 2zm.792 17.708c0 .437-.355.792-.792.792H4.292c-.437 0-.792-.355-.792-.792V6.418c0-.437.354-.79.79-.792h15.42c.436 0 .79.355.79.79V19.71z"></path><circle cx="7.032" cy="8.75" r="1.285"></circle><circle cx="7.032" cy="13.156" r="1.285"></circle><circle cx="16.968" cy="8.75" r="1.285"></circle><circle cx="16.968" cy="13.156" r="1.285"></circle><circle cx="12" cy="8.75" r="1.285"></circle><circle cx="12" cy="13.156" r="1.285"></circle><circle cx="7.032" cy="17.486" r="1.285"></circle><circle cx="12" cy="17.486" r="1.285"></circle></g></svg>
        {text || ''}
      </>
    )
  },
  Link({ text }) {
    return (
      <>
        <svg viewBox="0 0 24 24" width={16} height={16} ><g><path d="M11.96 14.945c-.067 0-.136-.01-.203-.027-1.13-.318-2.097-.986-2.795-1.932-.832-1.125-1.176-2.508-.968-3.893s.942-2.605 2.068-3.438l3.53-2.608c2.322-1.716 5.61-1.224 7.33 1.1.83 1.127 1.175 2.51.967 3.895s-.943 2.605-2.07 3.438l-1.48 1.094c-.333.246-.804.175-1.05-.158-.246-.334-.176-.804.158-1.05l1.48-1.095c.803-.592 1.327-1.463 1.476-2.45.148-.988-.098-1.975-.69-2.778-1.225-1.656-3.572-2.01-5.23-.784l-3.53 2.608c-.802.593-1.326 1.464-1.475 2.45-.15.99.097 1.975.69 2.778.498.675 1.187 1.15 1.992 1.377.4.114.633.528.52.928-.092.33-.394.547-.722.547z"></path><path d="M7.27 22.054c-1.61 0-3.197-.735-4.225-2.125-.832-1.127-1.176-2.51-.968-3.894s.943-2.605 2.07-3.438l1.478-1.094c.334-.245.805-.175 1.05.158s.177.804-.157 1.05l-1.48 1.095c-.803.593-1.326 1.464-1.475 2.45-.148.99.097 1.975.69 2.778 1.225 1.657 3.57 2.01 5.23.785l3.528-2.608c1.658-1.225 2.01-3.57.785-5.23-.498-.674-1.187-1.15-1.992-1.376-.4-.113-.633-.527-.52-.927.112-.4.528-.63.926-.522 1.13.318 2.096.986 2.794 1.932 1.717 2.324 1.224 5.612-1.1 7.33l-3.53 2.608c-.933.693-2.023 1.026-3.105 1.026z"></path></g></svg>
        {text || ''}
      </>
    )
  },
  Retweets({ text }) {
    let [hover, set] = React.useState(false)
    return (
      <>
        <span onMouseEnter={_ => set(true)} onMouseLeave={_ => set(false)} title='Retweet' style={{ color: 'rgba(0,0,0,.6)' }}>
          <svg viewBox="0 0 24 24" width={20} height={20} style={{ cursor: 'pointer', fill: (hover ? '#17bf63' : 'rgba(0,0,0,.6)') }} ><g><path d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z"></path></g></svg>
          &nbsp;{text || ''}
        </span>
      </>
    )
  },
  Like({ text }) {
    let [hover, set] = React.useState(false)
    return (
      <>
        <span onMouseEnter={_ => set(true)} onMouseLeave={_ => set(false)} title='Like' style={{ color: 'rgba(0,0,0,.6)' }}>
          <svg viewBox="0 0 24 24" width={20} height={20} style={{ cursor: 'pointer', fill: (hover ? 'red' : 'rgba(0,0,0,.6)') }} ><g><path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z"></path></g></svg>
          &nbsp;{text || ''}
        </span>
      </>
    )
  },
  Share({ title, link }) {
    let [hover, set] = React.useState(false)
    if (link) {
      let sub = "Share tweet", enc = encodeURIComponent(title + '\n' + link)
      return (
       <div style={{left : -20 , marginTop : -10 }}>
          <Dropdown title={
            <span onMouseEnter={_ => set(true)} onMouseLeave={_ => set(false)} title='Share'>
              <svg viewBox="0 0 24 24" height={20} style={{ cursor: 'pointer', fill: (hover ? '#1da1f2' : 'rgba(0,0,0,.6)') }}><g><path d="M17.53 7.47l-5-5c-.293-.293-.768-.293-1.06 0l-5 5c-.294.293-.294.768 0 1.06s.767.294 1.06 0l3.72-3.72V15c0 .414.336.75.75.75s.75-.336.75-.75V4.81l3.72 3.72c.146.147.338.22.53.22s.384-.072.53-.22c.293-.293.293-.767 0-1.06z"></path><path d="M19.708 21.944H4.292C3.028 21.944 2 20.916 2 19.652V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 .437.355.792.792.792h15.416c.437 0 .792-.355.792-.792V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 1.264-1.028 2.292-2.292 2.292z"></path></g></svg>
            </span>
          } noCaret>
            <Dropdown.Item icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383l-4.758 2.855L15 11.114v-5.73zm-.034 6.878L9.271 8.82 8 9.583 6.728 8.82l-5.694 3.44A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.739zM1 11.114l4.758-2.876L1 5.383v5.73z" />
              </svg>
            } onClick={_ => window.open(`mailto:?subject=${sub}&amp;body=<div>${title}</div><a href=${link}>${link}</a>`, "_blank")}>&nbsp;&nbsp;Share on Mail</Dropdown.Item>
            <Dropdown.Item icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
              </svg>
            } onClick={_ => window.open(`https://www.facebook.com/sharer/sharer.php?u=${link}`, "_blank")}>&nbsp;&nbsp;Share on Facebook</Dropdown.Item>
            <Dropdown.Item icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
              </svg>
            } onClick={_ => window.open(`https://twitter.com/share?url=${enc}`, "_blank")}>&nbsp;&nbsp;Share on Twitter</Dropdown.Item>
            <Dropdown.Item icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
              </svg>
            } onClick={_ => { navigator?.clipboard?.writeText(link) }}>&nbsp;&nbsp;Copy URL</Dropdown.Item>
          </Dropdown>
        </div>
      )
    } else return null
  }
}



 
function shortenLargeNumber(num, digits) {
    var units = ['k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'],
        decimal;

    for(var i=units.length-1; i>=0; i--) {
        decimal = Math.pow(1000, i+1);

        if(num <= -decimal || num >= decimal) {
            return +(num / decimal).toFixed(digits) + units[i];
        }
    }

    return num;
}
const createTime = (dte=new Date())=>{
  var res = {
    time : null,
    fullDate : null
  }
   try{
     dte = new Date(dte);
    var oD = dte.getDate() , nw = new Date(), d = (nw).getDate() , sme = dte.getMonth()===nw.getMonth() && dte.getFullYear()===nw.getFullYear()
    res.fullDate = dte;
    if(sme && oD===d){
      let m = nw.getMinutes() , om = dte.getMinutes() , mi = Math.abs(m-om)
      res.time = mi && 40 > mi ? mi+'m':'TODAY';
    }else if(oD===(d-1) && sme){
      res.time = 'YESTERDAY';
    }else{
      res.time = sme ? Math.abs(oD-d)+'d' : Math.round(  Math.abs( nw.getTime() - dte.getTime() ) / (1000 * 3600 * 24) )+'d'  ;
    }
    
   }catch(e){}
return res
}

function LoadingDiv({ total = 5 , background= '#e8dddd4a' , loadingColor = '#ece6e6' , margin = '10px' , width = 400 , height = 50 }){
  const arr = [] , num = Number(total)
  for(let k=0;k<num;++k)arr.push(k);
  return(
    arr.map((v,i)=>{
      return(
        <div key={i+Math.random() + 65} style={{ overflow : 'hidden' , margin : margin , width : width , height : height , position : 'relative' , background:background}}>
          <div className="LoadingDivAnimation" style={{position:'relative', animationDuration : ( (Math.round(Math.random() * ( 10 - 4 ) + 4 ) ) || 4) +'s' ,boxShadow : '0 0 20px' , transform : 'rotateZ(44deg)' , top : -10, width : 1 , height : height + 15 , background : loadingColor }}></div>
        </div>
      )
    })
  )
  
  }
  
function CreateBox(props) {
    return (
        <>
            <div className="rounded mt-3 p-2 GlobalScrollBar" style={{fontSize : 12, height : 500 , overflowX:'hidden' }}>
                {props.data}
            </div>
        </>
    )
}


class TwitterFeeds extends React.PureComponent{
    constructor(props){
        super(props);
        this.state = {
            hashTag : this.props.symbol , //String : don't use #
            resultType : 'latest',//more info view the server twitter.js file
            hashTagDataLength : 5,//number : default 1
            data  : [],
            users : [],
            newUser : false, //boolean
            loading : true
        }
        this.hasUser = this.hasUser.bind(this)
        this.hasTagClick = this.hasTagClick.bind(this)
        this.GetDate = this.GetDate.bind(this)
        this.AtTheRateClick = this.AtTheRateClick.bind(this)

        this.hashTagsUsers = this.hashTagsUsers.bind(this)
        this.hashTagsUsersClick = this.hashTagsUsersClick.bind(this)

        this.DescThumbnail = this.DescThumbnail.bind(this);
        this.isURL = this.isURL.bind(this)
    }

componentDidMount(){
  this.GetHashTagData()
}

GetHashTagData(){
  let h = this.state.hashTag
  if(h){
    Axios(`http://${REQUEST_BASE_URL}:8000/twitter/${this.state.hashTag}/${this.state.resultType}/${this.state.hashTagDataLength || 1}`).then(({data})=>{
      this.setState({
        data:data , 
        users : (data).map((v)=>{let s = {};s[v.user.screen_name] = v.user;return s}),
        loading : false
      })
    }).catch(e=>{
      console.log('err in GetHashTagData = ',e)
    })

  }
}
    
GetDate = d =>{
  try {
    let n = new Date(d)
    return MonthNames[n.getMonth()] + ' ' + n.getFullYear()
  } catch (e) { }
}

 hasUser = t=> {
   let f = t ? (this.state.users || {}).hasOwnProperty(t):null
   if(!f && t){
    if(Array.isArray(this.state.users)){
       for(let k of this.state.users){
          if(typeof k=='object' && k && !Array.isArray(k)){
            f = k.hasOwnProperty(t)
            if(f){
              f = k[t];
              break;
            }
          }
       }
    }
   }
   return f
 }
    
hasTagClick = e=>{
  let t = String(e.target.innerText).replace("#",'')
  if(t){
    this.setState({hashTag:t})
    this.GetHashTagData()
    console.log('hasTagClick = ',t)
  }
}
  
hashTagsUsersClick(t){//@ is removed 
  return new Promise((res) => {
    if (!this.hasUser(t)) {
      Axios(`http://${REQUEST_BASE_URL}:8000/twitterUser/${t}`).then(({ data }) => {
        let d = {}
        d[t] = data
        this.setState(e => { e.users.push(d) })
        res(true)
      }).catch(e => {//handle this error according to you
        console.log('err in hashTagsUsersClick= ', e)
      })
    } else res(true)
  })

}

AtTheRateClick({ placement , text , component }){
  if (text) {
    let r = String(text).replace("@", ''), usr = this.hasUser(r)
    return (
      <>
        <Whisper
          trigger="active"
          {...(!usr ? {onClick:_=>this.hashTagsUsersClick(r).then(_=>{
            this.setState({newUser : true})
          })} : {})}
          placement={placement}
          speaker={
            <Popover>
              {
                (usr) ? (
                  <div className="container-fluid pb-3 pt-0" style={{ background: 'white', color: 'black' }}>
                    <div className="row pr-1 pt-2 justify-content-between" style={{ height: 100, backgroundImage: "url(" + usr.profile_banner_url + ")", backgroundPosition: 'center', backgroundSize: 'cover' }}>
                      <div className="col-4 p-3 pt-1 pl-0">
                        <div className="position-absolute" style={{ marginTop: 60 }}>
                          <img src={usr.profile_image_url_https} alt={usr.name} className="img-fluid rounded-circle" />
                        </div>
                      </div>
                      <div className="col-6 align-self-start" style={{ textAlign: 'right' }}>
                        <div><button type="button" onClick={_ => window.open("https://twitter.com/" + usr.screen_name, "_blank")} style={{ borderRadius: 45, border: '1px solid #3091ca', width: 70 }} className="pr-2 pl-2"><a href={"https://twitter.com/" + usr.screen_name} target="_blank" rel="noopener noreferrer" style={{ fontSize: 15, fontWeight: 'bold' }}>Follow</a></button></div>
                      </div>
                    </div>
                    <div style={{ marginTop: 20, textAlign: 'left', fontSize: 15, lineHeight: 1.3 }} className="pt-2">
                      <div className="row justify-content-start">
                        <div className="col-8">{usr.name}
                          {usr.verified && <span style={{ marginLeft: 3, color: 'black' }}><SVGLOGOS.Verified color="#35a3f1" /></span>}
                        </div>
                      </div>
                      <div className="text-secondary">@{usr.screen_name}</div>
                      <div style={{ lineHeight: 1.5 }}>
                        <br />
                        <div className="w-100"></div>
                        <div>{this.hashTagsUsers(usr, 'usr')}</div>
                      </div>
                    </div>

                    <div className="row justify-content-start pt-2 pb-2">
                      {usr.location && <div className="col-4"><SVGLOGOS.Location text={<span className="text-secondary">{usr.location}</span>} /></div>}
                      {
                        (usr.hasOwnProperty('entities') && usr.entities.hasOwnProperty('url') && usr.entities.url.hasOwnProperty('urls')) && (
                          (usr.entities.url.urls).map((v, i) => {
                            try {
                              if ('object' === typeof v && v && v.url && v.display_url) {
                                return <div className="col" key={v.url + Math.random() * (i || 3)}><SVGLOGOS.Link key={v.url + (Math.random() * (i || 5))} text={
                                  <a href={v.url} target="_blank" rel="noopener noreferrer" >{v.display_url}</a>
                                } /></div>
                              } else return null
                            } catch (e) { }
                            return null
                          })
                        )
                      }
                      {
                        usr.created_at && <div className="col"><SVGLOGOS.Calendar text={<span className="text-secondary">&nbsp;Joined&nbsp;{this.GetDate(usr.created_at)}</span>} /></div>
                      }
                    </div>

                    {
                      (usr.followers_count || usr.friends_count) && (
                        <div className="row justify-content-md-center" style={{ fontSize: 13 }}>
                          <div className="col-6">
                            <span style={{ fontWeight: 'bold' }}>{shortenLargeNumber(usr.friends_count, 1) || 0}</span> <span className="text-secondary">Following</span>
                          </div>
                          <div className="col">
                            <span style={{ fontWeight: 'bold' }}>{shortenLargeNumber(usr.followers_count, 1) || 0}</span> <span className="text-secondary">Followers</span>
                          </div>
                        </div>
                      )
                    }
                  </div>
                ) :
                  (this.state.newUser ? (
                    <>
                     <this.AtTheRateClick placement={placement} text={text} component={component} />
                     {setTimeout(_=>this.setState({ newUser : false }),600)}
                    </>
                    ) : (
                    <div className="container text-center p-0 text-center">
                      <div style={{ height: 50, width: 50, background: '#000000ad' }} className="p-2">
                        <Loader inverse center />
                      </div>
                    </div>
                  )
                )

              }
            </Popover>

          }
        >

          {component ? component : <span className="hashTagsUsers">{text}</span>}
        </Whisper>
      </>
    )
  } else return null
}

isURL = (str)=>{
  if(str){ 
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return pattern.test(str.trim());
  }else return false
  }

hashTagsUsers(v,t){
  const URLS = (t==='usr' ? v.hasOwnProperty('descriptionUrls') && v.descriptionUrls : (v.hasOwnProperty("entities") && v.entities.urls ) ) || [] //entities , urls
  const VOBJ = 'object'===typeof v ;

 const URLdec = t =>{
    let res = t 
    if( t && VOBJ && this.isURL(t)){
      let resF = _=> {res = t.indexOf("twitter")===-1 ? <a key={t+Math.random()+3 } href={t} target="_blank" rel="noopener noreferrer">{t}</a> : '' }
      for (let u of URLS) {
        if (u && 'object' === typeof u) {
          if (u.hasOwnProperty('url')) {
            if (u.url === t) {
              res = (u.display_url).indexOf("twitter")===-1 ? <a key={u+23+Math.random() } href={u.url} target="_blank" rel="noopener noreferrer">{u.display_url}</a> : ''
              break;
            }else res = ''
          }else resF()
        }else resF()
      }
    }else if(String(res).indexOf('http')!==-1){res = ''}
    return res
}

return ( 
       (String(v.text || v.description).split(/([#|@][a-z\d][\w-]*)|(https?:\/\/[^\s]+)/ig) || []).map((v,i)=>{
              let f = v && v[0]
               return(
                f==='#' || f==='@' ?(
                    f==='@' ?
                    <this.AtTheRateClick key={v+i} placement="autoVertical" text={v} />
                     :
                     <span key={v+i} onClick={this.hasTagClick} className="hashTagsUsers">{v}</span> 
                  ): 
                    (
                      URLdec(v)
                    )
                )
         })
        
    )
    
}

DescThumbnail(arr,text){
  var res = null , statusURL = "https://twitter.com/i/web/status/"+arr.id_str
  const hasP = (p,a) =>(a || arr).hasOwnProperty(p)
  if(arr && typeof arr==='object' && !Array.isArray(arr)){
    if(hasP('entities')){
      if(hasP('media',arr.entities)){
        let m = arr.entities.media;
        if(Array.isArray(m) && m.length){
              m = m[0]
              var pu = t=><a href={ (url || statusURL)} target="_blank" rel="noopener noreferrer" ><div>{m.display_url}</div> {t} </a>
              let url = (m.media_url_https || m.media_url), 
              t = String(m.type).toLowerCase();
            if(typeof m==='object' && !Array.isArray(m)){
              if(t==='photo' || t==='gif'){
                res = pu(<img src={url} style={{borderRadius:20,maxHeight:'100%',height:200,border:'1px solid #c5b4b4'}} alt={t} />)
              }else if(t==='video'){
                res = pu(
                  <span>
                    <video controls>
                      <source src={url} type="video/mp4" />
                      <source src={url} type="video/webm" />
                      <p>Your browser doesn't support HTML5 video. Here is
                        a <a href={url}>link to the video</a> instead.</p>
                    </video>
                  </span>
                )
              }
            }
          }
        }
    }
  }
  if(!res){
    res = <a href={ statusURL } target="_blank" rel="noopener noreferrer" >twitter.com/i/web/status/{arr.id_str} </a>
  }
return res
}

render(){
        return(
            <>
              <div className="container-fluid p-0 m-0">
                {!this.state.loading ? 
                (this.state.data ).map((v,i)=>{
                    let text = this.hashTagsUsers(v) , thumbnail = this.DescThumbnail(v,text) , Link = `https://twitter.com/i/web/status/${v.id_str}`
                    return (
                     <div className="row m-0 p-1 pt-2 mb-3 border" key={ v.id_str + Math.random() * (i || 2) }>
                       
                        <div className="col-1 p-0 m-0" style={{paddingRight:10,marginLeft:1,textAlign:'right'}}>{v.user.profile_image_url_https && <img src={v.user.profile_image_url_https} className="img-fluid rounded-circle" alt={v.user.name} style={{cursor:'pointer'}} onClick={_=>window.open(Link,"_blank")} />} </div>
                        <div className="col-10 m-0 ml-2 " style={{cursor:'pointer'}} >
                            <div className="row m-0 p-0 pb-2" style={{lineHeight:1}}>
                            <this.AtTheRateClick key={v+i} placement="autoVertical" text={v.user.screen_name} component={
                                <div className="col p-0 text-truncate d-flex" style={{padding:0,margin:0,fontWeight:'bold'}}>
                                {v.user.name && <div className="text-truncate">{v.user.name} </div>}
                                
                                {v.user.verified && <div style={{width:16,marginLeft:3}}><SVGLOGOS.Verified color="#35a3f1"/></div>}
                                {v.user.screen_name && <div style={{marginLeft:2,color:'#6c757dab'}}>@{v.user.screen_name}</div>}
                                    {createTime(v.created_at) && <div className=" p-0 m-0 "> <span className="m-1">&nbsp;&middot;&nbsp;</span> <span>{createTime(v.created_at).time}</span></div>} 
                                </div>
                            } />

                            </div>

                            <div className="col m-0 p-0 pb-2" style={{fontWeight:'normal'}} >
                                {text}
                            </div>

                        </div>
                          <div className="row text-center">
                            {thumbnail}
                          </div>
                        <div className="row justify-content-center p-3 pl-4 pr-4 pb-0">
                           <div className="col text-center" onClick={_=>window.open(Link,"_blank")}>
                             <SVGLOGOS.Retweets text={v.retweet_count && (shortenLargeNumber(v.retweet_count,1) || '')} /> 
                           </div>
                           <div className="col text-center" onClick={_=>window.open(Link,"_blank")}>
                             <SVGLOGOS.Like text={v.favorite_count && (shortenLargeNumber(v.favorite_count,1) || '')} />
                           </div>
                           <div className="col text-center">
                             <SVGLOGOS.Share title={text} link={Link} />
                           </div>
                        </div>

                     </div>
                    )
                })
                :
            <LoadingDiv total={6} height={65} width='95%' />

                }

               </div>
               {/* {console.log("dd= ",this.state.users)} */}
          
            </>
            
        )  
  }
}



function RenderMedia({ data }){
  const Get = (t,i=0)=>Array.isArray(t) ? t[i] : t;
  let link = Get(data.link), dTime = createTime(Get(data.pubDate)), source = Get(data.source), sU = Get(source.$.url)
  
  const [get, set] = React.useState({img:null,desc:null})
  if(!get.img){
    Axios(`http://${REQUEST_BASE_URL}:8000/getmetadata?url=${link}&types=og:image,og:description`).then(({data})=>{
       let d = data.data
       if( d && !data.error && typeof d==='object'){
         let img = d['og:image'] , desc = d['og:description'];
         if(img){
           if(desc && desc.length > 200){
             desc = desc.slice(0,200)+'...'
           }
           set({img:img,desc:desc})
         }
       }
     }).catch(e=>{
       console.log("err in MediaData = ",e) //handle this error
     })
    }

  const head = Get(data.title) , Source = Get(data.source)._
  return (
    <>
      <div className="col-9">
        <article className="gNews">
          <div style={{color:'black',fontSize:12}}>
            {/* dangerouslySetInnerHTML={{ __html: Get(data.description) }} */}
              <div style={{fontWeight:'bold',cursor:'pointer'}} onClick={_=>window.open(Get(data.link),"_blank")}>{
                head.slice(0,head.lastIndexOf(" - "+Source))
              }</div>
          </div>
          <div style={{ paddingTop : 5 , fontWeight : 'normal'}}>
            { get.desc }
          </div>
          <div style={{ color: '#00000087', cursor: 'pointer' , marginTop : (get.desc ? 15 : 0) }} {...(sU ? { onClick: _ => window.open(sU, "_blank") } : {})}>
            <time dateTime={dTime.fullDate}>&middot;&nbsp;{(/^[0-9?]/).test((dTime.time).trim()) ? parseInt(dTime.time) + ' days ago' : dTime.time}</time>
            <span>&nbsp;&nbsp;{Source}</span>
          </div>
        </article>
      </div>
      <div className="col-3">

        {
          get.img ? (
            <>
              <img src={get.img} style={{ width: '100%' }} alt={link.slice(-12)} />
            </>
          ) : (
            <>
              <div style={{ width: '100%', height: '100%', background: '#f2f2f5' }}></div>
            </>
          )
        }
      </div>
    </>
  )
}
class GoogleFeeds extends React.PureComponent{
  constructor(props){
    super(props);
    this.state = {
      hashTag : this.props.symbol , 
      data : [],
      loading : true
    }
 }

 componentDidMount(){
   Axios(`http://${REQUEST_BASE_URL}:8000/feeds/${this.state.hashTag}`).then(({data})=>{
    this.setState({data:data.data || [] , loading : false})
   }).catch(e=>{
     console.log("e = ",e)//handle this error
   })
 }


  render(){
    return(
      <>
        <div className="container-fluid p-0 m-0 pb-4" style={{color : '#202124'}}>
          {
            !this.state.loading ?
            (this.state.data || []).map((v, i) => {
              if(v && 'object'===typeof v){
                return(
                   <div key={i+Math.random() + 6} className="row" style={{ border : '1px solid #dee2e6',borderRadius:8 , padding : 10 , margin : 3 , marginBottom : 15 }}>
                      <RenderMedia data={v} />
                   </div> 
                )
              }else return null
            })
            : 
            <LoadingDiv total={6} height={65} width='95%' />
          }
        </div>
      </>
    )
  }
}

class Feed extends React.PureComponent {
  constructor(props){
    super(props);
      this.state = {
        symbol : 'reliance'
      }
  }
    render() {
      const Heading = {
        style : {
          fontSize : 13,
          marginLeft : 15,
          fontWeight : 'bold'
        }
      }
        return (
          <>
            <div className="container" style={{ color: 'black' }}>
              <div className="row p-0">
                <div className="col-6 p-0 m-0" >
                  <div {...Heading}>Twitter Feed </div>
                  <CreateBox data={<TwitterFeeds symbol={this.state.symbol} />} />
                  
                </div>

                <div className="col-6 p-0 m-0">
                  <div {...Heading}>News </div>
                  <CreateBox data={<GoogleFeeds symbol={this.state.symbol} />} />
                </div>
              </div>
            </div>
          </>
        )
    }
}


export { Feed }
