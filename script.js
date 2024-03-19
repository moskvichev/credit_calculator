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

// восстанавливать заполненные поля

window.onload = function () {
  if (window.localStorage && localStorage.loan_amount) {
    document.getElementById('amount').value = localStorage.loan_amount;
    document.getElementById('apr').value = localStorage.loan_apr;
    document.getElementById('years').value = localStorage.loan_years;
    document.getElementById('zipcode').value = localStorage.loan_zipcode;
  }
};

// график изменения остатка

function chart(principal, interest, monthly, payments) {
  const graph = document.getElementById('graph');
  graph.width = graph.width;
  if (arguments.length == 0 || !graph.getContext) return;
  const g = graph.getContext('2d');
  const width = graph.width,
    height = graph.height;
  function paymentToX(n) {
    return (n * width) / payments;
  }
  function amountToY(a) {
    return height - (a * height) / (monthly * payments * 1.05);
  }
  g.moveTo(paymentToX(0), amountToY(0));
  g.lineTo(paymentToX(payments), amountToY(monthly * payments));
  g.lineTo(paymentToX(payments), amountToY(0));
  g.closePath();
  g.fillStyle = '#f88';
  g.fill();
  g.font = 'bold 12px sans-serif';
  g.fillText('Total Interest Payments', 20, 20);
}
