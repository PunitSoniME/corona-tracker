import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { HelperService } from './helper.service';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {

    constructor(
        private helperService: HelperService
    ) {

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        request.headers.set('Content-Type', 'application/json');
        request.headers.set('Access-Control-Allow-Origin', '*');
        request.headers.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        request.headers.set('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,PUT,OPTIONS');

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    // console.log('event--->>>', event);
                }
                return event;
            }), catchError((error: HttpErrorResponse) => {
                const errorResponse = {
                    errorMessage: error.error.message,
                    statusCode: error.status
                };

                this.helperService.showToaster({ message: error.error.message });
                return throwError(errorResponse);
            }));
    }
}

