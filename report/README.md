# TradeSovereign Student & Trader Learning Platform

## Overview
TradeSovereign is a dual-purpose educational powerhouse, seamlessly combining a deeply structured K-12 academic curriculum hub with a professional-grade trading and market analysis dashboard. The application is built entirely as a **flawless, high-authority static website** using HTML5, CSS3, vanilla JavaScript, and Tailwind CSS.

## Features at a Glance
- **Student Dashboard:** Dynamic routing structure (via URL params) supporting Classes 1-12 with deep subject and chapter structures.
- **Trader Dashboard:** Real-time interactive charts, live ticker marquee, technical indicators (mock/API ready), and financial news structure.
- **Admin Panel:** Secure authentication UI handling class/subject management, PDF uploads, and WYSIWYG markdown-enabled editing.
- **AI Assistant:** Floating GPT-4o powered chat widget natively integrated across the site structure.

## How to Run Locally

Since this project consists entirely of clean static files (no build required), it can be run using any basic local web server.

### Using Python (Recommended)
1. Open a terminal in the root directory.
2. Run: `python -m http.server 8000` (or `python3 -m http.server 8000`)
3. Navigate to `http://localhost:8000` in your browser.

### Using Node.js
1. If you have Node installed, run `npx serve` in the root directory.
2. Navigate to the port output in your terminal (usually `http://localhost:3000`).

## Deployment Steps
Because the application is fully static, deployment is instantaneous and free across major providers:

**Vercel / Netlify:**
1. Drag and drop the root folder into the Netlify/Vercel dashboard, or deploy via GitHub integration.
2. Set the build command to empty, and the output directory to `.` (the root).

**Firebase Hosting:**
1. Run `firebase init hosting`.
2. Select your project and set your public directory to `.` (or move these files into `public/`).
3. Run `firebase deploy`.

**Hostinger:**
1. Zip the files natively in the root directory (excluding `_legacy_nextjs` to save space).
2. Upload and extract directly in your Hostinger `public_html` via the File Manager.
