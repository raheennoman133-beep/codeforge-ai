class AstraAI {
    constructor() {
        this.currentChatId = 'welcome';
        this.messages = {};
        this.freeMessageCount = 50;
        this.isPro = false;
        this.isTyping = false;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadChats();
        this.updateTheme();
        this.simulateWelcomeMessage();
    }

    bindEvents() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // User menu
        document.getElementById('userBtn').addEventListener('click', () => {
            document.getElementById('userDropdown').classList.toggle('show');
        });

        // Sidebar toggle (mobile)
        document.getElementById('closeSidebar').addEventListener('click', () => {
            this.toggleSidebar();
        });

        // Message input
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');
        
        messageInput.addEventListener('input', (e) => {
            this.toggleSendButton();
            this.autoResize(e.target);
        });

        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        sendBtn.addEventListener('click', () => {
            this.sendMessage();
        });

        // Modal events
        document.getElementById('closeUpgrade').addEventListener('click', () => {
            this.closeModal();
        });

        document.querySelector('.pro-badge').addEventListener('click', () => {
            this.openUpgradeModal();
        });

        // Voice button - ENHANCED VERSION
        document.getElementById('voiceBtn').addEventListener('click', () => {
            this.startVoiceInput();
        });

        // Close modal on outside click
        document.getElementById('upgradeModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeModal();
            }
        });

        // Chat history clicks
        document.getElementById('chatHistory').addEventListener('click', (e) => {
            const historyItem = e.target.closest('.history-item');
            if (historyItem) {
                this.switchChat(historyItem.dataset.chat);
            }
        });

        // Hide dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-menu')) {
                document.getElementById('userDropdown').classList.remove('show');
            }
        });
    }

    // 🔥 ENHANCED VOICE INPUT - SINGLE METHOD
    startVoiceInput() {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new webkitSpeechRecognition();
            const voiceBtn = document.getElementById('voiceBtn');
            
            // Visual feedback - Button changes to STOP
            const originalIcon = voiceBtn.innerHTML;
            voiceBtn.innerHTML = '<i class="fas fa-stop" style="color: white;"></i>';
            voiceBtn.style.background = '#ef4444';
            voiceBtn.style.color = 'white';
            voiceBtn.disabled = true;
            
            recognition.continuous = false;
            recognition.interimResults = true;  // Real-time typing effect
            recognition.lang = 'en-US';
            recognition.maxAlternatives = 1;

            recognition.onstart = () => {
                console.log('🎤 Listening... Speak now!');
            };

            recognition.onresult = (event) => {
                let finalTranscript = '';
                let interimTranscript = '';
                
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript + ' ';
                    } else {
                        interimTranscript += transcript;
                    }
                }
                
                const messageInput = document.getElementById('messageInput');
                messageInput.value = finalTranscript || interimTranscript;
                this.autoResize(messageInput);
                this.toggleSendButton();
            };

            recognition.onend = () => {
                // Reset button appearance
                voiceBtn.innerHTML = originalIcon;
                voiceBtn.style.background = '';
                voiceBtn.style.color = '';
                voiceBtn.disabled = false;
                console.log('🎤 Voice input finished');
            };

            recognition.onerror = (event) => {
                console.error('Voice error:', event.error);
                voiceBtn.innerHTML = originalIcon;
                voiceBtn.style.background = '';
                voiceBtn.style.color = '';
                voiceBtn.disabled = false;
                
                const errorMessages = {
                    'not-allowed': '🎤 Microphone access denied. Please enable microphone permissions.',
                    'no-speech': '🤐 No speech detected. Speak louder or try again.',
                    'audio-capture': '🔇 Microphone not working. Check your hardware.',
                    'network': '🌐 Poor internet connection. Try again.'
                };
                
                alert(errorMessages[event.error] || 'Voice recognition failed. Please try typing.');
            };

            recognition.start();
        } else {
            alert('🎤 Voice input requires:\n• Chrome/Edge (Desktop/Mobile)\n• Safari 16.4+ (iOS)\n\nUse typing instead!');
        }
    }

    // ... [ALL OTHER METHODS STAY THE SAME - JUST ADD THESE MISSING ONES] ...

    toggleTheme() {
        const body = document.body;
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.innerHTML = newTheme === 'dark' ? 
            '<i class="fas fa-sun"></i>' : 
            '<i class="fas fa-moon"></i>';
    }

    updateTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.body.setAttribute('data-theme', savedTheme);
        
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.innerHTML = savedTheme === 'dark' ? 
            '<i class="fas fa-sun"></i>' : 
            '<i class="fas fa-moon"></i>';
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('collapsed');
        sidebar.classList.toggle('mobile-open');
    }

    toggleSendButton() {
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');
        sendBtn.classList.toggle('enabled', messageInput.value.trim().length > 0);
    }

    autoResize(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }

    // [Include ALL other methods from your original code - sendMessage, addMessage, etc.]
    // Just make sure there's ONLY ONE startVoiceInput method!
}

// Initialize
const astra = new AstraAI();

// Global functions (keep these)
function upgradePlan() { astra.upgradePlan(); }
function logout() { 
    if (confirm('Logout?')) { localStorage.clear(); location.reload(); }
}
function startQuickChat(message) { astra.startQuickChat(message); }
function deleteChat(button) { astra.deleteChat(button); }
function clearAllChats() { astra.clearAllChats(); }

// New chat button
document.addEventListener('DOMContentLoaded', () => {
    const sidebarHeader = document.querySelector('.sidebar-header h3');
    sidebarHeader.innerHTML = '<i class="fas fa-plus"></i> New Chat';
    sidebarHeader.style.cursor = 'pointer';
    sidebarHeader.style.userSelect = 'none';
    sidebarHeader.addEventListener('click', () => astra.createNewChat());
});