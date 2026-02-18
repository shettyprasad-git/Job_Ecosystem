/* script.js */

// Interactions for the KodNest Premium Build System

function copyPrompt() {
    const promptText = document.querySelector('.prompt-box').innerText;
    navigator.clipboard.writeText(promptText).then(() => {
        // Simple visual feedback
        const btn = document.querySelector('button[onclick="copyPrompt()"]');
        const originalText = btn.innerText;
        btn.innerText = "Copied!";
        btn.style.backgroundColor = "#e8f5e9";
        btn.style.borderColor = "var(--color-success)";
        btn.style.color = "var(--color-success)";
        
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.backgroundColor = "";
            btn.style.borderColor = "";
            btn.style.color = "";
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

// Proof Footer Logic
const checkboxes = document.querySelectorAll('.proof-checkbox input');
const completeBtn = document.querySelector('.proof-footer .btn-primary');

// Initially disable complete button
if(completeBtn) {
    completeBtn.style.opacity = '0.5';
    completeBtn.style.pointerEvents = 'none';
}

function checkCompletion() {
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    if (completeBtn) {
        if (allChecked) {
            completeBtn.style.opacity = '1';
            completeBtn.style.pointerEvents = 'auto';
        } else {
            completeBtn.style.opacity = '0.5';
            completeBtn.style.pointerEvents = 'none';
        }
    }
}

checkboxes.forEach(cb => {
    cb.addEventListener('change', checkCompletion);
});
