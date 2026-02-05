import { ReactNode } from "react";
import "./Card.css";

interface CardProps {
  children?: ReactNode;
}

const Card = ({ children }: CardProps) => {
  return (
    <div className="cardContainer">
      <div className="cardContent">{children}</div>
    </div>
  );
};

export default Card;
