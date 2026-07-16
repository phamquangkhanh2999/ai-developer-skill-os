import sys
with open('bin/install.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix kiloConfig bug
content = content.replace(
    "if (!Array.isArray(kiloConfig.skills) || typeof kiloConfig.skills !== 'object' || !kiloConfig.skills.paths) {",
    "if (!kiloConfig.skills || typeof kiloConfig.skills !== 'object' || Array.isArray(kiloConfig.skills) || !kiloConfig.skills.paths) {"
)

# Replace the interactive part with CLI parsing
start_marker = "rl.question(questionIde, (answerIde) => {"
end_marker = "    } catch (error) {\n      console.error('? Có l?i x?y ra trong quá trình cài d?t:', error.message);\n    } finally {\n      rl.close();\n    }\n  });\n});"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker) + len(end_marker)

if start_idx != -1 and end_idx != -1:
    replacement = """// Parse command line arguments for CI/CD automation
const args = process.argv.slice(2);
let autoIde = null;
let autoScope = null;

for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--ide=')) {
    autoIde = args[i].split('=')[1];
  }
  if (args[i].startsWith('--scope=')) {
    autoScope = args[i].split('=')[1];
  }
}

function runInstallation(answerIde, answerScope) {
"""

    old_body = content[start_idx:end_idx]
    
    # Extract the body inside rl.question(questionScope...)
    scope_start = "rl.question(questionScope, (answerScope) => {"
    scope_start_idx = old_body.find(scope_start) + len(scope_start)
    scope_end = "    } catch (error) {"
    scope_end_idx = old_body.find(scope_end)
    
    # Extract the ide logic before scope question
    ide_logic_start_idx = old_body.find("  let isGemini = false;")
    ide_logic_end_idx = old_body.find(scope_start)
    ide_logic = old_body[ide_logic_start_idx:ide_logic_end_idx]
    
    inner_body = old_body[scope_start_idx:scope_end_idx]
    
    replacement += ide_logic
    replacement += inner_body
    replacement += """
    } catch (error) {
      console.error('? Error during installation:', error.message);
    } finally {
      if (rl) rl.close();
    }
}

if (autoIde && autoScope) {
  console.log('\\n?? Running in non-interactive mode with IDE=' + autoIde + ', Scope=' + autoScope);
  runInstallation(autoIde, autoScope);
} else {
  rl.question(questionIde, (answerIde) => {
    if (answerIde.trim() === '0') {
      console.log('? B? qua cài d?t t? d?ng.');
      rl.close();
      return;
    }
    rl.question(questionScope, (answerScope) => {
      runInstallation(answerIde, answerScope);
    });
  });
}
"""
    content = content[:start_idx] + replacement + content[end_idx:]
    
    with open('bin/install.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Python patch applied.")
else:
    print("Could not find markers.")
