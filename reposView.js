// Sidebar webview
const vscode = require('vscode');

function getNonce() {
  return Math.random().toString(36).substring(2, 15);
}

class ReposView {
  constructor(extensionUri) {
    this.extensionUri = extensionUri;
  }

  resolveWebviewView(webviewView) {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.extensionUri]
    };
    const nonce = getNonce();

    webviewView.webview.html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy"
    content="default-src 'none'; img-src https: data:;
             script-src 'nonce-${nonce}'; connect-src https://api.github.com;">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      padding: 1rem;
      background: transparent;
      color: var(--vscode-foreground);
    }
    .search {
      width: 100%;
      padding: 0.6rem 0.8rem;
      font-size: 0.9rem;
      background: var(--vscode-input-background);
      border: 1px solid var(--vscode-input-border);
      border-radius: 6px;
      color: var(--vscode-input-foreground);
      outline: none;
      margin-bottom: 1rem;
    }
    .search:focus { border-color: var(--vscode-focusBorder); }
    .repos { display: flex; flex-direction: column; gap: 0.5rem; }
    .repo {
      padding: 0.75rem;
      background: var(--vscode-textCodeBlock-background);
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .repo:hover { background: var(--vscode-list-hoverBackground); }
    .repo-name {
      color: var(--vscode-textLink-foreground);
      font-weight: 600;
      font-size: 0.9rem;
      display: block;
    }
    .repo-desc {
      color: var(--vscode-foreground);
      opacity: 0.7;
      font-size: 0.8rem;
      margin-top: 0.25rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .repo-meta {
      display: flex;
      gap: 1rem;
      margin-top: 0.5rem;
      font-size: 0.75rem;
      color: var(--vscode-foreground);
      opacity: 0.6;
    }
    .lang-dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      display: inline-block;
      margin-right: 4px;
    }
    .empty, .loading, .error {
      text-align: center;
      padding: 2rem;
      color: var(--vscode-foreground);
      opacity: 0.6;
    }
    .error { color: var(--vscode-errorForeground); opacity: 1; }
  </style>
</head>
<body>
  <input type="text" class="search" id="username" placeholder="GitHub username..." />
  <div class="repos" id="repos"></div>

  <script nonce="${nonce}">
    const reposEl = document.getElementById('repos');
    let allRepos = [];

    const langColors = {
      JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
      Java: '#b07219', Go: '#00ADD8', Rust: '#dea584', Ruby: '#701516',
      PHP: '#4F5D95', 'C++': '#f34b7d', C: '#555555', Swift: '#F05138',
      Kotlin: '#A97BFF', Dart: '#00B4AB', HTML: '#e34c26', CSS: '#563d7c'
    };

    async function fetchRepos(username) {
      if (!username) { reposEl.innerHTML = ''; return; }
      reposEl.innerHTML = '<div class="loading">Loading...</div>';
      try {
        const res = await fetch(\`https://api.github.com/users/\${username}/repos?sort=updated&per_page=50\`);
        if (!res.ok) { reposEl.innerHTML = '<div class="error">User not found</div>'; return; }
        allRepos = await res.json();
        renderRepos();
      } catch {
        reposEl.innerHTML = '<div class="error">Network error</div>';
      }
    }

    function renderRepos() {
      if (allRepos.length === 0) {
        reposEl.innerHTML = '<div class="empty">No public repos</div>';
        return;
      }
      reposEl.innerHTML = allRepos.map(repo => \`
        <div class="repo" onclick="window.open('\${repo.html_url}', '_blank')">
          <span class="repo-name">\${repo.name}</span>
          \${repo.description ? \`<div class="repo-desc">\${repo.description}</div>\` : ''}
          <div class="repo-meta">
            \${repo.language
              ? \`<span><span class="lang-dot" style="background:\${langColors[repo.language] || '#8b949e'}"></span>\${repo.language}</span>\`
              : ''}
            <span>&#9733; \${repo.stargazers_count}</span>
            <span>&#8918; \${repo.forks_count}</span>
          </div>
        </div>
      \`).join('');
    }

    let timeout;
    document.getElementById('username').addEventListener('input', e => {
      clearTimeout(timeout);
      const u = e.target.value.trim();
      if (u) timeout = setTimeout(() => fetchRepos(u), 400);
      else reposEl.innerHTML = '';
    });
    document.getElementById('username').addEventListener('keydown', e => {
      if (e.key === 'Enter') { clearTimeout(timeout); fetchRepos(e.target.value.trim()); }
    });
  </script>
</body>
</html>`;
  }
}

module.exports = ReposView;
