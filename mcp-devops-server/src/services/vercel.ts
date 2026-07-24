export async function triggerVercelDeploy(target: 'production' | 'preview' = 'production') {
  const token = process.env.VERCEL_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  const teamId = process.env.VERCEL_TEAM_ID;

  if (!token || !projectId) {
    throw new Error("Faltan variables de entorno para Vercel (VERCEL_TOKEN, VERCEL_PROJECT_ID).");
  }

  let gitSource: any = undefined;
  try {
    let projUrl = `https://api.vercel.com/v9/projects/${projectId}`;
    if (teamId) projUrl += `?teamId=${teamId}`;
    const projRes = await fetch(projUrl, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (projRes.ok) {
      const projData = await projRes.json();
      if (projData.link && projData.link.repoId) {
        gitSource = {
          type: 'github',
          repoId: projData.link.repoId,
          ref: projData.link.productionBranch || 'main'
        };
      }
    }
  } catch (e) {
    // Ignore error fetching project link details
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
      name: 'voltlyzer-lc',
      target: target,
      gitSource: gitSource
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
