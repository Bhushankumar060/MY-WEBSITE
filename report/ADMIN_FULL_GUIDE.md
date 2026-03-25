# Admin Panel Master Guide (v4.0)

Welcome to the TradeSovereign v4.0 Zero-Code Control Center. This interface was engineered specifically so that **non-technical founders and business owners** can manage every granular detail of the platform without writing a single line of code.

## 1. Dashboard Navigation
The massive vertical sidebar is your primary command vector. It is split into 4 core sectors:
1. **Data Core**: Controls the frontend CMS (Classes, PDFs) and Gemini student analytics.
2. **Infrastructure**: Your API keys and master feature toggle switches.
3. **DevOps & Security**: Live server error logs, penetration test mocks, and DB backups.
4. **Intelligence**: The automated AI business recommendation feed.

## 2. Managing Content (CMS Engine)
By clicking on the "CMS Engine" tab, you gain absolute control over the K-12 curriculum structure.
- **Add Nodes**: By injecting a new "Class" or "Subject", that exact folder structure instantly propagates securely to the Student Dashboard.
- **Modify Chapters**: Clicking the "Chapter Editor" tab loads a markdown-compatible text area. Pasting YouTube embed links dynamically renders lecture videos inside the student's study matrix.

## 3. Uploading Massive Documents (Blob Storage)
Our integrated "Blob Storage" drag-and-drop UI communicates directly with Firebase Storage.
- Dragging a `<50MB>` PDF automatically processes the file and assigns it a secure remote URL, instantly accessible to authenticated students.

*Never edit the physical HTML files to add content. The V4 SPA handles 100% of data integration dynamically.*
