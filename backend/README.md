# AlgoAnalyst Engine Core API

Robust Python micro-service driving asynchronous AI computation and runtime execution graphics generation.

## 🛠 Architecture

Built on modern FastAPI asynchronous routines combined with Google Gemini Flash 2.5 for millisecond latency parsing and Pillow (PIL) buffer stream rendering.

## 📂 Structure
- **`main.py`**: Core FastAPI application layer with orchestrated routing, logging, and middleware binding.
- **`visualizer.py`**: Logic simulation tier containing zero-allocation step-engines for sorting & searching animations.
- **`.env`**: Bound persistent environment configuration (DO NOT COMMIT).

## 🛰 Endpoints

### 1. `POST /api/analyze`
**Description**: Consumes dynamic code buffers and executes Prompt-Chained metadata extraction via Generative AI.
- **Payload**: `{ "code": "str" }`
- **Returns**: Structured JSON dictionary containing:
  - `complexity`: Time/Space Big-O strings
  - `visualizer_type`: Best matched animation mode identifier.
  - `feedback`: Array of performance vectors.

### 2. `GET /api/visualize/{slug}`
**Description**: Triggers on-the-fly data instantiation and execution visual compilation.
- **Returns**: `image/gif` dynamic media response stream.

## 🚦 Local Setup

Ensure runtime dependencies are properly configured:
```bash
pip install -r requirements.txt
uvicorn main:app --reload
```
