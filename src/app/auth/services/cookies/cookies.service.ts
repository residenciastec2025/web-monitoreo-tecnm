import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookiesService {

  constructor(){}
  
  public getCookie(name : string) : string | null{
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if(parts.length === 2){
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  }

  public removeCookie(name : string) : string | null{
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
    return null;
  }

}