import {
    generateQuestionImage,
    getCachedQuestionImage,
    clearCachedQuestionImage
} from './ai-image-generator.js';

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}

async function render(question, container) {
    container.innerHTML = '<div class="jft-image-loading"><i class="fa-solid fa-spinner fa-spin"></i> Menyiapkan ilustrasi soal...</div>';

    const localImage = question.image || question.imageUrl;
    if (localImage) {
        showImage(question, container, localImage);
        return;
    }

    const cached = getCachedQuestionImage(question.id);
    if (cached?.url) {
        showImage(question, container, cached.url);
        return;
    }

    try {
        const generated = await generateQuestionImage(question);
        showImage(question, container, generated.url);
    } catch (error) {
        showError(question, container, error);
    }
}

function showImage(question, container, url) {
    const safeUrl = escapeHtml(url);
    const safeAlt = escapeHtml(question.imageAlt || question.text || 'Ilustrasi soal');
    container.innerHTML = `
        <div class="jft-question-image-wrap">
            <img class="jft-question-image" src="${safeUrl}" alt="${safeAlt}" loading="eager">
        </div>
        <div class="jft-image-meta">Ilustrasi AI • Soal ${escapeHtml(question.id)}</div>
    `;
    const img = container.querySelector('img');
    if (img) {
        img.onerror = () => {
            clearCachedQuestionImage(question.id);
            showError(question, container, new Error('URL gambar sudah kedaluwarsa atau tidak dapat dimuat.'));
        };
    }
}

function showError(question, container, error) {
    container.innerHTML = `
        <div class="jft-image-action">
            <div><i class="fa-solid fa-image"></i> Ilustrasi soal belum dapat dimuat.</div>
            <div class="text-xs font-medium mt-1">${escapeHtml(error?.message || 'Terjadi kesalahan.')}</div>
            <button type="button" id="jft-regenerate-image-${escapeHtml(question.id)}">Buat gambar lagi</button>
            <div class="jft-image-meta">Prompt tersimpan di data soal sehingga gambar dapat dibuat ulang kapan saja.</div>
        </div>
    `;
    const btn = container.querySelector(`#jft-regenerate-image-${CSS.escape(String(question.id))}`);
    if (btn) btn.onclick = () => render(question, container);
}

window.JFTImageQuestion = { render, generateQuestionImage };
