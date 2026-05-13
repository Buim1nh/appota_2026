// src/lib/validate-build.ts
// Shared validation utility for Build payloads (POST and PUT).

import mongoose from "mongoose";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Check whether a value looks like a valid MongoDB ObjectId (24-hex string).
 */
function isObjectId(value: unknown): boolean {
  if (typeof value !== "string") return false;
  return mongoose.Types.ObjectId.isValid(value);
}

/**
 * Validate the optional / shared fields that appear in both create and update payloads.
 * Pushes any errors into the provided `errors` array.
 */
function validateOptionalFields(
  body: Record<string, unknown>,
  errors: string[]
): void {
  // ── name ──
  if (body.name != null) {
    if (typeof body.name !== "string" || body.name.trim().length === 0) {
      errors.push("name must be a non-empty string.");
    } else if (body.name.length > 100) {
      errors.push("name must be at most 100 characters.");
    }
  }

  // ── level ──
  if (body.level != null) {
    if (typeof body.level !== "number" || !Number.isInteger(body.level)) {
      errors.push("level must be an integer.");
    } else if (body.level < 1 || body.level > 20) {
      errors.push("level must be between 1 and 20.");
    }
  }

  // ── classRef / raceRef ──
  if (body.classRef != null && !isObjectId(body.classRef)) {
    errors.push("classRef must be a valid ObjectId.");
  }
  if (body.raceRef != null && !isObjectId(body.raceRef)) {
    errors.push("raceRef must be a valid ObjectId.");
  }

  // ── baseStats ──
  if (body.baseStats != null) {
    const stats = body.baseStats as Record<string, unknown>;
    const statKeys = ["str", "dex", "con", "int", "wis", "cha"];
    for (const key of statKeys) {
      if (key in stats) {
        const val = stats[key];
        if (typeof val !== "number" || !Number.isInteger(val) || val < 1 || val > 30) {
          errors.push(`baseStats.${key} must be an integer between 1 and 30.`);
        }
      }
    }
  }

  // ── equipment ──
  if (body.equipment != null) {
    const eq = body.equipment as Record<string, unknown>;
    const slots = ["head", "chest", "mainHand", "offHand", "ring1", "ring2", "amulet"];
    for (const slot of slots) {
      if (eq[slot] != null && !isObjectId(eq[slot])) {
        errors.push(`equipment.${slot} must be a valid ObjectId.`);
      }
    }
  }

  // ── spells ──
  if (body.spells != null) {
    if (!Array.isArray(body.spells)) {
      errors.push("spells must be an array of ObjectIds.");
    } else {
      for (let i = 0; i < body.spells.length; i++) {
        if (!isObjectId(body.spells[i])) {
          errors.push(`spells[${i}] must be a valid ObjectId.`);
        }
      }
    }
  }

  // ── feats ──
  if (body.feats != null) {
    if (!Array.isArray(body.feats)) {
      errors.push("feats must be an array of ObjectIds.");
    } else {
      for (let i = 0; i < body.feats.length; i++) {
        if (!isObjectId(body.feats[i])) {
          errors.push(`feats[${i}] must be a valid ObjectId.`);
        }
      }
    }
  }
}

/**
 * Validate a Build creation payload.
 * Checks required fields, then delegates shared field checks.
 * classRef and raceRef are optional to allow initial wizard creation.
 */
export function validateCreateBuild(
  body: Record<string, unknown>
): ValidationResult {
  const errors: string[] = [];

  // ── Required fields ──
  if (!body.userId || !isObjectId(body.userId)) {
    errors.push("userId is required and must be a valid ObjectId.");
  }
  if (!body.name || typeof body.name !== "string" || body.name.trim().length === 0) {
    errors.push("name is required and must be a non-empty string.");
  }

  // classRef and raceRef are optional (set via wizard steps)
  if (body.classRef != null && !isObjectId(body.classRef)) {
    errors.push("classRef must be a valid ObjectId.");
  }
  if (body.raceRef != null && !isObjectId(body.raceRef)) {
    errors.push("raceRef must be a valid ObjectId.");
  }

  // ── Shared validation for field formats/ranges ──
  validateOptionalFields(body, errors);

  return { valid: errors.length === 0, errors };
}

/**
 * Validate a Build update (PUT) payload.
 * userId is required for ownership; all other fields are optional.
 */
export function validateUpdateBuild(
  body: Record<string, unknown>
): ValidationResult {
  const errors: string[] = [];

  // userId is required for ownership check
  if (!body.userId || !isObjectId(body.userId)) {
    errors.push("userId is required and must be a valid ObjectId.");
  }

  // ── Shared validation for field formats/ranges ──
  validateOptionalFields(body, errors);

  return { valid: errors.length === 0, errors };
}
