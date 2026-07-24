import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

import { getLatestWorkflowRuns, triggerWorkflow } from "./services/github.js";
import { triggerVercelDeploy, getVercelDeploymentStatus } from "./services/vercel.js";
import { reloadPythonAnywhereWebApp, getPythonAnywhereAppInfo } from "./services/pythonanywhere.js";

const server = new Server(
  { name: "mcp-devops-server", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "github_check_workflows",
        description: "Obtiene el estado de las últimas ejecuciones de workflows en GitHub Actions.",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "github_trigger_workflow",
        description: "Dispara manualmente un workflow de GitHub Actions en un repositorio.",
        inputSchema: {
          type: "object",
          properties: {
            workflowId: { type: "string", description: "Nombre del archivo de workflow (ej: deploy.yml) o su ID" },
            ref: { type: "string", description: "Nombre de la rama (por defecto 'main')" }
          },
          required: ["workflowId"]
        }
      },
      {
        name: "vercel_deploy_frontend",
        description: "Inicia un despliegue del frontend en Vercel.",
        inputSchema: {
          type: "object",
          properties: {
            target: { type: "string", enum: ["production", "preview"], description: "Entorno de destino" }
          }
        }
      },
      {
        name: "vercel_check_status",
        description: "Consulta el estado de un despliegue específico en Vercel.",
        inputSchema: {
          type: "object",
          properties: {
            deploymentId: { type: "string", description: "ID del despliegue en Vercel" }
          },
          required: ["deploymentId"]
        }
      },
      {
        name: "pythonanywhere_reload_webapp",
        description: "Recarga el servidor web Backend Flask en PythonAnywhere para aplicar los últimos cambios de código.",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "pythonanywhere_get_status",
        description: "Obtiene información del estado y configuración de la Web App en PythonAnywhere.",
        inputSchema: { type: "object", properties: {} }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result: unknown;

    switch (name) {
      case "github_check_workflows":
        result = await getLatestWorkflowRuns();
        break;

      case "github_trigger_workflow":
        result = await triggerWorkflow((args as any).workflowId, (args as any).ref);
        break;

      case "vercel_deploy_frontend":
        result = await triggerVercelDeploy((args as any)?.target || "production");
        break;

      case "vercel_check_status":
        result = await getVercelDeploymentStatus((args as any).deploymentId);
        break;

      case "pythonanywhere_reload_webapp":
        result = await reloadPythonAnywhereWebApp();
        break;

      case "pythonanywhere_get_status":
        result = await getPythonAnywhereAppInfo();
        break;

      default:
        throw new Error(`Herramienta '${name}' no reconocida.`);
    }

    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
    };
  } catch (error: any) {
    return {
      isError: true,
      content: [{ type: "text", text: `Error ejecutando ${name}: ${error.message}` }]
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP DevOps Server en ejecución sobre stdio...");
}

main().catch((err) => {
  console.error("Error iniciando Servidor MCP:", err);
  process.exit(1);
});
