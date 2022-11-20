import Header from './components/header/Header';
import classes from './App.module.css';
import Form from './components/form/Form';
import Card from './components/card/Card';
import { useState } from 'react';
import { ResponseData } from './types';

const App = () => {
  const [responseData, setResponseData] = useState<ResponseData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <>
      <Header />
      <div className={classes.container}>
        <Form setResponseData={setResponseData} setIsLoading={setIsLoading} />
        <Card responseData={responseData} isLoading={isLoading} />
      </div>
    </>
  );
};

export default App;
