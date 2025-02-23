import { CronJob } from "cron";
import { TTimeStampCronJob } from "./cronjob.types";

enum TimeStampCronJob {
  EVERY_5_SEC = "*/5 * * * * *",
  EVERY_15_SEC = "*/15 * * * * *",
  EVERY_30_SEC = "*/30 * * * * *",
  EVERY_1_MIN = "* * * * *",
  EVERY_3_MIN = "*/3 * * * *",
  EVERY_5_MIN = "*/5 * * * *",
  EVERY_15MIN = "*/15 * * * *",
  EVERY_30MIN = "*/30 * * * *",
  EVERY_1H = "0 * * * *",
}

const timeStampMapping: Record<TTimeStampCronJob, TimeStampCronJob> = {
  "5sec": TimeStampCronJob.EVERY_5_SEC,
  "15sec": TimeStampCronJob.EVERY_15_SEC,
  "30sec": TimeStampCronJob.EVERY_30_SEC,
  "1min": TimeStampCronJob.EVERY_1_MIN,
  "3min": TimeStampCronJob.EVERY_3_MIN,
  "5min": TimeStampCronJob.EVERY_5_MIN,
  "15min": TimeStampCronJob.EVERY_15MIN,
  "30min": TimeStampCronJob.EVERY_30MIN,
  "1h": TimeStampCronJob.EVERY_1H,
};

const getCronJobFromString = (timeStamp: string): TimeStampCronJob => {
  if (!(timeStamp in timeStampMapping)) {
    throw new Error(
      `Invalid timestamp: "${timeStamp}". Allowed values: ${Object.keys(
        timeStampMapping
      ).join(", ")}`
    );
  }
  return timeStampMapping[timeStamp as TTimeStampCronJob];
};

const initCronjob = (
  handleFunction: () => Promise<boolean>,
  timeStamp: string
) => {
  let isJobRunning = false;
  let jobSkippedCount = 0;

  const cronjob = CronJob.from({
    cronTime: getCronJobFromString(timeStamp),
    onTick: async () => {
      if (isJobRunning) {
        jobSkippedCount++;
        console.log("JOB SKIPPED, COUNT: ", jobSkippedCount);
        return;
      }
      isJobRunning = true;
      try {
        const shouldStop = await handleFunction();
        if (shouldStop) {
          console.log("CRON JOB STOPPED, DATA FOUND....");
          cronjob.stop();
        }
      } catch (err) {
        console.log("Cron job error:", err);
      } finally {
        isJobRunning = false;
      }
    },
  });

  console.log("CronJob init");
  return cronjob;
};

export { initCronjob };
