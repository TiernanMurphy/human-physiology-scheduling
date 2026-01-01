// Fetch and display all plans for the logged-in user
async function loadUserPlans() {
    const userId = localStorage.getItem('userId');

    if (!userId) {
        window.location.href = '/';
        return;
    }

    const plansContainer = document.getElementById('plans-list');

    try {
        const response = await fetch(`/api/plans/user/${userId}`);
        const plans = await response.json();

        if (!response.ok) {
            plansContainer.innerHTML = '<p>Error loading plans</p>';
            return;
        }

        if (plans.length === 0) {
            plansContainer.innerHTML = `
                <p>You haven't saved any plans yet.</p>
                <a href="/pages/plan.html" class="btn btn-primary">Create Your First Plan</a>
            `;
            return;
        }

        // Display plans
        plansContainer.innerHTML = '';
        plans.forEach(plan => {
            const planCard = createPlanCard(plan);
            plansContainer.appendChild(planCard);
        });

    } catch (error) {
        console.error('Error loading plans:', error);
        plansContainer.innerHTML = '<p>Error loading plans. Please try again.</p>';
    }
}

function createPlanCard(plan) {
    const card = document.createElement('div');
    card.className = 'plan-card';

    // Count total courses
    const totalCourses = plan.semesters.reduce((sum, sem) => sum + sem.courses.length, 0);

    // Format date
    const updatedDate = new Date(plan.updatedAt).toLocaleDateString();

    card.innerHTML = `
        <div class="plan-card-header">
            <h3>${plan.planName}</h3>
            <div class="plan-meta">
                <span>${plan.semesters.length} semesters</span>
                <span>${totalCourses} courses</span>
                <span>Updated: ${updatedDate}</span>
            </div>
        </div>
        <div class="plan-card-actions">
            <button class="btn btn-primary" onclick="viewPlan('${plan._id}')">View</button>
            <button class="btn btn-secondary" onclick="deletePlan('${plan._id}')">Delete</button>
        </div>
    `;

    return card;
}

// View a specific plan (we'll implement this next)
window.viewPlan = function(planId) {
    window.location.href = `/pages/plan.html?planId=${planId}`;
};

// Delete a plan
window.deletePlan = async function(planId) {
    if (!confirm('Are you sure you want to delete this plan?')) {
        return;
    }

    try {
        const response = await fetch(`/api/plans/${planId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Plan deleted successfully');
            loadUserPlans(); // Reload the list
        } else {
            alert('Error deleting plan');
        }
    } catch (error) {
        console.error('Delete error:', error);
        alert('Error deleting plan');
    }
};

// Load plans when page loads
document.addEventListener('DOMContentLoaded', loadUserPlans);