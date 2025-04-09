# SwayWM MCP Server (swaywm-mcp)

[SwayWM](https://swaywm.org/) is windows manager for linux that aims to be a drop-in replacement for i3.

This is a Model Context Protocol (MCP) service that provides access to SwayWM window manager data and controls. It allows you to query and interact with your SwayWM environment through using an LLM and MCP client (cursor/claude desktop/copilotMCP/etc)

## Installation

### Using npx (Recommended/no installation required)

You can run the service directly using npx without installing it:

```bash
npx swaywm-mcp
```

### Using Nix

This project provides Nix integration for reproducible development environments and builds.

#### Installing with Nix Flakes (Recommended)

If you have Nix with flakes enabled:

```bash
# Run directly without installing
nix run github:cristianoliveira/swaywm-mcp

# Or install to your profile
nix profile install github:cristianoliveira/swaywm-mcp
```

#### Installing to NixOS System

Add to your configuration.nix:

```nix
{ pkgs, ... }:
{
  # Add flake inputs
  inputs.swaywm-mcp.url = "github:cristianoliveira/swaywm-mcp";
  
  # In your system configuration
  environment.systemPackages = with pkgs; [
    inputs.swaywm-mcp.packages.${system}.default
  ];
}
```

### Local Development

1. Clone this repository 
2. (optional) Enter the development shell:
   ```bash
   nix develop
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build the project:
   ```bash
   npm run build
   ```
5. Run the inspect service
   ```bash
   npm run inspect
   ```
6. Access http://localhost:6274/#resources

## Usage

### In order to quick check the service

Clone this repository and run the following command:

```bash
// in the project root directory
npm run inspect
```

It will start the [mcp inspector](https://github.com/modelcontextprotocol/inspector) and open a browser window with the inspector interface.

## Configuring MCP Clients

To use this MCP service with clients that support the Model Context Protocol (like Cursor), you need to configure the client to use this service. Here's how to do it:

### The standard MCP configuration

```json
{
  "mcpServers": {
    "swaywm-mcp": {
        "command": "npx",
        "args": ["swaywm-mcp"]
    }
  }
}
```

You MAY NEED to add `env` section like below, in case the MCP server runs in an isolated environment, is NOT the case for cursor-code, for instance.
```json
{
  "mcpServers": {
    "swaywm-mcp": {
        "command": "npx",
        "args": ["swaywm-mcp"],
        "env": {
          "SWAYMSG_BIN": "/usr/bin/swaymsg",
          "SWAYSOCK": "/run/user/<var>/sway-ipc.<var>.<var>.sock"
        }
    }
  }
}
```

In order to figure out the correct values:
```bash
# For SWAYMSG_BIN
which swaymsg

# For SWAYSOCK
sway --get-socketpath
```

### For Cursor

1. Open Cursor's settings
2. Navigate to the "AI" section
3. Find the "MCP Servers" configuration
4. Add a new MCP server with one of the following configurations:

### For Other MCP Clients

Look the step by step guide for your specific MCP client.

#### Configure using npx (Recommended)
```json
{
  "mcpServers": {
    "swaywm-mcp": {
      "name": "SwayWM",
      "command": "npx",
      "args": ["swaywm-mcp"],
    }
  }
}
```

#### Configure for development
```json
{
  "mcpServers": {
    "swaywm-mcp": {
      "command": "npm",
      "args": ["run", "dev"],
      "cwd": "/path/to/clonedrepo/swaywm-mcp"
    }
  }
}
```

Replace `/path/to/swaywm-mcp` with the actual path to this project on your system.

### Testing the Connection

To test if the server is running and accessible, you can use the following command:

```bash
npm run inspect
```

## Development

To modify or extend this service:

1. The main implementation is in `src/main.ts`
2. Add new tools using `server.tool()`
3. Add new resources using `server.resource()`
4. Rebuild using `npm run build`

## Requirements

- SwayWM
- Node.jsf
