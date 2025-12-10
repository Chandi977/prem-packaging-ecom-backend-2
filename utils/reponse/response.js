exports.commonResponse=(message,success,data)=>{
       return {
         message:message ?? null,
         data:data ?? null,
         success
       }
}


exports.returnjson=(data)=>{
    const strings=JSON.stringify(data);
    return JSON.parse(strings)
}