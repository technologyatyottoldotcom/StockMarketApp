
function SendResponse(code,data){
 var res = null
    switch(code){
       
        case 101 : 
         res = {
            code : 101,
            msg  : 'data not found',
            data : null 
         } 
        break;

        case 102 : 
         res = {
             code : 102,
             msg  : 'Invalid code',
             data : null
         }
        break;  

        case 103 : 
         res = {
            code : 103,
            msg  : 'Invalid data type',
            data : null
         }
         break;

         case 104 : 
         res = {
            code : 104,
            msg  : 'Code not found',
            data : null 
         }
         break;

         case 105 : 
         res = {
            code : 105,
            msg  : 'Internal server error',
            data : null 
         }
         break;

         case 106 : 
         res = {
            code : 106,
            msg  : 'Database error. Try again later',
            data : null 
         }
         break;


        case 800 : 
        res = {
           code : 800,
           msg  : 'fail',
           data : null
        }
        // do more....

        case 900 : 
        res = {
           code : 900,
           msg  : 'success',
           data : data
        }
        break;
        default : 
            res = {
                code : 1000,
                msg  : 'Something went Wrong. Try again later',
                data : null
            }
         break;
    }
 return res
}

const inArray = (arr,key)=>{
   var res = -1
   if(typeof arr==='object'){
       let l = arr.length , i = 0
       for(;i<l;++i){
           if(arr[i]===key){
               res=i
               break;
           }
       }

   }
   return res
}

exports.SendResponse = SendResponse
exports.inArray = inArray