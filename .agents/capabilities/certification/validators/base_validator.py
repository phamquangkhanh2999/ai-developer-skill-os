#!/usr/bin/env python3
"""
EDAOS v1.0 — Certification Authority
Base Validator Contract
"""

from typing import Dict, Any, Optional
from dataclasses import dataclass
from abc import ABC, abstractmethod

@dataclass(frozen=True)
class ValidationResult:
    """
    Every validator must return a strongly typed ValidationResult,
    containing proof of its evaluation rather than just a boolean.
    """
    validator: str
    status: str             # 'PASS', 'FAIL', 'WARN'
    evidence: Dict[str, Any]
    violations: Optional[list] = None
    
class BaseValidator(ABC):
    
    @property
    @abstractmethod
    def validator_name(self) -> str:
        pass
        
    @abstractmethod
    def validate(self, capability_contract: Dict[str, Any], context: Dict[str, Any] = None) -> ValidationResult:
        """
        Executes the validation logic against a capability contract.
        Must return a strongly typed ValidationResult containing cryptographic or structural evidence.
        """
        pass
