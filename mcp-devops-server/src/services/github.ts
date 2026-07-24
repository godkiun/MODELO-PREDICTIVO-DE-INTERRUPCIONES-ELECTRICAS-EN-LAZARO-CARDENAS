export async function getLatestWorkflowRuns() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;

  if (!token || !owner || !repo) {
    throw new Error("Faltan variables de entorno para GitHub (GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO).");
  }

  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/runs?per_page=5`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'MCP-DevOps-Server'
    }
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error en GitHub API (${res.status}): ${errorText}`);
  }
  return await res.json();
}

export async function triggerWorkflow(workflowId: string, ref: string = 'main') {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;

  if (!token || !owner || !repo) {
    throw new Error("Faltan variables de entorno para GitHub (GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO).");
  }

  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflowId}/dispatches`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'MCP-DevOps-Server',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ref })
  });

  if (!res.ok && res.status !== 204) {
    const errorText = await res.text();
    throw new Error(`Error disparando workflow en GitHub (${res.status}): ${errorText}`);
  }
  return { success: true, message: `Workflow '${workflowId}' disparado exitosamente en la rama '${ref}'.` };
}
