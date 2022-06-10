import React, { useContext, useEffect, useState } from "react";
import UserContext from "../../contexts/UserContext";
import Layout from "../../layout/Layout";
import { useLocation, useNavigate } from "react-router-dom";
import { RiScan2Fill } from "react-icons/ri";
import cronstrue from "cronstrue";
import { generateCron } from "../../utils/Utils";
import { scheduleScan } from "../../services/scan";
import { AlertContext } from "../../contexts/AlertContext";
import LangContext from "../../contexts/LangContext";
import LANG from "../../../../i18n/lang.json";
import "cronstrue/locales/fr";
import "cronstrue/locales/en";
import "cronstrue/locales/de";
import { AlertMessage } from "../../components/AlertMessage";

export const ScheduleScanPage = () => {
  const [user] = useContext(UserContext);
  const [lang] = useContext(LangContext);
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
  const [alertData, setAlertData] = useContext(AlertContext);

  const navigate = useNavigate();
  const { state } = useLocation();

  const MONTHS_NAMES = [
    "NONE",
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

  const DAYS_OF_THEWEEK = LANG["scheduleScan"]["DAYS_OF_THEWEEK"][lang];

  window.onpopstate = () => {
    navigate("/scan/create", {
      state: {
        source: state?.source,
        destination: state?.destination,
        orderNumbers: state?.orderNumbers,
        logFile: state?.logFile,
      },
    });
  };

  const handleSchedule = async () => {
    const cron = generateCron(repeatsChecked, repeats, times, exludeSunSat);
    const data = await scheduleScan(
      cron,
      state.source,
      state.destination,
      state.orderNumbers,
      state.logFile,
      user.id
    );
    if (data?.output?.log?.length > 0)
      setAlertData({
        message:
          data.output.log[data.output.log.length - 1].message.toLowerCase(),
        type: "success",
      });
    else {
      setAlertData({
        message: LANG["alerts"]["Scan scheduled successfully"][lang],
        type: "success",
      });
      navigate("/scan");
    }
  };

  const cronToString = () => {
    try {
      return cronstrue.toString(
        generateCron(repeatsChecked, repeats, times, exludeSunSat, dayOfWeek),
        {
          locale: lang.toLowerCase(),
        }
      );
    } catch (error) {
      console.log(error);
      return "";
    }
  };

  useEffect(() => {
    if (user?.role == "viewer") navigate("/home");
  }, []);

  useEffect(() => {
    if (!state) navigate("/scan/create");
  }, []);

  return (
    <Layout>
      {alertData && <AlertMessage />}
      <h1 className="text-2xl text-secondary font-bold   flex items-center">
        <RiScan2Fill size={40} color="#f88c6c" className="mr-2" />{" "}
        {LANG["scheduleScan"]["Schedule a Scan"][lang]}
      </h1>

      <div className="flex justify-between items-center mt-4 flex-wrap  ">
        <div>
          <label className="text-sm text-secondary block mb-2">
            {LANG["scheduleScan"]["Minute"][lang]}s :
          </label>
          <select
            placeholder={`${LANG["scheduleScan"]["Minute"][lang]}s`}
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
          <label className="text-sm text-secondary block mb-2">
            {LANG["scheduleScan"]["Hour"][lang]}s :
          </label>
          <select
            placeholder={`${LANG["scheduleScan"]["Hour"][lang]}s`}
            onChange={(e) => {
              setTimes({ ...times, hours: e.target.value });
            }}
          >
            {["NONE", ...Array(24).keys()].map((i) => (
              <option key={i} value={i === "NONE" ? "*" : i}>
                {i === "NONE" ? "NONE" : i}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-secondary block mb-2">
            {LANG["scheduleScan"]["Day"][lang]}s :
          </label>
          <select
            placeholder={`${LANG["scheduleScan"]["Day"][lang]}s`}
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
          <label className="text-sm text-secondary block mb-2">
            {LANG["scheduleScan"]["Month"][lang]}s :
          </label>
          <select
            placeholder={`{LANG["scheduleScan"]["Month"][lang]}s`}
            onChange={(e) => {
              setTimes({ ...times, months: e.target.value });
            }}
          >
            {MONTHS_NAMES.map((month, index) => (
              <option key={month} value={index || "*"}>
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
          <span className="text-xl text-secondary">
            {LANG["scheduleScan"]["Repeats every"][lang]} :
          </span>
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
              {LANG["scheduleScan"]["Minute"][lang]}
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
              {LANG["scheduleScan"]["Hour"][lang]}
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
              {LANG["scheduleScan"]["Day"][lang]}
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
              {LANG["scheduleScan"]["Month"][lang]}
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
              {LANG["scheduleScan"]["Day of the week"][lang]} :
            </label>
            <select
              disabled={repeats == "dayOfwekk"}
              placeholder={`${LANG["scheduleScan"]["Day of the week"][lang]}`}
              onChange={(e) => {
                setDayOfWeek(e.target.value);
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
        <span className="ml-2 text-sm">
          {LANG["scheduleScan"]["Exclude Sunday and Saturday"][lang]}
        </span>
      </div>

      <div className="bg-slate-700 w-full px-3 py-4 mt-6">
        <p className="text-slate-300 text-sm italic">
          {LANG["scheduleScan"]["This scan will be executed"][lang]}{" "}
          {cronToString()}
        </p>
      </div>

      <button
        onClick={() => {
          handleSchedule();
        }}
        disabled={cronToString() == ""}
        className="mt-8 bg-primary text-white font-bold py-2 w-full hover:bg-darkPrimary disabled:bg-lightPrimary"
      >
        {LANG["scheduleScan"]["Schedule"][lang]}
      </button>
    </Layout>
  );
};
