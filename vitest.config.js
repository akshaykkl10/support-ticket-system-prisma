import {defineConfig} from "vitest/config";

export default defineConfig({
    test:{
        fileParallelism: false,
        
        include: [
            "tests/**"
        ],
        exclude: [
            "node_modules/**",
            "dist/**",
            "tests/services.test.ts",
            "tests/dbreset.ts"
        ],
    },
})