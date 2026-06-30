---
title: API Client Integration
scenario_type: api-client
recommended_patterns:
  - Adapter
  - Factory
  - Strategy
not_recommended_initially:
  - Retry
  - Circuit Breaker
---

# API Client Integration

## Problem

An application integrates with one or more external APIs and needs a stable internal interface even though vendors expose inconsistent request formats, authentication models, and error responses.

## Forces and Constraints

- Business constraint: integrations often change providers or add new endpoints over time.
- Technical constraint: each API has its own payload shapes, authentication, rate limits, and failure semantics.
- Maintainability constraint: domain and application logic should not depend on transport details or SDK-specific naming.
- Testing constraint: the integration boundary must be testable with deterministic fake responses.

## Recommended Patterns

| Pattern | Why It Helps |
|---|---|
| Adapter | Translates external API details into internal language and result contracts. |
| Factory | Selects the correct client implementation when providers or API versions differ. |
| Strategy | Useful when one use case supports multiple integration policies such as sync vs cached fetch behavior. |

## Not Recommended Initially

| Pattern | Why It May Be Too Much |
|---|---|
| Retry | Worth adding only after understanding which failures are transient and safe to repeat. |
| Circuit Breaker | A scale and reliability tool, not an MVP default for every integration. |

## Suggested Project Structure

```txt
app/
  CatalogSync/
    Application/
      FetchProducts.php
      ProductFeedClientFactory.php
    Infrastructure/
      Clients/
        ProviderAProductFeedAdapter.php
        ProviderBProductFeedAdapter.php
```

## Step-by-Step Flow

1. The application use case requests data in internal business terms.
2. A factory selects the correct external client adapter based on provider or environment.
3. The adapter signs the request, calls the external API, and maps the response to internal DTO-like structures.
4. The use case handles normalized success or failure results without knowing vendor-specific payload fields.
5. Additional policies such as caching or conditional fetch behavior can be selected with Strategy if the variation becomes real.

## Failure Modes

- Provider response shape changes unexpectedly and breaks mapping.
- Authentication details leak into application services.
- One adapter returns raw transport errors while another returns business-level failures, making callers inconsistent.
- Teams add direct HTTP calls beside the adapter because the boundary feels optional.

## Testing Strategy

- Unit tests: mapping, normalization, and client selection behavior.
- Integration tests: fake HTTP or sandbox-level tests for adapter request/response translation.
- Contract tests: assert that each adapter preserves one internal result contract.
- E2E tests, if necessary: one representative use case path that proves the integration boundary works end to end.

## Scaling Considerations

As integrations become more business-critical, selective Retry, Circuit Breaker, request logging, and rate-limit handling may become necessary. Those additions belong after observing real failure modes and after the core internal contract is already stable.

## Review Checklist

- [ ] Are external systems isolated?
- [ ] Are business rules testable?
- [ ] Is the chosen abstraction justified?
- [ ] Are duplicate requests or retries handled where needed?
- [ ] Is the initial design simpler than the future design?
