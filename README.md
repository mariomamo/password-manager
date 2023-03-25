
# :key: password-manager :book:
Password manager is a free and open source project for manage passwords.

## :white_check_mark: To do list
Following there is a to do list of functionalities that will be added in future
* **import/export**: The user can export a json with all the passwords (encrypted of course) and can import them on another pc. The passwords imported will be merged with those already existing;
* **secret keys generator**: If the application not found the encryption/decryption key (or keys) a wizard show up for generating them;
* **password generator**: Generate random passwords;
* **read conf from file**: Create a config file or windows for settings;
* **firebase**: Given an API key for a firebase account the application will be able to save pasword and read (always in crypted form) from it.
  

# :gear: Install project

:one: First of all you have to install neutralino js.

Go to the project root folder and run

  

```bash

npm install -g @neutralinojs/neu

```

  

:two: Install dependencies

go to `/app` folder and run

  

```bash

npm install

```

  

:three: Build application

Run this command in `/app` folder

```bash

npm run build

```

:four: Create public and private keys
This project is using public and private keys pair for encrypt and decrypt the passwords, so you have to generate and put them inside `keys` folder.
:warning: **I strongly  advise you from generate this keys pair from a website. No one besides you must know the keys** :warning:
When you add a key this will be added inside `secrets` folder and you can save it everywhere you want for backup purpose.  :warning: **don't lose the private key or you will not be able to read the passwords anymore** :warning:
  

# :rocket: Run application locally for testing changes

:one: Run npm

Move to `/app` and run this command

```bash

npm start

```

  

:two: Run Neutralino

Go back to the project root folder and run this command

```bash

neu run --frontend-lib-dev

```

  

Now you will see all the changes directly in Neutralino application

# :hammer: Build executable release
:one:
Open `/app/public/index.html` and check that there is this script. Be sure that `%PUBLIC_URL%` is present, if you can see something like `http://localhost:xxxxx` change it to `%PUBLIC_URL%`.
```bash
<script  src="%PUBLIC_URL%/neutralino.js"></script>
```

:two: Build react release
Go to `/app` folder and run
```bash
npm run build
```

:three: Build Neutralino app
Go back to project root folder and run

```bash
neu build
```
