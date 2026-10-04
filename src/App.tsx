import Footer from "./components/Footer";
import Header from "./components/Header";
import ScrollIndicator from "./components/ScrollIndicator";

function App() {
  return (
    <>
      <Header />
      <ScrollIndicator />
      <main className="site-shell" />
      <Footer />
    </>
  );
}

export default App;
