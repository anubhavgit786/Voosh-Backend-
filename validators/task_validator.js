const { body } = require('express-validator');


module.exports.createTaskValidator = ()=>
{
    const createTaskValidationRules = [
        body('title').not().isEmpty().withMessage('Title is required'),
        body('status').not().isEmpty().withMessage('Status is required') .isIn(['todo', 'inprogress', 'done']).withMessage('Invalid status of the task'),
        body('description').not().isEmpty().withMessage('Description is required'),
    ];

    return createTaskValidationRules;
}

module.exports.updateTaskValidator = ()=>
{
    const updateTaskValidationRules = [
            body('title').not().isEmpty().withMessage('Title is required'),
            body('status').not().isEmpty().withMessage('Status is required') .isIn(['todo', 'inprogress', 'done']).withMessage('Invalid status of the task'),
            body('description').not().isEmpty().withMessage('Description is required'),
    ];
    
    return updateTaskValidationRules;
}

