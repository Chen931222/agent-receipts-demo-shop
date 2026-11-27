# agent-receipts-demo-shop

A tiny payments module. A Claude Code session worked on it, test-first, to produce the recorded session that [Agent Receipts for Jira](https://github.com/Chen931222/agent-receipts) replays on its setup page.

- `Full refunds only`: the starting point.
- `PAY-7: partial refunds`: written by the Claude Code session. Its first test run had 14 failed and 3 passed, then 17 passed.
- `PAY-7 review: refuse refunds on cancelled orders`: the same session, continued. 1 failed, then 19 passed.

```
npm install
npm test
```
