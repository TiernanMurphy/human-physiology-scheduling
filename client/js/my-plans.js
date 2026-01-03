import {generatePlanPDF} from "./pdf-generator.js";

function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;

    document.body.appendChild(messageDiv);

    setTimeout(() => messageDiv.remove(), 3000);
}

// fetch and display all plans for the logged-in user
async function loadUserPlans() {
    const userId = localStorage.getItem('userId');
    const plansContainer = document.getElementById('plans-list');

    // show loading state immediately
    plansContainer.innerHTML = '<p class="loading">Loading your plans...</p>';

    if (!userId) {
        window.location.href = '/';
        return;
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/plans/user/${userId}`, {
            header: {
                'Authorization': `Bearer ${token}`
            }
        });

        const plans = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                window.location.href = '/';
                return;
            }

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

        // display plans
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

    // count total courses
    const totalCourses = plan.semesters.reduce((sum, sem) => sum + sem.courses.length, 0);

    // format date
    const updatedDate = new Date(plan.updatedAt).toLocaleDateString();

    card.innerHTML = `
        <div class="plan-card-header">
            <h3 class="plan-name"></h3>
            <div class="plan-meta">
                <span>${plan.semesters.length} semesters</span>
                <span>${totalCourses} courses</span>
                <span>Updated: ${updatedDate}</span>
            </div>
        </div>
        <div class="plan-card-actions">
            <button class="btn btn-primary view-plan-btn">View</button>
            <button class="btn btn-tertiary download-plan-btn">Download PDF</button>
            <button class="btn btn-secondary delete-plan-btn">Delete</button>
        </div>
    `;

    card.querySelector('.plan-name').textContent = plan.planName;

    card.querySelector('.view-plan-btn').addEventListener('click', () => {
        window.location.href = `/pages/plan.html?planId=${plan._id}`;
    });

    card.querySelector('.download-plan-btn').addEventListener('click', () => {
        generatePlanPDF(plan);
    });

    card.querySelector('.delete-plan-btn').addEventListener('click', () => {
        deletePlan(plan._id);
    });

    return card;
}

async function deletePlan(planId) {
    if (!confirm('Are you sure you want to delete this plan?')) {
        return;
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/plans/${planId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            showMessage('Plan deleted successfully', 'success');
            loadUserPlans(); // reload the list
        } else {
            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                window.location.href = '/';
                return;
            }

            showMessage('error deleting plan', 'error');
        }
    } catch (error) {
        console.error('Delete error:', error);
        showMessage('Error deleting plan', 'error');
    }
}

document.addEventListener('DOMContentLoaded', loadUserPlans);