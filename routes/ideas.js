const express = require('express')
const router = express.Router()
const Idea = require('../models/Idea')

// const ideas = [ 
//   { 
//     id: 1,
//     text: 'Positive NewsLetter, a newsletter that only shares positive, uplifting news',
//     tag: 'Technology',
//     username: 'TonyStark',
//     date: '2025-07-20',
//   },
//   { 
//     id: 2,
//     text: 'Milk cartons that turn a different color the older that your milk is getting',
//     tag: 'Inventions',
//     username: 'SteveRogers',
//     date: '2025-07-20',
//   },
//   { 
//     id: 3,
//     text: 'ATM location app which lets you know where the closest ATM is and if it is in service',
//     tag: 'Software',
//     username: 'BruceBanner',
//     date: '2025-07-20',
//   }
// ]

// Get all ideas
router.get('/', async (req, res) => { 
  try {
    const ideas = await Idea.find()
    res.json({ success: true, data: ideas })
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: 'Something went wrong' })
  }
})

// Get single idea
router.get('/:id', async (req, res) => { 
  try {
    const idea = await Idea.findById(req.params.id)
    res.json({ success: true, data: idea })
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: 'Something went wrong' })
  }
})

// Add an idea
router.post('/', async (req, res) => { 
  const idea = new Idea ({
    text: req.body.text,
    tag: req.body.tag,
    username: req.body.username,
  })

  try {
    const savedIdea = await idea.save()
    res.json({ success: true, data: savedIdea })
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: 'Something went wrong' })
  }
})

// Update idea
router.put('/:id', async (req, res) => { 
  try {
    const idea = await Idea.findById(req.params.id)

    // Match the usernames
    if (idea.username === req.body.username) {  
      const updatedIdea = await Idea.findByIdAndUpdate( 
        req.params.id,
        { 
          $set: { 
            text: req.body.text,
            tag: req.body.tag
          }
        },
        { 
          new: true
        }
      )
      res.json({ success: true, data: updatedIdea })
    }    

    // Usernames do not match
    res.status(403).json({ success: false, error: 'You are not authorized to update this resource' })

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: 'Something went wrong' })
  }
})

// Delete idea
router.delete('/:id', async (req, res) => { 
  try {
    const idea = await Idea.findById(req.params.id)

    // Match the usernames
    if (idea.username === req.body.username) { 
      await Idea.findByIdAndDelete(req.params.id)
      return res.json({ success: true, data: {} })
    }

    // Usernames do not match
    res.status(403).json({ success: false, error: 'You are not authorized to delete this resource' })
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: 'Something went wrong' })
  }
})


module.exports = router