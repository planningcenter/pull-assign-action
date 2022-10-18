const core = require('@actions/core')
const github = require('@actions/github')

const run = async () => {
  try {
    const githubToken = core.getInput('github_token')

    if (!githubToken) {
      throw Error(`input 'github_token' is required`)
    }

    const client = github.getOctokit(githubToken)
    const owner = github.context.payload.repository.owner.login
    const repo = github.context.payload.repository.name
    const issue_number = github.context.payload.pull_request.number

    const pr = github.context.payload.pull_request
    const assignees = pr.assignees
    const author = pr.user

    if (author.login === "dependabot") { return }

    if (!assignees || assignees.length === 0) {
      await client.request(`POST /repos/${owner}/${repo}/issues/${issue_number}/assignees`, {
        owner,
        repo,
        issue_number,
        assignees: [author.login]
      })
    }
  } catch (error) {
    console.log('Error:', error)
    core.error(error)
    core.setFailed(error)
  }
}

run()
