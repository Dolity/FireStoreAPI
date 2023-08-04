const express = require("express");
const app = express();


const port = 5200;

const dbFirestore = require('./API/getAgency');

const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

//CRUD_FireStore
app.get('/agency', dbFirestore.GetAgenciesAll);
app.delete('/deleteDoc/:email', dbFirestore.DeleteDocument);
app.delete('/deleteUser/:email', dbFirestore.DeleteUser);
app.delete('/deleteAll/:email', dbFirestore.DeleteAll);
app.delete('/disableUser/:email', dbFirestore.DisableUser);


app.get('/', (req, res) => {
  res.send('This is my API running...')
});

app.get('/about', (req, res) => {
  res.send('This is my about route')
});

app.listen(port, () => {  //server starts listening for any attempts from a client to connect at port: {port}
  console.log(`Now listening on port ${port}`);
});

module.exports = app;
