export function handleAxiosErrors(err, handler){
  let errMessage;
  if(err.response){
    if(err.response.data && err.response.data.message){
      errMessage = err.response.data.message;
    }
    else{
      errMessage = err.response;
    }

  }
  else if(err.request){
    errMessage = err.request;
  }
  else{
    errMessage =err;
  }
  handler(errMessage);
}
