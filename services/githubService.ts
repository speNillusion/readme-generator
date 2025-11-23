import { RepoDetails, RepoFile } from '../types';

const GITHUB_API_BASE = 'https://api.github.com';

// Helper to parse URL
export const parseGithubUrl = (url: string): RepoDetails | null => {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname !== 'github.com') return null;
    const parts = urlObj.pathname.split('/').filter(Boolean);
    if (parts.length < 2) return null;
    return {
      owner: parts[0],
      repo: parts[1],
      branch: 'main' // Default assumption, updated later
    };
  } catch (e) {
    return null;
  }
};

export const fetchRepoContext = async (details: RepoDetails, onProgress: (msg: string) => void): Promise<string> => {
  // 1. Get Repo Info to find default branch
  onProgress(`Connecting to ${details.owner}/${details.repo}...`);
  const repoInfoRes = await fetch(`${GITHUB_API_BASE}/repos/${details.owner}/${details.repo}`);
  if (!repoInfoRes.ok) throw new Error('Repository not found or private.');
  const repoInfo = await repoInfoRes.json();
  const defaultBranch = repoInfo.default_branch;

  // 2. Get Tree (Recursive)
  onProgress(`Scanning file structure on branch '${defaultBranch}'...`);
  const treeRes = await fetch(`${GITHUB_API_BASE}/repos/${details.owner}/${details.repo}/git/trees/${defaultBranch}?recursive=1`);
  if (!treeRes.ok) throw new Error('Failed to fetch file tree.');
  const treeData = await treeRes.json();

  // 3. Filter and Select Files
  // Limit to text files, exclude lock files, binaries, huge assets
  const MAX_FILES = 40; // Hard limit to avoid blowing up context/rate limits
  const ALLOWED_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.py', '.rb', '.go', '.rs', '.java', '.c', '.cpp', '.h', '.md', '.json', '.html', '.css', '.vue', '.svelte', '.php'];
  
  const allFiles = treeData.tree.filter((node: any) => {
    return node.type === 'blob' && 
           !node.path.includes('package-lock.json') &&
           !node.path.includes('yarn.lock') &&
           !node.path.includes('node_modules/') &&
           !node.path.includes('.git/') &&
           ALLOWED_EXTENSIONS.some(ext => node.path.endsWith(ext));
  });

  // Prioritize files: README, package.json, src files, root files
  allFiles.sort((a: any, b: any) => {
    const score = (node: any) => {
      let s = 0;
      if (node.path.toLowerCase().includes('readme')) s += 100;
      if (node.path.includes('package.json')) s += 50;
      if (!node.path.includes('/')) s += 20; // Root files
      if (node.path.startsWith('src/')) s += 10;
      return s;
    };
    return score(b) - score(a);
  });

  const selectedFiles = allFiles.slice(0, MAX_FILES);
  
  onProgress(`Downloading content for ${selectedFiles.length} key files...`);
  
  // 4. Fetch Content (in parallel chunks)
  const fileContents: RepoFile[] = [];
  
  // Fetch raw content
  // Note: Using raw.githubusercontent.com is easier for text than API base64 decoding
  const fetchContent = async (file: any) => {
    try {
      const res = await fetch(`https://raw.githubusercontent.com/${details.owner}/${details.repo}/${defaultBranch}/${file.path}`);
      if (res.ok) {
        const text = await res.text();
        // Skip huge files
        if (text.length < 100000) {
            fileContents.push({
            path: file.path,
            content: text,
            size: file.size
            });
        }
      }
    } catch (err) {
      console.warn(`Failed to fetch ${file.path}`, err);
    }
  };

  const chunk = 5;
  for (let i = 0; i < selectedFiles.length; i += chunk) {
    await Promise.all(selectedFiles.slice(i, i + chunk).map(fetchContent));
    onProgress(`Downloaded ${Math.min(i + chunk, selectedFiles.length)}/${selectedFiles.length} files...`);
  }

  // 5. Construct Context String
  let context = `Repository: ${details.owner}/${details.repo}\n\n`;
  context += `File Structure (Selected):\n`;
  selectedFiles.forEach((f: any) => context += `- ${f.path}\n`);
  context += `\nFile Contents:\n`;
  
  fileContents.forEach(f => {
    context += `\n--- START OF FILE ${f.path} ---\n${f.content}\n--- END OF FILE ${f.path} ---\n`;
  });

  return context;
};