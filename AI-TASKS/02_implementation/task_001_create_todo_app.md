Implement the TODO-APP according to the requirements specified in @/requirements/todo-app-reqs-improved.md

Plan the implementation of the TODO-APP in the following steps:
- Step 1: Implement the TODO-APP as a next.js (https://nextjs.org/) using the react framework (https://react.dev/).
- Step 2: ensure that the TODO-APP is responsive and works on all devices. Run the app by using node.js and the command 'npm run dev'.
- Step 3: test the TODO-APP by using the playwright framework (https://playwright.dev/)

Check the previous steps throughtout the implementation process.

Architecture:
- The UI is implemented in react and the code shall be written in Typescript.
- The backend is implemented in node.js and the code shall be written in Typescript.
- The database is implemented in Cloudant DB of IBM cloud and the code shall be written in Typescript. The todo-tasks shall be stored in the cloudant-DB.For details of the Cloudant DB see the documentation at https://github.com/IBM/cloudant-node-sdk.
- The connection details for Cloudant DB are store in the environment variables of the application (see @.env.local file).

- The backend is exposed as a REST API and the code shall be written in Typescript.
  
  
