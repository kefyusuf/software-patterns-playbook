# Pattern vs Pattern

Use this guide when two patterns appear similar on paper but lead to different maintenance outcomes.

## Factory vs Builder

| Question | Factory | Builder |
|---|---|---|
| Main concern | Choosing what to create | Controlling how complex construction happens |
| Best when | Variants differ | Setup steps or optional parts grow |
| Too much when | There is only one obvious creation path | The object is simple and stable |

Choose Factory when selection logic is the real problem. Choose Builder when construction readability is the real problem.

## Adapter vs Decorator

| Question | Adapter | Decorator |
|---|---|---|
| Main concern | Interface mismatch | Behavior extension |
| Best when | External systems speak a different shape | You want to wrap extra behavior around a stable service |
| Too much when | A tiny translation function is enough | The extra behavior is local and one-off |

Adapter changes the interface you expose. Decorator keeps the interface and changes the behavior around it.

## Strategy vs State

| Question | Strategy | State |
|---|---|---|
| Main concern | Pick one behavior from several policies | Behavior changes because the object's state changes |
| Best when | The caller chooses the rule | The object evolves through transitions |
| MVP decision | Use Strategy now | Defer State to later slices |

If the variation is caller-driven, Strategy is usually the simpler choice.

## Command vs Chain of Responsibility

| Question | Command | Chain of Responsibility |
|---|---|---|
| Main concern | Representing an action | Passing work through ordered handlers |
| Best when | You care about queuing, retrying, auditing, undo, or delayed execution | You care about step-by-step processing and conditional handoff |
| Too much when | A direct method call is enough | The workflow is short and fixed |

Use Command when the action itself needs identity. Use Chain when the sequence of handlers is the design pressure.

## Factory vs Singleton

| Question | Factory | Singleton |
|---|---|---|
| Main concern | Controlled creation | Enforcing one shared instance |
| Best when | You want flexibility in creation | You truly need a process-wide resource with explicit constraints |
| Risk | Becomes a hidden service locator | Becomes hidden global state |

If you are choosing between these two, the correct answer is usually Factory or plain dependency injection, not Singleton.

## Default Rule

When two patterns both seem possible, prefer the one with:

- less hidden state
- fewer moving parts
- easier tests
- clearer failure boundaries
