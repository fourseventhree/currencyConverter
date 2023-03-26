import './App.css';
import React, {Component} from 'react';


export default class CurrencyConverter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      fromCurrency: 'USD',
      toCurrency: 'UAH',
      fromCurrencyInput: 0,
      toCurrencyInput: 0,
      selectedFromCurrency: 'USD',
      selectedToCurrency: 'UAH',
      periodFromCurrency: false,
      periodToCurrency: false
    };
    this.handleFromCurrencyChange = this.handleFromCurrencyChange.bind(this);
    this.handleToCurrencyChange = this.handleToCurrencyChange.bind(this);
    this.handleFromCurrencyInput = this.handleFromCurrencyInput.bind(this);
    this.handleToCurrencyInput = this.handleToCurrencyInput.bind(this);
    this.replaceCurrency = this.replaceCurrency.bind(this);
    this.handleKeyDownFromCurrency = this.handleKeyDownFromCurrency.bind(this);
    this.handleKeyDownToCurrency = this.handleKeyDownToCurrency.bind(this);
  }

  componentDidMount() {
    fetch("https://api.monobank.ua/bank/currency")
    .then(response => response.json())
    .then(
      (result) => {
        this.setState({
          isLoaded: true,
          items: [...result]
        });
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    )
  }

  handleKeyDownFromCurrency(event) { // check if input contains only numbers and only one period in 'fromCurrency input'
    if (String(this.state.toCurrencyInput).split('').indexOf('.') == -1) {
      this.setState({
        periodToCurrency: false
      });
    } else if (String(this.state.toCurrencyInput).split('').indexOf('.') != -1) {
      this.setState({
        periodToCurrency: true
      })
    }
    setTimeout(() => {
      if (String(this.state.fromCurrencyInput).split('').indexOf('.') == -1) {
        this.setState({
          periodFromCurrency: false
        });
      } else if (String(this.state.fromCurrencyInput).split('').indexOf('.') != -1) {
        this.setState({
          periodFromCurrency: true
        })
      }
    }, 1);
    
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);
    const isNumber = (keyCode == 190 && !this.state.periodFromCurrency && String(this.state.fromCurrencyInput).length > 0) || keyCode == 8 || keyCode == 46 || keyCode == 37 || keyCode == 39 ? true : /\d/.test(keyValue);
      
    if (keyCode == 190) {
      this.setState({
        periodFromCurrency: true
      });
    }

    if (!isNumber) {
      event.preventDefault();
    }
  }

  handleKeyDownToCurrency(event) { // check if input contains only numbers and only one period in 'toCurrency input'
    if (String(this.state.fromCurrencyInput).split('').indexOf('.') == -1) {
      this.setState({
        periodFromCurrency: false
      });
    } else if (String(this.state.fromCurrencyInput).split('').indexOf('.') != -1) {
      this.setState({
        periodFromCurrency: true
      })
    }
    setTimeout(() => {
      if (String(this.state.toCurrencyInput).split('').indexOf('.') == -1) {
        this.setState({
          periodToCurrency: false
        });
      } else if (String(this.state.toCurrencyInput).split('').indexOf('.') != -1) {
        this.setState({
          periodToCurrency: true
        })
      }
    }, 1);
    
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);
    const isNumber = (keyCode == 190 && !this.state.periodToCurrency && String(this.state.toCurrencyInput).length > 0) || keyCode == 8 || keyCode == 46 || keyCode == 37 || keyCode == 39 ? true : /\d/.test(keyValue);
      

    if (keyCode == 190) {
      this.setState({
        periodToCurrency: true
      });
    }

    if (!isNumber) {
      event.preventDefault();
    }
  }

  handleFromCurrencyChange( {target} ) { // getting value from option when changing in 'fromCurrency select'
    this.setState({
      fromCurrency: target.value,
      selectedFromCurrency: target.value
    });

    setTimeout(() => {
      this.refreshToCurrencyInput()
    }, 1);
  }

  handleToCurrencyChange( {target} ) { // getting value from option when changing in 'toCurrency select'
    this.setState({
      toCurrency: target.value,
      selectedToCurrency: target.value
    });

    setTimeout(() => {
      this.refreshToCurrencyInput();
    }, 1);
  }

  handleFromCurrencyInput( {target} ) { // getting values from 'fromCurrency input' for next calculating in 'refreshToCurrencyInput' method
    this.setState({
      fromCurrencyInput: target.value
    });
   this.refreshToCurrencyInput()
  }

  handleToCurrencyInput( {target} ) { // getting values from 'toCurrency input' for next calculating in 'refreshFromCurrencyInput' method
    this.setState({
      toCurrencyInput: target.value
    });
    this.refreshFromCurrencyInput();
  }

  refreshToCurrencyInput() {
    const {fromCurrency, toCurrency} = this.state;
    const usdToUah = this.state.items.filter(x => (
      x.currencyCodeA == 840 && x.currencyCodeB == 980
    ));
    const eurToUah = this.state.items.filter(x => (
      x.currencyCodeA == 978 && x.currencyCodeB == 980
    ));
    const eusd = this.state.items.filter(x => (
      x.currencyCodeA == 978 && x.currencyCodeB == 840
    ));

    if (fromCurrency === 'USD' && toCurrency === 'UAH') {
      this.setState(prev => ({
        toCurrencyInput: (prev.fromCurrencyInput * usdToUah[0].rateSell).toFixed(4)
      }));
    } else if (fromCurrency === 'USD' && toCurrency === 'EUR') {
      this.setState(prev => ({
        toCurrencyInput: (prev.fromCurrencyInput / eusd[0].rateSell).toFixed(4)
      }));
    } else if (fromCurrency === 'EUR' && toCurrency === 'UAH') {
      this.setState(prev => ({
        toCurrencyInput: (prev.fromCurrencyInput * eurToUah[0].rateSell).toFixed(4)
      }));
    } else if (fromCurrency === 'EUR' && toCurrency === 'USD') {
      this.setState(prev => ({
        toCurrencyInput: (prev.fromCurrencyInput * eusd[0].rateSell).toFixed(4)
      }));
    } else if (fromCurrency === 'UAH' && toCurrency === 'USD') {
      this.setState(prev => ({
        toCurrencyInput: (prev.fromCurrencyInput / usdToUah[0].rateSell).toFixed(4)
      }));
    } else if (fromCurrency === 'UAH' && toCurrency === 'EUR') {
      this.setState(prev => ({
        toCurrencyInput: (prev.fromCurrencyInput / eurToUah[0].rateSell).toFixed(4)
      }));
    } else if (fromCurrency === toCurrency) {
      this.setState(prev => ({
        toCurrencyInput: prev.fromCurrencyInput
      }));
    }
  }

  refreshFromCurrencyInput() {
    const {fromCurrency, toCurrency} = this.state;
    const usdToUah = this.state.items.filter(x => (
      x.currencyCodeA == 840 && x.currencyCodeB == 980
    ));
    const eurToUah = this.state.items.filter(x => (
      x.currencyCodeA == 978 && x.currencyCodeB == 980
    ));
    const eusd = this.state.items.filter(x => (
      x.currencyCodeA == 978 && x.currencyCodeB == 840
    ));

    if (fromCurrency === 'USD' && toCurrency === 'UAH') {
      this.setState(prev => ({
        fromCurrencyInput: (prev.toCurrencyInput / usdToUah[0].rateSell).toFixed(4)
      }));
    } else if (fromCurrency === 'USD' && toCurrency === 'EUR') {
      this.setState(prev => ({
        fromCurrencyInput: (prev.toCurrencyInput * eusd[0].rateSell).toFixed(4)
      }));
    } else if (fromCurrency === 'EUR' && toCurrency === 'UAH') {
      this.setState(prev => ({
        fromCurrencyInput: (prev.toCurrencyInput / eurToUah[0].rateSell).toFixed(4)
      }));
    } else if (fromCurrency === 'EUR' && toCurrency === 'USD') {
      this.setState(prev => ({
        fromCurrencyInput: (prev.toCurrencyInput / eusd[0].rateSell).toFixed(4)
      }));
    } else if (fromCurrency === 'UAH' && toCurrency === 'USD') {
      this.setState(prev => ({
        fromCurrencyInput: (prev.toCurrencyInput * usdToUah[0].rateSell).toFixed(4)
      }));
    } else if (fromCurrency === 'UAH' && toCurrency === 'EUR') {
      this.setState(prev => ({
        fromCurrencyInput: (prev.toCurrencyInput * eurToUah[0].rateSell).toFixed(4)
      }));
    } else if (fromCurrency === toCurrency) {
      this.setState(prev => ({
        fromCurrencyInput: prev.toCurrencyInput
      }));
    }
  }

  replaceCurrency() { // swapping currencies
    this.setState(prev => ({
      fromCurrency: prev.toCurrency,
      toCurrency: prev.fromCurrency,
      selectedFromCurrency: prev.toCurrency,
      selectedToCurrency: prev.fromCurrency,
      fromCurrencyInput: prev.toCurrencyInput,
      toCurrencyInput: prev.fromCurrencyInput
    }));
  }

  render() {
    const {error, isLoaded, items, fromCurrencyInput, toCurrencyInput, selectedFromCurrency, selectedToCurrency} = this.state;
    const usdToUah = items.filter(x => (
      x.currencyCodeA == 840 && x.currencyCodeB == 980
    ));
    const eurToUah = items.filter(x => (
      x.currencyCodeA == 978 && x.currencyCodeB == 980
    ));
    const updateTime = items
    .filter(x => x.currencyCodeA === 840 && x.currencyCodeB === 980)
    .map(x => new Date(x.date * 1000).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }));
    
    return (
      <div className='mainBody'>
        {error && <p className='errorText'>Error {error.message}</p>}

        {!isLoaded && <p className='loadingText'>Too many requests<br />Refresh page in a few seconds</p>}

        {isLoaded && 
          <>
          <header>
            <h1 className='title'>Currency Converter</h1>
            <div className='currentExchangeRate'>

              <div id='usdToUah'>
                <div className='usFlag'></div>
                <p>1 USD = {usdToUah[0].rateSell} UAH</p>
                <div className='uaFlag'></div>
              </div>

              <div id='eurToUah'>
                <div className='euFlag'></div>
                <p>1 EUR = {eurToUah[0].rateSell} UAH</p>
                <div className='uaFlag'></div>
              </div>

              <p id='updateTime'>Last update: {updateTime}</p>

            </div>
          </header>
          <main>
            <div className='converter'>

              <div id='fromCurrency'>
                <h3>From Currency</h3>
                <select value={this.state.fromCurrency} onChange={this.handleFromCurrencyChange}>
                  <option value="USD" disabled={selectedToCurrency === "USD"} selected>USD</option>
                  <option value="EUR" disabled={selectedToCurrency === "EUR"}>EUR</option>
                  <option value="UAH" disabled={selectedToCurrency === "UAH"}>UAH</option>
                </select>
                <div className='inputGroup'>
                  <input
                  className='fromCurrencyInput' 
                  value={fromCurrencyInput} 
                  onChange={this.handleFromCurrencyInput}
                  onKeyDown={this.handleKeyDownFromCurrency}></input>
                  <div className={this.state.fromCurrency == 'USD' ? 'usFlag2' : this.state.fromCurrency == 'EUR' ? 'euFlag2' : 'uaFlag'}></div>
                </div>
              </div>

              <button id='replaceCurrency' className='fa-sharp fa-solid fa-repeat' title='Replace Currency' onClick={this.replaceCurrency}></button>
              
              <div id='toCurrency'>
                <h3>To Currency</h3>
                <select value={this.state.toCurrency} onChange={this.handleToCurrencyChange}>
                  <option value="USD" disabled={selectedFromCurrency === "USD"}>USD</option>
                  <option value="EUR" disabled={selectedFromCurrency === "EUR"}>EUR</option>
                  <option value="UAH" disabled={selectedFromCurrency === "UAH"} selected>UAH</option>
                </select>
                <div className='inputGroup'>
                  <input
                  className='toCurrencyInput' 
                  value={toCurrencyInput} 
                  onChange={this.handleToCurrencyInput}
                  onKeyDown={this.handleKeyDownToCurrency}></input>
                  <div className={this.state.toCurrency == 'USD' ? 'usFlag' : this.state.toCurrency == 'EUR' ? 'euFlag' : 'uaFlag2'}></div>
                </div>
              </div>
              
            </div>
          </main>
          </>
        }
      </div>
    )
  }
}

