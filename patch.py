import sys
with open('bin/install.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix kiloConfig bug
content = content.replace(
    "if (!Array.isArray(kiloConfig.skills) || typeof kiloConfig.skills !== 'object' || !kiloConfig.skills.paths) {",
    "if (!kiloConfig.skills || typeof kiloConfig.skills !== 'object' || Array.isArray(kiloConfig.skills) || !kiloConfig.skills.paths) {"
)

# Replace the interactive part with CLI parsing
start_marker = "rl.question(questionIde, (ideChoice) => {"
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

function runInstallation(ideChoice, scopeChoice) {
    const isGlobal = scopeChoice === '1';
"""

    old_body = content[start_idx:end_idx]
    
    # Extract the body inside rl.question(questionScope...)
    scope_start = "const isGlobal = scopeChoice === '1';"
    scope_start_idx = old_body.find(scope_start)
    scope_end = "    } catch (error) {"
    scope_end_idx = old_body.find(scope_end)
    
    inner_body = old_body[scope_start_idx + len(scope_start):scope_end_idx]
    
    replacement += inner_body
    replacement += """
    } catch (error) {
      console.error('? Có l?i x?y ra trong quá trình cài d?t:', error.message);
    } finally {
      rl.close();
    }
}

if (autoIde && autoScope) {
  console.log('\\n?? Running in non-interactive mode with IDE=' + autoIde + ', Scope=' + autoScope);
  runInstallation(autoIde, autoScope);
} else {
  rl.question(questionIde, (ideChoice) => {
    if (ideChoice === '0') {
      console.log('? Ðã b? qua c?u hình t? d?ng. Skill OS v?n du?c t?i v?, b?n có th? t? c?u hình file c?a IDE theo thu m?c hi?n t?i.');
      rl.close();
      return;
    }

    if (!['1', '2', '3', '4', '5', '6', '7'].includes(ideChoice)) {
      console.log('? L?a ch?n không h?p l?. Vui lòng ch?y l?i script.');
      rl.close();
      return;
    }

    rl.question(questionScope, (scopeChoice) => {
      if (!['1', '2'].includes(scopeChoice)) {
        console.log('? L?a ch?n không h?p l?. M?c d?nh s? cài Global.');
        scopeChoice = '1';
      }
      runInstallation(ideChoice, scopeChoice);
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
