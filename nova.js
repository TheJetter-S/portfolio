/**
 * Nova the Robot - Interactive Assistant
 * Handles user engagement, CV download, and feedback.
 */
class NovaBot {
    constructor() {
        this.container = document.getElementById('nova-container');
        this.avatar = document.getElementById('novaAvatar');
        this.dialog = document.getElementById('novaDialog');
        this.textElement = document.getElementById('novaText');
        this.optionsElement = document.getElementById('novaOptions');
        this.closeBtn = document.getElementById('closeDialog');
        
        this.synth = window.speechSynthesis;
        this.hasInteracted = false;
        
        // Navigation History
        this.history = [];
        this.currentStep = null;

        this.init();
    }

    init() {
        // Event Listeners
        this.avatar.addEventListener('click', () => this.handleAvatarClick());
        this.closeBtn.addEventListener('click', () => this.hideDialog());

        // Initial Greeting Sequence (delayed) or just waiting for interaction
        // If we want it to pop up automatically:
        setTimeout(() => {
            if (!this.hasInteracted) {
                this.goToStep('intro');
            }
        }, 3000);
    }

    handleAvatarClick() {
        this.hasInteracted = true;
        this.playSound('chirp');
        this.avatar.classList.add('nova-bounce');
        setTimeout(() => this.avatar.classList.remove('nova-bounce'), 1000);
        
        // If dialog is closed, resume or start
        if (!this.dialog.classList.contains('active')) {
             if (this.currentStep) {
                 this.renderStep(this.currentStep);
             } else {
                 this.goToStep('intro');
             }
        }
    }

    // --- State Machine ---

    goToStep(stepName) {
        if (this.currentStep && this.currentStep !== stepName) {
            this.history.push(this.currentStep);
        }
        this.renderStep(stepName);
    }

    goBack() {
        if (this.history.length > 0) {
            const prev = this.history.pop();
            this.renderStep(prev, true);
        }
    }

    renderStep(stepName, isBack = false) {
        this.currentStep = stepName;
        
        // Clear any previous typing or timeouts if structure allows
        // (Simplified here)

        switch(stepName) {
            case 'intro':
                this.speak("Hi! I'm Nova, your virtual assistant.");
                this.showOptions([
                    { label: "Next", icon: "fas fa-arrow-right", action: () => this.goToStep('engagement') }
                ]);
                break;
            
            case 'engagement':
                this.speak("Have you touched me today? I'm quite interactive!");
                this.showOptions([
                    { label: "Yes, I have!", icon: "fas fa-check", action: () => this.goToStep('response_yes') },
                    { label: "Not yet", icon: "fas fa-times", action: () => this.goToStep('response_no') },
                    { label: "Back", icon: "fas fa-arrow-left", action: () => this.goBack() }
                ]);
                break;

            case 'response_yes':
                this.speak("Great! Since you're interested, you can download my CV and explore hiring opportunities.");
                this.showOptions([
                    { label: "Download CV", icon: "fas fa-download", action: () => this.downloadCV() },
                    { label: "Hire Me", icon: "fas fa-briefcase", action: () => this.utilsNavigate('#contact') },
                    { label: "Next", icon: "fas fa-arrow-right", action: () => this.goToStep('ask_skills') },
                    { label: "Back", icon: "fas fa-arrow-left", action: () => this.goBack() }
                ]);
                break;

            case 'response_no':
                this.speak("No worries! I'm always here if you change your mind. Let me know if you need assistance.");
                this.showOptions([
                    { label: "I need assistance", icon: "fas fa-question", action: () => this.goToStep('ask_skills') },
                    { label: "Just browsing", icon: "far fa-eye", action: () => this.hideDialog() },
                    { label: "Back", icon: "fas fa-arrow-left", action: () => this.goBack() }
                ]);
                break;

            case 'ask_skills':
                this.speak("Would you like to know more about my skills or how I can assist you?");
                this.showOptions([
                    { label: "Show Skills", icon: "fas fa-code", action: () => this.utilsNavigate('#skills') },
                    { label: "See Projects", icon: "fas fa-laptop-code", action: () => this.utilsNavigate('#projects') },
                    { label: "Give Feedback", icon: "fas fa-star", action: () => this.goToStep('feedback') },
                    { label: "Back", icon: "fas fa-arrow-left", action: () => this.goBack() }
                ]);
                break;
            
            case 'feedback':
                this.speak("How would you rate your interaction with me?");
                this.showOptions([
                    { label: "Awesome!", icon: "fas fa-smile-beam", action: () => this.handleFeedback("awesome") },
                    { label: "Good", icon: "fas fa-smile", action: () => this.handleFeedback("good") },
                    { label: "Needs Work", icon: "fas fa-meh", action: () => this.handleFeedback("poor") },
                    { label: "Back", icon: "fas fa-arrow-left", action: () => this.goBack() }
                ]);
                break;
        }
    }

    // --- Actions ---

    speak(text) {
        if (this.synth.speaking) {
            this.synth.cancel();
        }

        // Type text visually
        this.typeText(text);

        // Audio Speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = 1.2; 
        utterance.rate = 1.0;
        
        const voices = this.synth.getVoices();
        const preferredVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Microsoft Zira'));
        if (preferredVoice) utterance.voice = preferredVoice;

        this.synth.speak(utterance);
    }

    typeText(text) {
        this.textElement.innerHTML = '';
        this.dialog.classList.add('active');
        this.optionsElement.innerHTML = ''; 
        
        let i = 0;
        const speed = 25;
        
        const type = () => {
            if (i < text.length) {
                this.textElement.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        };
        type();
    }

    showOptions(options) {
        // Wait for typing to finish roughly (or just clear and show)
        setTimeout(() => {
            this.optionsElement.innerHTML = '';
            options.forEach(opt => {
                const btn = document.createElement('button');
                btn.className = 'nova-btn';
                if (opt.icon) {
                    btn.innerHTML = `<i class="${opt.icon}"></i> ${opt.label}`;
                } else {
                    btn.textContent = opt.label;
                }
                btn.onclick = opt.action;
                this.optionsElement.appendChild(btn);
            });
        }, 500); 
    }

    downloadCV() {
         const link = document.createElement('a');
        link.href = 'Santhosh_M_Resume.pdf'; 
        link.download = 'Santhosh_M_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.speak("Downloading the CV for you now.");
    }

    handleFeedback(rating) {
        if (rating === 'awesome' || rating === 'good') {
            this.speak("Thank you! I'm glad I could help.");
        } else {
            this.speak("Thanks for the feedback. I'll try to do better next time!");
        }
        setTimeout(() => this.hideDialog(), 3000);
    }

    // --- Utilities ---

    hideDialog() {
        this.dialog.classList.remove('active');
        this.synth.cancel();
    }

    utilsNavigate(selector) {
        const element = document.querySelector(selector);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 80,
                behavior: 'smooth'
            });
            this.speak(`Navigating to ${selector.replace('#', '')} section.`);
        }
    }

    playSound(type) {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === 'chirp') {
            osc.frequency.setValueAtTime(600, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        }
    }
}

// Initialize Nova
document.addEventListener('DOMContentLoaded', () => {
    if (!window.novaInstance) {
        window.novaInstance = new NovaBot();
    }
});
