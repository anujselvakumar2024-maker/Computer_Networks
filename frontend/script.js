// Modern JavaScript for Protocol Emulator
class ProtocolEmulator {
    constructor() {
        this.protocolChart = null;
        this.trafficChart = null;
        this.updateInterval = null;
        this.initializeApp();
    }

    initializeApp() {
        this.setupEventListeners();
        this.initializeCharts();
        this.startDataUpdates();
        this.animateElements();
    }

    setupEventListeners() {
        // Add click animations to buttons
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', this.addRippleEffect.bind(this));
        });
    }

    addRippleEffect(e) {
        const button = e.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    initializeCharts() {
        this.createProtocolChart();
        this.createTrafficChart();
    }

    createProtocolChart() {
        const ctx = document.getElementById('protocolChart');
        if (!ctx) return;

        this.protocolChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['HTTP', 'FTP', 'SMTP', 'SNMP', 'DNS', 'Telnet'],
                datasets: [{
                    data: [0, 0, 0, 0, 0, 0],
                    backgroundColor: [
                        '#00ff88',
                        '#ff6b6b', 
                        '#00c4cc',
                        '#ffd93d',
                        '#ff9f43',
                        '#a55eea'
                    ],
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#ffffff',
                            usePointStyle: true,
                            padding: 20
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: true
                }
            }
        });
    }

    createTrafficChart() {
        const ctx = document.getElementById('trafficChart');
        if (!ctx) return;

        this.trafficChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({length: 20}, (_, i) => i),
                datasets: [{
                    label: 'Network Traffic (MB/s)',
                    data: Array.from({length: 20}, () => Math.floor(Math.random() * 90) + 10),
                    borderColor: '#00c4cc',
                    backgroundColor: 'rgba(0, 196, 204, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#00c4cc',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.6)'
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.6)'
                        },
                        min: 0,
                        max: 100
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    startDataUpdates() {
        this.updateStats();
        this.updateInterval = setInterval(() => {
            this.updateStats();
            this.updateCharts();
        }, 3000);
    }

    async updateStats() {
        try {
            const response = await fetch('/api/stats');
            const stats = await response.json();

            document.getElementById('active-connections').textContent = stats.activeConnections || 0;
            document.getElementById('running-protocols').textContent = stats.runningProtocols || 0;
            document.getElementById('data-transferred').textContent = stats.dataTransferred || '0.0 MB';
            document.getElementById('system-uptime').textContent = stats.systemUptime || '00:00:00';

            // Update protocol status indicators
            const protocolResponse = await fetch('/api/protocols');
            const protocols = await protocolResponse.json();

            Object.keys(protocols).forEach(protocol => {
                const status = protocols[protocol].status;
                const statusElement = document.getElementById(`${protocol}-status`);
                const badgeElement = document.getElementById(`${protocol}-badge`);
                const serverStatusElement = document.getElementById(`${protocol}-server-status`);
                const nodeElement = document.getElementById(`${protocol.toLowerCase()}-node`);

                if (statusElement) {
                    statusElement.className = `status-indicator ${status}`;
                    statusElement.textContent = `● Server ${status === 'active' ? 'Online' : 'Offline'}`;
                }

                if (badgeElement) {
                    badgeElement.className = `status-badge ${status}`;
                    badgeElement.textContent = status.toUpperCase();
                }

                if (serverStatusElement) {
                    serverStatusElement.className = `server-status ${status}`;
                    serverStatusElement.textContent = `● Server ${status === 'active' ? 'Online' : 'Offline'}`;
                }

                if (nodeElement) {
                    if (status === 'active') {
                        nodeElement.classList.add('active');
                    } else {
                        nodeElement.classList.remove('active');
                    }
                }
            });

        } catch (error) {
            console.error('Error updating stats:', error);
        }
    }

    updateCharts() {
        // Update traffic chart with new data
        if (this.trafficChart) {
            const newData = Array.from({length: 20}, () => Math.floor(Math.random() * 90) + 10);
            this.trafficChart.data.datasets[0].data = newData;
            this.trafficChart.update('active');
        }

        // Update protocol usage chart
        if (this.protocolChart) {
            // Simulate protocol usage data
            const protocolData = [
                Math.floor(Math.random() * 50) + 10, // HTTP
                Math.floor(Math.random() * 30) + 5,  // FTP
                Math.floor(Math.random() * 25) + 5,  // SMTP
                Math.floor(Math.random() * 20) + 5,  // SNMP
                Math.floor(Math.random() * 35) + 10, // DNS
                Math.floor(Math.random() * 15) + 2   // Telnet
            ];
            this.protocolChart.data.datasets[0].data = protocolData;
            this.protocolChart.update('active');
        }
    }

    animateElements() {
        // Add stagger animation to protocol cards
        const protocolCards = document.querySelectorAll('.protocol-card');
        protocolCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.style.animation = 'fadeInUp 0.6s ease forwards';
        });

        // Add animation to stat cards
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.2}s`;
            card.style.animation = 'slideInUp 0.8s ease forwards';
        });
    }
}

// Tab Management
function showTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName).classList.add('active');

    // Activate selected nav tab
    document.querySelector(`[onclick="showTab('${tabName}')"]`).classList.add('active');
}

// Protocol Tab Management
function showProtocol(protocolName) {
    // Hide all protocol contents
    document.querySelectorAll('.protocol-content').forEach(content => {
        content.classList.remove('active');
    });

    // Remove active class from all protocol tabs
    document.querySelectorAll('.protocol-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Show selected protocol
    document.getElementById(`${protocolName}-protocol`).classList.add('active');

    // Activate selected protocol tab
    document.querySelector(`[onclick="showProtocol('${protocolName}')"]`).classList.add('active');
}

// Protocol Control Functions
async function startProtocol(protocol) {
    try {
        const button = event.target;
        const originalText = button.textContent;

        // Show loading state
        button.innerHTML = '<span class="loading"></span> STARTING...';
        button.disabled = true;

        const response = await fetch(`/api/start/${protocol}`);
        const result = await response.json();

        if (result.status === 'success') {
            button.textContent = 'STOP SERVER';
            button.onclick = () => stopProtocol(protocol);
            button.style.background = 'linear-gradient(45deg, #ff6b6b, #ff5252)';

            // Show success message
            showMessage(`${protocol} server started successfully!`, 'success');

            // Update log
            updateLog(protocol, `${protocol} server started on port ${getProtocolPort(protocol)}`);
        } else {
            button.textContent = originalText;
            showMessage(`Failed to start ${protocol} server`, 'error');
        }

        button.disabled = false;

    } catch (error) {
        console.error('Error starting protocol:', error);
        showMessage(`Error starting ${protocol} server`, 'error');
        event.target.disabled = false;
        event.target.textContent = 'START SERVER';
    }
}

async function stopProtocol(protocol) {
    try {
        const button = event.target;
        const originalText = button.textContent;

        // Show loading state
        button.innerHTML = '<span class="loading"></span> STOPPING...';
        button.disabled = true;

        const response = await fetch(`/api/stop/${protocol}`);
        const result = await response.json();

        if (result.status === 'success') {
            button.textContent = 'START SERVER';
            button.onclick = () => startProtocol(protocol);
            button.style.background = 'linear-gradient(45deg, #00ff88, #00cc6a)';

            // Show success message
            showMessage(`${protocol} server stopped successfully!`, 'success');

            // Update log
            updateLog(protocol, `${protocol} server stopped`);
        } else {
            button.textContent = originalText;
            showMessage(`Failed to stop ${protocol} server`, 'error');
        }

        button.disabled = false;

    } catch (error) {
        console.error('Error stopping protocol:', error);
        showMessage(`Error stopping ${protocol} server`, 'error');
        event.target.disabled = false;
        event.target.textContent = 'STOP SERVER';
    }
}

// Client Interaction Functions
async function sendHTTPRequest() {
    const request = document.getElementById('http-request').value;
    const logElement = document.getElementById('HTTP-log');

    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] Sending request: ${request}\n`;
    logElement.textContent += logEntry;
    logElement.scrollTop = logElement.scrollHeight;

    // Simulate response
    setTimeout(() => {
        const responseEntry = `[${timestamp}] Response: 200 OK - Request processed successfully\n`;
        logElement.textContent += responseEntry;
        logElement.scrollTop = logElement.scrollHeight;
    }, 1000);
}

async function sendFTPCommand() {
    const command = document.getElementById('ftp-command').value;
    // Implement FTP command logic here
    console.log(`Sending FTP command: ${command}`);
}

// Utility Functions
function getProtocolPort(protocol) {
    const ports = {
        'HTTP': 8080,
        'FTP': 2121,
        'SMTP': 2525,
        'SNMP': 16100,
        'DNS': 53,
        'Telnet': 2323
    };
    return ports[protocol] || 0;
}

function showMessage(text, type) {
    // Remove existing messages
    document.querySelectorAll('.message').forEach(msg => msg.remove());

    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;

    // Insert after navbar
    const navbar = document.querySelector('.navbar');
    navbar.parentNode.insertBefore(message, navbar.nextSibling);

    // Auto remove after 3 seconds
    setTimeout(() => {
        message.style.opacity = '0';
        setTimeout(() => message.remove(), 300);
    }, 3000);
}

function updateLog(protocol, message) {
    const logElement = document.getElementById(`${protocol}-log`);
    if (logElement) {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = `[${timestamp}] ${message}\n`;
        logElement.textContent += logEntry;
        logElement.scrollTop = logElement.scrollHeight;
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProtocolEmulator();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Resume updates when tab becomes visible
        if (window.protocolEmulator && !window.protocolEmulator.updateInterval) {
            window.protocolEmulator.startDataUpdates();
        }
    }
});
