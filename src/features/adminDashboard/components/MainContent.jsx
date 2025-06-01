import React from "react";
import Header from "./Header";
import ContentArea from "./ContentArea";

const MainContent = ({ activeTab }) => {
  return (
    <main className="main-content">
      <Header activeTab={activeTab} />
      <ContentArea activeTab={activeTab} />
    </main>
  );
};

export default MainContent;