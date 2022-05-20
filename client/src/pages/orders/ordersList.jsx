import React, { useContext, useEffect, useRef, useState } from "react";
import UserContext from "../../contexts/UserContext";
import Layout from "../../layout/Layout";
import SquareLoader from "react-spinners/SquareLoader";
import { useNavigate } from "react-router-dom";
import { getAllOrders } from "../../services/order";
import { OrderNumber } from "../../partials/OrderNumber";
import { BiSearch } from "react-icons/bi";

export const OrdersListPage = () => {
  const [user] = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [searchedOrders, setSearchedOrders] = useState([]);
  const searchValue = useRef("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const data = await getAllOrders();
      if (data?.message) alert(data.message);
      else setOrders(data.orders);
      setLoading(false);
      console.log(data);
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!user) navigate("/");
  }, []);

  return (
    <Layout>
      {loading ? (
        <div className="w-full h-screen flex justify-center items-center">
          <SquareLoader color="#f88c6c" loading={loading} size="20px" />
        </div>
      ) : (
        <>
          <h1 className="text-2xl text-secondary font-bold">
            Scanned Orders numbers List
          </h1>
          <span>
            Showing {orders?.length} order number
            {orders?.length != 1 && "s"}
          </span>

          <div className="mt-4 flex items-center">
            <input
              type="search"
              ref={searchValue}
              placeholder="Search..."
              className="  appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <button
              className="bg-secondary text-white py-2 px-3 ml-2 h-2/6"
              onClick={() => {

                setSearchedOrders(
                  orders.filter((order) => {
                    console.log( order.order);
                    return order.order.startsWith(searchValue.current.value.trim())
                  }
                   
                  )
                );
                console.log(searchValue.current.value);
                console.log(searchedOrders);
              }}
            >
              <BiSearch size={20} color="white" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-4 mt-7">
            {searchedOrders.length > 0 && searchValue.current != ""
              ? searchedOrders.map((order) => (
                  <OrderNumber key={order.id} order={order} />
                ))
              : searchedOrders.length == 0 && searchValue != ""?
              <h1>
                No order found
              </h1>
              : 
                (
                    orders.map((order) => (
                  <OrderNumber key={order.id} order={order} />
                ))
                )
                }
          </div>
        </>
      )}
    </Layout>
  );
};
