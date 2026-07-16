const fs = require('fs');
let content = fs.readFileSync('bin/install.js', 'utf8');

const replacement = \// Parse command line arguments for CI/CD automation
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
  const isGlobal = scopeChoice === '1';\;

content = content.replace(/rl\.question\\(questionIde, \\(ideChoice\\) => \\{[\\s\\S]*?const isGlobal = scopeChoice === '1';/, replacement);

const endReplacement = \    } catch (error) {
      console.error('? Có l?i x?y ra trong quá trình cài d?t:', error.message);
    } finally {
      if (rl) rl.close();
    }
}

if (autoIde && autoScope) {
  console.log('\\n?? Running in non-interactive mode with IDE=' + autoIde + ', Scope=' + autoScope);
  runInstallation(autoIde, autoScope);
  if (rl) rl.close();
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
}\;

content = content.replace(/    \\} catch \\(error\\) \\{\\s*console\\.error\\('? Có l?i x?y ra trong quá trình cài d?t:', error\\.message\\);\\s*\\} finally \\{\\s*rl\\.close\\(\\);\\s*\\}\\s*\\}\\);\\s*\\}\\);/, endReplacement);

fs.writeFileSync('bin/install.js', content);
console.log('Done');
