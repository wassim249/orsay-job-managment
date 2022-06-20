import moment from "moment";
import resolveConfig from "tailwindcss/resolveConfig";
import LANG from "../../../i18n/lang.json";
export const tailwindConfig = () => {
  // Tailwind config
  return resolveConfig("./src/css/tailwind.config.js");
};

export const hexToRGB = (h) => {
  let r = 0;
  let g = 0;
  let b = 0;
  if (h.length === 4) {
    r = `0x${h[1]}${h[1]}`;
    g = `0x${h[2]}${h[2]}`;
    b = `0x${h[3]}${h[3]}`;
  } else if (h.length === 7) {
    r = `0x${h[1]}${h[2]}`;
    g = `0x${h[3]}${h[4]}`;
    b = `0x${h[5]}${h[6]}`;
  }
  return `${+r},${+g},${+b}`;
};

export const getDates = (date) => {
  let dates = [moment(date).format("MM DD")];
  for (let i = 1; i < 3; i++)
    dates.push(moment(dates[0]).add(i, "days").format("MM DD"));

  return dates;
};

export const scanSuccess = (scan) => {
  if (scan) {
    let log = JSON.parse(scan.log);
    for (let i = 0; i < log.length; i++)
      if (log[i].type === "error") return false;
    return true;
  } else return false;
};

export const salute = (lang) => {
  let hour = new Date().getHours();
  if (hour < 12) return LANG["home"]["good morning"][lang];
  else if (hour < 18) return LANG["home"]["good afternoon"][lang];
  else return LANG["home"]["good evenning"][lang];
};

export const generatePassword = () => {
  let length = 8,
    charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@&é-è_çà)=ù#",
    pwd = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    pwd += charset.charAt(Math.floor(Math.random() * n));
  }
  return pwd;
};

export const validateEmail = (email) => {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const generateCron = (
  repeatsChecked,
  repeats,
  times,
  exludeSunSat,
  dayOfWeek
) => {
  let cron = times;
  if (repeatsChecked && repeats) {
    if (repeats == "minute")
      cron = {
        minutes: "*/" + times.minutes,
        hours: cron.hours,
        days: cron.days,
        months: cron.months,
        weekdays: cron.weekdays,
      };
    else if (repeats === "hour")
      cron = {
        minutes: times.minutes || "0",
        hours: `*/${times.hours}`,
        days: cron.days,
        months: cron.months,
        weekdays: cron.weekdays,
      };
    else if (repeats === "day")
      cron = {
        minutes: times.minutes || "0",
        hours: times.hours || "0",
        days: `*/${times.days}`,
        months: cron.months,
        weekdays: cron.weekdays,
      };
    else if (repeats === "month")
      cron = {
        minutes: times.minutes || "0",
        hours: times.hours || "0",
        days: times.days || "0",
        months: `*/${times.months}`,
        weekdays: cron.weekdays,
      };
    else if (repeats === "week")
      cron = {
        minutes: times.minutes || "0",
        hours: times.hours || "0",
        days: times.days || "0",
        months: times.months || "0",
        weekdays: `${dayOfWeek}`,
      };
  }
  if (exludeSunSat)
    cron = {
      ...cron,
      weekdays: "1-5",
    };
  return `${cron.minutes} ${cron.hours} ${cron.days} ${cron.months} ${cron.weekdays}`;
};

export const generateColors = (length = 6) => {
  const COLORS = [
    {
      primary: "#6366f1",
      dark: "#a5b4fc",
    },
    {
      primary: "#3b82f6",
      dark: "#93c5fd",
    },
    {
      primary: "#14b8a6",
      dark: "#5eead4",
    },
    {
      primary: "#7dd3fc",
      dark: "#0284c7",
    },
    {
      primary: "#f97316",
      dark: "#fdba74",
    },
    {
      primary: "#fecaca",
      dark: "#f87171",
    },
  ];
  let colors = [];
  for (let i = 0; i < length; i++) {
    let color = COLORS[Math.floor(Math.random() * COLORS.length)];
    if (colors.includes(color)) i--;
    else colors.push(color);
  }
  return colors;
};
