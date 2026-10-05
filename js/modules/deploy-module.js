function copyText(text) {
    return navigator.clipboard?.writeText(text).then(() => true).catch(() => false);
}

function currentDeploymentTarget() {
    const host = location.hostname || '';
    if (host.includes('pages.dev')) return 'Cloudflare Pages';
    if (host.includes('github.io')) return 'GitHub Pages';
    if (host === 'localhost' || host === '127.0.0.1') return 'Local development';
    return host || 'Unknown';
}

function injectDeployCard() {
    const adminRoot = document.getElementById('screen-admin');
    if (!adminRoot || document.getElementById('jft-deploy-module')) return;
    const card = document.createElement('div');
    card.id = 'jft-deploy-module';
    card.className = 'deploy-module-card mb-5';
    card.innerHTML = `
      <div class="flex items-center justify-between gap-3 mb-2">
        <div>
          <div class="text-[10px] uppercase tracking-wider text-slate-500 font-black">Deployment Module</div>
          <div class="font-black text-lg">Deploy Center</div>
        </div>
        <span class="px-2 py-1 rounded-lg border-[2px] border-[#181818] bg-[#43c9bd] text-[10px] font-black">STATIC READY</span>
      </div>
      <div class="text-xs text-slate-600 mb-3">Target terdeteksi: <b>${currentDeploymentTarget()}</b></div>
      <div class="flex flex-wrap gap-2">
        <button class="deploy-module-btn bg-[#ffe45c]" id="jft-copy-cf">Copy Cloudflare Deploy</button>
        <button class="deploy-module-btn bg-[#62bddb]" id="jft-copy-gh">Copy GitHub Push</button>
      </div>`;
    const first = adminRoot.querySelector('div');
    if (first) first.prepend(card); else adminRoot.prepend(card);
    document.getElementById('jft-copy-cf').onclick = async () => {
        const ok = await copyText('npx wrangler pages deploy . --project-name jft-basic-practice');
        if (typeof showToast === 'function') showToast(ok ? 'Disalin' : 'Gagal', ok ? 'Perintah Cloudflare disalin.' : 'Clipboard tidak tersedia.', !ok);
    };
    document.getElementById('jft-copy-gh').onclick = async () => {
        const ok = await copyText('git add . && git commit -m "update JFT-Basic" && git push origin main');
        if (typeof showToast === 'function') showToast(ok ? 'Disalin' : 'Gagal', ok ? 'Perintah GitHub disalin.' : 'Clipboard tidak tersedia.', !ok);
    };
}

window.JFTDeploy = { injectDeployCard, currentDeploymentTarget };
document.addEventListener('DOMContentLoaded', () => setTimeout(injectDeployCard, 700));
