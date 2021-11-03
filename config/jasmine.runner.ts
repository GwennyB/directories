import Jasmine from "jasmine";
import { SpecReporter, StacktraceOption } from "jasmine-spec-reporter";

const jaz = new Jasmine();
jaz.loadConfig({
  spec_dir: "dist_test",
  spec_files: ["**/*[sS]pec.js"],
});

jaz.env.clearReporters();
jaz.env.addReporter(new SpecReporter({
  spec: {
    displaySuccessful: true,
    displayFailed: true,
    displayPending: true,
    displayErrorMessages: true,
    displayStacktrace: StacktraceOption.PRETTY,
    displayDuration: true,
  },
}));

jaz.execute();
