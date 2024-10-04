const express = require('express');

const taskController = require('../controllers/task_controller');
const authMiddleware = require('../middlewares/auth_middleware');

const taskValidator = require('../validators/task_validator')
const validation = require('../validators/validation')

const router = express.Router();

router.get('/', authMiddleware,  taskController.getTasks);
router.post('/', authMiddleware, taskValidator.createTaskValidator(), validation.validate, taskController.createTask);
router.put('/:id', authMiddleware, taskValidator.updateTaskValidator(), validation.validate, taskController.updateTask);
router.delete('/:id', authMiddleware, taskController.deleteTask);




module.exports = router;