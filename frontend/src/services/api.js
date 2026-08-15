import axios from "axios";

/*
|--------------------------------------------------------------------------
| API BASE URL
|--------------------------------------------------------------------------
*/
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000";
/*
|--------------------------------------------------------------------------
| Axios instance
|--------------------------------------------------------------------------
*/

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
});

/*
|--------------------------------------------------------------------------
| AUTH TOKEN
|--------------------------------------------------------------------------
*/

export const getAuthToken = () => {
  return (
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token") ||
    null
  );
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("access_token", token);
  } else {
    localStorage.removeItem("access_token");
    sessionStorage.removeItem("access_token");
  }
};

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("current_user");

  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem("current_user");
};

/*
|--------------------------------------------------------------------------
| NORMALIZE 0-1 / 0-100 VALUES
|--------------------------------------------------------------------------
*/

const normalizePercentValue = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  /*
  Backend may return:
  0.9995 -> 0.9995
  99.95  -> 0.9995
  1      -> 1
  100    -> 1
  */

  if (number > 1) {
    return Math.min(number / 100, 1);
  }

  return Math.max(number, 0);
};

/*
|--------------------------------------------------------------------------
| AXIOS REQUEST INTERCEPTOR
|--------------------------------------------------------------------------
*/

api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();

    if (token) {
      config.headers = config.headers || {};

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/*
|--------------------------------------------------------------------------
| AXIOS RESPONSE INTERCEPTOR
|--------------------------------------------------------------------------
*/

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error?.response?.status === 401) {
      logout();
    }

    return Promise.reject(error);
  }
);

/*
|--------------------------------------------------------------------------
| URL HELPER
|--------------------------------------------------------------------------
*/

export const resolveBackendUrl = (value) => {
  if (!value) {
    return null;
  }

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("blob:")
  ) {
    return value;
  }

  if (value.startsWith("/")) {
    return `${API_BASE_URL}${value}`;
  }

  return `${API_BASE_URL}/${value}`;
};

/*
|--------------------------------------------------------------------------
| DISPLAY NAME
|--------------------------------------------------------------------------
*/

const getDisplayName = (prediction) => {
  const names = {
    glioma: "Glioma",
    meningioma: "Meningioma",
    pituitary: "Pituitary Tumor",
    notumor: "No Tumor",
  };

  return (
    names[prediction] ||
    prediction ||
    "Unknown"
  );
};

/*
|--------------------------------------------------------------------------
| NORMALIZE PROBABILITIES
|--------------------------------------------------------------------------
*/

const normalizeProbabilities = (
  rawProbabilities
) => {
  if (!rawProbabilities) {
    return [];
  }

  /*
  ------------------------------------------------------------------------
  Object format

  {
    glioma: 0,
    meningioma: 99.95,
    notumor: 0,
    pituitary: 0.05
  }

  OR

  {
    glioma: 0,
    meningioma: 0.9995,
    ...
  }
  ------------------------------------------------------------------------
  */

  if (
    typeof rawProbabilities === "object" &&
    !Array.isArray(rawProbabilities)
  ) {
    return Object.entries(
      rawProbabilities
    ).map(
      ([className, probability]) => ({
        class: className,

        displayName:
          getDisplayName(className),

        probability:
          normalizePercentValue(
            probability
          ),
      })
    );
  }

  /*
  ------------------------------------------------------------------------
  Array format
  ------------------------------------------------------------------------
  */

  if (Array.isArray(rawProbabilities)) {
    return rawProbabilities.map(
      (item) => {
        const className =
          item?.class ||
          item?.label ||
          item?.tumor ||
          item?.name ||
          "";

        const probability =
          item?.probability ??
          item?.confidence ??
          item?.score ??
          0;

        return {
          class: className,

          displayName:
            item?.displayName ||
            item?.display_name ||
            item?.label ||
            item?.name ||
            className ||
            "Unknown",

          probability:
            normalizePercentValue(
              probability
            ),
        };
      }
    );
  }

  return [];
};

/*
|--------------------------------------------------------------------------
| NORMALIZE PREDICTION RESULT
|--------------------------------------------------------------------------
*/

export const normalizeResult = (
  raw,
  originalFile = null
) => {
  if (
    !raw ||
    typeof raw !== "object"
  ) {
    return null;
  }

  const prediction =
    raw.prediction ||
    raw.predicted_class ||
    raw.predictedClass ||
    raw.class_name ||
    raw.label ||
    "";

  const displayName =
    raw.displayName ||
    raw.display_name ||
    raw.prediction_name ||
    raw.predicted_name ||
    getDisplayName(prediction);

  /*
  |--------------------------------------------------------------------------
  | IMPORTANT:
  | Normalize confidence to 0-1.
  |--------------------------------------------------------------------------
  */

  const rawConfidence =
    raw.confidence ??
    raw.prediction_confidence ??
    raw.score ??
    0;

  const confidence =
    normalizePercentValue(
      rawConfidence
    );

  /*
  |--------------------------------------------------------------------------
  | Probabilities
  |--------------------------------------------------------------------------
  */

  const probabilities =
    normalizeProbabilities(
      raw.probabilities ||
      raw.class_probabilities ||
      raw.probability
    );

  return {
    ...raw,

    id:
      raw.id ||
      raw.prediction_id ||
      null,

    prediction,

    displayName,

    confidence,

    model:
      raw.model ||
      raw.model_name ||
      raw.modelName ||
      "Hybrid CNN + Morphology",

    filename:
      raw.filename ||
      raw.file_name ||
      raw.original_filename ||
      originalFile?.name ||
      "Uploaded MRI",

    imageUrl:
      resolveBackendUrl(
        raw.imageUrl ||
        raw.image_url ||
        raw.upload_url ||
        raw.uploaded_image_url
      ),

    gradcamUrl:
      resolveBackendUrl(
        raw.gradcamUrl ||
        raw.gradcam_url ||
        raw.grad_cam_url ||
        raw.explanation_url
      ),

    probabilities,
  };
};

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

export const login = async (
  email,
  password
) => {
  const response = await api.post(
    "/api/auth/login",
    {
      email,
      password,
    }
  );

  const data = response.data;

  if (!data?.access_token) {
    throw new Error(
      "Login succeeded but no access token was returned."
    );
  }

  setAuthToken(
    data.access_token
  );

  if (data.user) {
    localStorage.setItem(
      "current_user",
      JSON.stringify(data.user)
    );
  }

  return data;
};

/*
|--------------------------------------------------------------------------
| SIGN UP
|--------------------------------------------------------------------------
*/

export const signup = async (
  name,
  email,
  password
) => {
  const response = await api.post(
    "/api/auth/signup",
    {
      name,
      email,
      password,
    }
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| PREDICT MRI
|--------------------------------------------------------------------------
*/

export const predictMRI = async (
  file,
  onProgress
) => {
  const token =
    getAuthToken();

  if (!token) {
    const error =
      new Error(
        "You must sign in before performing MRI analysis."
      );

    error.code =
      "NO_AUTH_TOKEN";

    throw error;
  }

  if (!file) {
    throw new Error(
      "MRI image file is required."
    );
  }

  const formData =
    new FormData();

  formData.append(
    "file",
    file
  );

  const response =
    await api.post(
      "/api/predict",
      formData,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },

        onUploadProgress:
          (event) => {
            if (!event.total) {
              return;
            }

            const percent =
              Math.round(
                (event.loaded * 100) /
                event.total
              );

            if (onProgress) {
              onProgress(
                percent
              );
            }
          },
      }
    );

  if (onProgress) {
    onProgress(100);
  }

  return normalizeResult(
    response.data,
    file
  );
};

/*
|--------------------------------------------------------------------------
| GET TUMORS
|--------------------------------------------------------------------------
*/

export const getTumors =
  async () => {
    const response =
      await api.get(
        "/api/tumors"
      );

    const data =
      response.data;

    if (Array.isArray(data)) {
      return data;
    }

    if (
      Array.isArray(
        data?.tumors
      )
    ) {
      return data.tumors;
    }

    return [];
  };

/*
|--------------------------------------------------------------------------
| GET SINGLE TUMOR
|--------------------------------------------------------------------------
*/

export const getTumor =
  async (slug) => {
    if (!slug) {
      throw new Error(
        "Tumor slug is required."
      );
    }

    const response =
      await api.get(
        `/api/tumors/${encodeURIComponent(
          slug
        )}`
      );

    return response.data;
  };

/*
|--------------------------------------------------------------------------
| PREDICTION HISTORY
|--------------------------------------------------------------------------
*/

/* =====================================================
   PREDICTION HISTORY
===================================================== */

export const getPredictionHistory = async () => {
  const response = await api.get("/api/predictions/history");

  const data = response.data;

  /*
   * Backend may return:
   *
   * [
   *   {...},
   *   {...}
   * ]
   *
   * OR:
   *
   * {
   *   predictions: [...]
   * }
   *
   * OR:
   *
   * {
   *   history: [...]
   * }
   *
   * OR:
   *
   * {
   *   data: [...]
   * }
   */

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.predictions)) {
    return data.predictions;
  }

  if (Array.isArray(data?.history)) {
    return data.history;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.items)) {
    return data.items;
  }

  console.warn(
    "Prediction history API returned an unexpected format:",
    data
  );

  return [];
};
/*
|--------------------------------------------------------------------------
| SINGLE PREDICTION
|--------------------------------------------------------------------------
*/

export const getPrediction =
  async (predictionId) => {
    if (!predictionId) {
      throw new Error(
        "Prediction ID is required."
      );
    }

    const response =
      await api.get(
        `/api/predictions/${encodeURIComponent(
          predictionId
        )}`
      );

    return response.data;
  };

/*
|--------------------------------------------------------------------------
| DEFAULT EXPORT
|--------------------------------------------------------------------------
*/

export default api;