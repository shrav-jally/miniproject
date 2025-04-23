const VisitCount = require('../models/VisitCount');

// Get current visit count
const getVisitCount = async (req, res) => {
    try {
        let visitCount = await VisitCount.findOne();
        if (!visitCount) {
            visitCount = await VisitCount.create({ count: 0 });
        }
        res.status(200).json({ count: visitCount.count });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching visit count', error: error.message });
    }
};

// Increment visit count
const incrementVisitCount = async (req, res) => {
    try {
        let visitCount = await VisitCount.findOne();
        if (!visitCount) {
            visitCount = await VisitCount.create({ count: 1 });
        } else {
            visitCount.count += 1;
            await visitCount.save();
        }
        res.status(200).json({ count: visitCount.count });
    } catch (error) {
        res.status(500).json({ message: 'Error incrementing visit count', error: error.message });
    }
};

module.exports = {
    getVisitCount,
    incrementVisitCount
};
 