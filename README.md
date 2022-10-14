# Pull Assign Action

This is a GitHub action that assigns a PR owner upon opening a pull request.

Sample config, place in `.github/workflows/assign.yml`

```
name: Pull assign

on:
  pull_request:
    types: [opened, reopened]

jobs:
  assign:
    runs-on: ubuntu-latest
    steps:
      - uses: planningcenter/pull-assign-action@v1.1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Copyright & License

Copyright (c) Planning Center, licensed MIT. See LICENSE file in this repo.
