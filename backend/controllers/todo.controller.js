const Todo = require('../models/todo.model');

// Get all todos with pagination and filters
const getAllTodos = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const category = req.query.category;
        const search = req.query.search;
        const showDeleted = req.query.showDeleted === 'true';
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

        const query = { user: req.user.id };

        if (status) {
            if (Array.isArray(status)) {
                query.status = { $in: status };
            } else {
                query.status = status;
            }
        }
        if (category) {
            if (Array.isArray(category)) {
                query.category = { $in: category };
            } else {
                query.category = category;
            }
        }
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        if (!showDeleted) {
            query.isDeleted = false;
        }

        const total = await Todo.countDocuments(query);
        const todos = await Todo.find(query)
            .sort({ [sortBy]: sortOrder })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            success: true,
            data: todos,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching todos',
            error: error.message
        });
    }
};

// Create new todo
const createTodo = async (req, res) => {
    try {
        const { title, description, category, dueDate, status } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: 'Title is required'
            });
        }

        const todo = await Todo.create({
            title,
            description,
            category,
            dueDate: dueDate ? new Date(dueDate) : null,
            user: req.user.id,
            status: status || 'pending',
            isDeleted: false
        });

        res.status(201).json({
            success: true,
            data: todo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating todo',
            error: error.message
        });
    }
};

// Update todo
const updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category, dueDate, status } = req.body;
        
        const todo = await Todo.findOne({ _id: id, user: req.user._id });
        
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        
        todo.title = title;
        todo.description = description;
        todo.category = category;
        todo.dueDate = dueDate ? new Date(dueDate) : null;
        if (status) {
            todo.status = status;
        }
        
        await todo.save();
        
        res.json(todo);
    } catch (error) {
        console.error('Update todo error:', error);
        res.status(500).json({ message: 'Error updating todo' });
    }
};

// Update todo status
const updateTodoStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['pending', 'in_progress', 'completed'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        let todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: 'Todo not found'
            });
        }

        if (todo.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }

        todo = await Todo.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        res.json({
            success: true,
            data: todo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating todo status',
            error: error.message
        });
    }
};

// Delete (soft delete) todo
const deleteTodo = async (req, res) => {
    try {
        let todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: 'Todo not found'
            });
        }

        if (todo.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }

        todo = await Todo.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true }
        );

        res.json({
            success: true,
            data: todo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting todo',
            error: error.message
        });
    }
};

// Restore todo
const restoreTodo = async (req, res) => {
    try {
        let todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: 'Todo not found'
            });
        }

        if (todo.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }

        todo = await Todo.findByIdAndUpdate(
            req.params.id,
            { isDeleted: false },
            { new: true }
        );

        res.json({
            success: true,
            data: todo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error restoring todo',
            error: error.message
        });
    }
};

// Get todo statistics
const getTodoStats = async (req, res) => {
    try {
        const stats = await Todo.aggregate([
            { $match: { user: req.user._id } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    completed: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
                        }
                    },
                    pending: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'pending'] }, 1, 0]
                        }
                    },
                    deleted: {
                        $sum: {
                            $cond: [{ $eq: ['$isDeleted', true] }, 1, 0]
                        }
                    }
                }
            }
        ]);

        res.json({
            success: true,
            data: stats[0] || {
                total: 0,
                completed: 0,
                pending: 0,
                deleted: 0
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching todo statistics',
            error: error.message
        });
    }
};

// Export all controller functions including getTodoStats
module.exports = {
    getAllTodos,
    createTodo,
    updateTodo,
    updateTodoStatus,
    deleteTodo,
    restoreTodo,
    getTodoStats
};