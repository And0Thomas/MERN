const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use((req, res, next) =>
{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );

  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});



const MongoClient = require('mongodb').MongoClient;

require('dotenv').config();
const url = process.env.MONGODB_URI;
const client = new MongoClient(url);
console.log('Test1');

async function connectToDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    // Perform operations on the database using 'client'
  } catch (err) {
    console.error('Error connecting to MongoDB Atlas:', err);
  }
}

connectToDB();

const path = require('path');
const PORT = process.env.PORT || 5000;

console.log("port is " + PORT)


app.set('port', (process.env.PORT || 5000));


if (process.env.NODE_ENV === 'production')
{
// Set static folder
app.use(express.static('frontend/build'));
app.get('*', (req, res) =>
{
  res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
});
}

app.listen(PORT, () =>
{
  console.log('Server listening on port ' + PORT);
});

 // start Node + Express server on port 5000
// Your cardList data

const cardList = [
'Roy Campanella',
'Paul Molitor',
'Tony Gwynn',
'Dennis Eckersley',
'Reggie Jackson',
'Gaylord Perry',
'Buck Leonard',
'Rollie Fingers',
'Charlie Gehringer',
'Wade Boggs',
'Carl Hubbell',
'Dave Winfield',
'Jackie Robinson',
'Ken Griffey, Jr.',
'Al Simmons',
'Chuck Klein',
'Mel Ott',
'Mark McGwire',
'Nolan Ryan',
'Ralph Kiner',
'Yogi Berra',
'Goose Goslin',
'Greg Maddux',
'Frankie Frisch',
'Ernie Banks',
'Ozzie Smith',
'Hank Greenberg',
'Kirby Puckett',
'Bob Feller',
'Dizzy Dean',
'Joe Jackson',
'Sam Crawford',
'Barry Bonds',
'Duke Snider',
'George Sisler',
'Ed Walsh',
'Tom Seaver',
'Willie Stargell',
'Bob Gibson',
'Brooks Robinson',
'Steve Carlton',
'Joe Medwick',
'Nap Lajoie',
'Cal Ripken, Jr.',
'Mike Schmidt',
'Eddie Murray',
'Tris Speaker',
'Al Kaline',
'Sandy Koufax',
'Willie Keeler',
'Pete Rose',
'Robin Roberts',
'Eddie Collins',
'Lefty Gomez',
'Lefty Grove',
'Carl Yastrzemski',
'Frank Robinson',
'Juan Marichal',
'Warren Spahn',
'Pie Traynor',
'Roberto Clemente',
'Harmon Killebrew',
'Satchel Paige',
'Eddie Plank',
'Josh Gibson',
'Oscar Charleston',
'Mickey Mantle',
'Cool Papa Bell',
'Johnny Bench',
'Mickey Cochrane',
'Jimmie Foxx',
'Jim Palmer',
'Cy Young',
'Eddie Mathews',
'Honus Wagner',
'Paul Waner',
'Grover Alexander',
'Rod Carew',
'Joe DiMaggio',
'Joe Morgan',
'Stan Musial',
'Bill Terry',
'Rogers Hornsby',
'Lou Brock',
'Ted Williams',
'Bill Dickey',
'Christy Mathewson',
'Willie McCovey',
'Lou Gehrig',
'George Brett',
'Hank Aaron',
'Harry Heilmann',
'Walter Johnson',
'Roger Clemens',
'Ty Cobb',
'Whitey Ford',
'Willie Mays',
'Rickey Henderson',
'Babe Ruth'
];

// Endpoint to add a card
app.post('/api/addcard', async (req, res, next) =>
{
  // incoming: userId, color
  // outgoing: error
  const { userId, card } = req.body;
  const newCard = {Card:card,UserId:userId};
  var error = '';
  try
  {
    const db = client.db("cluster0tek");
    const result = db.collection('Cards').insertOne(newCard);
  }
  catch(e)
  {
    error = e.toString();
  }

  cardList.push( card );
  var ret = { error: error };
  res.status(200).json(ret);
});

// Endpoint for user login
app.post('/api/login', async (req, res, next) =>
{
  // incoming: login, password
  // outgoing: id, firstName, lastName, error
  var error = '';
  const { login, password } = req.body;
  const db = client.db("cluster0tek");
  const results = await
  db.collection('Users').find({Login:login,Password:password}).toArray();
  var id = -1;
  var fn = '';
  var ln = '';
  
  if( results.length > 0 )
  {
    id = results[0].UserID;
    fn = results[0].FirstName;
    ln = results[0].LastName;
  }

  var ret = { id:id, firstName:fn, lastName:ln, error:''};
  res.status(200).json(ret);
});

// Endpoint for searching cards
app.post('/api/searchcards', async (req, res, next) =>
{
  // incoming: userId, search
  // outgoing: results[], error
  var error = '';
  const { userId, search } = req.body;
  var _search = search.trim();
  const db = client.db();
  const results = await db.collection('Cards').find({"Card":{$regex:_search+'.*', $options:'r'}}).toArray();
  var _ret = [];
  for( var i=0; i<results.length; i++ )
  {
  _ret.push( results[i].Card );
  }
  var ret = {results:_ret, error:error};
  res.status(200).json(ret);
});