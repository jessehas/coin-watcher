import { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import axios from 'axios';

import SideMenu from './SideMenu';
import CoinView from './CoinView';

import './css/App.css';

const App = () => {
  const [marketData, setMarketData] = useState([]);
  const [vsCurrencies, setVsCurrencies] = useState([]);

  useEffect(() => {
    fetchMarketData();
    fetchVsCurrencies();
  }, [])

  const fetchMarketData = () => {
    axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false')
      .then(response => setMarketData(response.data))
      .catch(error => console.log('error!'));
  }

  const fetchVsCurrencies = () => {
    axios.get('https://api.coingecko.com/api/v3/simple/supported_vs_currencies')
      .then(response => setVsCurrencies(response.data))
      .catch(error => console.log('error!'));
  }

  return (
    <BrowserRouter>
      <SideMenu
        menuItems={marketData.map(coin => ( { label: coin.name, id: coin.id, symbol: coin.symbol, imageLink: coin.image } ))}
      />
      <Switch>
      {
        marketData.map(coin => (
          <Route key={coin.id} path={`/${coin.id}`}>
            <CoinView
              title={coin.name}
              id={coin.id}
              vsCurrencies={vsCurrencies}
            />
          </Route>
        ))
      }
      </Switch>
    </BrowserRouter>
  );
}

export default App;
