import history from '../../history.js';

let lang = window.location.pathname;
lang = lang.split("/");

let redirectOnLogin = (agency) => {
  if(agency.status === "A" && agency.organizationEntity.status === "A"){
    history.push(`/protected/${lang[2]}`);
  }else if(agency.status === "P"  && agency.organizationEntity.status === "A"){
    history.push(`/pending/user/${lang[2]}`);
  }else if(agency.status === "P"  && agency.organizationEntity.status === "P"){
    history.push(`/pending/agency/${lang[2]}`);
  }else if(agency.status === "D"  && agency.organizationEntity.status === "A"){
    history.push(`/denied/user/${lang[2]}`);
    //history.push(`/register/${lang[2]}`);
  }else if(agency.status === "D"  && agency.organizationEntity.status === "D"){
    history.push(`/denied/agency/${lang[2]}`);
    //history.push(`/registerAgency/${lang[2]}`);
  }else if(agency.status === "ERROR"){
    history.push(`/error/${lang[2]}`);
  }else{
    history.push(`/auth/${lang[2]}`);
  }
}

export default {
  redirectOnLogin
}
