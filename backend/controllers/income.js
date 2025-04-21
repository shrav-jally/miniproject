const Income = require('../models/IncomeModel')

exports.addIncome = async (req, res) => {
    const {title, amount, date, category, description} = req.body

    const income = Income({
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
        await income.save()
        res.status(200).json({message: 'Income Added'})
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }

    console.log(income)
}

exports.getIncomes = async (req, res) =>{
    try {
        const incomes = await Income.find({ user: req.user.id }).sort({createdAt: -1})
        res.status(200).json(incomes)
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }
}

exports.deleteIncome = async (req, res) =>{
    const {id} = req.params;
    try {
        const income = await Income.findById(id);
        
        if (!income) {
            return res.status(404).json({message: 'Income not found'});
        }

        // Check if the income belongs to the logged-in user
        if (income.user.toString() !== req.user.id) {
            return res.status(403).json({message: 'Not authorized to delete this income'});
        }

        await Income.findByIdAndDelete(id);
        res.status(200).json({message: 'Income Deleted'});
    } catch (error) {
        res.status(500).json({message: 'Server Error'});
    }
}