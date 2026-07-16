const fs = require('fs');
let content = fs.readFileSync('bin/install.js', 'utf8');

// Fix kiloConfig bug
content = content.replace(
    "if (!Array.isArray(kiloConfig.skills) || typeof kiloConfig.skills !== 'object' || !kiloConfig.skills.paths) {",
    "if (!kiloConfig.skills || typeof kiloConfig.skills !== 'object' || Array.isArray(kiloConfig.skills) || !kiloConfig.skills.paths) {"
);

// Replace interactive prompt
const startMarker = "rl.question(questionIde, (answerIde) => {";
const endMarker = "} catch (error) {\\n      console.error('? Có l?i x?y ra trong quá trình cài d?t:', error.message);\\n    } finally {\\n      rl.close();\\n    }\\n  });\\n});";

const startIdx = content.indexOf(startMarker);
// Actually simpler regex
