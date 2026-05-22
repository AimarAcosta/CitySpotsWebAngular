import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LanguageService } from './services/language';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.html'
})
export class App {
  langService = inject(LanguageService);

  changeLang(event: any) {
    this.langService.setLanguage(event.target.value);
  }
}