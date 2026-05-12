"""
Algorithm Visualization Engine
Generates dynamic step-by-step GIFs of standard algorithms using Python Pillow.
"""

import io
import random
from typing import List, Dict, Any
from PIL import Image, ImageDraw, ImageFont

def build_visualizer_gif(slug: str, custom_steps: List[List[int]] = None) -> io.BytesIO:
    """
    Simulates the specified algorithm step-by-step, or consumes provided custom_steps.
    Renders runtime state into an in-memory GIF buffered reader.
    """
    num_bars = 12
    
    # Initialize random array only if we don't have custom pre-determined steps
    if custom_steps and len(custom_steps) > 0:
        arr = list(custom_steps[0]) # Seed from the first custom frame
        num_bars = len(arr)
    else:
        arr = [random.randint(20, 99) for _ in range(num_bars)]
        
    frames: List[Dict[str, Any]] = []
    
    def add_frame(snap: List[int], active: List[int] = None, highlight: List[int] = None):
        frames.append({
            'data': list(snap),
            'active': list(active) if active else [],
            'highlight': list(highlight) if highlight else []
        })

    # SHORT CIRCUIT: If we have custom execution steps, hydrate states instantly and skip hardcoded loop
    if custom_steps:
        for i, step_data in enumerate(custom_steps):
            # Optionally highlight indices that changed between steps automatically
            changed = []
            if i > 0:
                prev = custom_steps[i-1]
                changed = [j for j in range(min(len(prev), len(step_data))) if prev[j] != step_data[j]]
            add_frame(step_data, highlight=changed)
            
        # Jump to rendering block
    else:
        add_frame(arr)

        # 1. RUN SIMULATION & CAPTURE STATES
        if 'search' in slug:
            arr.sort()  # Ensure sorted for search visualization
            target = arr[random.randint(len(arr)//3, 2*len(arr)//3)]
            low, high = 0, len(arr) - 1
            
            while low <= high:
                mid = (low + high) // 2
                # Save currently visible span and the midpoint being scrutinized
                rng = list(range(low, high + 1))
                add_frame(arr, active=rng, highlight=[mid])
                
                if arr[mid] == target:
                    add_frame(arr, highlight=[mid])
                    break
                elif arr[mid] < target:
                    low = mid + 1
                else:
                    high = mid - 1
                    
        elif slug == 'bubble-sort':
            sim = list(arr)
            for i in range(len(sim)):
                for j in range(len(sim) - i - 1):
                    add_frame(sim, highlight=[j, j+1])
                    if sim[j] > sim[j+1]:
                        sim[j], sim[j+1] = sim[j+1], sim[j]
                        add_frame(sim, highlight=[j, j+1])
                        
        elif slug == 'merge-sort':
            sim = list(arr)
            def merge(start, mid, end):
                L = sim[start:mid+1]
                R = sim[mid+1:end+1]
                i = j = 0
                k = start
                while i < len(L) and j < len(R):
                    add_frame(sim, highlight=[k])
                    if L[i] <= R[j]: sim[k] = L[i]; i += 1
                    else: sim[k] = R[j]; j += 1
                    k += 1
                while i < len(L): add_frame(sim, highlight=[k]); sim[k] = L[i]; i += 1; k += 1
                while j < len(R): add_frame(sim, highlight=[k]); sim[k] = R[j]; j += 1; k += 1
            
            def m_sort(start, end):
                if start < end:
                    mid = (start + end) // 2
                    m_sort(start, mid)
                    m_sort(mid + 1, end)
                    merge(start, mid, end)
            m_sort(0, len(sim) - 1)

        else: # Quick Sort Fallback
            sim = list(arr)
            def q_sort(low, high):
                if low < high:
                    pi = partition(low, high)
                    q_sort(low, pi - 1)
                    q_sort(pi + 1, high)
            
            def partition(low, high):
                pivot = sim[high]
                i = low - 1
                for j in range(low, high):
                    add_frame(sim, highlight=[j, high])
                    if sim[j] < pivot:
                        i += 1
                        sim[i], sim[j] = sim[j], sim[i]
                        add_frame(sim, highlight=[i, j])
                sim[i+1], sim[high] = sim[high], sim[i+1]
                add_frame(sim, highlight=[i+1, high])
                return i + 1
            q_sort(0, len(sim) - 1)

    # 2. RENDER CAPTURED STATES TO PIL IMAGES
    width, height = 640, 240
    bg_color = (9, 9, 11)  # Rich Slate background
    pil_frames = []
    
    try:
        font = ImageFont.truetype("arialbd.ttf", 18)
    except IOError:
        font = ImageFont.load_default()

    max_val = max(arr)
    bar_w = (width - 80) // num_bars
    
    for frame in frames:
        img = Image.new('RGB', (width, height), color=bg_color)
        draw = ImageDraw.Draw(img)
        
        snapshot = frame['data']
        active = frame['active']
        highlight = frame['highlight']

        for idx, val in enumerate(snapshot):
            bar_height = int((val / max_val) * (height - 80))
            x0 = 40 + idx * bar_w
            y1 = height - 30
            y0 = y1 - bar_height
            x1 = x0 + bar_w - 8
            
            edge_color = (6, 182, 212) # Default Neon Cyan
            
            # In-situ highlighting engine
            if active and idx not in active:
                edge_color = (50, 50, 50) # Inactive dims to dark grey
            
            if idx in highlight:
                # Draw filled vibrant emerald state for focus targets
                emerald = (16, 185, 129)
                draw.rectangle([x0, y0, x1, y1], fill=emerald, outline=emerald, width=4)
            else:
                # Standard hollow aesthetic
                draw.rectangle([x0, y0, x1, y1], fill=None, outline=edge_color, width=2)
            
            # Draw text aligned to top center of column
            draw.text((x0 + (bar_w - 20) // 2, y0 - 25), str(val), fill=(255, 255, 255), font=font)
            
        pil_frames.append(img)

    # 3. COMPILE IMAGES INTO OPTIMIZED GIF BUFFER
    buf = io.BytesIO()
    frame_duration = 800 if 'search' in slug else 500
    
    pil_frames[0].save(
        buf, 
        format='GIF', 
        save_all=True, 
        append_images=pil_frames[1:], 
        optimize=True, 
        duration=frame_duration, 
        loop=0
    )
    buf.seek(0)
    return buf
