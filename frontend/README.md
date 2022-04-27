# Frontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.0.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.






## Run e2e tests

Run:

`npx cypress run --browser chrome --spec **/app/*.spec.ts`

## Run e2e screenshot tests

Add these environment variables:
- SNAPSHOT_BASE_DIRECTORY = ./cypress/snapshots/base
- SNAPSHOT_DIFF_DIRECTORY = ./cypress/snapshots/diff

To take base screenshots to which the comparison will be done run:

`npx cypress run --browser chrome --env type=base --spec **/snapshots/*.spec.ts`

To compare screenshots against the saved ones:

`npx cypress run --browser chrome --env type=actual --spec **/snapshots/*.spec.ts`


