import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.json({ message: 'All users' })
})

router.get('/:id', (req, res) => {
  res.json({ message: 'User with id' + req.params.id + 'got' })
})

router.post('/:id', (req, res) => {
  res.json({ message: 'User created' }).status(201)
})

router.put('/:id', (req, res) => {
  res.json({ message: 'User modified' }).status(200)
})

router.delete('/:id', (req, res) => {
  res.json({ message: 'User deleted' }).status(204)
})

export default router
