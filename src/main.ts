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
      await client.graphql(`mutation {
        createRef(input: {repositoryId: "${github.context.repo.repo}", name: "refs/tags/${tag}", oid: "${sha}"}) {
          ref {
            id
          }
        }
      }`);
      core.debug(`Created tag ${tag} for commit ${sha}`);
    } catch (err) {
      core.debug(`error: #${err}`);

      await client.graphql(`mutation {
        updateRef (input: {repositoryId: "${github.context.repo.repo}", name: "refs/tags/${tag}", oid: "${sha}"}) {
          ref {
            id
          }
        }
      }`);

      core.debug(`Updated tag ${tag} for commit ${sha}`);
    }
  } catch (err) {
    core.error(err);
    core.setFailed(err.message);
  }
}

run();
