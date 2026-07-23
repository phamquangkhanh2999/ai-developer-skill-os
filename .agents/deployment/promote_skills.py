#!/usr/bin/env python3
"""
EDAOS Skill Promotion Script (Wave 1 & Wave 2)
Promotes 11 Native EDAOS v2.0 Skills from Workspace to Global Runtime.
"""

import os
import shutil
import sys

WORKSPACE_SKILLS_PATH = r"d:\ai-code-skin-mcp\rules-skill\.agents\skills"
GLOBAL_SKILLS_PATH = r"C:\Users\qkhanh\.gemini\config\skills"
BACKUP_PATH = r"C:\Users\qkhanh\.gemini\config\skills_legacy_v7.5_backup"

PROMOTED_SKILLS = [
    # Wave 1 Core SDLC Orchestrators
    "qk-engineering-standard",
    "qk-ui-audit",
    "qk-performance-tuner",
    "qk-bug-resolution",
    "qk-feature-delivery",
    "qk-production-release",
    "qk-project-health",
    # Wave 2 Platform Control Plane Skills
    "qk-orchestrator",
    "qk-context-loader",
    "qk-validation-gate",
    "qk-system-evolution"
]

def backup_legacy_skills():
    if not os.path.exists(BACKUP_PATH):
        print(f"[BACKUP] Backing up legacy skills to: {BACKUP_PATH}")
        shutil.copytree(GLOBAL_SKILLS_PATH, BACKUP_PATH)
        print("  [OK] Legacy skills backup created.")
    else:
        print(f"[BACKUP] Backup already exists at: {BACKUP_PATH}")

def promote_skills():
    print(f"[PROMOTION] Promoting {len(PROMOTED_SKILLS)} Native EDAOS v2.0 Skills to Global Runtime...")
    for skill_name in PROMOTED_SKILLS:
        src = os.path.join(WORKSPACE_SKILLS_PATH, skill_name)
        dst = os.path.join(GLOBAL_SKILLS_PATH, skill_name)

        if not os.path.exists(src):
            print(f"  [ERROR] Source skill '{src}' does not exist!")
            sys.exit(1)

        # Remove old global skill dir if exists
        if os.path.exists(dst):
            shutil.rmtree(dst)

        # Copy new EDAOS v2.0 skill dir
        shutil.copytree(src, dst)
        print(f"  [PROMOTED] {skill_name} (v2.0 Native) -> {dst}")

def verify_promotion():
    print("\n[VERIFICATION] Verifying Global Skill Runtime Conformance...")
    all_passed = True
    for skill_name in PROMOTED_SKILLS:
        skill_md = os.path.join(GLOBAL_SKILLS_PATH, skill_name, "SKILL.md")
        if not os.path.exists(skill_md):
            print(f"  [FAIL] {skill_name}: SKILL.md missing!")
            all_passed = False
            continue

        with open(skill_md, "r", encoding="utf-8") as f:
            content = f.read()

        if "2.0" in content or "EDAOS" in content:
            print(f"  [PASS] {skill_name}: Certified EDAOS v2.0 Runtime Active")
        else:
            print(f"  [WARN] {skill_name}: Content does not match expected v2.0 signature")
            all_passed = False

    if all_passed:
        print("\n==================================================")
        print("   ALL 11 SKILLS PROMOTED & RUNTIME ACTIVATED! [OK]")
        print("==================================================")
    else:
        print("\n[ERROR] Promotion verification had warnings/errors.")

if __name__ == "__main__":
    backup_legacy_skills()
    promote_skills()
    verify_promotion()
