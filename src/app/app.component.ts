import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'laravel-angular-app-gui';

  constructor(translate: TranslateService) {
    translate.setDefaultLang('en');
    const browserLang = translate.getBrowserLang();
    const availableLangs = ['en'];
    translate.addLangs(availableLangs);
    translate.use(
      availableLangs.includes(browserLang)
        ? browserLang
        : 'en'
    );
  }
}
