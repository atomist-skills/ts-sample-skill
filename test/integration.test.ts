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

import { State } from "@atomist/skill/lib/handler/index";
import { assertSkill } from "@atomist/skill/lib/test/assert";
import * as assert from "assert";

describe("on_push", () => {
	it("should successfully handle on_push event", async () => {
		const payload: any = {
			correlation_id:
				"80b3dc5b-cbd5-446b-8615-1dc78831b1c0.mKRZdUKhAXShLsUKGazOg",
			skill: {
				id: "9b3adbf7-0ac2-4f72-86b4-9707baf5db56",
				namespace: "atomist",
				name: "ts-sample-skill",
				version: "0.1.0-12",
				configuration: {
					name: "javascript_sample_skill",
					enabled: true,
				},
				artifacts: [
					{
						args: null,
						image: "gcr.io/atomist-container-skills/ts-sample-skill:e310b8bca63fe2609f22bab12ec4ac38ac35e27f",
						__typename: "AtomistSkillDockerArtifact",
						name: "docker",
						resources: {
							request: null,
							limit: { memory: 1024, cpu: 1 },
						},
						env: null,
						command: null,
					},
				],
				platform: "docker",
			},
			subscription: {
				"name": "on_push",
				"tx": 13194143809603,
				"after-basis-t": 4276291,
				"result": [
					[
						{
							"schema/entity-type": "git/commit",
							"git.commit/repo": {
								"git.repo/name": "go-sample-skill",
								"git.repo/source-id": "490643782",
								"git.repo/default-branch": "main",
								"git.repo/org": {
									"github.org/installation-token":
										process.env.GITHUB_TOKEN,
									"git.org/name": "atomist-skills",
									"git.provider/url": "h****************m",
								},
							},
							"git.commit/author": {
								"git.user/name": "C**************s",
								"git.user/login": "c*****s",
								"git.user/emails": [
									{ "email.email/address": "c************m" },
								],
							},
							"git.commit/sha":
								"3753d920965bc39fa97115a90788c3f326b21571",
							"git.commit/message": "Fix name",
							"git.ref/refs": [
								{
									"git.ref/name": "main",
									"git.ref/type": {
										"db/id": 83562883711320,
										"db/ident": "git.ref.type/branch",
									},
								},
							],
						},
					],
				],
			},
			type: "datalog_subscription_result",
			team_id: "T29E48P34",
			registration: { name: "atomist/js-sample-skill" },
			log_url:
				"h*********************************************************************************************g",
			secrets: [
				{
					uri: "atomist://api-key",
					value: "e********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************E",
				},
			],
		};

		const result = await assertSkill(payload);
		assert.deepStrictEqual(result.state, State.Completed);
	});
});
