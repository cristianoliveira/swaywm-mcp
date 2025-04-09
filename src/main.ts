#!/usr/bin/env node
import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import type { SwayNode } from "./types.d.js";
import logger from "./logger.js";
import * as sq from "./sway-querier.js";
import * as swaymsg from "./swaymsg.js";

const server = new McpServer({
  name: "SwayWM MCP",
 // NOTE: Update ../package.json version when changing this
  version: '0.0.1',
});

// Get all workspaces
server.tool("workspaces", "Get all workspaces", {}, async () => {
  const workspaces = await swaymsg.fetchWorkspaces();
  return {
    content: [{ type: "text", text: JSON.stringify(workspaces, null, 2) }],
  };
});

// Get all outputs (monitors)
server.tool("outputs", "Get all outputs", {}, async () => {
  const outputs = await swaymsg.fetchOutputs();
  return {
    content: [{ type: "text", text: JSON.stringify(outputs, null, 2) }],
  };
});

// Get all windows
server.tool("windows", "Get all windows", {}, async () => {
  const tree = await swaymsg.fetchTree();
  return {
    content: [{ type: "text", text: JSON.stringify(tree, null, 2) }],
  };
});

// Get focused window
server.tool("focused", "Get focused window", {}, async () => {
  const tree = await swaymsg.fetchTree();
  const focused = sq.find(tree, ({ focused }: SwayNode) => focused);
  return {
    content: [{ type: "text", text: JSON.stringify(focused[0], null, 2) }],
  };
});

// Get input devices
server.tool("inputs", "Get all input devices", {}, async () => {
  const inputs = await swaymsg.fetchInputs();
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
    await swaymsg.sendCommand(command);
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
    const workspaces = await swaymsg.fetchWorkspaces();
    const workspace: SwayNode | undefined = workspaces.find((w: SwayNode) => w.name === name);
    
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
