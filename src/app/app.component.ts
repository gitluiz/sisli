import { Component } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: [
        './app.component.scss',
        "./css/dashboard.css",
        "./css/style.css"
    ]
})
export class AppComponent {
    constructor(
        private electronService: ElectronService,
        private translate: TranslateService
    ) {
        this.translate.setDefaultLang('pt-br');
        console.log('AppConfig', AppConfig);

        if (electronService.isElectron) {
            console.log("loadind OK");
        } else {
            console.log('Run in browser');
        }
    }
}
