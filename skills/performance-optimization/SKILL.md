# Performance Optimization

## Principles
- Measure before optimizing; define a baseline.
- Optimize the critical path, not everything.
- Prefer algorithmic improvements over micro-opts.
- Avoid premature optimization; verify with benchmarks.

## Workflow
1. Profile (CPU/memory/network) to find hotspots.
2. Establish baseline metrics and targets.
3. Apply targeted change; re-measure.
4. Guard with performance tests/benchmarks in CI.

## Checklist
- [ ] Baseline captured
- [ ] Hotspot identified with evidence
- [ ] Change improves target metric
- [ ] No regression in correctness/tests
- [ ] Benchmark added to CI