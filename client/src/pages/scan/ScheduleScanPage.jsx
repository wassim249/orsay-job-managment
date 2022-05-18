import React, { useContext, useEffect, useState } from "react";
import UserContext from "../../contexts/UserContext";
import Layout from "../../layout/Layout";
import { useNavigate } from "react-router-dom";
import { RiScan2Fill } from "react-icons/ri";
import cronstrue from "cronstrue";

export const ScheduleScanPage = () => {
  const [user, setUser] = useContext(UserContext);
  const [times, setTimes] = useState({
    minutes: "*",
    hours: "*",
    days: "*",
    months: "*",
    weekdays: "*",
  });
  const [repeatsChecked, setRepeatsChecked] = useState(false);
  const [repeats, setRepeats] = useState(null);
  const [exludeSunSat, setExludeSunSat] = useState(false);
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const navigate = useNavigate();

  const MONTHS_NAMES = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  const DAYS_OF_THEWEEK = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];

  const generateCron = () => {
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

  const handleSchedule = () => {
    const cron = generateCron();
 
  };

  useEffect(() => {
    if (!user) navigate("/");
    else if (user.role != "scanner" && user.role != "admin") navigate("/home");
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl text-secondary font-bold   flex items-center">
        <RiScan2Fill size={40} color="#f88c6c" className="mr-2" /> Schedule a
        Scan
      </h1>

      <div className="flex justify-between items-center mt-4 flex-wrap  ">
        <div>
          <label className="text-sm text-secondary block mb-2">Minutes :</label>
          <select
            placeholder="Minutes"
            className=""
            onChange={(e) => {
              setTimes({ ...times, minutes: e.target.value });
            }}
          >
            {["NONE", ...Array(60).keys()].map((i) => (
              <option key={i} value={i == "NONE" ? "*" : i}>
                {i}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-secondary block mb-2">Hours :</label>
          <select
            placeholder="Minutes"
            onChange={(e) => {
              setTimes({ ...times, hours: e.target.value });
            }}
          >
            {["NONE", ...Array(24).keys()].map((i) => (
              <option key={i} value={i === "NONE" ? "*" : i + 1}>
                {i === "NONE" ? "NONE" : i + 1}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-secondary block mb-2">Days :</label>
          <select
            placeholder="Minutes"
            className=""
            onChange={(e) => {
              setTimes({ ...times, days: e.target.value });
            }}
          >
            {["NONE", ...Array(31).keys()].map((i) => (
              <option key={i} value={i === "NONE" ? "*" : i + 1}>
                {i === "NONE" ? "NONE" : i + 1}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-secondary block mb-2">Months :</label>
          <select
            placeholder="Minutes"
            onChange={(e) => {
              setTimes({ ...times, months: e.target.value });
            }}
          >
            {["NONE", ...MONTHS_NAMES].map((month, index) => (
              <option key={month} value={index}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center mb-3">
          <input
            type="checkbox"
            className="mr-2"
            onChange={(e) => {
              setRepeatsChecked(e.target.checked);
              if (!e.target.checked) setRepeats(null);
            }}
          />
          <span className="text-xl text-secondary">Repeats every</span>
        </div>

        <div className="grid grid-cols-3 gap-x-2 gap-y-4">
          <div
            className={`flex items-center justify-center ${
              repeatsChecked ? "bg-lightPrimary" : "bg-slate-200"
            }  px-3 py-4 font-semibold text-secondary`}
          >
            <input
              type="radio"
              onChange={(e) => {
                if (e.target.checked) setRepeats("minute");
              }}
              disabled={!repeatsChecked}
              name="repeats"
            />
            <label
              className={`text-sm block ml-2 ${
                !repeatsChecked && "text-slate-400"
              }`}
            >
              Minute
            </label>
          </div>

          <div
            className={`flex items-center justify-center ${
              repeatsChecked ? "bg-lightPrimary" : "bg-slate-200"
            }  px-3 py-4 font-semibold text-secondary`}
          >
            <input
              onChange={(e) => {
                if (e.target.checked) setRepeats("hour");
              }}
              type="radio"
              disabled={!repeatsChecked}
              name="repeats"
            />
            <label
              className={`text-sm block ml-2 ${
                !repeatsChecked && "text-slate-400"
              }`}
            >
              Hour
            </label>
          </div>

          <div
            className={`flex items-center justify-center ${
              repeatsChecked ? "bg-lightPrimary" : "bg-slate-200"
            }  px-3 py-4 font-semibold text-secondary`}
          >
            <input
              onChange={(e) => {
                if (e.target.checked) setRepeats("day");
              }}
              type="radio"
              disabled={!repeatsChecked}
              name="repeats"
            />
            <label
              className={`text-sm block ml-2 ${
                !repeatsChecked && "text-slate-400"
              }`}
            >
              Day
            </label>
          </div>

          <div
            className={`flex items-center justify-center ${
              repeatsChecked ? "bg-lightPrimary" : "bg-slate-200"
            }  px-3 py-4 font-semibold text-secondary`}
          >
            <input
              onChange={(e) => {
                if (e.target.checked) setRepeats("month");
              }}
              type="radio"
              disabled={!repeatsChecked}
              name="repeats"
            />
            <label
              className={`text-sm block ml-2 ${
                !repeatsChecked && "text-slate-400"
              }`}
            >
              Month
            </label>
          </div>

          <div
            className={`flex items-center justify-center ${
              repeatsChecked ? "bg-lightPrimary" : "bg-slate-200"
            }  px-3 py-4 font-semibold text-secondary col-span-2`}
          >
            <input
              onChange={(e) => {
                if (e.target.checked) setRepeats("week");
              }}
              type="radio"
              disabled={!repeatsChecked}
              name="repeats"
            />
            <label
              className={`text-sm block mx-2 ${
                !repeatsChecked && "text-slate-400"
              }`}
            >
              Day of the week :
            </label>
            <select
              disabled={repeats == "dayOfwekk"}
              placeholder="days of the week"
              onChange={(e) => {
                setDayOfWeek(e.target.value);
                console.log(e.target.value);
              }}
            >
              {DAYS_OF_THEWEEK.map((day, index) => (
                <option key={day} value={index + 1}>
                  {day}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center mt-3 text-secondary">
        <input
          type="checkbox"
          onChange={(e) => {
            setExludeSunSat(e.target.checked);
          }}
        />
        <span className="ml-2 text-sm">Exclude Sunday and Saturday</span>
      </div>

      <div className="bg-slate-700 w-full px-3 py-4 mt-6">
        <p className="text-slate-300 text-sm italic">
          This scan will be executed : {cronstrue.toString(generateCron())}
        </p>
      </div>

      <button
        onClick={() => {
          handleSchedule();
        }}
        className="mt-8 bg-primary text-white font-bold py-2 w-full hover:bg-darkPrimary  "
      >
        Schedule
      </button>
    </Layout>
  );
};