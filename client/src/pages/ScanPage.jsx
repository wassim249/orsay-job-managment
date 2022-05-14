import React , {useContext , useEffect} from "react";
import UserContext from "../contexts/UserContext";
import Layout from "../layout/Layout";
import { useNavigate } from "react-router-dom";

export const ScanPage = () => {
  const [user, setUser] = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) navigate("/");
  }, []);
  return (
    <Layout>
      <h1 className="text-2xl text-secondary font-bold font-montserat">
        Create a new Scan
      </h1>
      {/* formulaire POST  */}
      <form
        method="post"
        action="/"
        className="grid grid-cols-2 gap-4 mt-4 font-montserat"
      >
        {/* Input de dossier source */}
        <div>
          <label
            className="block text-secondary text-sm d mb-2"
            htmlFor="source"
          >
            Dossier source : <span className="text-primary">*</span>
          </label>
          <input
            className="appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="source"
            type="text"
            placeholder="c:/dossier/...."
            required
          />
        </div>
        {/* Input de dossier destination */}
        <div>
          <label
            className="block text-secondary text-sm d mb-2"
            htmlFor="destination"
          >
            Dossier Destination : <span className="text-primary">*</span>
          </label>
          <input
            className="appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="destination"
            type="text"
            placeholder="c:/dossier/...."
            required
          />
        </div>
        {/* Input d'ajout d'un numéro de commande */}
        <div>
          <label
            className="block text-secondary text-sm d mb-2"
            htmlFor="order"
          >
            Numero de commande : <span className="text-primary">*</span>
          </label>
          <input
            className="appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="order"
            type="text"
            placeholder="20219787987..."
            required
          />
        </div>
        {/* Button d'ajout d'un numero de commande */}
        <div className="flex flex-row items-end">
          <button
            type="button"
            onclick="addOrder()"
            className="bg-primary text-white  sm:w-1/2 w-full px-2 py-2 font-bold font-montserat"
          >
            <span className="text-white text-lg">+</span>
            Ajouter
          </button>
        </div>
        {/* Input de l'emplacement du fichier log */}
        <div className="col-span-2">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="order"
          >
            Le fichier log :
          </label>
          <input
            className="appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="logFile"
            type="text"
            placeholder="c:/dossier/..."
          />
        </div>
        {/* Button de création du fichier */}
        <button
          className="col-span-2 bg-primary hover:bg-darkPrimary text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline font-montserat"
          type="submit"
          id="btn-create"
        >
          Créer
        </button>
        {/* Table de la liste des numéros de commande */}
        <table className="col-span-2 font-montserat">
          <thead className="rounded-lg p-2">
            <tr>
              <td className="bg-pink-50 p-2 rounded-tl text-gray-700 text-sm font-bold">
                &nbsp;
              </td>
              <td className="bg-lightPrimary p-2 text-center text-white font-bold">
                Numero de commande
              </td>
              <td className="bg-pink-50 p-2 rounded-tr text-gray-700 text-sm font-bold">
                &nbsp;
              </td>
            </tr>
          </thead>
          <tbody id="orders">
            <tr>
              <td
                colSpan={3}
                className="text-center w-full bg-gray-200 py-2 text-sm font-bold text-gray-500"
              >
                Insérer des numéros de commande
              </td>
            </tr>
          </tbody>
        </table>
      </form>
      <div>
        <button  className="mt-10 text-red-500 font-bold py-2 px-4 hover:underline">Effacer</button>
        <div id="output" className="w-full bg-slate-900  min-h-full text-slate-200 p-4 font-montserat border-4 border-slate-400 text-sm">
          <p>Résultat ici...</p>
        </div>
        {/*- Zone des commandes terminées  */}
        <button onclick="$('#finished_orders').html('<p>Les commandes terminées ici....</p>')" className="mt-10 text-red-500 font-bold py-2 px-4 hover:underline">Effacer</button>
        <div id="finished_orders" className="w-full bg-slate-900 min-h-full text-slate-200 p-4 font-montserat border-4 border-slate-400 text-sm">
          <p>Les commandes terminées ici...</p>
        </div>
      </div>
    </Layout>
  );
};
