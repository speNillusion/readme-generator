import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      allowedHosts: true,
      port: 5000,
      host: '0.0.0.0',
    },
    plugins: [
      react(),
      {
        name: 'openrouter-proxy',
        configureServer(server) {
          server.middlewares.use('/api/generate', async (req, res, next) => {
            if (req.method !== 'POST') return next();

            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', async () => {
              try {
                const { context } = JSON.parse(body);
                const apiKey = env.OPENROUTER_API;

                if (!apiKey) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: 'Server configuration error: API Key missing' }));
                  return;
                }

                const systemInstruction = `
                  You are an elite Senior Software Architect and Technical Writer. 
                  Your task is to analyze the provided code repository context deeply and intrinsically.
                  
                  You must understand:
                  1. The project's core purpose and problem it solves.
                  2. The architecture (e.g., MVC, Microservices, React Hooks pattern).
                  3. The tech stack (languages, frameworks, libraries).
                  4. Key features and functionalities.
                  5. How to install, configure, and run the project.

                  Output a high-quality, professional, and beautiful README.md file in Markdown format.
                  
                  The README should include:
                  - A catchy Title and one-paragraph Description.
                  - Badges (suggested based on tech stack).
                  - Features list.
                  - Tech Stack overview.
                  - Installation & Usage instructions (infer commands from package.json or makefiles).
                  - Project Structure (tree view explanation).
                  - Code Snippets (if relevant to explain usage).
                  
                  Style:
                  - Use clear headings.
                  - Use code blocks with language syntax highlighting.
                  - Be concise but comprehensive.
                  - Use emojis tastefully to make it engaging.
                  - If the project seems incomplete, suggest what is missing in a "Roadmap" section.
                `;

                const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                  method: "POST",
                  headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                    "model": "x-ai/grok-4.1-fast",
                    "messages": [
                      {
                        "role": "system",
                        "content": systemInstruction
                      },
                      {
                        "role": "user",
                        "content": `Here is the codebase context:\n${context}\n\nPlease generate the README.md now.`
                      }
                    ],
                    "reasoning": { "enabled": true },
                    "max_tokens": 1000000,
                    "temperature": 0.5
                  })
                });

                if (!response.ok) {
                  const errorText = await response.text();
                  console.error(`OpenRouter API Error: ${response.status} - ${errorText}`);
                  res.statusCode = response.status;
                  res.end(JSON.stringify({ error: `OpenRouter API Error: ${errorText}` }));
                  return;
                }

                const result = await response.json();
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(result));

              } catch (error) {
                console.error("Error generating README:", error);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
              }
            });
          });
        }
      }
    ],
    define: {
      'process.env.OPENROUTER_MODEL': JSON.stringify(env.OPENROUTER_MODEL),
      'process.env.OPENROUTER_API': JSON.stringify(env.OPENROUTER_API),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
