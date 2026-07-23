import os
import unittest
import re

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_DIR = os.path.join(BASE_DIR, 'src')

class TestAntigravityClient(unittest.TestCase):

    def test_d2_01_no_governance_logic(self):
        """D2-TEST-01: Antigravity client has no capability/governance knowledge"""
        forbidden_imports = ['capability_registry', 'runtime_validator', 'permission_engine', 'gstack', 'ai_reasoning']
        
        for root, dirs, files in os.walk(SRC_DIR):
            for file in files:
                if file.endswith('.ts'):
                    with open(os.path.join(root, file), 'r', encoding='utf-8') as f:
                        content = f.read()
                        for forbidden in forbidden_imports:
                            self.assertNotIn(forbidden, content, f"Forbidden term '{forbidden}' found in {file}")

    def test_d2_02_context_fidelity(self):
        """D2-TEST-02: Context mapping keeps observation contract intact"""
        extractor_path = os.path.join(SRC_DIR, 'context_extractor.ts')
        with open(extractor_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        self.assertIn("editor_source: 'antigravity'", content)
        self.assertIn("ast_node: astNode", content)
        self.assertNotIn("if ", content) # No branching context
        self.assertNotIn("analyze", content)

    def test_d2_03_04_execution_boundary_rendered(self):
        """D2-TEST-03 & 04: Execution boundary handled identically to VS Code"""
        webview_path = os.path.join(SRC_DIR, 'webview_renderer.ts')
        with open(webview_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Verify no bypass logic
        self.assertNotIn("retry", content.lower())
        self.assertNotIn("override", content.lower())
        self.assertNotIn("bypass", content.lower())
        # Verify it just delegates error rendering
        self.assertIn("this.showError(", content)

if __name__ == '__main__':
    unittest.main()
