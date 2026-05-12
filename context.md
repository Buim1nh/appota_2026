You are a senior backend architect and MongoDB database designer.

Your task is to design a scalable MongoDB schema for a Dungeons & Dragons Build/Loadout Organizer application.

# Application Overview

The application allows users to:

- Create D&D characters
- Select class, subclass, race, feats, skills, spells, and equipment
- Equip weapons, armor, accessories, consumables
- Store multiple builds/loadouts
- Calculate derived combat stats automatically
- Share builds through public links
- Compare builds
- Optimize builds based on stats and formulas

The system must support highly complex RPG stat calculations.

# Demo Flow

1. User selects:
   - Character class
   - Race
   - Skills
   - Equipment
   - Feats
   - Spells

2. System loads data from predefined databases.

3. System calculates:
   - stats modifier
   - AC
   - initiative
   - speed
   - skills
   - saving throw
   - atk bonus
   - hit point
   - spell save dc
   - spell slot
   - Carry Weight
   - Damage Modifier
     
4. System outputs:
   - Final calculated stats
   - Combat summary
   - Character sheet
   - Shareable build link

# Requirements

Generate MongoDB schemas using:
- Mongoose
- TypeScript
- Best practices for indexing and scalability
- NextJS

# Important Design Requirements

The database design MUST support:

## Core Systems

### Characters
- race
- subrace
- class
- subclass
- level
- background
- proficiency bonus

### Attributes
- STR
- DEX
- CON
- INT
- WIS
- CHA

### Derived Stats
- HP
- Armor Class
- Initiative
- Spell Save DC
- Attack Bonus
- Damage Modifier
- Carry Weight
- Movement Speed

### Equipment System

Support:
- weapons
- armor
- shields
- rings
- amulets


Each equipment item may include:
- rarity
- attunement
- stat bonuses
- passive effects
- active skills

### Weapon System

Weapons must support:
- damage dice
- damage type
- versatile damage
- finesse
- two-handed
- magical modifiers

### Spell System

Spells should support:
- spell slots
- scaling
- duration
- casting time
- components
- area effects
- saving throws
- damage formulas

### Build System

A build/loadout contains:
- equipped items
- selected spells
- feat setup
- stat allocation
- calculated final stats
- optimization score
- notes
- tags

### Sharing System

Support:
- share IDs
- public URLs
- cloning builds

# Formula Engine Requirements

Design schemas flexible enough to support:
- formula expressions
- conditional modifiers
- additive/multiplicative bonuses
- dynamic scaling
- event-based calculations

Example:
- "+5% fire damage when HP < 50%"
- "+2 AC while dual wielding"
- "DEX modifier added to ranged attack damage"

# Technical Requirements

The output MUST include:

1. Collection list
2. Full schema definitions
3. Embedded vs referenced design decisions
4. Indexing strategy
5. Example documents
6. Relationship diagram explanation
7. Optimization considerations
8. Data validation strategy
9. Extensibility strategy
10. Suggested folder structure

# Architecture Constraints

- Optimize for read-heavy workload
- Builds should load quickly
- Calculated stats may be cached
- Avoid deeply nested documents where possible
- Support future MMORPG-scale expansion

# Additional Requirements

The schema should support:
- homebrew/custom content
- multiple D&D editions
- future plugin/mod system
- combat simulation
- AI build recommendation system

# Output Format

Return:
- clean architecture explanation
- TypeScript interfaces
- Mongoose schemas
- indexes
- example JSON documents
- collection relationships
- scaling recommendations

Use production-level architecture quality.