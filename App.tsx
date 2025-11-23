import React, { useState } from 'react';
import { parseGithubUrl, fetchRepoContext } from './services/githubService';
import { generateReadmeFromContext } from './services/inteligenceCode';
import { LoadingStatus } from './types';
import { TerminalOutput } from './components/TerminalOutput';
import { MarkdownViewer } from './components/MarkdownViewer';
import { Sparkles, Github, Copy, Download, Code, BrainCircuit, Search, Loader2 } from 'lucide-react';

export default function App() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<LoadingStatus>(LoadingStatus.IDLE);
  const [logs, setLogs] = useState<string[]>([]);
  const [readme, setReadme] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const modelWithVersion = process.env.OPENROUTER_MODEL;

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, msg]);
  };

  const handleAnalyze = async () => {
    if (!url) return;

    // Reset state
    setLogs([]);
    setReadme('');
    setStatus(LoadingStatus.FETCHING_REPO);

    try {
      const details = parseGithubUrl(url);
      if (!details) {
        addLog('Error: Invalid GitHub URL. Please use https://github.com/owner/repo');
        setStatus(LoadingStatus.ERROR);
        return;
      }

      addLog(`Target Identified: ${details.owner}/${details.repo}`);

      // Step 1: Fetch Context
      const context = await fetchRepoContext(details, addLog);

      // Step 2: Analyze with Gemini
      setStatus(LoadingStatus.ANALYZING);
      addLog(`Initiating ${modelWithVersion}...`);
      addLog('Thinking Budget: 2.000,000 tokens (Deep Analysis Mode)');
      addLog('Analyzing code architecture, patterns, and logic...');

      const generatedReadme = await generateReadmeFromContext(context);

      setReadme(generatedReadme);
      addLog('Documentation successfully generated!');
      setStatus(LoadingStatus.COMPLETE);

    } catch (error: any) {
      console.error(error);
      addLog(`Critical Error: ${error.message || 'Unknown error occurred'}`);
      setStatus(LoadingStatus.ERROR);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(readme);
    addLog('Content copied to clipboard.');
  };

  const downloadFile = () => {
    const element = document.createElement("a");
    const file = new Blob([readme], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = "README.md";
    document.body.appendChild(element);
    element.click();
    addLog('README.md downloaded.');
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-slate-200 selection:bg-neon-pink selection:text-white pb-20">

      {/* Header */}
      <header className="border-b border-cyber-700 bg-cyber-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-neon-blue blur opacity-40 rounded-full animate-pulse"></div>
              <Sparkles className="w-8 h-8 text-neon-blue relative z-10" />
            </div>
            <h1 className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-white to-cyber-400 bg-clip-text text-transparent">
              CodeDeepScan<span className="text-neon-blue">.AI</span>
            </h1>
          </div>
          <div className="flex items-center space-x-4 text-sm font-mono text-cyber-400">
            <span className="flex items-center"><BrainCircuit className="w-4 h-4 mr-1 text-neon-purple" />{modelWithVersion}</span>
            <span className="flex items-center"><Search className="w-4 h-4 mr-1 text-neon-green" /> Deep Analysis</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-12">

        {/* Hero / Input Section */}
        <section className="mb-16 text-center max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold mb-6 text-white leading-tight">
            Turn Code into <br />
            <span className="text-neon-blue animate-text-glow">Intelligent Documentation</span>
          </h2>
          <p className="text-cyber-300 mb-8 text-lg">
            Paste a GitHub repository URL. Our AI reads every line, intrinsically understands the logic, and writes the perfect README.
          </p>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-cyber-900 rounded-lg p-2 border border-cyber-600 focus-within:border-neon-blue transition-colors">
              <Github className="ml-3 text-gray-400 w-6 h-6" />
              <input
                type="text"
                placeholder="https://github.com/username/repository"
                className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 px-4 py-3 font-mono"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              />
              <button
                onClick={handleAnalyze}
                disabled={status !== LoadingStatus.IDLE && status !== LoadingStatus.COMPLETE && status !== LoadingStatus.ERROR}
                className="bg-neon-blue/10 hover:bg-neon-blue/20 text-neon-blue border border-neon-blue/50 px-6 py-2 rounded font-semibold transition-all hover:shadow-[0_0_15px_rgba(0,243,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {status === LoadingStatus.ANALYZING || status === LoadingStatus.FETCHING_REPO ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>SCAN NOW</>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Logs / Terminal */}
        {(status !== LoadingStatus.IDLE || logs.length > 0) && (
          <section className="mb-12">
            <TerminalOutput logs={logs} />
          </section>
        )}

        {/* Results Section */}
        {readme && (
          <section className="animate-[slideUp_0.5s_ease-out]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-2 bg-cyber-800 p-1 rounded-lg border border-cyber-600">
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'preview' ? 'bg-cyber-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  Preview
                </button>
                <button
                  onClick={() => setActiveTab('code')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'code' ? 'bg-cyber-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  <span className="flex items-center"><Code className="w-4 h-4 mr-2" /> Raw Markdown</span>
                </button>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center px-4 py-2 bg-cyber-800 border border-cyber-600 rounded-lg hover:bg-cyber-700 text-cyber-300 transition-colors text-sm"
                >
                  <Copy className="w-4 h-4 mr-2" /> Copy
                </button>
                <button
                  onClick={downloadFile}
                  className="flex items-center px-4 py-2 bg-neon-blue/10 border border-neon-blue/30 rounded-lg hover:bg-neon-blue/20 text-neon-blue transition-colors text-sm"
                >
                  <Download className="w-4 h-4 mr-2" /> Download
                </button>
              </div>
            </div>

            <div className="bg-cyber-900 border border-cyber-600 rounded-xl p-8 shadow-2xl overflow-hidden min-h-[500px]">
              {activeTab === 'preview' ? (
                <MarkdownViewer content={readme} />
              ) : (
                <textarea
                  readOnly
                  className="w-full h-[600px] bg-cyber-900 text-gray-300 font-mono text-sm p-4 rounded-lg border border-cyber-700 focus:outline-none focus:border-neon-blue resize-none"
                  value={readme}
                />
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}