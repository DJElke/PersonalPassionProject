const { tossr } = require('tossr')
const express = require('express')
const app = express()

const TEMPLATE = 'dist/__app.html'
const SCRIPT = 'dist/build/bundle.js'
const PORT = 443

// serve some custom endpoints
app.get('/hello', async (req, res) => {
  res.send('hello')
})

// else serve assets, if they exist
app.use(express.static('dist'))

// else serve Routify
app.get('*', async (req, res) => {
  const html = await tossr(TEMPLATE, SCRIPT, req.url)
  res.send(html)
})

// start server
app.listen(PORT)
console.log('serving on port', PORT)