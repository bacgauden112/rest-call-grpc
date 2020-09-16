const express = require('express')
const router = express.Router()
const Message = require('./message')
const http = require("http");
var microtime = require('microtime')
const request = require('request');

const makeString =  function (length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// Getting all
router.get('/', async (req, res) => {
  try {
    let n = parseInt(req.query.num);
    let retObj = {
      "data": [
        { id: '1', title: 'Note 1', content: `${makeString(n)}`}
      ]
    }
    res.json(retObj)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})



router.get('/call-rest', async (req, response) => {
  let n = req.query.num
  const s1_start = microtime.now()
  request(`${process.env.REST_API}/messages?num=${n}`, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    const s1_end = microtime.now()
    let retObj = {
      "start" : s1_start,
      "end": s1_end,
      "duration": s1_end - s1_start,
      "data": body
    }
    response.send(retObj);
  });
   
})


router.get('/call-grpc', async (req, res) => {
  let n = req.query.num
  const s1_start = microtime.now()
  try {
    const client = require('./client')
    client.list({}, (error, notes) => {
      const s1_end = microtime.now()
      const duration = s1_end - s1_start
      if (!error) {
        
        let retObj = {
          "start" : s1_start,
          "end": s1_end,
          "duration": s1_end - s1_start,
          "data": notes
        }
          // console.log('successfully fetch List notes')
          // console.log(notes)
          // notes.map(n=>n.stats = duration.toString())
          res.json(retObj)
      } else {
          console.error(error)
      }
    })
   
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// // Getting One
// router.get('/:id', getSubscriber, (req, res) => {
//   res.json(res.subscriber)
// })

// Creating one
// router.post('/', async (req, res) => {
//   const message = new Message({
//     message: req.body.message
//   })
//   try {
//     const newMessage = await message.save()
//     res.status(201).json(newMessage)
//   } catch (err) {
//     res.status(400).json({ message: err.message })
//   }
// })

// // Updating One
// router.patch('/:id', getSubscriber, async (req, res) => {
//   if (req.body.name != null) {
//     res.subscriber.name = req.body.name
//   }
//   if (req.body.subscribedToChannel != null) {
//     res.subscriber.subscribedToChannel = req.body.subscribedToChannel
//   }
//   try {
//     const updatedSubscriber = await res.subscriber.save()
//     res.json(updatedSubscriber)
//   } catch (err) {
//     res.status(400).json({ message: err.message })
//   }
// })

// // Deleting One
// router.delete('/:id', getSubscriber, async (req, res) => {
//   try {
//     await res.subscriber.remove()
//     res.json({ message: 'Deleted Subscriber' })
//   } catch (err) {
//     res.status(500).json({ message: err.message })
//   }
// })

// async function getSubscriber(req, res, next) {
//   let subscriber
//   try {
//     subscriber = await Subscriber.findById(req.params.id)
//     if (subscriber == null) {
//       return res.status(404).json({ message: 'Cannot find subscriber' })
//     }
//   } catch (err) {
//     return res.status(500).json({ message: err.message })
//   }

//   res.subscriber = subscriber
//   next()
// }

module.exports = router