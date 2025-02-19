import React from "react";
import Token from "../token/index";
import styles from "./index.module.css";

interface TokensProps {

}   


const Tokens: React.FC<TokensProps> = ({ 

}) => {


  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-1">
            <Token name="Moyaki" symbol="YAKI" image="https://imagedelivery.net/tWwhAahBw7afBzFUrX5mYQ/6679b698-a845-412b-504b-23463a3e1900/public"/>
          </div>
          <div className="col-span-1">
            <Token name="Molandak" symbol="DAK" image="https://imagedelivery.net/tWwhAahBw7afBzFUrX5mYQ/27759359-9374-4995-341c-b2636a432800/public" />

          </div>
          <div className="col-span-1">
            <Token name="Chog" symbol="CHOG" image="https://imagedelivery.net/tWwhAahBw7afBzFUrX5mYQ/5d1206c2-042c-4edc-9f8b-dcef2e9e8f00/public"/>
          </div>
        </div>
      </div>
    </div>
  );
};

  
export default Tokens;
  