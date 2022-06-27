/*
 * Copyright © 2022 Atomist, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
	datalog,
	EventHandler,
	github,
	handle,
	log,
	repository,
	status,
	subscription,
} from "@atomist/skill";

import { Configuration } from "./configuration";

export const on_push: EventHandler<subscription.datalog.OnPush, Configuration> =
	handle.transform(async ctx => {
		const commit = ctx.data.commit;

		const gitCommit = (
			await github.api(repository.fromRepo(commit.repo)).repos.getCommit({
				owner: commit.repo.org.name,
				repo: commit.repo.name,
				ref: commit.sha,
			})
		).data;

		await ctx.datalog.transact([
			datalog.entity("git/repo", "$repo", {
				"sourceId": commit.repo.sourceId,
				"git.provider/url": commit.repo.org.url,
			}),
			datalog.entity("git/commit", "$commit", {
				"sha": commit.sha,
				"repo": "$repo",
				"git.provider/url": commit.repo.org.url,
			}),
			datalog.entity("git.commit/signature", {
				commit: "$commit",
				signature: gitCommit.commit.verification.signature,
				status: gitCommit.commit.verification.verified
					? datalog.asKeyword("git.commit.signature/VERIFIED")
					: datalog.asKeyword("git.commit.signature/NOT_VERIFIED"),
				reason: gitCommit.commit.verification.reason,
			}),
		]);

		log.info("Transacted commit signature for %s", commit.sha);

		return status.success(
			"Successfully transacted commit signature for 1 commit",
		);
	});

interface CommitSignature {
	signature: string;
	reason: string;
	status: string;
}

export const on_commit_signature: EventHandler<
	subscription.datalog.OnPush & { signature: CommitSignature },
	Configuration
> = handle.transform(async ctx => {
	log.info(
		"Commit %s is signed and verified by: %s",
		ctx.data.commit.sha,
		ctx.data.signature.signature,
	);

	return status.success("Detected signed and verified commit");
});
