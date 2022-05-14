import React from "react";
import Layout from "../../layout/Layout";
import { BsFillPersonFill } from "react-icons/bs";
import moment from "moment";

export const ScanDetailsPage = () => {
  return (
    <Layout>
      <Status success={true} />
      <span className="mt-10 font-montserat text-sm text-slate-500">
        {moment(new Date()).format("DD/MM/YYYY HH:mm:ss")}
      </span>
      <div className=" flex justify-between items-center font-montserat ">
        <span className="font-montserat font-bold text-2xl text-secondary">
          Scan #1
        </span>

        <div className="flex items-center">
          <BsFillPersonFill size={30} color={"#f88c6c"} />
          <span className="ml-2 text-sm font-montserat hover:cursor-pointer hover:underline">
            By : John Doe
          </span>
        </div>
      </div>

      <div className="grid gap-10 grid-cols-2 mt-6">
        <div>
          <label className="block text-secondary text-sm d mb-2 font-montserat">
            Source folder :
          </label>
          <span className="text-primary font-montserat font-bold">
            c:/folder/....
          </span>
        </div>

        <div>
          <label className="block text-secondary text-sm d mb-2 font-montserat">
            Destination folder :
          </label>
          <span className="text-primary font-montserat font-bold">
            c:/folder/....
          </span>
        </div>

        <div className="col-span-2">
          <label className="block text-secondary text-sm d mb-2 font-montserat">
            Log file :
          </label>
          <span className="text-primary font-montserat font-bold hover:cursor-pointer hover:underline">
            c:/folder/....
          </span>
        </div>

        <div className="col-span-2">
          <label className="block text-secondary text-sm d mb-2 font-montserat">
            Orders List :
          </label>
          <div className="bg-slate-900 text-white p-2 text-sm font-montserat border-2 border-primary">
            <span className=" block">
              ✅
              <span className="font-bold text-green-500">
                &nbsp; 65465465465
              </span>{" "}
              from &nbsp;
              <span className="font-italic underline">
                c:/source/5465465.xml
              </span>
            </span>

            <span className=" block">
              ❌
              <span className="font-bold text-red-500">&nbsp;65465465465</span>{" "}
              from &nbsp;
              <span className="font-italic underline">
                c:/source/5465465.xml
              </span>
            </span>
          </div>
        </div>

        <div className="col-span-2">
          <label className="block text-secondary text-sm d mb-2 font-montserat">
            Log :
          </label>
          <div className="bg-slate-900 text-white p-2 text-sm font-montserat border-2 border-primary">
            <span className=" block">fgfdgfdgdfgjhdfoghdfoghdfuoh</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const Status = ({ success = true }) => (
  <div
    className={`${
      success ? "bg-green-500" : "bg-red-500"
    }  px-3 py-2 w-32 text-center text-white font-montserat font-bold`}
  >
    {success ? "Success" : "Failed"}
  </div>
);
