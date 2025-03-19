const core = require('@actions/core')
const github = require('@actions/github')
const { Octokit } = require("@octokit/action")

async function run() {
  const botAssignee = core.getInput('bot-assignee') || null

  const client = new Octokit()
  const owner = github.context.payload.repository.owner.login
  const repo = github.context.payload.repository.name
  const issue_number = github.context.payload.pull_request.number

  const pr = github.context.payload.pull_request
  const assignees = pr.assignees
  const author = pr.user

  console.log(`assignees: ${JSON.stringify(assignees, undefined, 2)}`)
  console.log(`author: ${JSON.stringify(author, undefined, 2)}`)

  if (!assignees || assignees.length === 0) {
    if (author.is_bot || (author.type && author.type === 'Bot')) {
      if (botAssignee) {
        console.log(`PR was created by a bot (${author.login}). Assigning ${botAssignee}.`)
        await client.request(
          `POST /repos/${owner}/${repo}/issues/${issue_number}/assignees`,
          { owner, repo, issue_number, assignees: [botAssignee] }
        )
      } else {
        console.log(`PR was created by a bot (${author.login}), but no bot-assignee was provided. No assignee added.`)
      }
    } else {
      console.log(`PR was created by a human (${author.login}). Assigning them.`)
      await client.request(
        `POST /repos/${owner}/${repo}/issues/${issue_number}/assignees`,
        { owner, repo, issue_number, assignees: [author.login] }
      )
    }
  } else {
    console.log('PR already has assignees. No changes made.')
  }
}

try {
  run()
} catch (error) {
  console.log('Error:', error)
  core.error(error)
  core.setFailed(error.message)
}
