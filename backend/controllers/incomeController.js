const xlsx = require('xlsx');
const Income = require('../models/Income');

exports.addIncome = async (req, res) => {
    const userId = req.user.id;

    try{
        const { icon, source, amount, date } = req.body;

        if(!source || !amount || !date){
            return res.status(400).json({message: "Source, amount, and date are required"});
        }

        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date: new Date(date),
        });

        await newIncome.save(); 
        res.status(201).json({message: "Income added successfully", income: newIncome});
    }catch(err){
        res.status(500).json({message: "Error adding income", error: err.message});
    }

}

exports.getAllIncomes = async (req, res) => {
    const userId = req.user.id;

    try{
        const income = await Income.find({userId}).sort({date: -1});
        res.json(income);
    }catch(err){
        res.status(500).json({message: "Error fetching incomes", error: err.message});
    }

}
exports.deleteIncome = async (req, res) => {
    try{
        await Income.findByIdAndDelete(req.params.id);
        res.json({message: "Income deleted successfully"});
    }catch(err){
        res.status(500).json({message: "Error deleting income", error: err.message});
    }
}

exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;

    try {
        const incomes = await Income.find({ userId }).sort({ date: -1 });

        const data = incomes.map(item => ({
            Source: item.source,
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
            "attachment; filename=incomes.xlsx"
        );

        // Send buffer
        res.send(buffer);

    } catch (err) {
        res.status(500).json({
            message: "Error downloading income data",
            error: err.message
        });
    }
};
