// Full editor panel webview
const vscode = require('vscode');

let currentPanel = null;

function showWebview(extensionUri) {
  if (currentPanel) {
    currentPanel.reveal(vscode.ViewColumn.One);
    return;
  }

  currentPanel = vscode.window.createWebviewPanel(
    'githubReposFull', 'GitHub Repos', vscode.ViewColumn.One,
    { enableScripts: true, localResourceRoots: [extensionUri] }
  );

  currentPanel.webview.html = getWebviewContent();
  currentPanel.onDidDispose(() => { currentPanel = null; });
}

function getWebviewContent() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GitHub Repos</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: var(--vscode-editor-background);
      color: var(--vscode-editor-foreground);
      padding: 2rem;
      height: 100vh;
      overflow: hidden;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .header { margin-bottom: 1.5rem; }
    .search-box input {
      width: 100%;
      padding: 0.75rem 1rem;
      font-size: 1rem;
      background: var(--vscode-input-background);
      border: 1px solid var(--vscode-input-border);
      border-radius: 6px;
      color: var(--vscode-input-foreground);
      outline: none;
    }
    .search-box input:focus { border-color: var(--vscode-focusBorder); }
    .profile {
      display: none;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: var(--vscode-textCodeBlock-background);
      border-radius: 6px;
      margin-bottom: 1rem;
    }
    .profile.visible { display: flex; }
    .profile img { width: 50px; height: 50px; border-radius: 50%; }
    .profile-info h2 { font-size: 1.1rem; }
    .profile-info p { opacity: 0.7; font-size: 0.85rem; }
    .profile-stats { display: flex; gap: 1rem; margin-top: 0.5rem; font-size: 0.8rem; opacity: 0.7; }
    .toolbar { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
    .filter-input, select {
      padding: 0.5rem;
      font-size: 0.85rem;
      background: var(--vscode-input-background);
      border: 1px solid var(--vscode-input-border);
      border-radius: 6px;
      color: var(--vscode-input-foreground);
    }
    .filter-input { flex: 1; }
    .count { padding: 0.5rem; font-size: 0.85rem; opacity: 0.7; align-self: center; }
    .repos {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .repo {
      padding: 1rem;
      background: var(--vscode-textCodeBlock-background);
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .repo:hover { background: var(--vscode-list-hoverBackground); }
    .repo-header { display: flex; justify-content: space-between; align-items: center; }
    .repo-name { color: var(--vscode-textLink-foreground); font-weight: 600; text-decoration: none; }
    .repo-name:hover { text-decoration: underline; }
    .repo-badge {
      font-size: 0.7rem;
      padding: 0.2rem 0.5rem;
      background: var(--vscode-badge-background);
      color: var(--vscode-badge-foreground);
      border-radius: 9999px;
    }
    .repo-desc { margin-top: 0.5rem; font-size: 0.85rem; opacity: 0.7; line-height: 1.4; }
    .repo-meta { display: flex; gap: 1rem; margin-top: 0.75rem; font-size: 0.75rem; opacity: 0.6; }
    .lang-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 4px; }
    .empty, .loading, .error { text-align: center; padding: 3rem; opacity: 0.6; }
    .error { color: var(--vscode-errorForeground); opacity: 1; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="search-box">
        <input type="text" id="username" placeholder="Enter GitHub username..." />
      </div>
    </div>
    <div class="profile" id="profile">
      <img id="avatar" src="" alt="" />
      <div class="profile-info">
        <h2 id="name"></h2>
        <p id="login"></p>
        <div class="profile-stats">
          <span id="reposCount"></span>
          <span id="followers"></span>
          <span id="following"></span>
        </div>
      </div>
    </div>
    <div class="toolbar">
      <input type="text" class="filter-input" id="filter" placeholder="Filter repositories..." />
      <select id="sort">
        <option value="updated_at">Recently updated</option>
        <option value="stargazers_count">Most stars</option>
        <option value="forks_count">Most forks</option>
        <option value="full_name">Name</option>
      </select>
      <span class="count" id="count"></span>
    </div>
    <div class="repos" id="repos"></div>
  </div>

  <script>
    const langColors = {
      JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
      Java: '#b07219', Go: '#00ADD8', Rust: '#dea584', Ruby: '#701516',
      PHP: '#4F5D95', 'C++': '#f34b7d', C: '#555555', Swift: '#F05138',
      Kotlin: '#A97BFF', Dart: '#00B4AB', HTML: '#e34c26', CSS: '#563d7c'
    };

    let allRepos = [];

    async function fetchUser(username) {
      const reposEl = document.getElementById('repos');
      reposEl.innerHTML = '<div class="loading">Loading...</div>';
      document.getElementById('profile').classList.remove('visible');

      try {
        const [userRes, reposRes] = await Promise.all([
          fetch(\`https://api.github.com/users/\${username}\`),
          fetch(\`https://api.github.com/users/\${username}/repos?sort=updated&per_page=100\`)
        ]);
        if (!userRes.ok) { reposEl.innerHTML = '<div class="error">User not found</div>'; return; }

        const user = await userRes.json();
        allRepos = await reposRes.json();

        document.getElementById('avatar').src = user.avatar_url;
        document.getElementById('name').textContent = user.name || user.login;
        document.getElementById('login').textContent = '@' + user.login;
        document.getElementById('reposCount').textContent = '&#128193; ' + user.public_repos;
        document.getElementById('followers').textContent = '&#128101; ' + user.followers;
        document.getElementById('following').textContent = '&#128100; ' + user.following;
        document.getElementById('profile').classList.add('visible');

        renderRepos();
      } catch {
        document.getElementById('repos').innerHTML = '<div class="error">Network error</div>';
      }
    }

    function renderRepos() {
      const filter = document.getElementById('filter').value.toLowerCase();
      const sort   = document.getElementById('sort').value;
      const reposEl = document.getElementById('repos');

      const filtered = allRepos
        .filter(r => r.name.toLowerCase().includes(filter))
        .sort((a, b) => {
          if (sort === 'full_name')  return a.full_name.localeCompare(b.full_name);
          if (sort === 'updated_at') return new Date(b.updated_at) - new Date(a.updated_at);
          return b[sort] - a[sort]; // numeric: stargazers_count, forks_count
        });

      document.getElementById('count').textContent = filtered.length + ' repos';

      if (filtered.length === 0) {
        reposEl.innerHTML = '<div class="empty">No matching repos</div>';
        return;
      }

      reposEl.innerHTML = filtered.map(repo => \`
        <div class="repo" onclick="window.open('\${repo.html_url}', '_blank')">
          <div class="repo-header">
            <a class="repo-name" href="#">\${repo.name}</a>
            \${repo.license ? \`<span class="repo-badge">\${repo.license.spdx_id}</span>\` : ''}
          </div>
          \${repo.description ? \`<div class="repo-desc">\${repo.description}</div>\` : ''}
          <div class="repo-meta">
            \${repo.language
              ? \`<span><span class="lang-dot" style="background:\${langColors[repo.language] || '#8b949e'}"></span>\${repo.language}</span>\`
              : ''}
            <span>&#9733; \${repo.stargazers_count.toLocaleString()}</span>
            <span>&#8918; \${repo.forks_count.toLocaleString()}</span>
          </div>
        </div>
      \`).join('');
    }

    let timeout;
    document.getElementById('username').addEventListener('input', e => {
      clearTimeout(timeout);
      const u = e.target.value.trim();
      if (u) timeout = setTimeout(() => fetchUser(u), 400);
    });
    document.getElementById('username').addEventListener('keydown', e => {
      if (e.key === 'Enter') { clearTimeout(timeout); fetchUser(e.target.value.trim()); }
    });
    document.getElementById('filter').addEventListener('input', renderRepos);
    document.getElementById('sort').addEventListener('change', renderRepos);
  </script>
</body>
</html>`;
}

module.exports = { showWebview };
