// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  coronaNinjaApi: "https://corona.lmao.ninja/",
  //  herokuApi: "http://localhost:8080/",
  herokuApi: "https://corona-data-api.herokuapp.com/",
  firebaseConfig: {
    apiKey: "AIzaSyDNVX833WmPOl_81gEp1ySFZhAhRnqzzlY",
    authDomain: "my-corona-tracker.firebaseapp.com",
    databaseURL: "https://my-corona-tracker.firebaseio.com",
    projectId: "my-corona-tracker",
    storageBucket: "my-corona-tracker.appspot.com",
    messagingSenderId: "231643577122",
    appId: "1:231643577122:web:063ba0d8e3ee756813837b"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
