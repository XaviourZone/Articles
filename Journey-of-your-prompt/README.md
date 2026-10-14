# The Prompt Journey — How LLMs Process a Prompt
**Interactive AI Architecture Simulator**  
**Author:** Yassin Xaviour  

## Overview
*The Prompt Journey* is an interactive, animated educational exhibit designed to visually demonstrate how an LLM transforms a raw prompt into a generated answer across five core stages:

1. **Stage 01 · From Prompt to Token IDs:** BPE subword segmentation and vocabulary lookup.
2. **Stage 02 · Giving Tokens a Numerical Representation:** Embedding projection onto a 2D illustrative semantic space.
3. **Stage 03 · How Tokens Use Context:** Multi-Head Self-Attention connections with Query-Key dot products and dynamic arc beams.
4. **Stage 04 · Inside the Transformer:** Multi-layer forward pass with LayerNorm, attention heads, residual connections, and FFN.
5. **Stage 05 · From Model Output to a Complete Answer:** Candidate token probability selection (Softmax logits) and iterative autoregressive decoding.

## How to Run
This project is built with vanilla HTML5, CSS3, and modern JavaScript. It has zero external package build steps.

To view:
1. Double-click `index.html` in your file explorer to open directly in any modern browser (Chrome, Edge, Safari, Firefox).
2. Alternatively, run via any local web server:
   ```bash
   npx serve .
   # or
   python -m http.server 8000
   ```
3. Open `http://localhost:8000/articles/inside-the-token-machine/` in your browser.
