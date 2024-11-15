import path from "path";

beforeEach(() => {
    // patch process.cwd to return the example directory
    process.cwd = () => path.resolve(__dirname, "../example");
});