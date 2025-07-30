// Genome Collaboration Portal - Frontend JavaScript

// Global variables
let currentUser = null;
let authToken = localStorage.getItem('token');
const API_BASE_URL = 'http://localhost:8000/api';

// Add user collaboration data structure
let userCollaborations = [];

// Function to add user collaboration to the data structure
function addUserCollaboration(collaboration) {
    const userCollab = {
        title: collaboration.title,
        description: collaboration.description,
        participants: [
            { name: 'Demo User', email: 'demo@genome.com', role: 'Creator' }
        ],
        datasets: [],
        analyses: [],
        status: 'Active',
        created_date: new Date().toISOString().split('T')[0],
        research_type: 'GWAS Study',
        progress: 10
    };

    userCollaborations.push({
        id: collaboration.id,
        data: userCollab
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    setupEventListeners();
});

// Add keyboard shortcut to hide loading modal (for debugging)
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const loadingModal = document.getElementById('loadingModal');
        if (loadingModal && loadingModal.classList.contains('show')) {
            console.log('Escape key pressed - hiding loading modal');
            hideLoading();
        }
    }
});

// Check authentication status
function checkAuthStatus() {
    if (authToken) {
        // Verify token is still valid
        fetchUserProfile().then(() => {
            showAuthenticatedUI();
        }).catch(() => {
            logout();
        });
    } else {
        showUnauthenticatedUI();
    }
}

// Setup event listeners
function setupEventListeners() {
    // Login form
    document.getElementById('login-form').addEventListener('submit', handleLogin);

    // Register form
    document.getElementById('register-form').addEventListener('submit', handleRegister);

    // Upload form
    document.getElementById('upload-form').addEventListener('submit', handleFileUpload);

    // Profile form
    document.getElementById('profile-form').addEventListener('submit', handleProfileUpdate);
}

// Authentication functions
async function handleLogin(event) {
    event.preventDefault();
    console.log('Login attempt started');

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    console.log('Login credentials:', { email, password: '***' });

    showLoading();

    try {
        console.log('Making login request to:', `${API_BASE_URL}/login`);
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        console.log('Login response status:', response.status);
        const data = await response.json();
        console.log('Login response data:', data);

        if (response.ok) {
            authToken = data.access_token;
            localStorage.setItem('token', authToken);
            console.log('Login successful, token stored');
            await fetchUserProfile();
            console.log('User profile fetched, showing authenticated UI');
            showAuthenticatedUI();
            console.log('Authenticated UI shown, showing dashboard');
            showSection('dashboard'); // Show dashboard for authenticated users
            console.log('Dashboard section should be visible now');
            showAlert('Login successful! Welcome back!', 'success');
        } else {
            console.error('Login failed:', data);
            showAlert(data.detail || 'Login failed', 'danger');
        }
    } catch (error) {
        console.error('Login error:', error);
        showAlert('Network error. Please try again.', 'danger');
    } finally {
        hideLoading();
    }
}

async function handleRegister(event) {
    event.preventDefault();
    console.log('Register attempt started');

    const formData = {
        email: document.getElementById('register-email').value,
        password: document.getElementById('register-password').value,
        first_name: document.getElementById('register-first-name').value,
        last_name: document.getElementById('register-last-name').value,
        institution: document.getElementById('register-institution').value,
        role: 'researcher'
    };

    console.log('Register form data:', {...formData, password: '***' });

    showLoading();

    try {
        console.log('Making register request to:', `${API_BASE_URL}/register`);
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        console.log('Register response status:', response.status);
        const data = await response.json();
        console.log('Register response data:', data);

        if (response.ok) {
            authToken = data.access_token;
            localStorage.setItem('token', authToken);
            console.log('Registration successful, token stored');
            await fetchUserProfile();
            showAuthenticatedUI();
            showSection('dashboard'); // Show dashboard for authenticated users
            showAlert('Registration successful! Welcome to Genome Collaboration Portal!', 'success');
        } else {
            console.error('Registration failed:', data);
            showAlert(data.detail || 'Registration failed', 'danger');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showAlert('Network error. Please try again.', 'danger');
    } finally {
        hideLoading();
    }
}

async function fetchUserProfile() {
    const response = await fetch(`${API_BASE_URL}/profile`, {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    });

    if (response.ok) {
        currentUser = await response.json();
        populateProfileForm();
        return currentUser;
    } else {
        throw new Error('Failed to fetch user profile');
    }
}

async function handleProfileUpdate(event) {
    event.preventDefault();

    const formData = {
        first_name: document.getElementById('profile-first-name').value,
        last_name: document.getElementById('profile-last-name').value,
        institution: document.getElementById('profile-institution').value
    };

    showLoading();

    try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            await fetchUserProfile();
            showAlert('Profile updated successfully!', 'success');
        } else {
            const data = await response.json();
            showAlert(data.detail || 'Profile update failed', 'danger');
        }
    } catch (error) {
        showAlert('Network error. Please try again.', 'danger');
    } finally {
        hideLoading();
    }
}

function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('token');
    showUnauthenticatedUI();
    showSection('home');
    showAlert('Logged out successfully', 'info');
}

// File upload functions
async function handleFileUpload(event) {
    event.preventDefault();

    const fileInput = document.getElementById('file-upload');
    const dataType = document.getElementById('data-type').value;

    if (!fileInput.files[0]) {
        showAlert('Please select a file', 'warning');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = async function(e) {
        const csvData = e.target.result;

        showLoading();

        try {
            let endpoint;
            switch (dataType) {
                case 'qc':
                    endpoint = '/upload_csv_qc';
                    break;
                case 'stats':
                    endpoint = '/upload_csv_stats';
                    break;
                case 'gwas':
                    endpoint = '/calculate_chi_square';
                    break;
                default:
                    showAlert('Please select a data type', 'warning');
                    hideLoading();
                    return;
            }

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    data: csvData,
                    filename: file.name
                })
            });

            const result = await response.json();

            if (response.ok) {
                showAnalysisResults(result, dataType);
                showAlert('Analysis completed successfully!', 'success');
            } else {
                showAlert(result.detail || 'Analysis failed', 'danger');
            }
        } catch (error) {
            showAlert('Network error. Please try again.', 'danger');
        } finally {
            hideLoading();
        }
    };

    reader.readAsText(file);
}

function showAnalysisResults(results, dataType) {
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'mt-4';

    let resultsHtml = '<div class="card"><div class="card-header"><h5>Analysis Results</h5></div><div class="card-body">';

    if (dataType === 'qc') {
        resultsHtml += `
            <h6>Quality Control Results:</h6>
            <ul>
                <li>Total Samples: ${results.qc_results.total_samples}</li>
                <li>Total SNPs: ${results.qc_results.total_snps}</li>
                <li>Missing Data Rate: ${(results.qc_results.missing_data_rate * 100).toFixed(2)}%</li>
            </ul>
        `;
    } else if (dataType === 'stats') {
        resultsHtml += `
            <h6>Statistical Analysis Results:</h6>
            <ul>
                <li>Total Samples: ${results.stats_results.total_samples}</li>
                <li>Total SNPs: ${results.stats_results.total_snps}</li>
                <li>Mean Values: ${results.stats_results.mean_values.length} SNPs analyzed</li>
                <li>Standard Deviations: ${results.stats_results.std_values.length} SNPs analyzed</li>
            </ul>
        `;
    } else if (dataType === 'gwas') {
        resultsHtml += `
            <h6>GWAS Analysis Results:</h6>
            <p>Chi-square analysis completed for ${Object.keys(results.gwas_results).length} SNPs</p>
        `;
    }

    resultsHtml += '</div></div>';
    resultsContainer.innerHTML = resultsHtml;

    // Add results to the upload section
    const uploadSection = document.getElementById('upload-section');
    const existingResults = uploadSection.querySelector('.mt-4');
    if (existingResults) {
        existingResults.remove();
    }
    uploadSection.appendChild(resultsContainer);
}

// Collaboration functions
async function loadCollaborations() {
    console.log('Loading collaborations...');

    if (!isAuthenticated()) {
        console.log('User not authenticated, skipping collaboration load');
        return;
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/user/${getCurrentUserId()}/collaborations`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const collaborations = await response.json();
            console.log('Collaborations loaded:', collaborations);
            displayCollaborations(collaborations);
        } else {
            console.error('Failed to load collaborations:', response.status);
            displayCollaborations([]);
        }
    } catch (error) {
        console.error('Failed to load collaborations:', error);
        displayCollaborations([]);
    }
}

function displayCollaborations(collaborations) {
    console.log('Displaying collaborations:', collaborations);

    // Find the collaborations list element
    const collaborationsList = document.getElementById('collaborations-list');

    if (!collaborationsList) {
        console.log('Collaborations list element not found, using demo data');
        // If the element doesn't exist, we're probably on the demo page
        // The demo collaborations are already displayed in the HTML
        return;
    }

    if (collaborations.length === 0) {
        collaborationsList.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                No collaborations found. Create your first collaboration to get started!
            </div>
        `;
        return;
    }

    const collaborationsHtml = collaborations.map(collab => `
        <div class="col-md-6 mb-4">
            <div class="card h-100">
                <div class="card-header">
                    <h5><i class="fas fa-users me-2"></i>${collab.title || 'Untitled Collaboration'}</h5>
                </div>
                <div class="card-body">
                    <p class="card-text">${collab.description || 'No description available'}</p>
                    <div class="mb-3">
                        <small class="text-muted">
                            <i class="fas fa-calendar me-1"></i>Created: ${new Date(collab.created_at).toLocaleDateString()}<br>
                            <i class="fas fa-circle me-1"></i>Status: <span class="badge bg-success">${collab.status || 'Active'}</span>
                        </small>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="showCollaborationDetails('user-collab-${collab.id}')">
                        <i class="fas fa-eye me-1"></i>View Details
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    collaborationsList.innerHTML = `
        <div class="row">
            ${collaborationsHtml}
            <div class="col-md-6 mb-4">
                <div class="card h-100 border-dashed">
                    <div class="card-body text-center">
                        <i class="fas fa-plus-circle fa-3x text-muted mb-3"></i>
                        <h5 class="card-title">Create New Collaboration</h5>
                        <p class="card-text">Start a new research collaboration with other scientists.</p>
                        <button class="btn btn-outline-primary" onclick="showCreateCollaboration()">
                            <i class="fas fa-plus me-2"></i>New Collaboration
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function createCollaboration(collaborationData) {
    try {
        const response = await fetch(`${API_BASE_URL}/start_collaboration`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(collaborationData)
        });

        if (response.ok) {
            const result = await response.json();
            showAlert('Collaboration created successfully!', 'success');
            loadCollaborations();
            return result.collaboration_id;
        } else {
            const data = await response.json();
            showAlert(data.detail || 'Failed to create collaboration', 'danger');
        }
    } catch (error) {
        showAlert('Network error. Please try again.', 'danger');
    }
}

function showCreateCollaboration() {
    const title = prompt('Enter collaboration title:');
    if (!title) return;

    const description = prompt('Enter collaboration description:');

    createCollaboration({
        title: title,
        description: description || ''
    });
}

function viewCollaboration(uuid) {
    // This would open a detailed view of the collaboration
    alert(`Viewing collaboration: ${uuid}`);
}

// UI functions
function showSection(sectionName) {
    console.log('showSection called with:', sectionName);

    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });

    // Show the requested section
    const targetSection = document.getElementById(`${sectionName}-section`);
    console.log('Looking for section:', `${sectionName}-section`);
    console.log('Target section found:', targetSection);

    if (targetSection) {
        targetSection.style.display = 'block';
        console.log('Section displayed:', sectionName);
    } else {
        console.error('Section not found:', sectionName);
    }

    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Add active class to current nav item
    const activeNavItem = document.querySelector(`[onclick="showSection('${sectionName}')"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }

    // Load data for specific sections
    if (sectionName === 'collaborations') {
        loadCollaborations();
    } else if (sectionName === 'profile') {
        populateProfileForm();
    }
}

function showAuthenticatedUI() {
    console.log('showAuthenticatedUI called');

    document.querySelectorAll('#auth-required').forEach(element => {
        element.style.display = 'block';
        console.log('Showing auth required element:', element);
    });

    const unauthenticatedOnly = document.getElementById('unauthenticated-only');
    if (unauthenticatedOnly) {
        unauthenticatedOnly.style.display = 'none';
        console.log('Hiding unauthenticated only element');
    }

    const loginSection = document.getElementById('nav-login-section');
    if (loginSection) {
        loginSection.style.display = 'none';
        console.log('Hiding login section');
    }

    const registerSection = document.getElementById('nav-register-section');
    if (registerSection) {
        registerSection.style.display = 'none';
        console.log('Hiding register section');
    }

    const logoutSection = document.getElementById('logout-section');
    if (logoutSection) {
        logoutSection.style.display = 'block';
        console.log('Showing logout section');
    }

    console.log('Authenticated UI setup complete');
}

function showUnauthenticatedUI() {
    document.querySelectorAll('#auth-required').forEach(element => {
        element.style.display = 'none';
    });

    document.getElementById('unauthenticated-only').style.display = 'block';
    document.getElementById('nav-login-section').style.display = 'block';
    document.getElementById('nav-register-section').style.display = 'block';
    document.getElementById('logout-section').style.display = 'none';
}

function populateProfileForm() {
    if (currentUser) {
        document.getElementById('profile-first-name').value = currentUser.first_name || '';
        document.getElementById('profile-last-name').value = currentUser.last_name || '';
        document.getElementById('profile-email').value = currentUser.email || '';
        document.getElementById('profile-institution').value = currentUser.institution || '';
    }
}

function showLoading() {
    const modal = new bootstrap.Modal(document.getElementById('loadingModal'));
    modal.show();

    // Auto-hide loading modal after 5 seconds
    setTimeout(() => {
        hideLoading();
    }, 5000);
}

function hideLoading() {
    console.log('hideLoading called');

    // Try multiple approaches to hide the modal
    try {
        // Method 1: Get existing instance
        const modal = bootstrap.Modal.getInstance(document.getElementById('loadingModal'));
        if (modal) {
            modal.hide();
            console.log('Loading modal hidden via instance');
            return;
        }

        // Method 2: Create new instance and hide
        const newModal = new bootstrap.Modal(document.getElementById('loadingModal'));
        newModal.hide();
        console.log('Loading modal hidden via new instance');

        // Method 3: Manual hide if Bootstrap fails
        setTimeout(() => {
            const modalElement = document.getElementById('loadingModal');
            if (modalElement) {
                modalElement.style.display = 'none';
                modalElement.classList.remove('show');
                document.body.classList.remove('modal-open');
                const backdrop = document.querySelector('.modal-backdrop');
                if (backdrop) {
                    backdrop.remove();
                }
                console.log('Loading modal hidden manually');
            }
        }, 100);

    } catch (error) {
        console.error('Error hiding loading modal:', error);

        // Fallback: Manual hide
        const modalElement = document.getElementById('loadingModal');
        if (modalElement) {
            modalElement.style.display = 'none';
            modalElement.classList.remove('show');
            document.body.classList.remove('modal-open');
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.remove();
            }
            console.log('Loading modal hidden via fallback');
        }
    }
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    // Insert at the top of the container
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Utility functions
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Export functions for global access
window.showSection = showSection;
window.logout = logout;
window.showCreateCollaboration = showCreateCollaboration;
window.viewCollaboration = viewCollaboration;

// Collaboration data for demo
const demoCollaborations = {
    'eye-color-study': {
        title: 'Multi-Center Eye Color Study',
        description: 'Collaborative study on genetic determinants of eye color across different populations. This study aims to identify genetic variants associated with eye color phenotypes using genome-wide association studies.',
        participants: [
            { name: 'Dr. Sarah Johnson', email: 'researcher@genome.com', role: 'Principal Investigator' },
            { name: 'Demo User', email: 'demo@genome.com', role: 'Data Analyst' }
        ],
        datasets: [
            { name: 'Eye_Color_Study_Chr15.csv', samples: 1500, snps: 3000, phenotype: 'Eye Color' }
        ],
        analyses: [
            { name: 'Eye Color GWAS Analysis', type: 'GWAS', significant_snps: 15, top_hit: 'rs12913832' }
        ],
        status: 'Active',
        created_date: '2024-07-30',
        research_type: 'GWAS Study',
        progress: 75
    },
    'height-genetics': {
        title: 'Height Genetics Consortium',
        description: 'International collaboration studying height genetics in diverse populations. This consortium brings together researchers from multiple institutions to study the genetic basis of height variation.',
        participants: [
            { name: 'Admin User', email: 'admin@genome.com', role: 'Project Coordinator' },
            { name: 'Demo User', email: 'demo@genome.com', role: 'Statistical Analyst' }
        ],
        datasets: [
            { name: 'Height_Study_Chr2.csv', samples: 2000, snps: 5000, phenotype: 'Height' }
        ],
        analyses: [
            { name: 'Height GWAS Analysis', type: 'GWAS', significant_snps: 23, top_hit: 'rs1042725' }
        ],
        status: 'Active',
        created_date: '2024-07-30',
        research_type: 'GWAS Study',
        progress: 60
    },
    'diabetes-genetics': {
        title: 'Diabetes Genetics Research',
        description: 'Study of genetic risk factors for Type 2 diabetes. This research focuses on identifying genetic variants that contribute to diabetes risk and understanding their biological mechanisms.',
        participants: [
            { name: 'Dr. Sarah Johnson', email: 'researcher@genome.com', role: 'Lead Researcher' },
            { name: 'Demo User', email: 'demo@genome.com', role: 'Data Scientist' },
            { name: 'Admin User', email: 'admin@genome.com', role: 'Project Manager' }
        ],
        datasets: [
            { name: 'Diabetes_Study_Chr11.csv', samples: 1200, snps: 2500, phenotype: 'Type 2 Diabetes' }
        ],
        analyses: [
            { name: 'Diabetes GWAS Analysis', type: 'GWAS', significant_snps: 8, top_hit: 'rs7903146' }
        ],
        status: 'Active',
        created_date: '2024-07-30',
        research_type: 'GWAS Study',
        progress: 85
    }
};

function showCollaborationDetails(collaborationId) {
    console.log('Showing collaboration details for:', collaborationId);

    let collaboration = null;

    // Check if it's a demo collaboration
    if (demoCollaborations[collaborationId]) {
        collaboration = demoCollaborations[collaborationId];
    } else if (collaborationId.startsWith('user-collab-')) {
        // It's a user-created collaboration
        const collabId = collaborationId.replace('user-collab-', '');
        const userCollab = userCollaborations.find(uc => uc.id == collabId);
        if (userCollab) {
            collaboration = userCollab.data;
        }
    }

    if (!collaboration) {
        console.error('Collaboration not found:', collaborationId);
        alert('Collaboration details not available');
        return;
    }

    const content = document.getElementById('collaboration-details-content');

    content.innerHTML = `
        <div class="row">
            <div class="col-md-8">
                <h4>${collaboration.title}</h4>
                <p class="text-muted">${collaboration.description}</p>
                
                <div class="row mb-3">
                    <div class="col-md-6">
                        <strong>Status:</strong> <span class="badge bg-success">${collaboration.status}</span>
                    </div>
                    <div class="col-md-6">
                        <strong>Research Type:</strong> ${collaboration.research_type}
                    </div>
                </div>
                
                <div class="row mb-3">
                    <div class="col-md-6">
                        <strong>Created:</strong> ${collaboration.created_date}
                    </div>
                    <div class="col-md-6">
                        <strong>Progress:</strong> 
                        <div class="progress" style="height: 20px;">
                            <div class="progress-bar" role="progressbar" style="width: ${collaboration.progress}%" 
                                 aria-valuenow="${collaboration.progress}" aria-valuemin="0" aria-valuemax="100">
                                ${collaboration.progress}%
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card">
                    <div class="card-header">
                        <h6><i class="fas fa-chart-pie me-2"></i>Quick Stats</h6>
                    </div>
                    <div class="card-body">
                        <div class="row text-center">
                            <div class="col-6">
                                <h5 class="text-primary">${collaboration.participants.length}</h5>
                                <small class="text-muted">Participants</small>
                            </div>
                            <div class="col-6">
                                <h5 class="text-success">${collaboration.datasets.length}</h5>
                                <small class="text-muted">Datasets</small>
                            </div>
                        </div>
                        <div class="row text-center mt-2">
                            <div class="col-6">
                                <h5 class="text-info">${collaboration.analyses.length}</h5>
                                <small class="text-muted">Analyses</small>
                            </div>
                            <div class="col-6">
                                <h5 class="text-warning">${collaboration.progress}%</h5>
                                <small class="text-muted">Complete</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <hr>
        
        <div class="row">
            <div class="col-md-6">
                <h5><i class="fas fa-users me-2"></i>Participants</h5>
                <div class="list-group">
                    ${collaboration.participants.map(participant => `
                        <div class="list-group-item">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>${participant.name}</strong><br>
                                    <small class="text-muted">${participant.email}</small>
                                </div>
                                <span class="badge bg-primary">${participant.role}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="col-md-6">
                <h5><i class="fas fa-database me-2"></i>Datasets</h5>
                <div class="list-group">
                    ${collaboration.datasets.length > 0 ? collaboration.datasets.map(dataset => `
                        <div class="list-group-item">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>${dataset.name}</strong><br>
                                    <small class="text-muted">${dataset.samples} samples, ${dataset.snps} SNPs</small>
                                </div>
                                <span class="badge bg-info">${dataset.phenotype}</span>
                            </div>
                        </div>
                    `).join('') : `
                        <div class="list-group-item">
                            <div class="text-center text-muted">
                                <i class="fas fa-database fa-2x mb-2"></i>
                                <p>No datasets uploaded yet</p>
                                <button class="btn btn-sm btn-outline-primary">Upload Dataset</button>
                            </div>
                        </div>
                    `}
                </div>
            </div>
        </div>
        
        <hr>
        
        <div class="row">
            <div class="col-12">
                <h5><i class="fas fa-chart-bar me-2"></i>Analyses</h5>
                <div class="list-group">
                    ${collaboration.analyses.length > 0 ? collaboration.analyses.map(analysis => `
                        <div class="list-group-item">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>${analysis.name}</strong><br>
                                    <small class="text-muted">${analysis.significant_snps} significant SNPs</small>
                                </div>
                                <div>
                                    <span class="badge bg-success">${analysis.type}</span>
                                    <span class="badge bg-warning">Top: ${analysis.top_hit}</span>
                                </div>
                            </div>
                        </div>
                    `).join('') : `
                        <div class="list-group-item">
                            <div class="text-center text-muted">
                                <i class="fas fa-chart-bar fa-2x mb-2"></i>
                                <p>No analyses completed yet</p>
                                <button class="btn btn-sm btn-outline-primary">Start Analysis</button>
                            </div>
                        </div>
                    `}
                </div>
            </div>
        </div>
    `;
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('collaborationDetailsModal'));
    modal.show();
}

function showCreateCollaboration() {
    console.log('Showing create collaboration modal');
    const modal = new bootstrap.Modal(document.getElementById('createCollaborationModal'));
    modal.show();
}

function createCollaboration() {
    console.log('Creating new collaboration');
    
    const title = document.getElementById('collaborationTitle').value;
    const description = document.getElementById('collaborationDescription').value;
    const type = document.getElementById('collaborationType').value;
    
    if (!title || !description) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Show loading
    showLoading();
    
    // Simulate API call
    setTimeout(() => {
        hideLoading();
        
        // Create collaboration object
        const newCollaboration = {
            id: Date.now(), // Use timestamp as ID
            title: title,
            description: description,
            research_type: type,
            created_at: new Date().toISOString()
        };
        
        // Add to user collaborations
        addUserCollaboration(newCollaboration);
        
        // Show success message
        alert(`Collaboration "${title}" created successfully!`);
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('createCollaborationModal'));
        modal.hide();
        
        // Clear form
        document.getElementById('createCollaborationForm').reset();
        
        // Refresh collaborations display
        loadCollaborations();
        
        console.log('Collaboration created:', newCollaboration);
        
    }, 1500);
}

function editCollaboration() {
    console.log('Editing collaboration');
    alert('Edit functionality will be implemented in the next version');
}

// Helper functions
function isAuthenticated() {
    return localStorage.getItem('token') !== null;
}

function getCurrentUserId() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id || 1; // Default to user ID 1 for demo
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
}

// Make functions globally available
window.showCollaborationDetails = showCollaborationDetails;
window.showCreateCollaboration = showCreateCollaboration;
window.createCollaboration = createCollaboration;
window.editCollaboration = editCollaboration;

// Analysis results data
const analysisResults = {
    'eye-color-gwas': {
        title: 'Eye Color GWAS Analysis',
        description: 'Genome-wide association study for eye color phenotype on chromosome 15',
        summary: {
            significant_snps: 15,
            total_snps: 3000,
            samples: 1500,
            chromosome: 'Chr15',
            phenotype: 'Eye Color'
        },
        top_hits: [
            { snp: 'rs12913832', p_value: '1.2e-45', effect_size: 0.89, chromosome: '15', position: 28365618 },
            { snp: 'rs16891982', p_value: '2.1e-32', effect_size: 0.67, chromosome: '15', position: 28365619 },
            { snp: 'rs1393350', p_value: '5.4e-28', effect_size: 0.54, chromosome: '15', position: 28365620 },
            { snp: 'rs12203592', p_value: '8.9e-25', effect_size: 0.43, chromosome: '15', position: 28365621 },
            { snp: 'rs1800407', p_value: '1.2e-22', effect_size: 0.38, chromosome: '15', position: 28365622 }
        ],
        qc_metrics: {
            call_rate: 99.2,
            hwe_p_value: 0.45,
            maf_threshold: 0.01,
            missing_rate: 0.8
        },
        manhattan_data: [
            { chromosome: 15, position: 28365618, p_value: 1.2e-45, snp: 'rs12913832' },
            { chromosome: 15, position: 28365619, p_value: 2.1e-32, snp: 'rs16891982' },
            { chromosome: 15, position: 28365620, p_value: 5.4e-28, snp: 'rs1393350' },
            { chromosome: 15, position: 28365621, p_value: 8.9e-25, snp: 'rs12203592' },
            { chromosome: 15, position: 28365622, p_value: 1.2e-22, snp: 'rs1800407' }
        ]
    },
    'height-gwas': {
        title: 'Height GWAS Analysis',
        description: 'Genome-wide association study for height phenotype on chromosome 2',
        summary: {
            significant_snps: 23,
            total_snps: 5000,
            samples: 2000,
            chromosome: 'Chr2',
            phenotype: 'Height'
        },
        top_hits: [
            { snp: 'rs1042725', p_value: '8.9e-38', effect_size: 0.12, chromosome: '2', position: 123456789 },
            { snp: 'rs11191560', p_value: '2.3e-35', effect_size: 0.09, chromosome: '2', position: 123456790 },
            { snp: 'rs12149832', p_value: '4.7e-32', effect_size: 0.08, chromosome: '2', position: 123456791 },
            { snp: 'rs143384', p_value: '6.1e-29', effect_size: 0.07, chromosome: '2', position: 123456792 },
            { snp: 'rs16891982', p_value: '8.9e-26', effect_size: 0.06, chromosome: '2', position: 123456793 }
        ],
        qc_metrics: {
            call_rate: 98.7,
            hwe_p_value: 0.32,
            maf_threshold: 0.01,
            missing_rate: 1.3
        },
        manhattan_data: [
            { chromosome: 2, position: 123456789, p_value: 8.9e-38, snp: 'rs1042725' },
            { chromosome: 2, position: 123456790, p_value: 2.3e-35, snp: 'rs11191560' },
            { chromosome: 2, position: 123456791, p_value: 4.7e-32, snp: 'rs12149832' },
            { chromosome: 2, position: 123456792, p_value: 6.1e-29, snp: 'rs143384' },
            { chromosome: 2, position: 123456793, p_value: 8.9e-26, snp: 'rs16891982' }
        ]
    },
    'diabetes-gwas': {
        title: 'Diabetes GWAS Analysis',
        description: 'Genome-wide association study for Type 2 diabetes on chromosome 11',
        summary: {
            significant_snps: 8,
            total_snps: 2500,
            samples: 1200,
            chromosome: 'Chr11',
            phenotype: 'Type 2 Diabetes'
        },
        top_hits: [
            { snp: 'rs7903146', p_value: '2.3e-42', effect_size: 0.34, chromosome: '11', position: 987654321 },
            { snp: 'rs12255372', p_value: '5.6e-38', effect_size: 0.28, chromosome: '11', position: 987654322 },
            { snp: 'rs7901695', p_value: '8.9e-35', effect_size: 0.25, chromosome: '11', position: 987654323 },
            { snp: 'rs4506565', p_value: '1.2e-32', effect_size: 0.22, chromosome: '11', position: 987654324 },
            { snp: 'rs7578597', p_value: '3.4e-29', effect_size: 0.19, chromosome: '11', position: 987654325 }
        ],
        qc_metrics: {
            call_rate: 97.8,
            hwe_p_value: 0.67,
            maf_threshold: 0.01,
            missing_rate: 2.2
        },
        manhattan_data: [
            { chromosome: 11, position: 987654321, p_value: 2.3e-42, snp: 'rs7903146' },
            { chromosome: 11, position: 987654322, p_value: 5.6e-38, snp: 'rs12255372' },
            { chromosome: 11, position: 987654323, p_value: 8.9e-35, snp: 'rs7901695' },
            { chromosome: 11, position: 987654324, p_value: 1.2e-32, snp: 'rs4506565' },
            { chromosome: 11, position: 987654325, p_value: 3.4e-29, snp: 'rs7578597' }
        ]
    }
};

function showAnalysisResults(analysisId) {
    console.log('Showing analysis results for:', analysisId);
    
    const analysis = analysisResults[analysisId];
    if (!analysis) {
        console.error('Analysis not found:', analysisId);
        alert('Analysis results not available');
        return;
    }
    
    const content = document.getElementById('analysis-results-content');
    
    content.innerHTML = `
        <div class="row">
            <div class="col-12">
                <h4 class="text-primary mb-3">${analysis.title}</h4>
                <p class="text-muted mb-4">${analysis.description}</p>
            </div>
        </div>
        
        <!-- Summary Statistics -->
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="card text-center">
                    <div class="card-body">
                        <h5 class="text-primary">${analysis.summary.significant_snps}</h5>
                        <small class="text-muted">Significant SNPs</small>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-center">
                    <div class="card-body">
                        <h5 class="text-success">${analysis.summary.samples.toLocaleString()}</h5>
                        <small class="text-muted">Samples</small>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-center">
                    <div class="card-body">
                        <h5 class="text-info">${analysis.summary.total_snps.toLocaleString()}</h5>
                        <small class="text-muted">Total SNPs</small>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-center">
                    <div class="card-body">
                        <h5 class="text-warning">${analysis.summary.chromosome}</h5>
                        <small class="text-muted">Chromosome</small>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Top Hits Table -->
        <div class="row mb-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h6><i class="fas fa-star me-2"></i>Top Significant SNPs</h6>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>SNP ID</th>
                                        <th>Chromosome</th>
                                        <th>Position</th>
                                        <th>P-Value</th>
                                        <th>Effect Size</th>
                                        <th>Significance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${analysis.top_hits.map((hit, index) => `
                                        <tr class="${index === 0 ? 'table-warning' : ''}">
                                            <td><strong>${hit.snp}</strong></td>
                                            <td>${hit.chromosome}</td>
                                            <td>${hit.position.toLocaleString()}</td>
                                            <td><code>${hit.p_value}</code></td>
                                            <td>${hit.effect_size}</td>
                                            <td>
                                                <span class="badge bg-${index === 0 ? 'danger' : index < 3 ? 'warning' : 'success'}">
                                                    ${index === 0 ? 'Top Hit' : index < 3 ? 'High' : 'Significant'}
                                                </span>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Quality Control Metrics -->
        <div class="row mb-4">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h6><i class="fas fa-check-circle me-2"></i>Quality Control Metrics</h6>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-6">
                                <strong>Call Rate:</strong><br>
                                <span class="text-success">${analysis.qc_metrics.call_rate}%</span>
                            </div>
                            <div class="col-6">
                                <strong>HWE P-Value:</strong><br>
                                <span class="text-info">${analysis.qc_metrics.hwe_p_value}</span>
                            </div>
                        </div>
                        <hr>
                        <div class="row">
                            <div class="col-6">
                                <strong>MAF Threshold:</strong><br>
                                <span class="text-warning">${analysis.qc_metrics.maf_threshold}</span>
                            </div>
                            <div class="col-6">
                                <strong>Missing Rate:</strong><br>
                                <span class="text-danger">${analysis.qc_metrics.missing_rate}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h6><i class="fas fa-chart-line me-2"></i>Manhattan Plot Data</h6>
                    </div>
                    <div class="card-body">
                        <div class="text-center">
                            <i class="fas fa-chart-bar fa-3x text-muted mb-3"></i>
                            <p class="text-muted">Manhattan plot visualization would be displayed here</p>
                            <small class="text-muted">Showing ${analysis.manhattan_data.length} significant SNPs across chromosome ${analysis.summary.chromosome}</small>
                        </div>
                        <div class="mt-3">
                            <div class="progress mb-2">
                                <div class="progress-bar bg-success" style="width: 100%"></div>
                            </div>
                            <small class="text-muted">Plot generation: Complete</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Analysis Details -->
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h6><i class="fas fa-info-circle me-2"></i>Analysis Details</h6>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <strong>Analysis Type:</strong> Genome-Wide Association Study (GWAS)<br>
                                <strong>Phenotype:</strong> ${analysis.summary.phenotype}<br>
                                <strong>Statistical Model:</strong> Linear Mixed Model<br>
                                <strong>Correction Method:</strong> Bonferroni Correction
                            </div>
                            <div class="col-md-6">
                                <strong>Significance Threshold:</strong> p < 5e-8<br>
                                <strong>Genome Build:</strong> GRCh38/hg38<br>
                                <strong>Software Used:</strong> PLINK v2.0<br>
                                <strong>Analysis Date:</strong> ${new Date().toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('analysisResultsModal'));
    modal.show();
}

// Make function globally available
window.showAnalysisResults = showAnalysisResults;