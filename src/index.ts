import { Command } from "commander";
import { Octokit } from "@octokit/rest";
import simpleGit from "simple-git";
import fs from "fs";
import path from "path";

const program = new Command();

program
    .name("quickdraw")
    .description("Automatically earn the GitHub Quickdraw badge")
    .version("1.0.0")
    .requiredOption("-t, --token <token>", "GitHub personal access token")
    .option("-n, --name <name>", "Repository name", `quickdraw-${Date.now()}`)
    .option("--private", "Create the repository as private", false)
    .parse(process.argv);

export const options = program.opts<{
    token: string;
    name: string;
    private: boolean;
}>();

const octokit = new Octokit({ auth: options.token });

async function createRepo() {
    const user = await octokit.rest.users.getAuthenticated();
    const username = user.data.login;

    console.log(`🚀 Creating repository: ${options.name}`);
    await octokit.rest.repos.createForAuthenticatedUser({
        name: options.name,
        private: options.private,
        auto_init: false,
    });

    return { username, repoUrl: `https://github.com/${username}/${options.name}.git` };
}

async function prepareAndPushFiles(username: string, repoUrl: string) {
    const branchName = "quickdraw-branch";
    const tempDir = path.join(process.cwd(), options.name);
    const git = simpleGit();

    console.log("📁 Cloning repo...");
    await git.clone(repoUrl);
    process.chdir(tempDir);

    console.log("🌱 Creating branch...");
    await git.checkoutLocalBranch(branchName);

    console.log("📄 Adding README...");
    fs.writeFileSync("README.md", `# Quickdraw Badge 🚀\nGenerated at ${new Date().toISOString()}\n`);

    await git.add(".");
    await git.commit("Add README for Quickdraw badge");
    await git.push("origin", branchName);

    return branchName;
}