import github from '@actions/github';
import core from '@actions/core';

async function run() {
  try {
    const token = core.getInput("repo-token", { required: true });
    const tag = core.getInput("tag", { required: true });
    const sha = core.getInput("commit-sha", { required: false }) || github.context.sha;

    const client = github.getOctokit(token);
    core.debug(`tagging #${sha} with tag ${tag}`);
    try {
      await client.rest.git.createRef({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        ref: `refs/tags/${tag}`,
        sha: sha
      });
      core.debug(`Created tag ${tag} for commit ${sha}`);
    } catch (error) {
      core.debug(`error: #${error}`);
      await client.rest.git.updateRef({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        ref: `tags/${tag}`,
        sha: sha,
        force: true
      });
      core.debug(`Updated tag ${tag} for commit ${sha}`);
    }
  } catch (error) {
    core.error(error);
    core.setFailed(error.message);
  }
}

run();