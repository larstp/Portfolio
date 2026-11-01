import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import App from "./App.tsx";

const consoleLogo = String.raw`                           #
                           #
                          ###
                          ###
                          ##
                          ##
                          ##
                      #####
                       #####
                        #####
      #####                ####
       -##############       ###
         .##                #####
           ###
            ###
             ####
              ####
             ##  ##
             ##
            ##
           +##
           ##`;

console.info(
  `${consoleLogo}\n\nOut snooping? Check out the source code:\nhttps://github.com/larstp/Portfolio`,
);

window.history.scrollRestoration = "manual";
window.scrollTo(0, 0);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
