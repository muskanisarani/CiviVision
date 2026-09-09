const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
const ML_TIMEOUT_MS = parseInt(process.env.ML_TIMEOUT_MS || '6000', 10);
const DEFAULT_THRESHOLD = parseFloat(process.env.ML_CONFIDENCE_THRESHOLD || '0.70');

/**
 * Checks the health status of the Python FastAPI ML microservice.
 */
async function checkMLHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`${ML_SERVICE_URL}/health`, {
      method: 'GET',
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return await res.json();
    }
    return { status: 'unhealthy', error: `HTTP ${res.status}` };
  } catch (err) {
    return { status: 'offline', error: err.message };
  }
}

/**
 * Sends image to Python FastAPI ML service for MobileNetV3 inference.
 * @param {string} base64Image - Base64 data URL or raw base64 string
 * @param {number} [threshold] - Confidence threshold
 */
async function predictWithMLService(base64Image, threshold = DEFAULT_THRESHOLD) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), ML_TIMEOUT_MS);

    const res = await fetch(`${ML_SERVICE_URL}/predict-json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image: base64Image,
        threshold
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorBody = await res.text();
      return {
        success: false,
        is_available: true,
        error: `ML Service returned HTTP ${res.status}: ${errorBody}`
      };
    }

    const data = await res.json();
    return {
      ...data,
      is_available: true,
      source: 'custom-mobilenetv3-ml-service'
    };
  } catch (err) {
    console.warn(`[ML Service Note] Primary ML Service at ${ML_SERVICE_URL} unreachable: ${err.message}`);
    return {
      success: false,
      is_available: false,
      error: err.name === 'AbortError' ? 'ML Service request timed out' : err.message
    };
  }
}

module.exports = {
  checkMLHealth,
  predictWithMLService,
  ML_SERVICE_URL
};
