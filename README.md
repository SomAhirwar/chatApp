#### Server hosted on

[](https://chat-app-jsyd.onrender.com/)

### Server

1. Clone the project
2. In server directory create .env file and complete the file with the help of .env.template file
3. Run below command in terminal to install dependencies

```shell
npm install
```

4. Run below command in terminal to start server

```shell
npm start
```

### Client

1. Navigate to client directory
2. Run below command in terminal to install dependencies

```shell
npm install
```

3. Run below command in terminal to start client

```shell
npm run dev
```

## For using this service, paste below code in your HTML file just before </body> tag

```html
<div id="chat"></div>
<script type="text/javascript">
  ;(function () {
    var s1 = document.createElement('script'),
      s0 = document.getElementsByTagName('script')[0]
    s1.async = true
    s1.src = 'https://cdn.jsdelivr.net/gh/SomAhirwar/chatApp/client/dist/assets/index.js'

    s1.setAttribute('crossorigin', '*')
    s0.parentNode.insertBefore(s1, s0)
  })()
</script>
```
