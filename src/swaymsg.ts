import { exec } from "child_process";
import { promisify } from "util";
import logger from "./logger.js";
import type { SwayNode } from "./types.d.js";

const swaymsgBin = process.env.SWAYMSG_BIN || "swaymsg";
const execAsync = promisify(exec);

/**
 * Executes a swaymsg command and returns the parsed JSON output.
 *
 * @param {string} command - The swaymsg command to execute.
 * @returns {Promise<T>} - A promise that resolves to the parsed JSON output.
 */
const swaymsg = async <T extends SwayNode | SwayNode[]>(command: string): Promise<T> => {
  logger.debug(`Executing swaymsg command: ${command}`);
  try {
    const { stdout } = await execAsync(`${swaymsgBin} --raw ${command}`);
    return JSON.parse(stdout) as T;
  } catch (error) {
    logger.error(`Error executing swaymsg ${command}:`, error);
    console.error(`Error executing swaymsg ${command}:`, error);
    throw error;
  }
}

/**
 * sendCommand - Sends a command to swaymsg.
 *
 * @param {string} command - The command to send.
 * @returns {Promise<void>} - A promise that resolves when the command is sent.
 **/
export const sendCommand = async (command: string): Promise<void> => {
    logger.debug(`Sending command to swaymsg: ${command}`);
    await swaymsg(command);
}

/**
 * fetchTree - Fetches the entire Sway tree.
 *
 * @returns {Promise<SwayNode>} - A promise that resolves to the root node of the Sway tre*/
export const fetchTree = async (): Promise<SwayNode> => {
  const tree = await swaymsg<SwayNode>("-t get_tree");
  return tree;
}

/**
 * fetchWorkspaces - Fetches all workspaces.
 *
 * @returns {Promise<SwayNode[]>} - A promise that resolves to an array of SwayNode objects representing workspaces.
 */
export const fetchWorkspaces = async (): Promise<SwayNode[]> => {
  const workspaces = await swaymsg<SwayNode[]>("-t get_workspaces");
  return workspaces;
}

/**
 * fetchOutputs - Fetches all outputs.
 *
 * @returns {Promise<SwayNode[]>} - A promise that resolves to an array of SwayNode objects representing outputs.
 */
export const fetchOutputs = async (): Promise<SwayNode[]> => {
  const outputs = await swaymsg<SwayNode[]>("-t get_outputs");
  return outputs;
}

/**
 * fetchInputs - Fetches all input devices.
 *
 * @returns {Promise<SwayNode[]>} - A promise that resolves to an array of SwayNode objects representing input devices.
 */
export const fetchInputs = async (): Promise<SwayNode[]> => {
  const inputs = await swaymsg<SwayNode[]>("-t get_inputs");
  return inputs;
}


