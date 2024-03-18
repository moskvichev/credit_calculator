'use strict';

console.log('script file added');

function calculate() {
  //переменные под id`шники
  const amount = document.getElementById('amount');
  const apr = document.getElementById('apr');
  const years = document.getElementById('years');
  const zipcode = document.getElementById('zipcode');
  const payment = document.getElementById('payment');
  const total = document.getElementById('total');
  const totalinterest = document.getElementById('totalinterest');

  // в переменную principle передаю данные amount и преобразовываю их в число
  // с остальными также
  const principal = parseFloat(amount.value);
  const interest = parseFloat(apr.value) / 100 / 12;
  const payments = parseFloat(years.value) * 12;

  // вычисление суммы ежемесячного платежа

  const x = Math.pow(1 + interest, payments);
  const monthly = (principal * x * interest) / (x - 1);
  console.log(monthly);

  //если данные корректны округляю данные до 2 знаков после точки
  if (isFinite(monthly)) {
    payment.innerHTML = monthly.toFixed(2);
    total.innerHTML = (monthly * payments).toFixed(2);
    totalinterest.innerHTML = (monthly * payments - principal).toFixed(2);
    //сохраняем данные на странице
    save(amount.value, apr.value, years.value, zipcode.value);

    //перехватываем ошибки
    try {
      getLenders(amount.value, apr.value, years.value, zipcode.value);
    } catch (e) {
      /*игнор ошибок*/
    }
    //строим график сумм
    chart(principal, interest, monthly, payments);
  } else {
    // если данные не корректные данные удалятся
    payment.innerHTML = '';
    total.innerHTML = '';
    totalinterest.innerHTML = '';
    chart();
  }
}

//сохранение данных в localstorage

function save(amount, apr, years, zipcode) {
  if (window.localStorage) {
    localStorage.loan_amount = amount;
    localStorage.loan_apr = apr;
    localStorage.loan_years = years;
    localStorage.loan_zipcode = zipcode;
  }
}
