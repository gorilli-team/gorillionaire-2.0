import { Plugin } from "@elizaos/core";
import { helloWorldAction } from "./actions/helloworld.ts";

export * as actions from "./actions";
export * as evaluators from "./evaluators";
export * as providers from "./providers";

export const devSchoolPlugin: Plugin = {
    name: "devschool",
    description: "Dev School example plugin",
    actions: [helloWorldAction],
};
