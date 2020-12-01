import { ToastController, LoadingController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { ToastOptions } from '@ionic/core';


@Injectable()
export class HelperService {

    loader: any;

    constructor(
        private toastController: ToastController,
        private loadingController: LoadingController,
    ) { }

    async showToaster(toasterConfiguration: ToastOptions = {}) {
        const toast = await this.toastController.create({
            message: toasterConfiguration.message,
            duration: toasterConfiguration.duration ? toasterConfiguration.duration : 2000,
            color: toasterConfiguration.color ? toasterConfiguration.color : null,
            cssClass: 'text-toaster',
            position: toasterConfiguration.position ? toasterConfiguration.position : 'bottom'
        });
        toast.present();
    }

    async startLoading(message: string = 'Please Wait...') {
        this.loader = await this.loadingController.create({
            message,
            //  duration: 2000
        });
        await this.loader.present();
    }

    async stopLoading() {
        return await this.loadingController.dismiss();
    }
}
