# CodeDeepScan.AI ✨

**Transform any GitHub repository into a professional README.md with AI-powered deep code analysis.** 🚀

Paste a GitHub repo URL, and our intelligent scanner fetches the file structure, prioritizes key files (up to 40), and uses advanced AI (Gemini via OpenRouter) to intrinsically understand the architecture, tech stack, features, and generate a polished, comprehensive README. No more manual documentation—let AI do the heavy lifting! 💻📄

[![React](https://img.shields.io/badge/React-19.2.0-brightgreen?style=flat&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-orange?style=flat&logo=vite)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Gemini AI](https://img.shields.io/badge/AI-Gemini%20%40google/genai-purple?style=flat&logo=google)](https://ai.google.dev/)

## ✨ Features

- **🔍 Deep Repo Scanning**: Fetches repo metadata, recursive file tree, and downloads prioritized text files (JS/TS/Python/etc., excludes binaries/locks).
- **🧠 AI-Powered Analysis**: Uses Gemini AI with 2M token context for intrinsic code understanding—architecture, patterns, stack, installation.
- **📱 Cyberpunk UI**: Stunning neon-themed interface with terminal logs, live preview, raw Markdown view.
- **⚡ Real-Time Feedback**: Terminal-style progress logs for fetching, analyzing, and generation.
- **💾 Export Ready**: Copy to clipboard or download `README.md` instantly.
- **⌨️ Keyboard-Friendly**: Hit Enter to scan!
- **🔒 Privacy-First**: Client-side only (except GitHub API & AI calls).

## 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | React 19 (^19.2.0), TypeScript, Vite 6 (^6.2.0), Lucide React Icons |
| **UI/Components** | React Markdown, React Syntax Highlighter (custom VSCode Dark+ theme) |
| **AI/ML** | CodeDeepScan.AI
| **Services** | GitHub API (raw content fetching), dotenv for env vars |
| **Build/Tools** | Vite, TailwindCSS (inferred from cyberpunk styles) |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- GitHub repo URL (public repos only)
- `.env.local` file with `OPENROUTER_MODEL` (e.g., `OPENROUTER_MODEL=google/gemini-pro-1.5-flash-exp` or your preferred model)

### Installation
```bash
# Clone the repo
git clone https://github.com/speNillusion/readme-generator.git
cd readme-generator

# Install dependencies
npm install

# Create .env (example)
echo "OPENROUTER_MODEL=your-model-here" > .env
```

### Run Locally
```bash
# Development server (hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Open [http://localhost:5000](http://localhost:5000) 🎉

### Usage Example
1. Paste: `https://github.com/username/my-repo`
2. Click **SCAN NOW** or press Enter.
3. Watch terminal logs: fetching files → AI analysis → README generated!
4. Preview, copy, or download.

**Sample Code Snippet** (Core Analysis Flow):
```tsx
// App.tsx - handleAnalyze()
const context = await fetchRepoContext(details, addLog);
const generatedReadme = await generateReadmeFromContext(context);
setReadme(generatedReadme);
```

## 📁 Project Structure

```
.
├── package.json          # Dependencies & scripts
├── tsconfig.json         # TypeScript config
├── vite.config.ts        # Vite config
├── types.ts              # Shared types (RepoDetails, LoadingStatus)
├── App.tsx               # Main app component
├── index.tsx             # Entry point
├── index.html            # Vite HTML template
├── metadata.json         # App metadata
├── components/
│   ├── MarkdownViewer.tsx # Renders generated README with syntax highlighting
│   ├── TerminalOutput.tsx # Cyberpunk terminal logs
│   └── codeTheme.ts       # Custom VSCode Dark+ syntax theme
└── services/
    ├── githubService.ts  # Parses URL, fetches tree/files (prioritizes ~40 key files)
    └── inteligenceCode.ts # AI README generation (Gemini/OpenRouter)
```

## 🔮 Roadmap

✅ **Complete**: Core scanning, AI generation, UI, exports.  
🚧 **In Progress**: Private repo support (GitHub token).  
📋 **Next**:
- Multi-model support (Claude, GPT-4o).
- Configurable file limits/extensions.
- Local AI mode (Ollama).
- Shareable scan links.
- VS Code extension.

## 🤝 Contributing

1. Fork & clone.
2. `npm install && npm run dev`.
3. Submit PRs to `main`.

**Issues?** Open one! Star ⭐ if useful.

## 📄 License

MIT © [speNillusion](https://github.com/speNillusion)