import CodeMirror from "codemirror";
import "codemirror/mode/sparql/sparql";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/idea.css";
// ShowHint addon is required for completion capability.
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/edit/matchbrackets";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/runmode/runmode";
// import "codemirror/keymap/vim";

import { Workspace } from "@qualified/codemirror-workspace";
import "@qualified/codemirror-workspace/css/default.css";

const query = `SELECT *
FROM <http://example.com>
WHERE {
  ?s ?p ?o
}`;

const $ = (sel: string) => {
  const el = document.querySelector(sel);
  if (!el) throw new Error(`No element matching ${sel}`);
  return el as HTMLElement;
};

const config: CodeMirror.EditorConfiguration = {
  gutters: ["cmw-gutter"],
  lineNumbers: true,
  matchBrackets: true,
  autoCloseBrackets: true,
};

const jsonEditor = CodeMirror($("#editor"), {
  ...config,
  mode: "application/sparql-query",
  value: query,
});

const WORKER = "sparql-worker";
const workspace = new Workspace({
  rootUri: "inmemory://workspace/",
  getLanguageAssociation: (uri: string) => {
    if (uri.endsWith(".rq") || uri.endsWith(".ru")) {
      return { languageId: "sparql", languageServerIds: [WORKER] };
    }
    return null;
  },
  getConnectionString: async (id: string) => {
    switch (id) {
      case WORKER:
        return "js/sparql.js";
      default:
        return "";
    }
  },
});

workspace.openTextDocument("query.rq", jsonEditor);
