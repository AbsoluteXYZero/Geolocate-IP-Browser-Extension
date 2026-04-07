chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'ip_changed') {
        showBanner(message.from, message.to);
    }
});

function showBanner(fromIP, toIP) {
    const existing = document.getElementById('ipgz-banner');
    if (existing) existing.remove();

    const banner = document.createElement('div');
    banner.id = 'ipgz-banner';
    banner.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #1a1a1a;
        color: #fff;
        padding: 12px 16px;
        border-radius: 8px;
        z-index: 2147483647;
        font-family: sans-serif;
        font-size: 13px;
        line-height: 1.5;
        box-shadow: 0 4px 16px rgba(0,0,0,0.4);
        opacity: 1;
        transition: opacity 0.4s ease;
        min-width: 220px;
    `;
    banner.innerHTML = `
        <div style="font-weight:600;margin-bottom:4px;">IP Address Changed</div>
        <div style="color:#aaa;">From: <span style="color:#fff;">${fromIP}</span></div>
        <div style="color:#aaa;">To: &nbsp;&nbsp;&nbsp;  <span style="color:#fff;">${toIP}</span></div>
    `;
    document.body.appendChild(banner);

    setTimeout(() => {
        banner.style.opacity = '0';
        setTimeout(() => banner.remove(), 400);
    }, 5000);
}
