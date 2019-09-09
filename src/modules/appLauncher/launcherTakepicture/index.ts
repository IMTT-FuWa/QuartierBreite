import { Injectable } from '@angular/core';
import { ExternalModuleBase } from '../../module-base';
import { AppLauncherService } from '../../../providers/app-launcher/index'
import { Camera, CameraOptions } from '@ionic-native/camera';
import { LoginRedirectService } from '../../../providers/authentication/login-redirect-service';
import { ConnectivityService } from '../../../providers/connectivity/index';

declare var _paq: any;

@Injectable()
export class LauncherTakepicture extends ExternalModuleBase {
    // https://github.com/apache/cordova-plugin-camera#module_camera.CameraOptions
    options: CameraOptions = {
        quality: 100,
        saveToPhotoAlbum: true,
        encodingType: this.camera.EncodingType.JPEG
    };

    constructor(public launcher: AppLauncherService, public loginRedirectService: LoginRedirectService, connectivityService: ConnectivityService, public camera: Camera) {
        super(loginRedirectService, connectivityService);
    }

    runExternal() {
        // this.launcher.launchApp(this.schemes)
        this.camera.getPicture(this.options).then((_imageData) => {
            // imageData is either a base64 encoded string or a file URI
        }, (_err) => {
            console.log('STARTED FAIL');
        });
        _paq.push(['trackEvent', 'Menu-Navigation', 'Kamera gestartet']);
    }

}
