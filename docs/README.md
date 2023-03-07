## GithubActionsClient

## githubActionsClient.ListWorkflows()

Get all workflows of a specific repository and a specific owner

**RETURNS**

Promise&lt;object[]
- `id`: number
- `node_id`: string
- `name`: string
- `path`: string
- `state`: `'active'` | `'deleted'` | `'disabled_fork'` | `'disabled_inactivity'` | `'disabled_manually'`
- `created_at`: string - Format: date-time
- `updated_at`: string - Format: date-time
- `url`: string
- `html_url`: string
- `badge_url`: string
- `deleted_at?`: string - Format: date-time&gt;

## githubActionsClient.GetWorkflow(workflowName)

Gets all infos to a specific workflow

**PARAMETERS**

- `workflowName`: string - The name of the workflow to trigger

**RETURNS**

Promise&lt;object
- `id`: number
- `node_id`: string
- `name`: string
- `path`: string
- `state`: `'active'` | `'deleted'` | `'disabled_fork'` | `'disabled_inactivity'` | `'disabled_manually'`
- `created_at`: string - Format: date-time
- `updated_at`: string - Format: date-time
- `url`: string
- `html_url`: string
- `badge_url`: string
- `deleted_at?`: string - Format: date-time&gt;

## githubActionsClient.TriggerWorkflow(workflowName, branch)

Triggers a workflow, identified by the given parameters

**PARAMETERS**

- `workflowName`: string - The name of the workflow to trigger
- `branch`: string - The name of the branch from which the code is to be taken

**RETURNS**

Promise&lt;void&gt;

## githubActionsClient.ListRepositoryVariables()

List all repository variables identified by owner and repository

**RETURNS**

Promise&lt;object[]
- `name`: string
- `value`: string
- `created_at`: string - Format: date-time
- `updated_at`: string - Format: date-time&gt;

## githubActionsClient.CreateRepositoryVariable(variableName, value)

Creates a new repository variable

**PARAMETERS**

- `variableName`: string - The name of the variable to be created
- `value`: string - The value of the created variable

**RETURNS**

Promise&lt;number&gt;

## githubActionsClient.GetRepositoryVariable(variableName)

Returns a specific repository variable

**PARAMETERS**

- `variableName`: string - The name of the variable to be gathered

**RETURNS**

Promise&lt;object
- `name`: string
- `value`: string
- `created_at`: string - Format: date-time
- `updated_at`: string - Format: date-time&gt;

## githubActionsClient.RepositoryVariableExists(variableName)

Checks if a specific repository variable exists

**PARAMETERS**

- `variableName`: string - The name of the variable to be gathered

**RETURNS**

Promise&lt;boolean&gt;

## githubActionsClient.UpdateRepositoryVariable(variableName, value)

Updates a specific repository variable

**PARAMETERS**

- `variableName`: string - The name of the variable to be gathered
- `value`: string - The value of the repository variable

**RETURNS**

Promise&lt;number&gt;

## githubActionsClient.CreateOrUpdateRepositoryVariable(variableName, value)

Creates or updates a specific repository variable

**PARAMETERS**

- `variableName`: string - The name of the variable to be gathered
- `value`: string - The value of the repository variable

**RETURNS**

Promise&lt;number&gt;

## githubActionsClient.DeleteRepositoryVariable(variableName)

Delete a specific repository variable

**PARAMETERS**

- `variableName`: string - The name of the variable to be gathered

**RETURNS**

Promise&lt;number&gt;

## githubActionsClient.ListRepositorySecrets()

List all repository secrets

**RETURNS**

Promise&lt;object[]
- `name`: string
- `created_at`: string - Format: date-time
- `updated_at`: string - Format: date-time&gt;

## githubActionsClient.GetRepositorySecret(secretName)

Gets a repository secret, but no value!

**PARAMETERS**

- `secretName`: string - The name of the secret

**RETURNS**

Promise&lt;object
- `name`: string
- `created_at`: string - Format: date-time
- `updated_at`: string - Format: date-time&gt;

## githubActionsClient.CreateOrUpdateSecret(secretName, secretValue)

Create or update a repository secret

**PARAMETERS**

- `secretName`: string - The name of the secret
- `secretValue`: string - The plain text value of the secret

**RETURNS**

Promise&lt;number&gt;

## githubActionsClient.DeleteRepositorySecret(secretName)

Deletes a repository secret

**PARAMETERS**

- `secretName`: string - The name of the secret

**RETURNS**

Promise&lt;number&gt;

## githubActionsClient.ListWorkflowRuns()

Lists all workflow runs for a repository.

**RETURNS**

Promise&lt;object[]
- `id`: number
- `name`: null | string
- `node_id`: string
- `check_suite_id?`: number
- `check_suite_node_id?`: string
- `head_branch`: null | string
- `head_sha`: string
- `path`: string
- `run_number`: number
- `run_attempt?`: number
- `referenced_workflows`: null | object[]
- `path`: string
- `sha`: string
- `ref?`: string
- `event`: string
- `status`: null | string
- `conclusion`: null | string
- `workflow_id`: number
- `url`: string
- `html_url`: string
- `pull_requests`: null | object[]
- `id`: number
- `number`: number
- `url`: string
- `head`: object
  - `ref`: string
  - `sha`: string
  - `repo`: object
    - `id`: number
    - `url`: string
    - `name`: string
- `base`: object
  - `ref`: string
  - `sha`: string
  - `repo`: object
    - `id`: number
    - `url`: string
    - `name`: string
- `created_at`: string - Format: date-time
- `updated_at`: string - Format: date-time
- `actor?`: object
  - `name`: null | string
  - `email`: null | string
  - `login`: string
  - `id`: number
  - `node_id`: string
  - `avatar_url`: string - Format: uri
  - `gravatar_id`: null | string
  - `url`: string - Format: uri
  - `html_url`: string - Format: uri
  - `followers_url`: string - Format: uri
  - `following_url`: string
  - `gists_url`: string
  - `starred_url`: string
  - `subscriptions_url`: string - Format: uri
  - `organizations_url`: string - Format: uri
  - `repos_url`: string - Format: uri
  - `events_url`: string
  - `received_events_url`: string - Format: uri
  - `type`: string
  - `site_admin`: boolean
  - `starred_at?`: string
- `triggering_actor?`: object
  - `name`: null | string
  - `email`: null | string
  - `login`: string
  - `id`: number
  - `node_id`: string
  - `avatar_url`: string - Format: uri
  - `gravatar_id`: null | string
  - `url`: string - Format: uri
  - `html_url`: string - Format: uri
  - `followers_url`: string - Format: uri
  - `following_url`: string
  - `gists_url`: string
  - `starred_url`: string
  - `subscriptions_url`: string - Format: uri
  - `organizations_url`: string - Format: uri
  - `repos_url`: string - Format: uri
  - `events_url`: string
  - `received_events_url`: string - Format: uri
  - `type`: string
  - `site_admin`: boolean
  - `starred_at?`: string
- `run_started_at?`: string - Format: date-time
- `jobs_url`: string
- `logs_url`: string
- `check_suite_url`: string
- `artifacts_url`: string
- `cancel_url`: string
- `rerun_url`: string
- `previous_attempt_url`: null | string
- `workflow_url`: string
- `head_commit`: null | object
- `repository`: object
  - `id`: number
  - `node_id`: string
  - `name`: string
  - `full_name`: string
  - `owner`: object
    - `name`: null | string
    - `email`: null | string
    - `login`: string
    - `id`: number
    - `node_id`: string
    - `avatar_url`: string - Format: uri
    - `gravatar_id`: null | string
    - `url`: string - Format: uri
    - `html_url`: string - Format: uri
    - `followers_url`: string - Format: uri
    - `following_url`: string
    - `gists_url`: string
    - `starred_url`: string
    - `subscriptions_url`: string - Format: uri
    - `organizations_url`: string - Format: uri
    - `repos_url`: string - Format: uri
    - `events_url`: string
    - `received_events_url`: string - Format: uri
    - `type`: string
    - `site_admin`: boolean
    - `starred_at?`: string
  - `private`: boolean
  - `html_url`: string - Format: uri
  - `description`: null | string
  - `fork`: boolean
  - `url`: string - Format: uri
  - `archive_url`: string
  - `assignees_url`: string
  - `blobs_url`: string
  - `branches_url`: string
  - `collaborators_url`: string
  - `comments_url`: string
  - `commits_url`: string
  - `compare_url`: string
  - `contents_url`: string
  - `contributors_url`: string - Format: uri
  - `deployments_url`: string - Format: uri
  - `downloads_url`: string - Format: uri
  - `events_url`: string - Format: uri
  - `forks_url`: string - Format: uri
  - `git_commits_url`: string
  - `git_refs_url`: string
  - `git_tags_url`: string
  - `git_url?`: string
  - `issue_comment_url`: string
  - `issue_events_url`: string
  - `issues_url`: string
  - `keys_url`: string
  - `labels_url`: string
  - `languages_url`: string - Format: uri
  - `merges_url`: string - Format: uri
  - `milestones_url`: string
  - `notifications_url`: string
  - `pulls_url`: string
  - `releases_url`: string
  - `ssh_url?`: string
  - `stargazers_url`: string - Format: uri
  - `statuses_url`: string
  - `subscribers_url`: string - Format: uri
  - `subscription_url`: string - Format: uri
  - `tags_url`: string - Format: uri
  - `teams_url`: string - Format: uri
  - `trees_url`: string
  - `clone_url?`: string
  - `mirror_url`: null | string
  - `hooks_url`: string - Format: uri
  - `svn_url?`: string
  - `homepage`: null | string
  - `language`: null | string
  - `forks_count?`: number
  - `stargazers_count?`: number
  - `watchers_count?`: number
  - `size?`: number
  - `default_branch?`: string
  - `open_issues_count?`: number
  - `is_template?`: boolean
  - `topics?`: string[]
  - `has_issues?`: boolean
  - `has_projects?`: boolean
  - `has_wiki?`: boolean
  - `has_pages?`: boolean
  - `has_downloads?`: boolean
  - `has_discussions?`: boolean
  - `archived?`: boolean
  - `disabled?`: boolean
  - `visibility?`: string
  - `pushed_at`: null | string - Format: date-time
  - `created_at`: null | string - Format: date-time
  - `updated_at`: null | string - Format: date-time
  - `permissions?`: object
    - `admin?`: boolean
    - `maintain?`: boolean
    - `push?`: boolean
    - `triage?`: boolean
    - `pull?`: boolean
  - `role_name?`: string
  - `temp_clone_token?`: string
  - `delete_branch_on_merge?`: boolean
  - `subscribers_count?`: number
  - `network_count?`: number
  - `code_of_conduct?`: object
    - `key`: string
    - `name`: string
    - `url`: string - Format: uri
    - `body?`: string
    - `html_url`: null | string - Format: uri
  - `license`: null | object
  - `forks?`: number
  - `open_issues?`: number
  - `watchers?`: number
  - `allow_forking?`: boolean
  - `web_commit_signoff_required?`: boolean
  - `security_and_analysis`: null | object
- `head_repository`: object
  - `id`: number
  - `node_id`: string
  - `name`: string
  - `full_name`: string
  - `owner`: object
    - `name`: null | string
    - `email`: null | string
    - `login`: string
    - `id`: number
    - `node_id`: string
    - `avatar_url`: string - Format: uri
    - `gravatar_id`: null | string
    - `url`: string - Format: uri
    - `html_url`: string - Format: uri
    - `followers_url`: string - Format: uri
    - `following_url`: string
    - `gists_url`: string
    - `starred_url`: string
    - `subscriptions_url`: string - Format: uri
    - `organizations_url`: string - Format: uri
    - `repos_url`: string - Format: uri
    - `events_url`: string
    - `received_events_url`: string - Format: uri
    - `type`: string
    - `site_admin`: boolean
    - `starred_at?`: string
  - `private`: boolean
  - `html_url`: string - Format: uri
  - `description`: null | string
  - `fork`: boolean
  - `url`: string - Format: uri
  - `archive_url`: string
  - `assignees_url`: string
  - `blobs_url`: string
  - `branches_url`: string
  - `collaborators_url`: string
  - `comments_url`: string
  - `commits_url`: string
  - `compare_url`: string
  - `contents_url`: string
  - `contributors_url`: string - Format: uri
  - `deployments_url`: string - Format: uri
  - `downloads_url`: string - Format: uri
  - `events_url`: string - Format: uri
  - `forks_url`: string - Format: uri
  - `git_commits_url`: string
  - `git_refs_url`: string
  - `git_tags_url`: string
  - `git_url?`: string
  - `issue_comment_url`: string
  - `issue_events_url`: string
  - `issues_url`: string
  - `keys_url`: string
  - `labels_url`: string
  - `languages_url`: string - Format: uri
  - `merges_url`: string - Format: uri
  - `milestones_url`: string
  - `notifications_url`: string
  - `pulls_url`: string
  - `releases_url`: string
  - `ssh_url?`: string
  - `stargazers_url`: string - Format: uri
  - `statuses_url`: string
  - `subscribers_url`: string - Format: uri
  - `subscription_url`: string - Format: uri
  - `tags_url`: string - Format: uri
  - `teams_url`: string - Format: uri
  - `trees_url`: string
  - `clone_url?`: string
  - `mirror_url`: null | string
  - `hooks_url`: string - Format: uri
  - `svn_url?`: string
  - `homepage`: null | string
  - `language`: null | string
  - `forks_count?`: number
  - `stargazers_count?`: number
  - `watchers_count?`: number
  - `size?`: number
  - `default_branch?`: string
  - `open_issues_count?`: number
  - `is_template?`: boolean
  - `topics?`: string[]
  - `has_issues?`: boolean
  - `has_projects?`: boolean
  - `has_wiki?`: boolean
  - `has_pages?`: boolean
  - `has_downloads?`: boolean
  - `has_discussions?`: boolean
  - `archived?`: boolean
  - `disabled?`: boolean
  - `visibility?`: string
  - `pushed_at`: null | string - Format: date-time
  - `created_at`: null | string - Format: date-time
  - `updated_at`: null | string - Format: date-time
  - `permissions?`: object
    - `admin?`: boolean
    - `maintain?`: boolean
    - `push?`: boolean
    - `triage?`: boolean
    - `pull?`: boolean
  - `role_name?`: string
  - `temp_clone_token?`: string
  - `delete_branch_on_merge?`: boolean
  - `subscribers_count?`: number
  - `network_count?`: number
  - `code_of_conduct?`: object
    - `key`: string
    - `name`: string
    - `url`: string - Format: uri
    - `body?`: string
    - `html_url`: null | string - Format: uri
  - `license`: null | object
  - `forks?`: number
  - `open_issues?`: number
  - `watchers?`: number
  - `allow_forking?`: boolean
  - `web_commit_signoff_required?`: boolean
  - `security_and_analysis`: null | object
- `head_repository_id?`: number
- `display_title`: string&gt;

## githubActionsClient.GetWorkflowRun(run_id)

Gets a specific workflow run

**PARAMETERS**

- `run_id`: number - The unique identifier of the workflow run.

**RETURNS**

Promise&lt;object
- `id`: number
- `name`: null | string
- `node_id`: string
- `check_suite_id?`: number
- `check_suite_node_id?`: string
- `head_branch`: null | string
- `head_sha`: string
- `path`: string
- `run_number`: number
- `run_attempt?`: number
- `referenced_workflows`: null | object[]
- `path`: string
- `sha`: string
- `ref?`: string
- `event`: string
- `status`: null | string
- `conclusion`: null | string
- `workflow_id`: number
- `url`: string
- `html_url`: string
- `pull_requests`: null | object[]
- `id`: number
- `number`: number
- `url`: string
- `head`: object
  - `ref`: string
  - `sha`: string
  - `repo`: object
    - `id`: number
    - `url`: string
    - `name`: string
- `base`: object
  - `ref`: string
  - `sha`: string
  - `repo`: object
    - `id`: number
    - `url`: string
    - `name`: string
- `created_at`: string - Format: date-time
- `updated_at`: string - Format: date-time
- `actor?`: object
  - `name`: null | string
  - `email`: null | string
  - `login`: string
  - `id`: number
  - `node_id`: string
  - `avatar_url`: string - Format: uri
  - `gravatar_id`: null | string
  - `url`: string - Format: uri
  - `html_url`: string - Format: uri
  - `followers_url`: string - Format: uri
  - `following_url`: string
  - `gists_url`: string
  - `starred_url`: string
  - `subscriptions_url`: string - Format: uri
  - `organizations_url`: string - Format: uri
  - `repos_url`: string - Format: uri
  - `events_url`: string
  - `received_events_url`: string - Format: uri
  - `type`: string
  - `site_admin`: boolean
  - `starred_at?`: string
- `triggering_actor?`: object
  - `name`: null | string
  - `email`: null | string
  - `login`: string
  - `id`: number
  - `node_id`: string
  - `avatar_url`: string - Format: uri
  - `gravatar_id`: null | string
  - `url`: string - Format: uri
  - `html_url`: string - Format: uri
  - `followers_url`: string - Format: uri
  - `following_url`: string
  - `gists_url`: string
  - `starred_url`: string
  - `subscriptions_url`: string - Format: uri
  - `organizations_url`: string - Format: uri
  - `repos_url`: string - Format: uri
  - `events_url`: string
  - `received_events_url`: string - Format: uri
  - `type`: string
  - `site_admin`: boolean
  - `starred_at?`: string
- `run_started_at?`: string - Format: date-time
- `jobs_url`: string
- `logs_url`: string
- `check_suite_url`: string
- `artifacts_url`: string
- `cancel_url`: string
- `rerun_url`: string
- `previous_attempt_url`: null | string
- `workflow_url`: string
- `head_commit`: null | object
- `repository`: object
  - `id`: number
  - `node_id`: string
  - `name`: string
  - `full_name`: string
  - `owner`: object
    - `name`: null | string
    - `email`: null | string
    - `login`: string
    - `id`: number
    - `node_id`: string
    - `avatar_url`: string - Format: uri
    - `gravatar_id`: null | string
    - `url`: string - Format: uri
    - `html_url`: string - Format: uri
    - `followers_url`: string - Format: uri
    - `following_url`: string
    - `gists_url`: string
    - `starred_url`: string
    - `subscriptions_url`: string - Format: uri
    - `organizations_url`: string - Format: uri
    - `repos_url`: string - Format: uri
    - `events_url`: string
    - `received_events_url`: string - Format: uri
    - `type`: string
    - `site_admin`: boolean
    - `starred_at?`: string
  - `private`: boolean
  - `html_url`: string - Format: uri
  - `description`: null | string
  - `fork`: boolean
  - `url`: string - Format: uri
  - `archive_url`: string
  - `assignees_url`: string
  - `blobs_url`: string
  - `branches_url`: string
  - `collaborators_url`: string
  - `comments_url`: string
  - `commits_url`: string
  - `compare_url`: string
  - `contents_url`: string
  - `contributors_url`: string - Format: uri
  - `deployments_url`: string - Format: uri
  - `downloads_url`: string - Format: uri
  - `events_url`: string - Format: uri
  - `forks_url`: string - Format: uri
  - `git_commits_url`: string
  - `git_refs_url`: string
  - `git_tags_url`: string
  - `git_url?`: string
  - `issue_comment_url`: string
  - `issue_events_url`: string
  - `issues_url`: string
  - `keys_url`: string
  - `labels_url`: string
  - `languages_url`: string - Format: uri
  - `merges_url`: string - Format: uri
  - `milestones_url`: string
  - `notifications_url`: string
  - `pulls_url`: string
  - `releases_url`: string
  - `ssh_url?`: string
  - `stargazers_url`: string - Format: uri
  - `statuses_url`: string
  - `subscribers_url`: string - Format: uri
  - `subscription_url`: string - Format: uri
  - `tags_url`: string - Format: uri
  - `teams_url`: string - Format: uri
  - `trees_url`: string
  - `clone_url?`: string
  - `mirror_url`: null | string
  - `hooks_url`: string - Format: uri
  - `svn_url?`: string
  - `homepage`: null | string
  - `language`: null | string
  - `forks_count?`: number
  - `stargazers_count?`: number
  - `watchers_count?`: number
  - `size?`: number
  - `default_branch?`: string
  - `open_issues_count?`: number
  - `is_template?`: boolean
  - `topics?`: string[]
  - `has_issues?`: boolean
  - `has_projects?`: boolean
  - `has_wiki?`: boolean
  - `has_pages?`: boolean
  - `has_downloads?`: boolean
  - `has_discussions?`: boolean
  - `archived?`: boolean
  - `disabled?`: boolean
  - `visibility?`: string
  - `pushed_at`: null | string - Format: date-time
  - `created_at`: null | string - Format: date-time
  - `updated_at`: null | string - Format: date-time
  - `permissions?`: object
    - `admin?`: boolean
    - `maintain?`: boolean
    - `push?`: boolean
    - `triage?`: boolean
    - `pull?`: boolean
  - `role_name?`: string
  - `temp_clone_token?`: string
  - `delete_branch_on_merge?`: boolean
  - `subscribers_count?`: number
  - `network_count?`: number
  - `code_of_conduct?`: object
    - `key`: string
    - `name`: string
    - `url`: string - Format: uri
    - `body?`: string
    - `html_url`: null | string - Format: uri
  - `license`: null | object
  - `forks?`: number
  - `open_issues?`: number
  - `watchers?`: number
  - `allow_forking?`: boolean
  - `web_commit_signoff_required?`: boolean
  - `security_and_analysis`: null | object
- `head_repository`: object
  - `id`: number
  - `node_id`: string
  - `name`: string
  - `full_name`: string
  - `owner`: object
    - `name`: null | string
    - `email`: null | string
    - `login`: string
    - `id`: number
    - `node_id`: string
    - `avatar_url`: string - Format: uri
    - `gravatar_id`: null | string
    - `url`: string - Format: uri
    - `html_url`: string - Format: uri
    - `followers_url`: string - Format: uri
    - `following_url`: string
    - `gists_url`: string
    - `starred_url`: string
    - `subscriptions_url`: string - Format: uri
    - `organizations_url`: string - Format: uri
    - `repos_url`: string - Format: uri
    - `events_url`: string
    - `received_events_url`: string - Format: uri
    - `type`: string
    - `site_admin`: boolean
    - `starred_at?`: string
  - `private`: boolean
  - `html_url`: string - Format: uri
  - `description`: null | string
  - `fork`: boolean
  - `url`: string - Format: uri
  - `archive_url`: string
  - `assignees_url`: string
  - `blobs_url`: string
  - `branches_url`: string
  - `collaborators_url`: string
  - `comments_url`: string
  - `commits_url`: string
  - `compare_url`: string
  - `contents_url`: string
  - `contributors_url`: string - Format: uri
  - `deployments_url`: string - Format: uri
  - `downloads_url`: string - Format: uri
  - `events_url`: string - Format: uri
  - `forks_url`: string - Format: uri
  - `git_commits_url`: string
  - `git_refs_url`: string
  - `git_tags_url`: string
  - `git_url?`: string
  - `issue_comment_url`: string
  - `issue_events_url`: string
  - `issues_url`: string
  - `keys_url`: string
  - `labels_url`: string
  - `languages_url`: string - Format: uri
  - `merges_url`: string - Format: uri
  - `milestones_url`: string
  - `notifications_url`: string
  - `pulls_url`: string
  - `releases_url`: string
  - `ssh_url?`: string
  - `stargazers_url`: string - Format: uri
  - `statuses_url`: string
  - `subscribers_url`: string - Format: uri
  - `subscription_url`: string - Format: uri
  - `tags_url`: string - Format: uri
  - `teams_url`: string - Format: uri
  - `trees_url`: string
  - `clone_url?`: string
  - `mirror_url`: null | string
  - `hooks_url`: string - Format: uri
  - `svn_url?`: string
  - `homepage`: null | string
  - `language`: null | string
  - `forks_count?`: number
  - `stargazers_count?`: number
  - `watchers_count?`: number
  - `size?`: number
  - `default_branch?`: string
  - `open_issues_count?`: number
  - `is_template?`: boolean
  - `topics?`: string[]
  - `has_issues?`: boolean
  - `has_projects?`: boolean
  - `has_wiki?`: boolean
  - `has_pages?`: boolean
  - `has_downloads?`: boolean
  - `has_discussions?`: boolean
  - `archived?`: boolean
  - `disabled?`: boolean
  - `visibility?`: string
  - `pushed_at`: null | string - Format: date-time
  - `created_at`: null | string - Format: date-time
  - `updated_at`: null | string - Format: date-time
  - `permissions?`: object
    - `admin?`: boolean
    - `maintain?`: boolean
    - `push?`: boolean
    - `triage?`: boolean
    - `pull?`: boolean
  - `role_name?`: string
  - `temp_clone_token?`: string
  - `delete_branch_on_merge?`: boolean
  - `subscribers_count?`: number
  - `network_count?`: number
  - `code_of_conduct?`: object
    - `key`: string
    - `name`: string
    - `url`: string - Format: uri
    - `body?`: string
    - `html_url`: null | string - Format: uri
  - `license`: null | object
  - `forks?`: number
  - `open_issues?`: number
  - `watchers?`: number
  - `allow_forking?`: boolean
  - `web_commit_signoff_required?`: boolean
  - `security_and_analysis`: null | object
- `head_repository_id?`: number
- `display_title`: string&gt;

## githubActionsClient.DownloadWorkflowRunLogs(run_id)

Gets a redirect URL to download an archive of log files for a workflow run. This link expires after 1 minute.

**PARAMETERS**

- `run_id`: number - The unique identifier of the workflow run

**RETURNS**

Promise&lt;string&gt;

## githubActionsClient.GetWorkflowUsage(workflow_id)

Gets the number of billable minutes used by a specific workflow during the current billing cycle.
Billable minutes only apply to workflows in private repositories that use GitHub-hosted runners.
Usage is listed for each GitHub-hosted runner operating system in milliseconds. Any job re-runs are also included in the usage.

**PARAMETERS**

- `workflow_id`: number - - The ID of the workflow

**RETURNS**

Promise&lt;object
- `billable`: object
  - `UBUNTU?`: object
    - `total_ms?`: number
  - `MACOS?`: object
    - `total_ms?`: number
  - `WINDOWS?`: object
    - `total_ms?`: number&gt;

## githubActionsClient.DisableWorkflow(workflow_id)

Disables a workflow and sets the state of the workflow to disabled_manually. You can replace workflow_id with the workflow file name. For example, you could use main.yaml.

**PARAMETERS**

- `workflow_id`: number - - The ID of the workflow

**RETURNS**

Promise&lt;number&gt;

## githubActionsClient.EnableWorkflow(workflow_id)

Enables a workflow and sets the state of the workflow to active. You can replace workflow_id with the workflow file name. For example, you could use main.yaml.

**PARAMETERS**

- `workflow_id`: number - - The ID of the workflow

**RETURNS**

Promise&lt;number&gt;