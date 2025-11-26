const artMessages = [
    "아직 캔버스에 꿈을 채우는 중이에요.",
    "붓끝에 머문 이야기를 정리하고 있습니다.",
    "색채의 온도를 조율하는 중입니다.",
    "당신에게 보여줄 그림을 고르고 있어요."
];

const photoMessages = [
    "필름에 빛을 담고 있습니다. 조금만 기다려주세요.",
    "순간의 조각들을 모으고 있어요.",
    "아직 현상되지 않은 기억들이 있습니다.",
    "프레임 너머의 이야기를 준비 중입니다."
];

const commonMessages = [
    "당신의 시선이 머물 곳을 준비하고 있어요.",
    "아직은 비밀스러운 공간입니다.",
    "더 깊은 이야기를 준비하고 있습니다.",
    "조금 더 무르익은 후에 보여드릴게요."
];

function showNotice(type) {
    const modal = document.getElementById('notice-modal');
    const textElement = document.getElementById('notice-text');
    
    let messages = commonMessages;
    if (type === 'art') {
        messages = [...artMessages, ...commonMessages];
    } else if (type === 'photo') {
        messages = [...photoMessages, ...commonMessages];
    }
    
    // Pick a random message
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    textElement.textContent = randomMessage;
    
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
