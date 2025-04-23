const Expense = require('../models/ExpenseModel')

exports.addExpense = async (req, res) => {
    const {title, amount, date, category, description} = req.body

    const expense = Expense({
        title,
        amount,
        date,
        category,
        description,
        user: req.user.id
    })

    try {
        //validations
        if(!title || !category || !description || !date){
            return res.status(400).json({message: 'All fields are required!'})
        }
        if(amount <= 0 || !amount === 'number'){
            return res.status(400).json({message: 'Amount must be a positive number!'})
        }
        await expense.save()
        res.status(200).json({message: 'Expense Added'})
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }

    console.log(expense)
}

exports.getExpenses = async (req, res) =>{
    try {
        const expenses = await Expense.find({ user: req.user.id }).sort({createdAt: -1})
        res.status(200).json(expenses)
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }
}

exports.deleteExpense = async (req, res) =>{
    const {id} = req.params;
    try {
        const expense = await Expense.findById(id);
        
        if (!expense) {
            return res.status(404).json({message: 'Expense not found'});
        }

        // Check if the expense belongs to the logged-in user
        if (expense.user.toString() !== req.user.id) {
            return res.status(403).json({message: 'Not authorized to delete this expense'});
        }

        await Expense.findByIdAndDelete(id);
        res.status(200).json({message: 'Expense Deleted'});
    } catch (error) {
        res.status(500).json({message: 'Server Error'});
    }
}