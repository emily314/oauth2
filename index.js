const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5100
const boxSDK = require('box-node-sdk');
const uuid = require('uuid')

//const appConfig = require('config.js'); 

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  //.get('/', (req, res) => res.render('pages/index'))
  //.get('/', (req, res) => res.send('hello world'))
  .get('/', (req, res) =>{

    const appConfig = require('./config.js');
        // Auth keys and redirect
    //const boxSDK = appConfig.boxSDK;              // Box SDK
    const querystring = require('querystring');   // Querystring stringifier
    // Build Box auth object
     const payload = {
      'response_type': 'code',
      'client_id': appConfig.oauthClientId,
      'redirect_uri': appConfig.redirectURI
      };

     // Build redirect URI and redirect
     const qs = querystring.stringify(payload);
     const authEndpoint = `https://account.box.com/api/oauth2/authorize?${qs}`;
    res.redirect(authEndpoint);
   // res.send('hello world')
  })
  .get('/return', (req, res) =>{
    const appConfig = require('./config.js');

    const fs = require('fs');
    // Create a new Box SDK instance
  const sdk = new boxSDK({
    clientID: appConfig.oauthClientId,
    clientSecret: appConfig.oauthClientSecret
  });

  // Extract auth code
  const code = req.query.code;

  // Exchange code for access token
  sdk.getTokensAuthorizationCodeGrant(code, null, function(err, tokenInfo) {
    const client = sdk.getPersistentClient(tokenInfo);
    // PERFORM API ACTIONS WITH CLIENT

    // Set folder values
    const folderName = 'FOLDER NAME 1'+ uuid.v4() ;
    //const folderId = uuid.v4();

     // Create folder
     client.folders.create('0', folderName, (err, folderres) => {
       folderId = folderres.id;
      console.log(`folder ${folderres.id} is created successful`);
      // Set upload values
      const fileName = 'test.txt';

      // Create file upload stream
      const stream = fs.createReadStream(fileName);

       // Upload file
       client.files.uploadFile(
           folderId, 
          fileName, 
           stream, 
           callback);

function callback(err, response) {
  // HANDLE ERROR CASE AND RESPONSE
  console.log(`upload file`);
  res.send('upload file successful');
}
 });
  })
})
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
