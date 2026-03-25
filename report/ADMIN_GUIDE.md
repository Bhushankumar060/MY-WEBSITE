# Administrator Guide

Welcome to the TradeSovereign Master Admin Panel. 

## 1. Accessing the Dashboard
- Navigate to `/admin.html` on the website.
- Enter your master Administrator email and password mapped directly to **Firebase Auth**.
- **Static Demo:** You may click the "Demo Bypass" button to immediately view the interface without live Firebase credentials.

## 2. Managing Curriculum Content (Classes, Subjects, Chapters)
The dashboard features a sleek, modular sidebar (or top tab sequence on mobile) separating your tasks:
- **Classes & Subjects:** Select a specific class (1-12). Click "Add Subject" to inject a new topic card (e.g., Mathematics, Physics).
- **Chapters Manager:** 
  1. Select the target Class and Subject from the dropdowns.
  2. Input the Chapter Title.
  3. Write your detailed chapter overview using the Markdown editor (`## Heading`, `*Bullet points*`).
  4. Paste your YouTube embed URL.
  5. Use the JSON text box to configure interactive Quizzes.
  6. Click "Save Chapter to Firebase" to sync.

## 3. PDF Uploads
Navigate to the "PDF Uploads" tab for handling mass resource drops:
1. Filter the destination (Class 10 -> Science).
2. Drag and drop your `.pdf` file directly into the dashed drop-zone.
3. The integrated JS listener will mock/process the upload via Firebase Storage, showing a smooth green progress bar completing to 100%.

## 4. Resource Manager
This is a holistic view of every file currently sitting on your Firebase buckets.
- Use the quick global search to locate specific files (e.g., "Motion Cl9").
- You can Edit metadata or Delete files completely to conserve cloud storage.

## 5. Using the AI Assistant
Located at the bottom of the overview dashboard is the GPT-4o CRM module.
- Type natural assertions: "List all PDFs missing in Class 10 Math".
- The AI securely uses your `OPENAI_API_KEY` (via cloud function proxy) to parse your database and generate responses internally.
