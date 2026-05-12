"""
Algorithm Analyst Backend API
Core FastAPI application routing and orchestration for Gemini AI analysis and algorithm visualization.
"""

import os
import json
import re
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

from visualizer import build_visualizer_gif
from comfy_api import generate_comfy_image

# --- SETUP CONFIGURATION ---
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("algo-api")

load_dotenv()

app = FastAPI(
    title="AlgoAnalyst Engine",
    description="Intelligent Algorithm Telemetry and Visualization API",
    version="1.0.0"
)

# Enable robust CORS policies for cross-domain browser interactivity
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, whitelist specific host origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- GEMINI CLIENT INITIALIZATION ---
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    logger.error("GEMINI_API_KEY is missing from server environment! AI analysis endpoints will fail.")
else:
    genai.configure(api_key=api_key)
    logger.info("Google Generative AI client securely bound.")


# --- TRANSIENT CACHE LAYER ---
# Stores the latest AI-generated algorithm traces to bridge between POST/GET routes
GLOBAL_EXECUTION_CACHE = {}

# --- DATA MODELS ---
class AnalyzeRequest(BaseModel):
    """Payload mapping incoming source code analysis target"""
    code: str

class ImageGenRequest(BaseModel):
    """Payload mapping custom comfy prompt request"""
    prompt: str
    width: int = 1024
    height: int = 512


# --- ENDPOINTS ---

@app.get("/")
def health_check():
    """Heartbeat diagnostics confirming engine operational status."""
    return {
        "status": "operational",
        "api_version": "1.1.0",
        "features": ["dynamic-ai-tracing"]
    }


@app.post("/api/analyze")
async def analyze_algorithm(request: AnalyzeRequest):
    """
    Executes zero-shot prompt chaining to deduce algorithm properties from raw source code.
    Generates explicit simulation traces to enable real-time code logic visualization.
    """
    if not api_key:
        raise HTTPException(status_code=503, detail="System Configuration Error: AI engine offline.")
    
    if not request.code or not request.code.strip():
        raise HTTPException(status_code=400, detail="Request Validation: Empty code buffer provided.")

    # Initialize Flash model for highest throughput low-latency response
    model = genai.GenerativeModel('gemini-2.5-flash')
    
    test_input = [64, 34, 25, 12, 22, 11, 90]
    
    prompt = f"""
    You are a Senior Software Engineer specializing in Algorithm Analysis and Simulation.
    Analyze the following source code and generate comprehensive runtime analysis in strict JSON only.
    
    CRITICAL REQUIREMENT: 
    Trace the EXACT step-by-step execution of this specific input list: {test_input}.
    Generate the intermediate state of the list after EACH MAJOR ITERATION OR SWAP.
    Limit trace to maximum 12 intermediate steps if runtime is excessive.

    Required JSON Schema:
    {{
      "name": "Inferred human-readable name of the algorithm",
      "complexity": "Standard Big O Time Complexity",
      "space": "Standard Big O Space Complexity",
      "status": "Optimal, Stable, or Inefficient",
      "desc": "One concise sentence explanation of utility.",
      "best_case": "Ideal environment use-case.",
      "visualizer_type": "Select ONE from: 'bubble-sort', 'merge-sort', 'quick-sort', 'binary-search'",
      "feedback": [
        {{"type": "success", "text": "trait"}},
        {{"type": "info", "text": "tip"}},
        {{"type": "warning", "text": "notice"}}
      ],
      "execution_trace": [
        [64, 34, 25, 12, 22, 11, 90],
        [34, 64, 25, 12, 22, 11, 90],
        "...(list of each successive state of the main array during logic operation)..."
      ]
    }}

    Target User Code:
    {request.code}
    """

    try:
        logger.info("Dispatching deep analysis and trace synthesis payload.")
        response = model.generate_content(prompt)
        payload = response.text
        
        json_match = re.search(r"\{([\s\S]*)\}", payload)
        if json_match:
            parsed = json.loads(json_match.group(0))
        else:
            parsed = json.loads(payload)
            
        # Securely bind the AI-generated execution trace to memory cache keyed to current visualization slug
        viz_type = parsed.get("visualizer_type", "unknown")
        trace = parsed.get("execution_trace")
        
        if viz_type and trace:
            logger.info(f"Successfully cached custom trace validation for type: {viz_type}")
            GLOBAL_EXECUTION_CACHE[viz_type] = trace
        
        return parsed

    except json.JSONDecodeError as decode_err:
        logger.exception("Integrity check failed on model raw return.")
        raise HTTPException(status_code=500, detail="Failed to validate AI response as structured data.")
    except Exception as e:
        logger.exception("Internal fatal during content pipeline.")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/image-gen")
async def generate_ai_image(request: ImageGenRequest):
    """
    Direct pipe to locally running ComfyUI orchestration engine to generate 
    high-fidelity imagery tailored to the provided semantic description.
    """
    try:
        logger.info(f"ComfyUI trigger invoked for prompt: {request.prompt[:50]}...")
        img_bytes = generate_comfy_image(request.prompt, width=request.width, height=request.height)
        
        from io import BytesIO
        return StreamingResponse(BytesIO(img_bytes), media_type="image/png")
    except Exception as e:
        logger.exception("Critical exception during ComfyUI pipeline invocation.")
        # Provide helpful fallback so UI doesn't totally crash if comfy is not running
        raise HTTPException(status_code=503, detail=f"Image Generation Offline: {str(e)}")

@app.get("/api/visualize/{slug}")
def get_visualizer_stream(slug: str):
    """
    Generates discrete runtime execution visualizer, prioritizing AI cached execution traces.
    Returns dynamic animated GIF media stream.
    """
    try:
        logger.info(f"GIF generation invoked for node: {slug}")
        
        # Retrieve latest cached trace from global memory to enable LIVE true custom rendering
        custom_trace = GLOBAL_EXECUTION_CACHE.get(slug)
        
        if custom_trace:
            logger.info(f"Injecting dynamic runtime trace for custom-code logic playback ({len(custom_trace)} frames).")
        
        gif_io = build_visualizer_gif(slug, custom_steps=custom_trace)
        return StreamingResponse(gif_io, media_type="image/gif")
        
    except Exception as e:
        logger.exception("Failure within downstream PIL assembly stream.")
        raise HTTPException(status_code=500, detail="Pipeline failure during GIF synthesis.")


if __name__ == "__main__":
    import uvicorn
    logger.info("Local development runtime firing via embedded loader.")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
