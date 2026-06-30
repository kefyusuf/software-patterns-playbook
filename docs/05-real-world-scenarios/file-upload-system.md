---
title: File Upload System
scenario_type: file-upload
recommended_patterns:
  - Adapter
  - DTO
  - Decorator
not_recommended_initially:
  - Event Sourcing
  - Circuit Breaker
---

# File Upload System

## Problem

An application accepts uploaded files, validates them, stores them through one or more storage backends, and may apply extra behaviors such as scanning, thumbnail generation, or audit logging without letting controller code become the place where every storage and processing concern leaks together.

## Forces and Constraints

- Business constraint: uploaded files may have tenant-specific size limits, allowed types, retention rules, or access policies.
- Technical constraint: local disk, cloud object storage, and media processing tools often expose different interfaces and failure behaviors.
- Maintainability constraint: the application should not duplicate validation, storage, and metadata mapping logic across many upload entry points.
- Testing constraint: upload flows should be testable without real cloud storage or external media services.

## Recommended Patterns

| Pattern | Why It Helps |
|---|---|
| [Adapter](../02-gof-patterns/structural/adapter.md) | Hides vendor-specific storage SDKs behind a stable internal file-storage contract. |
| [DTO](../04-enterprise-patterns/dto.md) | Makes upload request, stored-file metadata, and downstream processing payloads explicit across boundaries. |
| [Decorator](../02-gof-patterns/structural/decorator.md) | Adds scanning, logging, image processing, or quota checks around a stable storage service without changing its base contract. |

## Not Recommended Initially

| Pattern | Why It May Be Too Much |
|---|---|
| Event Sourcing | Adds storage and replay complexity that usually has little value for a basic upload workflow. |
| Circuit Breaker | May become useful for unstable external media pipelines later, but not as a default first step. |

## Suggested Project Structure

```txt
app/
  Files/
    Application/
      UploadFileCommand.php
      UploadResultDto.php
      FileUploadFacade.php
    Infrastructure/
      Storage/
        S3StorageAdapter.php
        LocalDiskStorageAdapter.php
      Decorators/
        VirusScanStorageDecorator.php
        ThumbnailStorageDecorator.php
      FileMetadataRepository.php
```

## Step-by-Step Flow

1. A controller or API boundary receives an upload request and turns it into an explicit command or DTO.
2. Validation checks file type, size, and business policy before any storage call happens.
3. A facade coordinates the upload workflow so callers do not need to understand validation, storage, metadata persistence, and post-processing order.
4. A storage adapter translates the internal file contract into the selected backend's API shape.
5. Decorators can wrap the storage service for optional scanning, thumbnail creation, or audit-friendly logging.
6. The system returns a stable result DTO that contains metadata, access path, and any follow-up state needed by the caller.

## Failure Modes

- Controllers directly call storage SDKs and duplicate validation or metadata logic.
- Vendor-specific upload responses leak into application services.
- Optional behaviors such as scanning or thumbnail generation get hard-coded into one storage class.
- File metadata and storage outcome drift apart because boundary contracts are implicit.

## Testing Strategy

- Unit tests: validation rules, DTO mapping, and decorator behavior.
- Integration tests: adapter translation and metadata persistence against fake storage boundaries.
- Contract tests: each storage adapter honors the same upload and retrieval contract.
- E2E tests, if necessary: one successful upload plus representative failures such as invalid type or storage rejection.

## Scaling Considerations

As file volume and processing complexity grow, patterns such as [Facade](../02-gof-patterns/structural/facade.md), [Repository](../04-enterprise-patterns/repository.md), and eventually asynchronous processing or event-driven follow-up may become more valuable. The safer first move is to make the storage boundary and upload contract explicit before layering on more reliability machinery.

## Review Checklist

- [ ] Are external systems isolated?
- [ ] Are business rules testable?
- [ ] Is the chosen abstraction justified?
- [ ] Are duplicate requests or retries handled where needed?
- [ ] Is the initial design simpler than the future design?

## Related Reading

- [API Client Integration](./api-client-integration.md)
- [Multi-tenant SaaS](./multi-tenant-saas.md)
- [Adapter](../02-gof-patterns/structural/adapter.md)
- [Decorator](../02-gof-patterns/structural/decorator.md)
- [Facade](../02-gof-patterns/structural/facade.md)
- [DTO](../04-enterprise-patterns/dto.md)
- [Repository](../04-enterprise-patterns/repository.md)
