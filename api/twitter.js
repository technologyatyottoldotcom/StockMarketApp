const Twitter = require('express').Router()
const util = require('util')
const twit = require("twit")


const TwitterConfig = new twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
    strictSSL: true, // optional - requires SSL certificates to be valid.
});

const validateHashTagsAndUsers = (text) => {
    text = String(text)
    var res = ''
    let s = text.split(' ');
    for (let e of s) {
        let f = e[0], r = e
        if (f == '#' || f == '@') { if ((r.match(/\W|_/g)).length >= 2) r = ''; }
        res = res + (r && ' ') + r
    }
    return res
}

const TwitterGetUser = ({ user }) => {
    try {

        let { name, id, id_str, protected, screen_name, description, location, url, followers_count, friends_count, verified, profile_image_url_https, profile_banner_url, created_at, entities } = user || {}
    
        let res = {
            name: name,
            id_str: id_str,
            id: id,
            screen_name: screen_name,
            description: validateHashTagsAndUsers(description),
            descriptionUrls: user.entities.description.urls, ////inside description url list (array [])
            location: location,
            url: url,
            entities: entities,
            followers_count: followers_count,
            friends_count: friends_count,
            created_at: created_at,
            verified: verified,
            protected: protected,
            profile_image_url_https: profile_image_url_https,
            profile_banner_url: profile_banner_url,
        }
        return res
    } catch (e) {
        }
}

// NOTE: - new will get on bottom and old will get on top
const createTwitterData = (data = []) => {
    var response = null
    if (data && typeof data == 'object') {
        response = []
        data.forEach((v, i) => {
            if (v && typeof v === 'object' && !Array.isArray(v)) {
                try {
                    let { retweeted_status } = v || {}
                    function cr(v) {
                        try {
                            let { created_at, id, id_str, text, entities, retweet_count, favorite_count, favorited, retweeted } = v || {}
                            return {
                                id: id,
                                id_str: id_str,
                                text: validateHashTagsAndUsers(text),
                                created_at: created_at,
                                entities: entities,
                                retweet_count: retweet_count,
                                favorite_count: favorite_count,
                                favorited: favorited,
                                retweeted: retweeted,
                                user: TwitterGetUser(v)
                            }
                        } catch (e) { }
                    }
                    response.push(cr(v))
                    if (retweeted_status && typeof retweeted_status == 'object') {
                        if (Array.isArray(retweeted_status)) {
                            retweeted_status.forEach((v, i) => {
                                let r = cr(v) || {}
                                r['tweet_type'] = 'retweeted'
                                response.push(r)
                            })
                        } else {
                            let r = cr(retweeted_status)
                            r['tweet_type'] = 'retweeted'
                            response.push(r)
                        }
                    }

                } catch (e) { }
            }
        })
    }
    return response.reverse()
}

function TwitterHashTags(symbol,ResultType,length=1) {
return new Promise((resolve,reject)=>{
    const GET = (type='mixed')=>{
        const TYPES = ['popular','recent'];
        const request = type =>new Promise((res,rej)=>{
          TwitterConfig.get('/api/search/tweets', {
            q: '#'+symbol,
            count: length,
            result_type:type// "latest" 
          }).then(d=>res(d.data)).catch(rej)
        })
    
        return new Promise((res,rej)=>{
          var reload = null , data = null
    
          const re = d=>{
            if(typeof d=='object' && !Array.isArray(d)){
              let s =  d.statuses;
              if(!s || !Array.isArray(s)){
                reload = true
              }else{
                if(s.length < length){
                  data = data && Array.isArray(data) ? [data,...s] : s
                  reload = true
                }else{
                  data = s;
                  reload = null
                  res(data)
                }
              }
            }else rej(d)
          }
    
          request(type).then(d=>{
            re(d);
            if(reload){
              let nType = null
              for(let e of TYPES){if(e!=type){nType = e;break;}}
              request(nType).then(d=>{re(d)}).catch(rej)
            }
           }).catch(rej)
         })
      }
      GET(ResultType||'recent').then(d=>{
        d = createTwitterData(d);
        resolve(d)
      })
})  
   
}

// get twitter hash tags
Twitter.get("/api/twitter/:hastag/?:ResultType/?:length", (req, res) => {
  let p = req.params  
  let hastag = p.hastag
    if(hastag){
        TwitterHashTags(hastag,(p.ResultType),(Number(p.length)||1)).then(d=>{
         res.send(d.reverse())
        }).catch(e=>res.sendStatus(502))
    }else res.send("symbol not found")
})


function TwitterUserFetch(userScreenName='') {
    return new Promise((resolve,rej)=>{
          if(userScreenName){
            TwitterConfig.get('/api/users/show', {
              screen_name: "@"+userScreenName,
          }).then(d=>resolve(d.data)).catch(rej)
        }else rej('userScreenName not found')
    })
  }
  
// get twitter user data
Twitter.get("/api/twitterUser/:screenName", (req, res) => {
    let screenName = String(req.params.screenName)
    if(screenName){
        TwitterUserFetch(screenName).then(d=>{
          function filter(d) {
            var res = null
            if( d && typeof d==='object' ){
              try{
                for(let k of d){
                    if( k && typeof k=='object'){
                            if(k.screen_name===screenName){
                                res = k ;
                                break;
                              }
                            }
                          }
                   }catch(e){}
                }
          
                if(!res){
                  if(!Array.isArray(d)){
                    if(d.screen_name===screenName){
                      res = d
                    }
                  }
                }
                return res
           }
         d = TwitterGetUser({user:filter(d)})//filter data according to you
         res.send(d) 
        }).catch(e=>res.send(e))
    }else res.send("screenName not found")
})

exports.Twitter = Twitter