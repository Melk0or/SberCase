<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { writable } from 'svelte/store';

  interface ICurr {
    base_code: "USD";
    conversion_rates: Record<string, number>;
    documentation: "https://www.exchangerate-api.com/docs";
    result: "success";
    terms_of_use: "https://www.exchangerate-api.com/terms";
    time_last_update_unix: number;
    time_last_update_utc: Date;
    time_next_update_unix: number;
    time_next_update_utc: Date;
  }

  let currencyData: ICurr| {conversion_rates: Record<string, number>} = {conversion_rates: {Loading: 0}};
  let baseCurrency: string = 'RUB';
  let convertToCurrency: string = 'USD';
  let amount: number = 1;
  let convertAmount: number = 0.01;

  const exchangeRate = writable(1);

  

  const fetchData = async () => {
    const response = await fetch(`https://v6.exchangerate-api.com/v6/f78298e882db1f74bfca3936/latest/${baseCurrency}`);
    const data = await response.json();
    currencyData = data;
    exchangeRate.set(currencyData.conversion_rates[convertToCurrency]);
  };

  onMount(() => {
    fetchData();
  });



  const handleBaseCurrencyChange = (event: Event) => {
    const select = event.target as HTMLSelectElement;
    baseCurrency = select.value;
    fetchData();
    amount = 1;
    convertAmount = amount * currencyData?.conversion_rates[convertToCurrency];
  };

  const handleConvertToCurrencyChange = (event: Event) => {
    const select = event.target as HTMLSelectElement;
    convertToCurrency = select.value;
    exchangeRate.set(currencyData.conversion_rates[convertToCurrency]);
    convertAmount = amount * currencyData?.conversion_rates[convertToCurrency];
  };

  const handleAmountChange = (event: Event) => {
    const select = event.target as HTMLInputElement;
    amount = parseInt(select.value);
    convertAmount = amount * currencyData?.conversion_rates[convertToCurrency];
  };

  const handleAmountChangeFrom = (event: Event) => {
    const select = event.target as HTMLInputElement;
    convertAmount = parseInt(select.value);
    amount = convertAmount / currencyData?.conversion_rates[convertToCurrency];
  };
</script>

<div>
  <h1>Currency Converter</h1>
  
  <div>
    <label for="baseCurrency">Base Currency:</label>
    <select id="baseCurrency" on:change={handleBaseCurrencyChange}>
      {#each Object.keys(currencyData?.conversion_rates || {}) as currency}
        <option value={currency} selected={currency === baseCurrency}>{currency}</option>
      {/each}
    </select>
  </div>
  
  <div>
    <label for="convertToCurrency">Convert To:</label>
    <select id="convertToCurrency" on:change={handleConvertToCurrencyChange}>
      {#each Object.keys(currencyData?.conversion_rates || {}) as currency}
        <option value={currency} selected={currency === convertToCurrency}>{currency}</option>
      {/each}
    </select>
  </div>
  
  <div>
    <label for="amount">Amount:</label>
    <input type="number" id="amount" bind:value={amount} on:input={handleAmountChange}>
  </div>
  
  <div>
    <label for="res">Result:</label>
    <input type="number" id="res" bind:value={convertAmount} on:input={handleAmountChangeFrom}>
    <!-- <h2>Result:</h2>
    <p>{(amount * $exchangeRate).toFixed(2)} {convertToCurrency}</p> -->
  </div>
</div>

<style>
  div {
    margin-bottom: 10px;
  }
</style>
