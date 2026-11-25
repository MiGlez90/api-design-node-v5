import { Router } from 'express'

const router = Router()

let id = 1
let habits = []

router.get('/', (req, res) => {
  res.json({ data: habits })
})

router.get('/:id', (req, res) => {
  const id = req.params.id
  const habit = habits.find((habit) => habit.id == id)
  if (!habit) return res.send({ message: 'Habit not found' }).status(404)
  return res.json({ data: habit })
})

router.post('/', (req, res) => {
  const body = req.body
  const habit = { id: id++, name: body.name, status: 'todo' }
  habits.push(habit)
  return res.send({ message: 'Created' }).status(201)
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  const habit = habits.find((habit) => habit.id == id)
  if (!habit) return res.send({ message: 'Habit not found' }).status(404)
  habits = habits.filter((habit) => habit.id !== id)
  res.send({ message: 'Removed' }).status(201)
})

router.post('/:id/complete', (req, res) => {
  const id = req.params.id
  const habit = habits.find((habit) => habit.id == id)
  if (!habit) return res.send({ message: 'Habit not found' }).status(404)
  habit.status = 'done'
  habits = habits.map((h) => {
    if (h.id === id) return habit
    return h
  })
  return res.json({ data: habit })
})

export default router
