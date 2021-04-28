let d = {
    mar_2015: '23,566',
    mar_2016: '29,745',
    mar_2017: '29,901',
    mar_2018: '36,075',
    mar_2019: '39,588',
    mar_2020: '39,354',
    sep_2020: '357,986',

  }

let d2 = {
    mar_2015: '23,566',
    mar_2016: '172,735',
    mar_2017: '225,622',
    mar_2018: '277,939',
    mar_2019: '302,806',
    mar_2020: '354,552',
    sep_2020: '357,986',
  }

  let d3 = {
    mar_2015: '23,566',
    mar_2016: '172,735',
    mar_2017: '225,622',
    mar_2018: '277,939',
  }

  const DescendingOrder = (d={})=>{
    let key = [] , dtAndKey = {}, newAsc = { }
     for(let k in d || {}){
            try{
                let dt = new Date(k.replace("_")).getTime()
                key.push(dt);
                dtAndKey[dt] = k
            }catch(e){}
        }

     let a = key.sort((a, b) => b - a);
     for(let e of a){
        let k = dtAndKey[e]
        newAsc[k] = d[k] 
    }
    return newAsc
  }

 function GetCommonFields(...arg){
    try {
        const arr = []
        for(let v of arg){
            if( v && typeof v==='object' && !Array.isArray(v)){
              arr.push(DescendingOrder(v))
            }
        }
    
        const newArr = []
        function hasProperty(key){
            let l = arr.length , res = false
            for(let i=0;i<l;++i){
                let a = arr[i]
               if( a && 'object'===typeof a && !Array.isArray(a) && key){
                  if(a.hasOwnProperty(key)){
                     res = true;
                  }else {
                      res = false
                      break;
                    }
                }
            }
            return res
        }
       
       for(let i in arr){
            let k = arr[i], nP = {  }
            if( k && 'object'===typeof k && !Array.isArray(k)){ 
                for( let ik in k){
                  if(hasProperty(ik)){
                     nP[ik] = k[ik]
                  }
                }
            }
            newArr.push(nP)
            
        }
        return newArr
    } catch (e) {
        return `error : - ${e}`
    }

 }

 function ConvertNumber(n) {
    return Number(String(n).replace(/[^.\d]/g, '').replace(/^(\d*\.?)|(\d*)\.?/g, "$1$2"))
}

//  inside data in json objects ( data = [ { } , { } , ....] )
 function GetNoOfFieldsInObjects(data=[ ] , noOfFields = 3 , func){
    const newData = [] , len = data.length
    for(let i=0;i<len;++i){
        let v = data[i]
        if( v && typeof v==='object' && !Array.isArray(v)){
            let d = { }
            for(let k in v){
                if(Object.keys(d).length!=noOfFields){
                    if('function'===typeof func){
                        d[k] = func(v[k])
                    }else d[k] = v[k]
                }
            }
            newData.push(d)
        }
    }
    
console.log("newData = ",newData)
 }

 GetNoOfFieldsInObjects(GetCommonFields(d,d2,d3) , 3 , ConvertNumber )
  
  

