import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import 'monaco-editor/esm/vs/basic-languages/python/python.contribution';

document.addEventListener('DOMContentLoaded', function () {
    const editorSpace = document.querySelector(".monaco-editor");
    monaco.editor.create(editorSpace, {
        value: "print('Hello, World!')",
        language: "python",
        automaticLayout: true,
        minimap: {
            enabled: true
        }
    });
});
