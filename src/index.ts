import { Command } from "commander";
import { Octokit } from "@octokit/rest";
import simpleGit from "simple-git";
import fs from "fs";
import path from "path";
import open from "open";

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
    const mainBranch = "main";
    const branchName = "quickdraw-branch";
    const tempDir = path.join(process.cwd(), options.name);

    if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
    }

    const git = simpleGit();

    console.log("📁 Cloning repo...");
    await git.clone(repoUrl);
    process.chdir(tempDir);

    const localGit = simpleGit();

    console.log(`🌱 Initializing main branch with initial commit...`);
    await localGit.checkoutLocalBranch(mainBranch);

    fs.writeFileSync("README.md", `# Initial Commit\nCreated at ${new Date().toISOString()}\n`);
    await localGit.add("./*");
    await localGit.commit("Initial commit");
    await localGit.push("origin", mainBranch);

    console.log(`🌱 Creating branch ${branchName} from ${mainBranch}...`);
    await localGit.checkoutBranch(branchName, mainBranch);

    console.log("📄 Updating README for Quickdraw badge...");
    fs.writeFileSync("README.md", `# Quickdraw Badge 🚀\nGenerated at ${new Date().toISOString()}\n`);

    await localGit.add("./*");
    await localGit.commit("Add README for Quickdraw badge");
    await localGit.push("origin", branchName);

    return branchName;
}

async function createPullRequest(username: string, branchName: string) {
    console.log("📬 Creating pull request...");
    const { data: pr } = await octokit.rest.pulls.create({
        owner: username,
        repo: options.name,
        title: "Quickdraw badge PR",
        head: branchName,
        base: "main",
        body: "This PR is created to earn the Quickdraw badge.",
    });

    console.log(`✅ Pull request created: ${pr.html_url}`);
    await open(pr.html_url);
}

async function main() {
    try {
        const { username, repoUrl } = await createRepo();
        const branchName = await prepareAndPushFiles(username, repoUrl);
        await createPullRequest(username, branchName);
    } catch (err) {
        console.error("❌ Error:", err);
        process.exit(1);
    }
}

main();
