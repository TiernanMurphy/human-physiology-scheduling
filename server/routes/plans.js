import express from 'express';
import Plan from '../models/Plan.js';

const router = express.Router();

// all user's plans
router.get('/user/:userId', async (req, res) => {
    try {
        const plans = await Plan.find({ userId: req.params.userId })
            .sort({ updatedAt: -1 }); // sort by recently edited
        res.json(plans);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching plans', error: error.message });
    }
});

// specific plan
router.get('/:planId', async (req, res) => {
    try {
        const plan = await Plan.findById(req.params.planId);
        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }
        res.json(plan);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching plan', error: error.message });
    }
});

// create new plan
router.post('/', async (req, res) => {
    try {
        const { userId, planName, semesters } = req.body;

        const newPlan = new Plan({
            userId,
            planName,
            semesters
        });

        await newPlan.save();
        res.status(201).json(newPlan);
    } catch (error) {
        res.status(500).json({ message: 'Error creating plan', error: error.message });
    }
});

// edit saved plan
router.put('/:planId', async (req, res) => {
    try {
        const { planName, semesters } = req.body;

        const updatedPlan = await Plan.findByIdAndUpdate(
            req.params.planId,
            { planName, semesters, updatedAt: Date.now() },
            { new: true } // return updated plan
        );

        if (!updatedPlan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        res.json(updatedPlan);
    } catch (error) {
        res.status(500).json({ message: 'Error updating plan', error: error.message });
    }
});

// delete plan
router.delete('/:planId', async (req, res) => {
    try {
        const deletedPlan = await Plan.findByIdAndDelete(req.params.planId);

        if (!deletedPlan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        res.json({ message: 'Plan deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting plan', error: error.message });
    }
});

export default router;