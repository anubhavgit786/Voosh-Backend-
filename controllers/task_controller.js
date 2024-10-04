const Task = require('../models/task');

// Get all tasks for a user
exports.getTasks = async (req, res) => 
{
    try 
    {

        const tasks = await Task.find({ user: req.user.id });

        const todoTasks = tasks.filter(t => t.status === "todo");
        const inProgressTasks = tasks.filter(t => t.status === "inprogress");
        const doneTasks = tasks.filter(t => t.status === "done");
        
        const taskData = { todo : todoTasks, inprogress : inProgressTasks, done : doneTasks };
  
        
        return res.status(200).json({ tasks: taskData });
    } 
    catch (error) 
    {
        return res.status(500).json({ error: 'Server error' });
    }
};
  

// Create a task
exports.createTask = async (req, res) => 
{
    try 
    {
        const { title, description, status } = req.body;
        const task = new Task(
        {
            title,
            description,
            status,
            user: req.user.id
        });
        await task.save();

        const sendTask = { title: task.title, description: task.description, status: task.status, createdAt: task.createdAt, _id: task._id };

        res.status(201).json({task: sendTask, message: 'Task created successfully' });
    } 
    catch (error) 
    {
        res.status(500).json({ error });
    }
};

// Update a task
exports.updateTask = async (req, res) => 
{
    try 
    {
        const task = await Task.findById(req.params.id);
        if (!task) 
        {
            return res.status(404).json({ error: 'Task not found' });
        }
        
        if (task.user.toString() !== req.user.id) 
        {
            return res.status(403).json({ error: 'Not authorized' });
        }
        
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.status(200).json({ updatedTask, message: 'Task updated successfully'});
    } 
    catch (error) 
    {
        res.status(500).json({ error });
    }
};

// Delete a task
exports.deleteTask = async (req, res) => 
{
    try 
    {
        const task = await Task.findById(req.params.id);
        if (!task) 
        {
            return res.status(404).json({ error: 'Task not found' });
        }
        
        if (task.user.toString() !== req.user.id) 
        {
            return res.status(403).json({ error: 'Not authorized' });
        }

        await Task.findByIdAndDelete(req.params.id);
        
        return res.status(200).json({ taskId:req.params.id, message: 'Task removed successfully' });
    } 
    catch (error) 
    {
        res.status(500).json({ error });
    }
};


