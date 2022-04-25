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
    if(err.request.responseText){
      errMessage = err.request.responseText;
    }
    else{
      errMessage = "server is unavailable";
    }

  }
  else{
    errMessage =err;
  }
  handler(errMessage);
}
