'use strict';

console.log('script file added');

function calculate() {
  //переменные под id`шники
  var amount = document.getElementById('amount');
  var apr = document.getElementById('apr');
  var years = document.getElementById('years');
  var zipcode = document.getElementById('zipcode');
  var payment = document.getElementById('payment');
  var total = document.getElementById('total');
  var totalinterest = document.getElementById('totalinterest');

  // в переменную principle передаю данные amount и преобразовываю их в число
  // с остальными также
  var principal = parseFloat(amount.value);
  var interest = parseFloat(apr.value) / 100 / 12;
  var payments = parseFloat(years.value) * 12;

  // вычисление суммы ежемесячного платежа

  var x = Math.pow(1 + interest, payments);
  var monthly = (principal * x * interest) / (x - 1);
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
  var graph = document.getElementById('graph');
  graph.width = graph.width;
  if (arguments.length == 0 || !graph.getContext) return;
  var g = graph.getContext('2d');
  var width = graph.width,
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

  var equity = 0;
  g.beginPath();
  g.moveTo(paymentToX(0), amountToY());
  for (let p = 1; p <= payments; p++) {
    let thisMonthsInterest = (principal - equity) * interest;
    equity += monthly - thisMonthsInterest;
    g.lineTo(paymentToX(p), amountToY(equity));
  }
  g.lineTo(paymentToX(payments), amountToY(0));
  g.closePath();
  g.fillStyle = 'green';
  g.fill();
  g.fillText('Total Equity', 20, 35);
  // график остатка кредита
  var bal = principal;
  g.beginPath();
  g.moveTo(paymentToX(0), amountToY(bal));
  for (let p = 1; p <= payments; p++) {
    let thisMonthsInterest = bal * interest;
    bal -= monthly - thisMonthsInterest;
    g.lineTo(paymentToX(p), amountToY(bal));
  }
  g.lineWidth = 3;
  g.stroke();
  g.fillStyle = 'black';
  g.fillText('Loan Balance', 20, 50);

  g.textAlign = 'center';
  var y = amountToY(0);
  for (var year = 1; year * 12 <= payments; year++) {
    var x = paymentToX(year * 12);
    g.fillRect(x - 0.5, y - 3, 1, 3);
    if (year == 1) g.fillText('Year', x, y - 5);
    if (year % 5 == 0 && year * 12 !== payments) g.fillText(String(year), x, y - 5);
  }

  //суммы платежей справа

  g.textAlign = 'right';
  g.textBaseline = 'middle';
  var ticks = [monthly * payments, principal];
  var rightEdge = paymentToX(payments);
  for (var i = 0; i < ticks.length; i++) {
    var y = amountToY(ticks[i]);
    g.fillRect(rightEdge - 3, y - 0.5, 3, 1);
    g.fillText(String(ticks[i].toFixed(0)), rightEdge - 5, y);
  }
}
