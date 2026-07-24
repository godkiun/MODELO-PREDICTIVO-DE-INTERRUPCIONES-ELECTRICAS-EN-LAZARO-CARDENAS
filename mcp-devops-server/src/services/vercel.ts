export async function triggerVercelDeploy(target: 'production' | 'preview' = 'production') {
  const token = process.env.VERCEL_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  const teamId = process.env.VERCEL_TEAM_ID;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;

  if (!token || !projectId) {
    throw new Error("Faltan variables de entorno para Vercel (VERCEL_TOKEN, VERCEL_PROJECT_ID).");
  }

  let url = `https://api.vercel.com/v13/deployments`;
  if (teamId) url += `?teamId=${teamId}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'monitor-lazarocardenas',
      target: target,
      gitSource: owner && repo ? {
        type: 'github',
        repo: `${owner}/${repo}`,
        ref: 'master'
      } : undefined
    })
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error en Vercel API (${res.status}): ${errorText}`);
  }

  return await res.json();
}

export async function getVercelDeploymentStatus(deploymentId: string) {
  const token = process.env.VERCEL_TOKEN;
  const teamId = process.env.VERCEL_TEAM_ID;

  if (!token) {
    throw new Error("Falta la variable VERCEL_TOKEN.");
  }

  let url = `https://api.vercel.com/v13/deployments/${deploymentId}`;
  if (teamId) url += `?teamId=${teamId}`;

  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error obteniendo estado de Vercel (${res.status}): ${errorText}`);
  }
  return await res.json();
}
