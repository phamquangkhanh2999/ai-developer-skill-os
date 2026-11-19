import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export const MANAGED_MANIFEST_FILE = '.ai-skill-os-managed.json';

const EXCLUDED_PATTERNS = [
  /^\.ai-local/,
  /^DEV_PROFILE\.md$/,
  /^\.git/,
  /^\.ai-skill-os-version$/,
  /^\.ai-skill-os-managed\.json$/,
  /\.backup-[\d]+$/,
  /\.system-new$/
];

// Repository-internal governance/specification files kept in package source (.agents/)
// for contract tests, but excluded from downstream user workspace installations.
export const SOURCE_ONLY_PATTERNS = [
  /^docs(?:\/|$)/,
  /^LICENSE$/
];

export const V10_RETIRED_FILES_FINGERPRINTS = {
  'skills/qk-product-spec/SKILL.md': 'a3eafcffa626932bcf4702c349056750d3ebdd38db2f35b3a3cd571634dc4bb8',
  'skills/qk-ui-engineer/SKILL.md': '3994fda574ad40551d5c423974c57e5caee617889c709ad070476d60520157df',
  'skills/qk-backend-data/SKILL.md': 'cc3b50dc76f5399f6717e2259a7f748d3ebd39b980945a9b8eb70bee3ce6a67f',
  'skills/qk-api-data-discovery/SKILL.md': '40e8c430ab03acdf5d441fa311d2888fb71f46cd43a5ecabad0d52f7661885d8',
  'skills/qk-api-data-discovery/references/bronze-record-format.md': 'de7b4c3eb2071d9ab58bebd87c4431bed3abd839dc26b29e1d2c8c399e529e18',
  'skills/qk-api-data-discovery/references/data-contract-yaml.md': '1088a859424919f41e635997cfd08f626c453033a8f2e3af7bcb32f648515ade',
  'skills/qk-api-data-discovery/references/discovery-report-template.md': '8ee21b6a80303d0883d8c73b5d425875fdbd89e35ee7df4c300ca7a074be5ea9',
  'skills/qk-prompt-compiler/SKILL.md': '9fcc46abc7238698f8be2e3f8e0c138e68049095187a240beb9d389d56f71a1f',
  'skills/qk-orchestrator/SKILL.md': '11834e5213f5e2c0c024173e1f805670e21d1165dff82a9e75a9d77700b1ef1b',
  'skills/qk-orchestrator/evals/scorecard.yaml': 'e4444f5087921a66ae8ea1b741ae3d883f2cce6616f0eaf85b063e490809',
  'skills/qk-orchestrator/references/routing-table.md': '0597eb8f30fe56cc8ca84de7d382e94387d66e3136ae095a7df980c4be62cc33',
  'skills/_template/SKILL.md': '2299ce2d663f3ee33d912a82e2f554a6aaa4175bde72be26c74e75e5207c6b13',
  'skills/qk-code-review/references/ai/ai-anti-patterns.md': 'cbbccd5cd9639c0896e141011ea9e0496dde9258dc651fad533fb79db4fceaf4',
  'skills/qk-code-review/references/ai/schema-validation.md': '317a0112ffecd7648ab162bca244b78d2ab7dd6d250600cb04492df8cf62e1a1',
  'skills/qk-code-review/references/cross-cutting/architecture-review-guide.md': '83d3d95a16b496ec8c0886a06a61a38b932a27ec79dbdd67f070bb472ef38fbb',
  'skills/qk-code-review/references/cross-cutting/async-concurrency-patterns.md': '70cd46106c863c0722dbc7ca034c684bda2af21ed213a1d7f7759819e49e2ee2',
  'skills/qk-code-review/references/cross-cutting/code-quality-universal.md': 'dc926d5391d1af3127efb6808c20f261630261b1676301d263967ebc65a3147c',
  'skills/qk-code-review/references/cross-cutting/code-review-best-practices.md': '6663e9aa749e48fa156fd55f89d6495f21c3edea763c2dc2f07d6bfef8ba0400',
  'skills/qk-code-review/references/cross-cutting/common-bugs-checklist.md': '7fee98b19a7db75bdf0428dff53ec0c4d29e6c0f616cea3b54c3d95d0c3865a6',
  'skills/qk-code-review/references/cross-cutting/error-handling-principles.md': 'a2b2139bffa96482e1f14d7de94a9d4648749b1b1eb0925dbf3cd07a50f226bf',
  'skills/qk-code-review/references/cross-cutting/n-plus-one-queries.md': '015bb5d3291882f792d12858500bbf59e98a14d1a5d0700db5640dbf06386a1a',
  'skills/qk-code-review/references/cross-cutting/performance-review-guide.md': '9f3dc41bc2e0a8c294e368516ce29b401d8c8ec10b4c0180f7db6d165d0441a6',
  'skills/qk-code-review/references/cross-cutting/security-review-guide.md': '0669eb4a08dd0ca1da4857f9cb2868e5d4f68e640d55585090a63d408e894102',
  'skills/qk-code-review/references/cross-cutting/sql-injection-prevention.md': 'c54b67fd73e280e0db7e89199b57212e3627dc460e670c3cc6d144c8c6d1d7e5',
  'skills/qk-code-review/references/cross-cutting/xss-prevention.md': '2d9118e7498f27c63ecb3c78ff9c549ec135a6c9cc170f9989181e0d9fc1cb36',
  'skills/qk-code-review/references/languages/angular.md': 'ce9013d7b60c6f8a928f0616f656817aed289090da5e2cc960e5d59febb9dac1',
  'skills/qk-code-review/references/languages/c.md': 'c153b752e298ba8e85ceaa13cfb0c5352b07251848c678ebd9da491aa78a4713',
  'skills/qk-code-review/references/languages/cpp.md': '8bf4da1da035ec0db5cc55deab021e6042b250b014d07c2d7505aa4bc1917a04',
  'skills/qk-code-review/references/languages/csharp.md': '8b9bc0211500ee240b6802e3ccb846ce4db4aced6de47da357a3aaaaf1503c98',
  'skills/qk-code-review/references/languages/css-less-sass.md': '22148c2ef86004f28c3c6af94d3d68ad4e19f92b86ef1010bc487cc0588f3bcc',
  'skills/qk-code-review/references/languages/django.md': 'b7ffaf6da75ca3b16408c121ff173f02928c29a4dba0cd71509d569b26603196',
  'skills/qk-code-review/references/languages/fastapi.md': 'bf52fb055aceba62aaa16de6e946a7c4c55cb79f1d52c3d3468fe6c6949ca915',
  'skills/qk-code-review/references/languages/go.md': 'c183c3ab9440f4f4ab6f2e6862648781042f5cd4de2ca505ee6a9af3acd528c4',
  'skills/qk-code-review/references/languages/java.md': '07083e47b279f8a72bba16a7a5bfafe2af5c03ce14dbd048e0561eb84779edf9',
  'skills/qk-code-review/references/languages/java8.md': 'ffa415e3d7f2ce70cefb631977a17454d43b69bf2d72a56108e867761ac8adb3',
  'skills/qk-code-review/references/languages/kotlin.md': '8bc062bf0a675471cb7ba1fe9becf3ab4f64861432b1aec3300b451017f95457',
  'skills/qk-code-review/references/languages/nestjs.md': '786016c5b692ce0b5fa34d4db96160ca53b479c787059db68fb54daf46fb3a46',
  'skills/qk-code-review/references/languages/php.md': '2e40d0e04b9a37f5d42792b1ee401070a2b3decc726a711ba4200e5c03329b95',
  'skills/qk-code-review/references/languages/python.md': 'e0df57bd897f2dd344a21791b04f739a00c7b93a32fc64ec505195048a2ef94c',
  'skills/qk-code-review/references/languages/qt.md': '922ed0fe1362bd0a0959e7be81f62c1cf9b77b4e9ad285e189db66fac7751b0e',
  'skills/qk-code-review/references/languages/react.md': '119a2b0be6966d162fbd2be76d3d10c0fd09cdb3d8e76be6ec9d5ed901332bd9',
  'skills/qk-code-review/references/languages/ruby.md': '4cd96f8d5062bea49c06eca7db790bf06d35ace42eced0d6d019d7e55254c2f2',
  'skills/qk-code-review/references/languages/rust.md': '1bb761f7aada1c597f0a4a7d857f3762673d7e017710402dc17b093fdd9fb569',
  'skills/qk-code-review/references/languages/svelte.md': '519da3dc582688b6d71e30898b5944192ee4904d69e2aac08655226c585b42e6',
  'skills/qk-code-review/references/languages/swift.md': 'c4d7f298265244f34f4a2a9d18116e2c047ee87ca20646ff6d5117802d5e537c',
  'skills/qk-code-review/references/languages/typescript.md': 'fca6e0e384c5542123a2781adc833599129e24d9881aa9ec7c802a42d8e13bf4',
  'skills/qk-code-review/references/languages/vue.md': '49686f8c59b2069f0b3b322a97555615ec071d991412d98a70b8425dbe94bdd4',
  'skills/qk-code-review/references/languages/zig.md': '9a5e9b727d206d91d687ec3cf3caf3ed85e1cbf92b2df5675f82476abe45e017',
  'skills/qk-code-review/evals/scorecard.yaml': '728811a108c5a3acf19cf449371728f163deb63a9ad9adc415c44f2990ee1010',
  'skills/qk-bug-resolution/evals/scorecard.yaml': '7252fd813c811cc7a741ca8a7abd38cbb2eb982f39f80d6660dd2e60f8fd070f',
  'skills/qk-feature-delivery/evals/scorecard.yaml': 'ac2f10c667bad1308940fbe3b4629de692ef55af2ba889eff0d59e07044a1434',
  'knowledge/design-intelligence/components/buttons.md': '5dcd7c420e773facac5e4c6c3a647bc24631b141e15dc236af7de1bad5a53a2c',
  'knowledge/design-intelligence/components/cards.md': 'b3c856d9a1c9b13e3b6378a5a05662383ca9e5d49940c0c048cf5fe7e99e570f',
  'knowledge/design-intelligence/components/inputs.md': '77a56f6920af608e446aa28e73dee4cea1dd4e3a97192388f216da5cdd258f8e',
  'knowledge/design-intelligence/components/modals.md': 'c91a50ed1c2a1a11d064cb1d8ee3aa4286bd7b3cbc4e0f1ca9ca3ce147577fd7',
  'knowledge/design-intelligence/industries/ecommerce.md': '8c904aa6829d7c8dde17b2e260c48cea6142dcb3535dc71fd6cdce4944289782',
  'knowledge/design-intelligence/industries/fintech.md': '0698eb75d9ac13ec584f9e05f89e3b55c3d3b2c66f02035faeeca1da5acf8719',
  'knowledge/design-intelligence/industries/healthcare.md': '6798ae78ba66d863e64e3063f095ddd93ab37479264e6622a611b3bd4cfc313e',
  'knowledge/design-intelligence/patterns/data-display.md': '036632f471cc030c04f943255118d06138d940b8d17e79ca326b6b55eee5df01',
  'knowledge/design-intelligence/patterns/empty-states.md': '578652b973161e1862f3051e0ff3b34f4a6f1fbe1bdc6de0013b73575908c231',
  'knowledge/design-intelligence/patterns/forms.md': '550a8781793bbc25f20c0d4cd5152de21c4481011a2de80297ce7d421632174f',
  'knowledge/design-intelligence/references/accessibility.md': 'd3336e76f56adc873188c42a24e3b4b67cc0ce065f3691436fdd631666ab0853',
  'knowledge/design-intelligence/references/tailwind-preset.md': '34eaa85f3239f3904c07c8e4e90c22b6865b6988d0d6a52583a7a7922ae79308',
  'knowledge/design-intelligence/templates/auth.md': '50fbd6ac42b1fb7fabbeb4113bcea3b0cc2f816f5cacaa97db8841439df524e8',
  'knowledge/design-intelligence/templates/dashboard.md': '694357844f8fad88c270b2bee547a38e553f3f3fcb6fdeb8419a7e86f6df4df1',
  'knowledge/design-intelligence/templates/landing-page.md': '58b116c9fc18f0a988f23a00a8a989e766495e1cfd4a09757756b08b4030e186',
  'knowledge/design-intelligence/themes/minimal.md': 'c51bfaa5100836d6784a0d510595d049d904130fe2a5a9d808890587c001b9e7',
  'knowledge/design-intelligence/themes/saas.md': 'de87c1b41bc143cae931030854be61b5083ff0c93a1325647d51cbd82da6a63f',
  'knowledge/design-intelligence/visual-language/animation.md': '18cab697abe808ab7f97d5bf9b280ce1b3d3f3bfa3958ccf434672981ddb99ae',
  'knowledge/design-intelligence/visual-language/color.md': 'b1dac069f3c4b1d321addbd03cf93af3f4984cfbafe69ac6a02195fa04127220',
  'knowledge/design-intelligence/visual-language/layout.md': '489c645a4942c854eeaef7efcb7deea5755dbee7734d4b037dfc5bcb0ef6aa14',
  'knowledge/design-intelligence/visual-language/spacing.md': '68f0c0cd54dca596638bd96ea99a6ec6510360d5863d0c1826084627fed83ff6',
  'knowledge/design-intelligence/visual-language/typography.md': '73e14277f20cea3511bf02451da072a5f2baf873baa26c0ef4e90cba1808f054',
  'knowledge/domain-patterns/construction/ddc-construction-ai-blueprint.md': '3cc7b86307ac354c36e38f83bed3f8edea07c87f7cc112e6e66ea7e95acecdf2',
  'blueprints/coding/project.yaml.tpl': 'ecc321b7de6af1beed7ca32ef4ea14b4c473f1f023837d06ab2f1b463d2d8cec',
  'blueprints/rag/project.yaml.tpl': '7a037fd5d8745ab3e140a974f6c05c357d695f8e8422145390113db622f3acbe'
};

export function computeSha256(contentOrBuffer) {
  return crypto.createHash('sha256').update(contentOrBuffer).digest('hex');
}

export function isExcludedFile(relPath) {
  const normalized = relPath.replace(/\\/g, '/');
  return EXCLUDED_PATTERNS.some(re => re.test(normalized));
}

export function isSourceOnlyFile(relPath) {
  const normalized = relPath.replace(/\\/g, '/');
  return SOURCE_ONLY_PATTERNS.some(re => re.test(normalized));
}

export function generateManifest(sourceDir, packageVersion = '13.0.0') {
  const files = {};

  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = path.relative(sourceDir, fullPath).replace(/\\/g, '/');

      // Security: ensure no path traversal or absolute escape
      if (relPath.startsWith('..') || path.isAbsolute(relPath)) {
        throw new Error(`Path traversal detected in manifest generation: ${relPath}`);
      }

      if (isExcludedFile(relPath) || isSourceOnlyFile(relPath)) {
        continue;
      }

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile()) {
        const content = fs.readFileSync(fullPath);
        files[relPath] = computeSha256(content);
      }
    }
  }

  walk(sourceDir);

  return {
    schemaVersion: 1,
    packageVersion,
    files
  };
}

export function planManagedMigration({
  previousManifest,
  nextManifest,
  installedFiles = [],
  currentFilesContent = {},
  isLegacyUpgrade = false
}) {
  const write = [...Object.keys(nextManifest?.files || {})];
  const remove = [];
  const preserve = [];
  const conflicts = [];

  const nextFilesSet = new Set(write);
  const prevFiles = previousManifest?.files || (isLegacyUpgrade ? V10_RETIRED_FILES_FINGERPRINTS : null);

  for (const installedFile of installedFiles) {
    const rel = installedFile.replace(/\\/g, '/');
    if (isExcludedFile(rel)) {
      preserve.push(rel);
      continue;
    }

    const currentContent = currentFilesContent[rel];
    const currentSha = currentContent !== undefined ? computeSha256(currentContent) : null;

    if (nextFilesSet.has(rel)) {
      // File exists in both old and new releases
      const hasKnownPrevSha = Boolean(prevFiles && prevFiles[rel]);
      const isAlreadyMatchingNext = Boolean(currentSha && currentSha === nextManifest?.files?.[rel]);
      const isKnownModified = hasKnownPrevSha && currentSha && currentSha !== prevFiles[rel] && !isAlreadyMatchingNext;
      // When ownership cannot be proven (no manifest or not in prevFiles), protect existing file if it differs from upstream
      const isUnverifiedOwnership = !hasKnownPrevSha;
      const isDifferentFromNext = isUnverifiedOwnership && currentSha && currentSha !== nextManifest?.files?.[rel];

      if (isKnownModified || isDifferentFromNext) {
        // User modified this file or file pre-existed with unverified ownership! Preserve user version.
        preserve.push(rel);
        conflicts.push(rel);
        const writeIndex = write.indexOf(rel);
        if (writeIndex !== -1) {
          write.splice(writeIndex, 1);
        }
      }
      continue;
    }

    // File is on disk, but not in next manifest
    const knownRetiredSha = prevFiles?.[rel] || V10_RETIRED_FILES_FINGERPRINTS[rel];
    if (knownRetiredSha) {
      if (currentSha === knownRetiredSha) {
        // Unmodified system file -> safe to remove
        remove.push(rel);
      } else {
        // User modified this file -> DO NOT REMOVE! Preserve and report conflict.
        preserve.push(rel);
        conflicts.push(rel);
      }
    } else {
      // Not managed by previous manifest (e.g. user custom file, or unrecognized legacy file) -> preserve
      preserve.push(rel);
      if (rel.startsWith('skills/')) {
        // Legacy or custom skill folder that was not recognized
        conflicts.push(rel);
      }
    }
  }

  return {
    write,
    remove,
    preserve,
    conflicts
  };
}
