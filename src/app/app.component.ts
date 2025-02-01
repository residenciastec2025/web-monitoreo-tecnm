import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from "./shared/components/menu/menu.component";
import { FooterComponent } from "./shared/components/footer/footer.component";
import { SystemService } from './shared/services/system/system.service';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    imports: [CommonModule, RouterOutlet, MenuComponent, FooterComponent]
})
export class AppComponent implements OnInit{
  
  title = 'web_server';
  darkTheme = signal(false);

  constructor(
    private systemService : SystemService
  ){}

  ngOnInit(): void {
    this.systemService.preferences$.subscribe((preferences : any) => {
      this.getPreferences();
    });

    this.getPreferences();
  }

  getPreferences(){
    this.darkTheme.set(this.systemService.getThemeState());
  }

}
