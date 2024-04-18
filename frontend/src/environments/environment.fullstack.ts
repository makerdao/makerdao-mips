// When runing the backend on the same machine, run
//ng serve -c fullstack or npm run start:dev
//in orden instruct this file to replace enviroment.ts

export const environment = {
  production: false,
  // apiUrl: 'http://backend:3000',
  apiUrl: "https://mips-api-staging.makerdao.com",
  repoUrl: 'https://github.com/makerdao/mips/blob/master',
  feedBackFormUrl: 'https://formspree.io/f/xyybvgej',
  githubURL: 'https://github.com/',
  menuURL:'https://raw.githubusercontent.com/DSpotDevelopers/mips/master/meta/menu.yaml',
  menuURLAuxiliar:'https://raw.githubusercontent.com/DSpotDevelopers/mips/master/meta/menu.json',
  varsURL: 'https://raw.githubusercontent.com/DSpotDevelopers/mips/master/meta/vars.yaml',
  newsURL: 'https://raw.githubusercontent.com/DSpotDevelopers/mips/master/meta/news.yaml'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
