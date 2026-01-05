import express from 'express';
import Plan from '../models/Plan.js';

const router = express.Router();

// GET all plans for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const plans = await Plan.find({ userId: req.params.userId })
            .sort({ updatedAt: -1 }); // Most recently updated first
        res.json(plans);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching plans', error: error.message });
    }
});

// GET a specific plan by ID
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

// POST - Create a new plan
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

// PUT - Update an existing plan
router.put('/:planId', async (req, res) => {
    try {
        const { planName, semesters } = req.body;

        const updatedPlan = await Plan.findByIdAndUpdate(
            req.params.planId,
            { planName, semesters, updatedAt: Date.now() },
            { new: true } // Return the updated document
        );

        if (!updatedPlan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        res.json(updatedPlan);
    } catch (error) {
        res.status(500).json({ message: 'Error updating plan', error: error.message });
    }
});

// DELETE a plan
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