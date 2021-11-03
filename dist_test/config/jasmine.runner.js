"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jasmine_1 = __importDefault(require("jasmine"));
const jasmine_spec_reporter_1 = require("jasmine-spec-reporter");
const jaz = new jasmine_1.default();
jaz.loadConfig({
    spec_dir: "dist_test",
    spec_files: ["**/*[sS]pec.js"],
});
jaz.env.clearReporters();
jaz.env.addReporter(new jasmine_spec_reporter_1.SpecReporter({
    spec: {
        displaySuccessful: true,
        displayFailed: true,
        displayPending: true,
        displayErrorMessages: true,
        displayStacktrace: jasmine_spec_reporter_1.StacktraceOption.PRETTY,
        displayDuration: true,
    },
}));
jaz.execute();
//# sourceMappingURL=jasmine.runner.js.map