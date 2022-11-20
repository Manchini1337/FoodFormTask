import { ResponseData } from '../../types';
import classes from './Card.module.css';

type CardProps = {
  responseData: ResponseData | null;
  isLoading: boolean;
};

const Card: React.FC<CardProps> = ({ responseData, isLoading }) => {
  return (
    <div className={classes.container}>
      <div className={classes.card}>
        <h1 className={classes.title}>Information</h1>
        <div className={classes.cardItem}>
          {isLoading ? (
            <p>Loading...</p>
          ) : responseData ? (
            Object.entries(responseData).map(([key, value]) => (
              <div key={key} className={classes.detailItem}>
                <span className={classes.detailItemKey}>{`${key}:`}</span>
                <span className={classes.detailItemValue}>{value}</span>
              </div>
            ))
          ) : (
            <p>There is no data.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
