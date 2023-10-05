import React from "react";
import { Header } from "../components";
import Layout from "../components/Layout";

const Calendar = () => {
  return (
    <Layout>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl ">
        <Header category="App" title="Calendar" />
      </div>
    </Layout>
  );
};

export default Calendar;
