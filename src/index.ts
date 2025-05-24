import { Command } from "commander";

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
