import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SystemService {
  private preferences = new BehaviorSubject(this.loadPreferences());
  preferences$ = this.preferences.asObservable();

  getThemeState(){
    return this.preferences.value.darkTheme;
  }

  toggleTheme(){
    const newPreferences = { ...this.preferences.value, darkTheme : !this.preferences.value.darkTheme };
    this.updatePreferences(newPreferences);
  }

  public updatePreferences(newPreferences : any){
    this.preferences.next(newPreferences);
    localStorage.setItem('preferences', JSON.stringify(newPreferences));
  }

  public loadPreferences(){
    const preferencesStorage = localStorage.getItem('preferences');

    if(preferencesStorage){
      const savedPreferences = JSON.parse(preferencesStorage);

      return { darkTheme : savedPreferences.darkTheme || false }
    }else{
      return { darkTheme : false }
    }
  }
}