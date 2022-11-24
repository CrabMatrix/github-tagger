"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const github_1 = __importDefault(require("@actions/github"));
const core_1 = __importDefault(require("@actions/core"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = core_1.default.getInput("repo-token", { required: true });
            const tag = core_1.default.getInput("tag", { required: true });
            const sha = core_1.default.getInput("commit-sha", { required: false }) || github_1.default.context.sha;
            const client = github_1.default.getOctokit(token);
            try {
                yield client.rest.git.createRef({
                    owner: github_1.default.context.repo.owner,
                    repo: github_1.default.context.repo.repo,
                    ref: `refs/tags/${tag}`,
                    sha: sha
                });
            }
            catch (_a) {
                try {
                    yield client.rest.git.updateRef({
                        owner: github_1.default.context.repo.owner,
                        repo: github_1.default.context.repo.repo,
                        ref: `refs/tags/${tag}`,
                        sha: sha,
                        force: true
                    });
                }
                catch (error) {
                    core_1.default.setFailed(error.message);
                }
            }
        }
        catch (error) {
            core_1.default.error(error);
            core_1.default.setFailed(error.message);
        }
    });
}
run();
