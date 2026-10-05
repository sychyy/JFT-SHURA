const API_BASE = 'https://api.omegatech.app/api/ai/easemate-image';

function cacheKey(questionId) {
    return `jft_ai_question_image_${questionId}`;
}

function readCachedImage(questionId) {
    try {
        const raw = localStorage.getItem(cacheKey(questionId));
        if (!raw) return null;
        const data = JSON.parse(raw);
        if (!data || !data.url) return null;
        return data;
    } catch (_) {
        return null;
    }
}

function saveCachedImage(questionId, payload) {
    try { localStorage.setItem(cacheKey(questionId), JSON.stringify(payload)); } catch (_) {}
}

export async function generateQuestionImage(question, options = {}) {
    const prompt = String(question?.imagePrompt || '').trim();
    if (!prompt) throw new Error('Soal ini belum memiliki prompt gambar.');

    const params = new URLSearchParams({
        action: 'generate',
        prompt,
        aspectRatio: options.aspectRatio || question.imageAspectRatio || '1:1',
        quality: options.quality || question.imageQuality || '1K',
        fileType: options.fileType || 'jpg'
    });

    const response = await fetch(`${API_BASE}?${params.toString()}`, { method: 'GET', mode: 'cors' });
    if (!response.ok) throw new Error(`API gambar mengembalikan HTTP ${response.status}.`);
    const json = await response.json();
    const url = json?.data?.url;
    if (!url) throw new Error('API berhasil dipanggil tetapi URL gambar tidak ditemukan.');

    const payload = { url, taskId: json?.data?.taskId || null, generatedAt: Date.now() };
    saveCachedImage(question.id, payload);
    return payload;
}

export function getCachedQuestionImage(questionId) {
    return readCachedImage(questionId);
}

export function clearCachedQuestionImage(questionId) {
    try { localStorage.removeItem(cacheKey(questionId)); } catch (_) {}
}

export { API_BASE };
