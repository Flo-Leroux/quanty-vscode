import * as vscode from "vscode";
import { workspace, ExtensionContext } from "vscode";

import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
} from "vscode-languageclient/node";
import { LANGUAGE_ID } from "./language-id.const";

const clientName = "Quanty";
const clientId = "quanty";
let client: LanguageClient;

export async function activate(context: ExtensionContext) {
  let restartCmd = vscode.commands.registerCommand(
    `${LANGUAGE_ID}.restart`,
    async () => {
      await stopClient();
      startClient(context);
    }
  );

  let showLogsCmd = vscode.commands.registerCommand(
    `${LANGUAGE_ID}.showLogs`,
    () => {
      if (!client) return;
      client.outputChannel.show(true);
    }
  );

  context.subscriptions.push(restartCmd, showLogsCmd);

  startClient(context);
}

export async function deactivate() {
  await stopClient();
}

function startClient(context: ExtensionContext) {
  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  let serverOptions: ServerOptions = {
    run: { command: "quanty-lang" },
    debug: { command: "quanty-lang" },
  };

  let clientOptions: LanguageClientOptions = {
    // Register the server for Markdown documents.
    documentSelector: [{ scheme: "file", language: LANGUAGE_ID }],
  };

  client = new LanguageClient(
    LANGUAGE_ID,
    clientName,
    serverOptions,
    clientOptions
  );

  // Start the client. This will also launch the server.
  client.start();
}

async function stopClient() {
  if (!client) return;

  await client.stop();
  client.outputChannel.dispose();
  client.traceOutputChannel.dispose();
}
