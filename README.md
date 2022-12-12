## gitIgnore file instructions

Any files with the prefix ".env" are not pushed to GitHib, and so must be added manually by the developer with each push. Create two files: one for development, and one for testing, following the format in the ``.env-example`` file. The names of the database can be inferred by referring to ``/db/setup.sql``. Ensure that these files remain .gitignored before pushing your changes. 

## Husky

To ensure we are not commiting broken code this project makes use of git hooks. Git hooks are scripts triggered during certain events in the git lifecycle. Husky is a popular package which allows us to set up and maintain these scripts. This project makes use a _pre-commit hook_. When we attempt to commit our work, the script defined in the `pre-commit` file will run. If any of our tests fail than the commit will be aborted.

The [Husky documentation](https://typicode.github.io/husky/#/) explains how to configure Husky for your own project as well as creating your own custom hooks.\_
