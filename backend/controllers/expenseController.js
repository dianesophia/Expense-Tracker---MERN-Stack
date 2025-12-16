const xlsx = require('xlsx');
const Expense = require('../models/Expense');

exports.addExpense = async (req, res) => {
    const userId = req.user.id;

    try{
        const { icon, category, amount, date } = req.body;

        if(!category || !amount || !date){
            return res.status(400).json({message: "Source, amount, and date are required"});
        }

        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date),
        });

        await newExpense.save(); 
        res.status(201).json({message: "Expense added successfully", expense: newExpense});
    }catch(err){
        res.status(500).json({message: "Error adding expense", error: err.message});
    }

}

exports.getAllExpense = async (req, res) => {
    const userId = req.user.id;

    try{
        const expense = await Expense.find({userId}).sort({date: -1});
        res.json(expense);
    }catch(err){
        res.status(500).json({message: "Error fetching incomes", error: err.message});
    }

}
exports.deleteExpense = async (req, res) => {
    try{
        await Expense.findByIdAndDelete(req.params.id);
        res.json({message: "Expense deleted successfully"});
    }catch(err){
        res.status(500).json({message: "Error deleting expense", error: err.message});
    }
}

exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });

        const data = expense.map(item => ({
            Category: item.category,
            Amount: item.amount,
            Date: item.date.toISOString().split("T")[0], // Format date
        }));

        // Create workbook
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Incomes");

        // Convert workbook to buffer
        const buffer = xlsx.write(wb, {
            type: "buffer",
            bookType: "xlsx"
        });

        // Proper Excel headers
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=expense.xlsx"
        );

        // Send buffer
        res.send(buffer);

    } catch (err) {
        res.status(500).json({
            message: "Error downloading expense data",
            error: err.message
        });
    }
};
