console.log("starting up!!");

const express = require('express');
const methodOverride = require('method-override');
const pg = require('pg');

// Initialise postgres client
const configs = {
  user: 'pablo101',
  host: '127.0.0.1',
  database: 'tunr_db',
  port: 5432,
};

const pool = new pg.Pool(configs);

pool.on('error', function (err) {
  console.log('idle client error', err.message, err.stack);
});

/**
 * ===================================
 * Configurations and set up
 * ===================================
 */

// Init express app
const app = express();

app.use(express.static('public'))

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(methodOverride('_method'));


// Set react-views to be the default view engine
const reactEngine = require('express-react-views').createEngine();
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', reactEngine);

/**
 * ===================================
 * Routes
 * ===================================
 */
//BUILT INDEX FEATURE (shows and displays)
app.get('/', (req, res) => {
  // query database for all pokemon

  // respond with HTML page displaying all pokemon
  // res.render('home');

  let sqlText  = 'SELECT * FROM artists';

//shortcut for pool.getConnection() + connection.query() + connection.release() ~ will be release automatically
  pool.query(sqlText, (error, queryResults) => {
    if (error) {
        console.log('error!', error);
        res.status(500).send('DIDNT WORK!!');
    }
    res.render('home', {artists: queryResults.rows})
  })
});

//built SHOW FEATURE
 app.get('/artists/:id', (req, res) => {

    let resId = req.parameters.id;

    let sqlText = 'SELECT * FROM artists WHERE id =' + resId;


pool.query(sqlText, (error, queryResults) => {
    if (error) {
        console.log('error!', error);
        res.status(500).send('DIDNT WORK!!');
    }
    res.render('artist', {artists: queryResults.rows})
  })
});

//Built CREATE FEATURE
app.get('/new', (req, res) => {
  // respond with HTML page with form to create new pokemon
  req.render('new');
});


app.post('/artists', (req, res) => {
    let sqlText = 'INSERT INTO artists (name, photo_url, nationality) VALUES ($1, $2, $3)'
    let values = [req.body.name, req.body.photo_url, req.body.nationality]

pool.query(sqlText, values, (error, queryResults) => {
    if (error) {
        console.log('error!', error);
        res.status(500).send('DIDNT WORK!!');
    } else {
    res.redirect('/');
    }
  });
});


//Built EDIT FEATURE

 app.get('/artists/:id/edit', (req, res) => {

    let resId = req.parameters.id;

    let sqlText = 'SELECT * FROM artists WHERE id =' + resId;

pool.query(sqlText, (error, queryResults) => {
    if (error) {
        console.log('error!', error);
        res.status(500).send('DIDNT WORK!!');
    } else {
    res.render('edit', {artists: queryResults.rows})
    }
  });
});

 app.put('/artists/:id', (req, res) => {

    let resId = req.parameters.id;
    let name = req.body.name;
    let nationality = req.body.nationality;
    let imgUrl =req.body.photo_url;

    let sqlText = `UPDATE artists SET name = '${name}', photo_url = '${imgUrl}', nationality = '${nationality}' WHERE id = ${resId}`;

pool.query(sqlText, (error, queryResults) => {
    if (error) {
        console.log('error!', error);
        res.status(500).send('DIDNT WORK!!');
    } else {
    res.render(`/artists/${resId})`);
    }
  });
});

 app.delete('/artists/:id', (req, res) => {

    let resId = req.parameters.id;

    let sqlText = 'DELETE * FROM artists WHERE id = ${resId}'

pool.query(sqlText, (error, queryResults) => {
    if (error) {
        console.log('error!', error);
        res.status(500).send('DIDNT WORK!!');
    } else {
        res.redirect('/');
    }
  });
});





/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
app.listen(3000, () => console.log('~~~ Tuning in to the waves of port 3000 ~~~'));

// server.on('close', () => {
//   console.log('Closed express server');

  // db.pool.end(() => {
  //   console.log('Shut down db connection pool');
  // });
// });
