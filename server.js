const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Funzione per autenticare l'utente
function autentica(username, password) {
  const utenti = JSON.parse(fs.readFileSync('utenti.json', 'utf-8'));

  if (utenti[username] && utenti[username].password === password) {
    return utenti[username].info;
  } else {
    return null;
  }
}

// Pagina di login
app.get('/', (req, res) => {
  res.render('login');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

// Gestione del login
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const infoUtente = autentica(username, password);

  if (infoUtente) {
    res.render('App_UtenteConcesso', { username, infoUtente });
  } else {
    res.redirect('/accessoNegato');
  }
});

// Gestione della registrazione
app.post('/signup', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    // Leggi il file utenti.json
    const utenti = JSON.parse(fs.readFileSync('utenti.json', 'utf-8'));

    // Verifica se l'utente esiste già
    
    // Aggiungi il nuovo utente
    utenti[username] = { password: password, info: 'Nuovo utente' };
    
    // Scrivi l'oggetto aggiornato nel file utenti.json
    fs.writeFileSync('utenti.json', JSON.stringify(utenti, null, 2));
    
    // Reindirizza all'area riservata dopo la registrazione
    if (utenti[username]) {
      res.redirect('/'); // O gestisci il caso in cui l'utente esista già
      return;
    }
    res.redirect('/');
  } catch (error) {
    console.error('Errore durante la registrazione:', error);
    res.status(500).send('Errore durante la registrazione');
  }
});



// Pagina di accesso negato
app.get('/accessoNegato', (req, res) => {
  res.render('accessoNegato');
});

// Gestione della cancellazione dell'utente
app.post('/cancellaUtente', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  // Implementa la logica per verificare la password e cancellare l'utente dal file utenti.json
  // Reindirizza all'area riservata dopo la cancellazione
  res.redirect('/');
});

// Gestione della modifica dell'utente
app.post('/modificaUtente', (req, res) => {
  const oldUsername = req.body.oldUsername;
  const password = req.body.password;
  const newUsername = req.body.newUsername;
  const newPassword = req.body.newPassword;
  // Implementa la logica per verificare la password e modificare l'utente nel file utenti.json
  // Reindirizza all'area riservata dopo la modifica
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server in esecuzione su http://localhost:${PORT}`);
});
