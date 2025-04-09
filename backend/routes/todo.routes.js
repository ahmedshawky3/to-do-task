const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todo.controller');
const { protect } = require('../middleware/auth.middleware');

// Apply authentication middleware
router.use(protect);

// CRUD operations
router.get('/', todoController.getAllTodos);
router.post('/', todoController.createTodo);
router.put('/:id', todoController.updateTodo);      // Add this line for updating todo
router.delete('/:id', todoController.deleteTodo);
router.patch('/:id/status', todoController.updateTodoStatus);   // Changed from put to patch
router.patch('/:id/restore', todoController.restoreTodo);       // Changed from put to patch

router.get('/stats', todoController.getTodoStats);

module.exports = router;