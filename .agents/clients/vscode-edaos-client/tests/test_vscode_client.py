import os
import unittest
import re

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_DIR = os.path.join(BASE_DIR, 'src')

class TestVsCodeClient(unittest.TestCase):

    def test_d1_01_client_cannot_bypass_permission(self):
        """D1-TEST-01: Client cannot bypass permission. WebviewRenderer must not have retry/override logic."""
        webview_path = os.path.join(SRC_DIR, 'webview_renderer.ts')
        with open(webview_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Verify no bypass logic
        self.assertNotIn("retry", content.lower())
        self.assertNotIn("override", content.lower())
        self.assertNotIn("bypass", content.lower())
        # Verify it just delegates error rendering
        self.assertIn("this.showError(", content)

    def test_d1_02_no_capability_knowledge(self):
        """D1-TEST-02: Client has no capability knowledge (no forbidden imports)"""
        forbidden_imports = ['capability_registry', 'runtime_validator', 'permission_engine', 'gstack', 'ai_reasoning']
        
        for root, dirs, files in os.walk(SRC_DIR):
            for file in files:
                if file.endswith('.ts'):
                    with open(os.path.join(root, file), 'r', encoding='utf-8') as f:
                        content = f.read()
                        for forbidden in forbidden_imports:
                            self.assertNotIn(forbidden, content, f"Forbidden term '{forbidden}' found in {file}")

    def test_d1_03_context_fidelity(self):
        """D1-TEST-03: Context Fidelity (ContextExtractor preserves source correctly)"""
        # We simulate the extractor behavior
        # In a real TS test, we would compile and run, but here we parse or simulate
        extractor_path = os.path.join(SRC_DIR, 'context_extractor.ts')
        with open(extractor_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        self.assertIn("editor_source: 'vscode'", content)
        self.assertIn("workspace: workspacePath", content)
        self.assertIn("file_reference: filePath", content)
        self.assertIn("intent: intent", content)
        # Ensure it doesn't do "if (workspacePath.includes('issue')) { ... }"
        self.assertNotIn("if ", content)
        self.assertNotIn("analyze", content)

if __name__ == '__main__':
    unittest.main()
