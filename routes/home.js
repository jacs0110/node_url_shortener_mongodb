const express = require('express')
const router = express.Router()
const Link = require('../models/link.js')

router.get('/', (req, res) => {
  return res.render('index')
})

// create a new shor url (action)
router.post('/', async (req, res) => {

  // check if the link exist in database aleady
  let record = await Link.findOne({ longUrl: req.body.url })

  console.log(`Record: ${record}`)

  if (record) {

    // Return the link if the link exists
    console.log(`there is a record: ${record}`)
    let success_msg = 'Get a previous short url successfully!'
    return res.render('index', { link: record, success_msg: success_msg })

  } else {

    // create new short url for new link
    console.log('creating a new url')
    let isUnique = false
    let code

    // generate unique short url for new link
    while (!isUnique) {
      code = Math.random().toString(36).slice(-5)
      let result = Link.findOne({
        shortUrl: `https://jacs-url-shortener-mongodb.herokuapp.com/${code}`

      })

      if (result.length > 0) {
        isUnique = false
      } else {
        isUnique = true
      }
    }

    console.log(code)
    if (code) {
      Link.create({
        longUrl: req.body.url,
        shortUrl: `https://jacs-url-shortener-mongodb.herokuapp.com/${code}`
      }).then((link) => {
        let success_msg = 'Create a new short url successfully!'
        res.render('index', { link: link, originalUrl: req.body.url, success_msg: success_msg })
      })
    }
  }
})

// redirect short url
router.get('/:id', (req, res) => {
  Link.findOne({
    shortUrl: `https://jacs-url-shortener-mongodb.herokuapp.com/${req.params.id}`
  }).then((link) => {
    return res.redirect(`${link.longUrl}`)
  }).catch((e) => {
    let warning_msg = `The short link "https://jacs-url-shortener-mongodb.herokuapp.com/${req.params.id}" is invalid!`
    return res.render('index', { warning_msg: warning_msg })
  })
})

module.exports = router