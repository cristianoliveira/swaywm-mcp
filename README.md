# SwayWM MCP Service

This is a Model Context Protocol (MCP) service that provides access to SwayWM window manager data and controls. It allows you to query and interact with your SwayWM environment through a standardized protocol.

## Installation

### Using npx (Recommended)

You can run the service directly using npx without installing it:

```bash
npx swaywm-mcp
```

### Local Development

1. Make sure you have Nix installed
2. Clone this repository
3. Enter the development shell:
   ```bash
   nix develop
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Build the project:
   ```bash
   npm run build
   ```

## Usage Examples

### Starting the Service

You can start the service in three ways:

#### 1. Using npx (Recommended)
```bash
npx swaywm-mcp
```

#### 2. Development Mode
```bash
npm run dev
```

#### 3. Production Mode (Using Built Version)
```bash
node dist/main.js
```

### Available Tools

#### 1. List All Workspaces

```typescript
// Returns a list of all workspaces with their properties
const result = await mcp.workspaces();
console.log(result.content[0].text);
```

Example output:
```json
[
  {
    "id": 1,
    "name": "1",
    "rect": {
      "x": 0,
      "y": 0,
      "width": 1920,
      "height": 1080
    },
    "focused": true,
    "focus": [1, 2, 3],
    "border": "normal",
    "current_border_width": 2,
    "layout": "splith",
    "orientation": "horizontal",
    "percent": 1,
    "window_rect": {
      "x": 0,
      "y": 0,
      "width": 1920,
      "height": 1080
    },
    "deco_rect": {
      "x": 0,
      "y": 0,
      "width": 0,
      "height": 0
    },
    "geometry": {
      "x": 0,
      "y": 0,
      "width": 1920,
      "height": 1080
    },
    "window": null,
    "urgent": false,
    "floating_nodes": [],
    "nodes": [],
    "fullscreen_mode": 0,
    "sticky": false,
    "num": 1,
    "output": "HDMI1",
    "type": "workspace",
    "representation": null
  }
]
```

#### 2. Get Monitor Information

```typescript
// Returns information about all connected monitors
const result = await mcp.outputs();
console.log(result.content[0].text);
```

Example output:
```json
[
  {
    "id": 1,
    "name": "HDMI1",
    "make": "Unknown",
    "model": "Unknown",
    "serial": "Unknown",
    "active": true,
    "dpms": true,
    "power": true,
    "primary": true,
    "scale": 1,
    "scale_filter": "nearest",
    "transform": "normal",
    "adaptive_sync": false,
    "current_mode": {
      "width": 1920,
      "height": 1080,
      "refresh": 60
    },
    "rect": {
      "x": 0,
      "y": 0,
      "width": 1920,
      "height": 1080
    },
    "current_workspace": "1",
    "focused": true
  }
]
```

#### 3. Get Window Tree

```typescript
// Returns the complete window tree
const result = await mcp.windows();
console.log(result.content[0].text);
```

#### 4. Get Focused Window

```typescript
// Returns information about the currently focused window
const result = await mcp.focused();
console.log(result.content[0].text);
```

#### 5. Get Input Devices

```typescript
// Returns information about all input devices
const result = await mcp.inputs();
console.log(result.content[0].text);
```

#### 6. Execute Sway Commands

```typescript
// Execute any sway command
const result = await mcp.execute({ command: "workspace 2" });
console.log(result.content[0].text);
```

### Resources

#### Access Workspace Information

```typescript
// Get information about a specific workspace
const result = await mcp.getResource("workspace://1");
console.log(result.contents[0].text);
```

## Configuring MCP Clients

To use this MCP service with clients that support the Model Context Protocol (like Cursor), you need to configure the client to use this service. Here's how to do it:

### For Cursor

1. Open Cursor's settings
2. Navigate to the "AI" section
3. Find the "MCP Servers" configuration
4. Add a new MCP server with one of the following configurations:

#### Using npx (Recommended)
```json
{
  "name": "SwayWM",
  "command": "npx",
  "args": ["swaywm-mcp"],
  "cwd": "/"
}
```

#### Development Mode
```json
{
  "name": "SwayWM",
  "command": "npm",
  "args": ["run", "dev"],
  "cwd": "/path/to/swaywm-mcp"
}
```

#### Production Mode (Using Built Version)
```json
{
  "name": "SwayWM",
  "command": "node",
  "args": ["dist/main.js"],
  "cwd": "/path/to/swaywm-mcp"
}
```

Replace `/path/to/swaywm-mcp` with the actual path to this project on your system.

### For Other MCP Clients

For other clients that support MCP, you'll need to configure them to use either:

#### Using npx (Recommended)
1. Execute the command: `npx swaywm-mcp`
2. No specific working directory required
3. Use stdio for communication

#### Development Mode
1. Execute the command: `npm run dev`
2. In the working directory: `/path/to/swaywm-mcp`
3. Use stdio for communication

#### Production Mode
1. Execute the command: `node dist/main.js`
2. In the working directory: `/path/to/swaywm-mcp`
3. Use stdio for communication

The exact configuration will depend on the client, but these are the core requirements.

### Testing the Connection

To test if your client is properly connected to the MCP service:

1. Start the MCP service using any of the methods above
2. In your client, try to use one of the available tools, like:
   ```typescript
   const result = await mcp.workspaces();
   console.log(result.content[0].text);
   ```
3. If you see workspace information, the connection is working

## Integration with Other Tools

This MCP service can be integrated with various tools that support the Model Context Protocol. For example:

1. AI assistants can query workspace information
2. Status bars can get real-time window information
3. Window switchers can get the complete window tree
4. System monitors can track workspace usage

## Development

To modify or extend this service:

1. The main implementation is in `src/main.ts`
2. Add new tools using `server.tool()`
3. Add new resources using `server.resource()`
4. Rebuild using `npm run build`

## Requirements

- SwayWM
- Node.js
- jq
