import { useState, useEffect, useMemo } from 'react';
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import axios from 'axios';

const CoinView = ({ id, title, vsCurrencies }) => {
  const [marketData, setMarketData] = useState(null);
  const [chartType, setChartType] = useState({ value: 'prices', label: 'Prices' });
  const [dateRange, setDateRange] = useState({ value: '1', label: '1d' });
  const [currency, setCurrency] = useState('usd');
  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  const chartTypes = [
    { value: 'prices', label: 'Prices' },
    { value: 'market_caps', label: 'Market Caps' },
    { value: 'total_volumes', label: 'Total Volumes' }
  ];

  const dateRanges = [
    { value: '1', label: '1d' }, 
    { value: '7', label: '7d' }, 
    { value: '14', label: '14d' }, 
    { value: '30', label: '30d' }, 
    { value: '90', label: '90d' }, 
    { value: '180', label: '180d' }, 
    { value: '365', label: '365d' }, 
    // { value: 'max', label: 'max' }
  ];

  useEffect(() => {
    fetchMarketChart(id, currency, dateRange.value);
  }, [dateRange, currency])

  const fetchMarketChart = (id, currency, days) => {
    axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=${days}${days >=30 ? '&interval=daily' : ''}`)
      .then(response => setMarketData(response.data))
      .catch(error => console.log('error!'));
  }

  const getDateObject = timestamp => {
    return new Date(timestamp);
  }

  const formatDate = timestamp => {
    const dateObj = new Date(timestamp);

    return `${dateObj.getDate()}/${dateObj.getMonth()}/${dateObj.getFullYear().toString().substring(2)}`;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-auto mx-auto">
          <h4 className="mt-2 mb-5">{title}</h4>
        </div>
      </div>
      {
        marketData ?
        <>
        <div className="row">
          {/* Date range buttons */}
          <div className="col-auto mx-auto">
            {
              dateRanges.map(type => (
                <button
                  key={type.value}
                  onClick={() => setDateRange({ value: type.value, label: type.label})}
                  className={`btn date-btn btn-sm btn${dateRange.value === type.value ? '' : '-outline'}-primary mx-1`}>{type.label}</button>
              ))
            }
            <div className="dropdown date-btn d-inline-block mx-1">
              <button className="btn btn-sm btn-secondary dropdown-toggle" id="currencyDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {currency}
              </button>
              <div className="dropdown-menu" aria-labelledby="currencyDropdown">
                { vsCurrencies.sort().map(currency => <a onClick={() => setCurrency(currency)} key={currency} href="#" className="dropdown-item">{currency}</a>) }
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          {/* Line chart */}
          <div className="col-auto mx-auto">
            <LineChart
              width={730}
              height={250}
              data={marketData[chartType.value].map((value, index) => (
                { name: formatDate(value[0]), [chartType.value]: Math.round(100*value[1])/100 }
              ))}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis interval={Math.round(marketData[chartType.value].length/10)} dataKey="name" />
              <YAxis type="number" domain={['dataMin', 'dataMax']} />
              <Tooltip />
              <Legend />
              <Line name={chartType.label} animationDuration={500} type="monotone" dataKey={chartType.value} stroke="#093A3E" dot={false} />
            </LineChart>
          </div>
        </div>
        <div className="row">
          {/* Chart type butttons */}
          <div className="col-auto mx-auto">
            {
              chartTypes.map(type => (
                <button
                  key={type.value}
                  onClick={() => setChartType({ value: type.value, label: type.label})}
                  className={`btn chart-btn btn-sm btn${chartType.value === type.value ? '' : '-outline'}-info mx-1`}>{type.label}</button>
              ))
            }
          </div>
        </div>
        </> : null
      }
      {
        marketData ?
        marketData.prices.map((price, index) => (
          <div key={index} className="row border-bottom">
            <div className="col-auto mx-auto">
              {getDateObject(price[0]).toString()}
            </div>
            <div className="col-auto mx-auto">
              ${price[1]}
            </div>
          </div>
        )) : null
      }
    </div>
  )
}

export default CoinView;