/**
 * Tag Integrator - Module Exports
 * 
 * Barrel file that exports all DDD layers for external usage.
 * Use this for programmatic access to the system components.
 * 
 * Note: Each layer can be imported individually to avoid naming conflicts:
 * - import { ... } from './domain'
 * - import { ... } from './application'
 * - import { ... } from './infrastructure'
 * - import { ... } from './presentation/http'
 * - import { ... } from './shared'
 */

// Domain Layer - Core business logic
export * as Domain from './domain'

// Application Layer - Use cases and DTOs
export * as Application from './application'

// Infrastructure Layer - External services and persistence
export * as Infrastructure from './infrastructure'

// Presentation Layer - HTTP server and controllers
export * as Presentation from './presentation/http'

// Shared Layer - Common utilities and errors
export * as Shared from './shared'

