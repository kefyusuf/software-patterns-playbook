import { defineConfig } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";

export default withMermaid(
  defineConfig({
    base: "/software-patterns-playbook/",
    lang: "en-US",
    title: "Real World Software Patterns",
    description:
      "Choose software patterns by real problems, project layers, and trade-offs — not by fashion.",
    ignoreDeadLinks: [(url) => url.includes("examples/")],
    themeConfig: {
      search: {
        provider: "local",
      },
      socialLinks: [
        { icon: "github", link: "https://github.com/kefyusuf/software-patterns-playbook" },
      ],
      outline: { level: [2, 3] },
      nav: [
        { text: "Home", link: "/" },
        { text: "Pattern Index", link: "/pattern-index" },
        { text: "Scenarios", link: "/05-real-world-scenarios/order-processing" },
        { text: "GitHub", link: "https://github.com/kefyusuf/software-patterns-playbook" },
      ],
      sidebar: [
        {
          text: "Start Here",
          collapsed: false,
          items: [
            { text: "Pattern Index", link: "/pattern-index" },
          ],
        },
        {
          text: "00 · Introduction",
          collapsed: true,
          items: [
            { text: "What Is a Pattern?", link: "/00-introduction/what-is-a-pattern" },
            { text: "Pattern vs Architecture", link: "/00-introduction/pattern-vs-architecture" },
            { text: "When Not to Use Patterns", link: "/00-introduction/when-not-to-use-patterns" },
            { text: "How To Read This Repository", link: "/00-introduction/how-to-read-this-repo" },
          ],
        },
        {
          text: "01 · Decision Guides",
          collapsed: true,
          items: [
            { text: "Choose by Problem", link: "/01-decision-guides/choose-by-problem" },
            { text: "Choose by Project Layer", link: "/01-decision-guides/choose-by-project-layer" },
            { text: "Choose by Code Smell", link: "/01-decision-guides/choose-by-code-smell" },
            { text: "Pattern vs Pattern", link: "/01-decision-guides/pattern-vs-pattern" },
            { text: "Testing With Patterns", link: "/01-decision-guides/testing-with-patterns" },
          ],
        },
        {
          text: "02 · GoF Patterns",
          collapsed: true,
          items: [
            {
              text: "Creational",
              collapsed: true,
              items: [
                { text: "Factory", link: "/02-gof-patterns/creational/factory" },
                { text: "Factory Method", link: "/02-gof-patterns/creational/factory-method" },
                { text: "Abstract Factory", link: "/02-gof-patterns/creational/abstract-factory" },
                { text: "Builder", link: "/02-gof-patterns/creational/builder" },
                { text: "Prototype", link: "/02-gof-patterns/creational/prototype" },
                { text: "Singleton", link: "/02-gof-patterns/creational/singleton" },
              ],
            },
            {
              text: "Structural",
              collapsed: true,
              items: [
                { text: "Adapter", link: "/02-gof-patterns/structural/adapter" },
                { text: "Bridge", link: "/02-gof-patterns/structural/bridge" },
                { text: "Composite", link: "/02-gof-patterns/structural/composite" },
                { text: "Decorator", link: "/02-gof-patterns/structural/decorator" },
                { text: "Facade", link: "/02-gof-patterns/structural/facade" },
                { text: "Flyweight", link: "/02-gof-patterns/structural/flyweight" },
                { text: "Proxy", link: "/02-gof-patterns/structural/proxy" },
              ],
            },
            {
              text: "Behavioral",
              collapsed: true,
              items: [
                { text: "Chain of Responsibility", link: "/02-gof-patterns/behavioral/chain-of-responsibility" },
                { text: "Command", link: "/02-gof-patterns/behavioral/command" },
                { text: "Interpreter", link: "/02-gof-patterns/behavioral/interpreter" },
                { text: "Iterator", link: "/02-gof-patterns/behavioral/iterator" },
                { text: "Mediator", link: "/02-gof-patterns/behavioral/mediator" },
                { text: "Memento", link: "/02-gof-patterns/behavioral/memento" },
                { text: "Observer", link: "/02-gof-patterns/behavioral/observer" },
                { text: "State", link: "/02-gof-patterns/behavioral/state" },
                { text: "Strategy", link: "/02-gof-patterns/behavioral/strategy" },
                { text: "Template Method", link: "/02-gof-patterns/behavioral/template-method" },
                { text: "Visitor", link: "/02-gof-patterns/behavioral/visitor" },
              ],
            },
          ],
        },
        {
          text: "03 · Architecture Patterns",
          collapsed: true,
          items: [
            { text: "Layered Architecture", link: "/03-architecture-patterns/layered-architecture" },
            { text: "Modular Monolith", link: "/03-architecture-patterns/modular-monolith" },
            { text: "Hexagonal Architecture", link: "/03-architecture-patterns/hexagonal-architecture" },
            { text: "Vertical Slice", link: "/03-architecture-patterns/vertical-slice" },
            { text: "Clean Architecture", link: "/03-architecture-patterns/clean-architecture" },
            { text: "CQRS", link: "/03-architecture-patterns/cqrs" },
            { text: "Event Sourcing", link: "/03-architecture-patterns/event-sourcing" },
            { text: "Microservices", link: "/03-architecture-patterns/microservices" },
            { text: "Domain-Driven Design", link: "/03-architecture-patterns/domain-driven-design" },
          ],
        },
        {
          text: "04 · Enterprise & Resilience",
          collapsed: true,
          items: [
            { text: "Service Layer", link: "/04-enterprise-patterns/service-layer" },
            { text: "Repository", link: "/04-enterprise-patterns/repository" },
            { text: "DTO", link: "/04-enterprise-patterns/dto" },
            { text: "Value Object", link: "/04-enterprise-patterns/value-object" },
            { text: "Specification", link: "/04-enterprise-patterns/specification" },
            { text: "Domain Event", link: "/04-enterprise-patterns/domain-event" },
            { text: "Unit of Work", link: "/04-enterprise-patterns/unit-of-work" },
            { text: "Data Mapper", link: "/04-enterprise-patterns/data-mapper" },
            { text: "Lazy Load", link: "/04-enterprise-patterns/lazy-load" },
            { text: "Retry with Backoff", link: "/04-enterprise-patterns/retry-with-backoff" },
            { text: "Circuit Breaker", link: "/04-enterprise-patterns/circuit-breaker" },
            { text: "Outbox", link: "/04-enterprise-patterns/outbox" },
            { text: "Inbox", link: "/04-enterprise-patterns/inbox" },
            { text: "Saga", link: "/04-enterprise-patterns/saga" },
          ],
        },
        {
          text: "05 · Real-World Scenarios",
          collapsed: true,
          items: [
            { text: "Payment System", link: "/05-real-world-scenarios/payment-system" },
            { text: "Notification System", link: "/05-real-world-scenarios/notification-system" },
            { text: "E-commerce Checkout", link: "/05-real-world-scenarios/ecommerce-checkout" },
            { text: "Order Processing", link: "/05-real-world-scenarios/order-processing" },
            { text: "API Client Integration", link: "/05-real-world-scenarios/api-client-integration" },
            { text: "Multi-tenant SaaS", link: "/05-real-world-scenarios/multi-tenant-saas" },
            { text: "Admin Panel Actions", link: "/05-real-world-scenarios/admin-panel" },
            { text: "File Upload System", link: "/05-real-world-scenarios/file-upload-system" },
            { text: "Background Job Processing", link: "/05-real-world-scenarios/background-job-processing" },
          ],
        },
        {
          text: "06 · Anti-Patterns",
          collapsed: true,
          items: [
            { text: "God Service", link: "/06-anti-patterns/god-service" },
            { text: "Anemic Domain Model", link: "/06-anti-patterns/anemic-domain-model" },
            { text: "Pattern for Pattern's Sake", link: "/06-anti-patterns/pattern-for-patterns-sake" },
            { text: "Repository Everywhere", link: "/06-anti-patterns/repository-everywhere" },
            { text: "Singleton Abuse", link: "/06-anti-patterns/singleton-abuse" },
            { text: "Golden Hammer", link: "/06-anti-patterns/golden-hammer" },
            { text: "Distributed Monolith", link: "/06-anti-patterns/distributed-monolith" },
          ],
        },
        {
          text: "07 · Checklists",
          collapsed: true,
          items: [
            { text: "Project Start Checklist", link: "/07-checklists/project-start-checklist" },
            { text: "Architecture Review Checklist", link: "/07-checklists/architecture-review-checklist" },
            { text: "Pattern Review Checklist", link: "/07-checklists/pattern-review-checklist" },
          ],
        },
      ],
    },
  }),
);
