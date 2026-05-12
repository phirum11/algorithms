import os
import json
import uuid
import time
import logging
import requests
import random

logger = logging.getLogger("comfy-api")

DEFAULT_COMFY_ADDR = os.getenv("COMFYUI_ADDRESS", "127.0.0.1:8188")

def get_available_checkpoints(server_address):
    try:
        resp = requests.get(f"http://{server_address}/object_info/CheckpointLoaderSimple", timeout=5)
        if resp.status_code == 200:
            data = resp.json()
            # The list of models is in inputs['required']['ckpt_name'][0]
            models = data.get("CheckpointLoaderSimple", {}).get("input", {}).get("required", {}).get("ckpt_name", [[]])[0]
            return models
        return []
    except Exception as e:
        logger.warning(f"Could not fetch ComfyUI checkpoints: {e}")
        return []

def generate_comfy_image(prompt_text, width=1024, height=512, server_address=DEFAULT_COMFY_ADDR):
    """
    Dispatches an image generation prompt to ComfyUI backend, polls for completion, and retrieves image bytes.
    """
    client_id = str(uuid.uuid4())
    
    models = get_available_checkpoints(server_address)
    # Pick the first model available, or fallback to a standard one
    selected_model = models[0] if models else "v1-5-pruned-emaonly.safetensors"
    
    workflow = {
        "3": {
            "class_type": "KSampler",
            "inputs": {
                "cfg": 8,
                "denoise": 1,
                "latent_image": ["5", 0],
                "model": ["4", 0],
                "negative": ["7", 0],
                "positive": ["6", 0],
                "sampler_name": "euler",
                "scheduler": "normal",
                "seed": random.randint(1, 10**9),
                "steps": 20
            }
        },
        "4": {
            "class_type": "CheckpointLoaderSimple",
            "inputs": {
                "ckpt_name": selected_model
            }
        },
        "5": {
            "class_type": "EmptyLatentImage",
            "inputs": {
                "batch_size": 1,
                "height": height,
                "width": width
            }
        },
        "6": {
            "class_type": "CLIPTextEncode",
            "inputs": {
                "clip": ["4", 1],
                "text": f"digital art, hi-tech blueprint, concept art, {prompt_text}, cinematic lighting, trending on artstation, high quality, detailed"
            }
        },
        "7": {
            "class_type": "CLIPTextEncode",
            "inputs": {
                "clip": ["4", 1],
                "text": "text, watermark, frame, border, blurry, bad quality, ugly, deformed, lowres"
            }
        },
        "8": {
            "class_type": "VAEDecode",
            "inputs": {
                "samples": ["3", 0],
                "vae": ["4", 2]
            }
        },
        "9": {
            "class_type": "SaveImage",
            "inputs": {
                "filename_prefix": "AlgoGen",
                "images": ["8", 0]
            }
        }
    }

    try:
        # 1. Queue the prompt
        logger.info(f"Queueing image prompt via ComfyUI ({server_address}) model: {selected_model}")
        resp = requests.post(f"http://{server_address}/prompt", json={"prompt": workflow, "client_id": client_id}, timeout=10)
        resp.raise_for_status()
        prompt_id = resp.json().get("prompt_id")
        
        if not prompt_id:
            raise Exception("Failed to queue prompt: prompt_id not received.")

        # 2. Poll history for completion (Simpler than websocket for simple sync script)
        max_retries = 60 # 60 seconds timeout
        for _ in range(max_retries):
            hist_resp = requests.get(f"http://{server_address}/history/{prompt_id}", timeout=5)
            if hist_resp.status_code == 200:
                history = hist_resp.json()
                if prompt_id in history:
                    # Execution finished!
                    output_images = history[prompt_id].get("outputs", {}).get("9", {}).get("images", [])
                    if output_images:
                        img_info = output_images[0]
                        filename = img_info["filename"]
                        subfolder = img_info["subfolder"]
                        folder_type = img_info["type"]
                        
                        # 3. Fetch visual media
                        img_resp = requests.get(
                            f"http://{server_address}/view", 
                            params={"filename": filename, "subfolder": subfolder, "type": folder_type},
                            timeout=10
                        )
                        img_resp.raise_for_status()
                        logger.info(f"Image successfully retrieved: {filename}")
                        return img_resp.content
            time.sleep(1)
        
        raise TimeoutError("Timed out waiting for ComfyUI generation.")
        
    except Exception as e:
        logger.error(f"ComfyUI Generation Failed: {e}")
        raise e
