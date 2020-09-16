const express = require('express')
const router = express.Router()
const Message = require('./message')
const http = require("http");
var microtime = require('microtime')
const request = require('request');


// Getting all
router.get('/', async (req, res) => {
  try {
    let retObj = {
      "data": [
        { id: '1', title: 'Note 1', content: 'Content 1'},
        { id: '2', title: 'Note 2', content: 'Content 2'}
      ]
    }
    res.json(retObj)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})



router.get('/call-rest', async (req, response) => {
  const s1_start = microtime.now()
  request('http://localhost:3002/messages', { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
     
    const s1_end = microtime.now()
      const ret = {
        "startS1" : s1_start,
        "endS1": s1_end,
        "durationS1": s1_end - s1_start,
        "data": body
      }
    response.send(ret);
  });
   
})


router.get('/call-grpc', async (req, res) => {
  const s1_start = microtime.now()
  try {
    const client = require('./client')
    client.list({}, (error, notes) => {
      const s1_end = microtime.now()
      const duration = s1_end - s1_start
      if (!error) {
        // let retObj = {
        //   "data": [
        //     { id: '1', title: 'Note 1', content: 'Content 1'},
        //     { id: '2', title: 'Note 2', content: 'Content 2'}
        //   ]
        // }
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