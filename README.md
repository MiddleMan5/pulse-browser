# Pulse Browser

![Home Page](docs/home.png)

An app I wrote to flex my frontend development skills and solve a problem I have:

```text
How do I organize the millions of photos I have spread across a thousand different storage mediums?
```

The initial concept for this app came when I most recently upgraded my computer. I now have a number of old machines with a hodgepodge of images, videos, documents, etc. I wanted to design a way for me to organize, tag, compare, and link these images with external services like Google Photos, Dropbox, etc.

## Features

-   Persistent State
-   Embedded Database
-   Theming

### Tech Demos

Examples of the following features exist in the app, but are planned to undergo major redevelopment.

-   Language Support
-   Multi-process IPC
-   Compiled Plugins

Built with Electron, React, Redux, PouchDB, and a million other minor tools

## UI Examples

![Theme Support](docs/themes.png)

---

![Preview](docs/preview.png)

---

![Color Selection](docs/color.png)

## Development

I haven't added full cross-platform development support, so assuming you're running a linux machine and have vscode set up, or want to troubleshoot npm scripts, all you have to do to start working is run the following:

```shell
git clone https://github.com/MiddleMan5/pulse-browser.git

cd pulse-browser

npm install
```

### To run from vscode:

Open the project and press the `F5` key

### To run from shell:

```shell
npm run start
```

Hot reloading is enabled, so you can keep the app running as you develop.
