function showNotice(type) {
    const modal = document.getElementById('notice-modal');
    const textElement = document.getElementById('notice-text');
    
    let message = "당신의 시선이 머물 곳을 준비하고 있어요.";
    
    if (type === 'art') {
        message = "붓끝에 머문 이야기를 정리하고 있습니다.";
    } else if (type === 'photo') {
        message = "필름에 빛을 담고 있습니다.";
    }
    
    textElement.textContent = message;
    
    modal.hidden = false;
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeNotice() {
    const modal = document.getElementById('notice-modal');
    modal.hidden = true;
    
    // Restore body scroll
    document.body.style.overflow = '';
}

// Close on outside click
document.getElementById('notice-modal').addEventListener('click', (e) => {
    if (e.target.id === 'notice-modal') {
        closeNotice();
    }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !document.getElementById('notice-modal').hidden) {
        closeNotice();
    }
});
