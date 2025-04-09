#!/usr/bin/env node
import logger from "./logger.js";

import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { exec } from "child_process";
import { promisify } from "util";
import { find } from "./sway-querier.js";

const execAsync = promisify(exec);

// Create an MCP server
const server = new McpServer({
  name: "SwayWM MCP",
 // NOTE: Update ../package.json version when changing this
  version: '0.0.1',
});

// Helper function to execute swaymsg commands
async function swaymsg(command: string): Promise<any> {
  logger.debug(`Executing swaymsg command: ${command}`);
  try {
    const { stdout } = await execAsync(`swaymsg --raw ${command}`);
    return JSON.parse(stdout);
  } catch (error) {
    logger.error(`Error executing swaymsg ${command}:`, error);
    console.error(`Error executing swaymsg ${command}:`, error);
    throw error;
  }
}

// Get all workspaces
server.tool("workspaces", "Get all workspaces", {}, async () => {
  const workspaces = await swaymsg("-t get_workspaces");
  return {
    content: [{ type: "text", text: JSON.stringify(workspaces, null, 2) }],
  };
});

// Get all outputs (monitors)
server.tool("outputs", "Get all outputs", {}, async () => {
  const outputs = await swaymsg("-t get_outputs");
  return {
    content: [{ type: "text", text: JSON.stringify(outputs, null, 2) }],
  };
});

// Get all windows
server.tool("windows", "Get all windows", {}, async () => {
  const tree = await swaymsg("-t get_tree");
  return {
    content: [{ type: "text", text: JSON.stringify(tree, null, 2) }],
  };
});

// Get focused window
server.tool("focused", "Get focused window", {}, async () => {
  const tree = await swaymsg("-t get_tree");
  const focused = find(tree, (node: any) => {
    return node.focused
  });
  return {
    content: [{ type: "text", text: JSON.stringify(focused[0], null, 2) }],
  };
});

// Get input devices
server.tool("inputs", "Get all input devices", {}, async () => {
  const inputs = await swaymsg("-t get_inputs");
  return {
    content: [{ type: "text", text: JSON.stringify(inputs, null, 2) }],
  };
});

// Execute a sway command
server.tool("execute", "Execute a sway command", {
  command: z.string()
    .describe("The sway command to execute")
    .default(""),
}, async ({ command }) => {
  try {
    await swaymsg(command);
    return {
      content: [{ type: "text", text: `Successfully executed: ${command}` }],
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error executing command: ${error}` }],
    };
  }
});

// Add a dynamic workspace resource
server.resource(
  "workspace",
  new ResourceTemplate("workspace://{name}", { list: undefined }),
  async (uri, { name }) => {
    const workspaces = await swaymsg("-t get_workspaces");
    const workspace = workspaces.find((w: any) => w.name === name);
    
    if (!workspace) {
      return {
        contents: [
          {
            uri: uri.href,
            text: `Workspace "${name}" not found`,
          },
        ],
      };
    }

    return {
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(workspace, null, 2),
        },
      ],
    };
  }
);

logger.info("SwayWM MCP server started");

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport); 
