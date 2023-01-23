// Import stylesheets
import './style.css';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  EmailAuthProvider,
  sendEmailVerification,
} from 'firebase/auth';

// Add the Firebase products and methods that you want to use
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  addDoc,
  collection,
  runTransaction,
  deleteDoc,
  deleteField,
  getDocFromCache,
  query,
  where,
  getDocs,
  onSnapshot,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';

import * as firebaseui from 'firebaseui';

let db, auth;

// Write Javascript code!
const appDiv = document.getElementById('app');

const loginButton = document.getElementById('login-link');

let home = '';
let dashboard = `
<hr />
<p>

      <button id = "cash-count" type="button" class="btn btn-primary">Cash Counter</button><p><p>
      <hr />
      <button id = "skip-app" type="button" class="btn btn-primary">Skip Orders</button><p><p>
      <button id = "uber-app" type="button" class="btn btn-primary">Uber Orders</button><p>
      <button id = "doordash-app" type="button" class="btn btn-primary">Doordash Orders</button>
      <hr />
   
      <button id = "summary-func" type="button" class="btn btn-primary">Summary</button>
<hr />
`;
let appSelection = `
<hr />
<p>

<hr />
`;
let verifyEmail = ` <div class="d-flex justify-content-center align-content-center" style="margin:15rem; ">
<button type="button" id = "verify-email" class="btn btn-primary">Verify Email</button>
</div>`;
let summaryPage = `<h5>Cash Before Payout</h5>
<input
  id="cbpayout-field"
  type="number"
  class="form-control"
  aria-label="net"
  disabled
/>
<h5>Float Amount</h5>
<input id="float-field" type="number"  value="250"class="form-control" aria-label="net" />

<h5>Payout</h5>
<input
  id="payout-field"
  type="number"
  class="form-control"
  aria-label="net"
/>
<h5>Jar Tip</h5>
<input id="jar-field" type="number" class="form-control" aria-label="net" />

<button id = "final-data" type="button" class="btn btn-primary">Save</button>

<h5>Skip Net Amount</h5>
<input
  id="skip-field"
  type="number"
  class="form-control"
  aria-label="net"
  disabled
/>
<h5>Uber Net Amount</h5>
<input
  id="uber-field"
  type="number"
  class="form-control"
  aria-label="net"
  disabled
/>
<h5>Doordash Net Amount</h5>
<input
  id="doordash-field"
  type="number"
  class="form-control"
  aria-label="net"
  disabled
/>
<h5>Deposit Cash</h5>
<input
  id="deposit-field"
  type="number"
  class="form-control"
  aria-label="net"
  disabled
/>
<h5>Cash in Cover</h5>
<h6 id="cc-field">$</h6>`;
let cashCountPage = ` <h2>Bills</h2>

<div class="d-flex p-2" style="margin: 0.5rem">
  <table class="table  table-striped" id="count-table">
    <thead>
      <tr>
        <th scope="col">Amount</th>
        <th scope="col">Count</th>
        <th scope="col">Total</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">$100</th>
        <td>
          <input
            id="m-100"
            type="number"
            class="form-control"
            aria-label="Number of Bills"
          />
        </td>
        <td>$0</td>
      </tr>
      <tr>
        <th scope="row">$50</th>
        <td>
          <input
            id="m-50"
            type="number"
            class="form-control"
            aria-label="Number of Bills"
          />
        </td>
        <td>$0</td>
      </tr>
      <tr>
        <th scope="row">$20</th>
        <td>
          <input
            id="m-20"
            type="number"
            class="form-control"
            aria-label="Number of Bills"
          />
        </td>
        <td>$0</td>
      </tr>
      <tr>
        <th scope="row">$10</th>
        <td>
          <input
            id="m-10"
            type="number"
            class="form-control"
            aria-label="Number of Bills"
          />
        </td>
        <td>$0</td>
      </tr>
      <tr>
        <th scope="row">$5</th>
        <td>
          <input
            id="m-5"
            type="number"
            class="form-control"
            aria-label="Number of Bills"
          />
        </td>
        <td>$0</td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td id="total-bills">$0</td>
      </tr>
    </tbody>
  </table>
</div>
<h2>Coins</h2>
<div class="d-flex p-2" style="margin: 0.5rem">
  <table class="table">
    <thead>
      <tr>
        <th scope="col">Amount</th>
        <th scope="col">Coins</th>
        <th scope="col">Total</th>
        <th scope="col">Rolls</th>
        <th scope="col">Total</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">$2</th>
        <td>
          <input
            id="m-2"
            type="number"
            class="form-control"
            aria-label="Number of coins"
          />
        </td>
        <td>$0</td>
        <td>
          <input
            id="mr-2"
            type="number"
            class="form-control"
            aria-label="Number of rolls"
          />
        </td>
        <td>$0</td>
      </tr>
      <tr>
        <th scope="row">$1</th>
        <td>
          <input
            id="m-1"
            type="number"
            class="form-control"
            aria-label="Number of coins"
          />
        </td>
        <td>$0</td>
        <td>
          <input
            id="mr-1"
            type="number"
            class="form-control"
            aria-label="Number of rolls"
          />
        </td>
        <td>$0</td>
      </tr>
      <tr>
        <th scope="row">25¢</th>
        <td>
          <input
            id="m-25c"
            type="number"
            class="form-control"
            aria-label="Number of coins"
          />
        </td>
        <td>$0</td>
        <td>
          <input
            id="mr-25c"
            type="number"
            class="form-control"
            aria-label="Number of rolls"
          />
        </td>
        <td>$0</td>
      </tr>
      <tr>
        <th scope="row">10¢</th>
        <td>
          <input
            id="m-10c"
            type="number"
            class="form-control"
            aria-label="Number of coins"
          />
        </td>
        <td>$0</td>
        <td>
          <input
            id="mr-10c"
            type="number"
            class="form-control"
            aria-label="Number of rolls"
          />
        </td>
        <td>$0</td>
      </tr>
      <tr>
        <th scope="row">5¢</th>
        <td>
          <input
            id="m-5c"
            type="number"
            class="form-control"
            aria-label="Number of coins"
          />
        </td>
        <td>$0</td>
        <td>
          <input
            id="mr-5c"
            type="number"
            class="form-control"
            aria-label="Number of rolls"
          />
        </td>
        <td>$0</td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td id="total-coins">$0</td>
        <td></td>
        <td id="total-rolls">$0</td>
      </tr>
    </tbody>
  </table>
</div>
<h4 id="total-all"></h4>
<button type="button" id="save-count" class="btn btn-primary">Save</button>
`;
let payoutPage = `
<h5>Payout</h5>
<input
  id="payout-field"
  type="number"
  class="form-control"
  aria-label="net"
/>
<h5>Jar Tip</h5>
<input id="jar-field" type="number" class="form-control" aria-label="net" />
<button type="button" id="save-count" class="btn btn-primary">Save</button>`;
let addOrders = `<h4 id="ao-title">App Orders</h4>
<input
id="order-value"
type="number"
class="form-control"
aria-label="amount"
/>
<input
id="order-total"
type="number"
class="form-control"
aria-label="net" disabled
/>
<button type="button" id="add-orders" class="btn btn-primary">Add Order</button>
<button type="button" id="update-orders" class="btn btn-primary">Update Orders</button>
<button type="button" id="back-button" class="btn btn-primary">Back</button>
<table class="table" id="orders-table">
      <thead>
        <tr>
          <th scope="col">Orders</th>
          <th scope="col">Net Value</th>
        </tr>
      </thead>
      <tbody id="result-box"></tbody>
    </table>
    <template id="row-template">
      <tr>
        <td>
          <input
            class="oAmount"
            id=""
            type="number"
            class="form-control"
            aria-label="amount"
          />
        </td>
        <td>
          <input
            class="oNet"
            id=""
            type="number"
            class="form-control"
            aria-label="net"
            disabled
          />
        </td>
      </tr>
    </template>
`;

document.getElementById('app').addEventListener('click', clickEventHandler);
document.getElementById('my-nav').addEventListener('click', linkEventHandler);
document.getElementById('app').addEventListener('input', inputEventHandler);

function clickEventHandler(e) {
  if (e.target.matches('#verify-email')) {
    userVerify();
  }
  if (e.target.matches('#cash-count')) {
    cashCount();
  }
  if (e.target.matches('#skip-app')) {
    appOrders('Skip');
  }
  if (e.target.matches('#uber-app')) {
    appOrders('Uber');
  }
  if (e.target.matches('#doordash-app')) {
    appOrders('Doordash');
  }

  if (e.target.matches('#summary-func')) {
    loadSummary();
  }
  if (e.target.matches('#other-func')) {
    otherFunc();
  }
}

function loadPayout() {
  appDiv.innerHTML = payoutPage;
}

async function loadSummary() {
  appDiv.innerHTML = summaryPage;
  const cbpField = document.getElementById('cbpayout-field');
  const payField = document.getElementById('payout-field');
  const jarField = document.getElementById('jar-field');
  const floatField = document.getElementById('float-field');
  const skipField = document.getElementById('skip-field');
  const uberField = document.getElementById('uber-field');
  const doordashField = document.getElementById('doordash-field');
  const depositField = document.getElementById('deposit-field');
  const ccField = document.getElementById('cc-field');
  var payoutValue;
  var jarValue;
  var floatValue;
  var countArr;
  var skipOr;
  var uberOr;
  var doordashOr;
  var cbpValue;
  var depositValue;
  var sknValue;
  var sos;
  var uos;
  var dos;
  var ccValue;
  const docSnap = await getDoc(doc(db, 'cashCount', todayDate()));

  if (docSnap.exists()) {
    const value = docSnap.data();
    console.log(value);
    countArr = value.counts;
    skipOr = value.skipOrder;
    uberOr = value.uberOrders;
    doordashOr = value.doordashOrders;
    payoutValue = payField.value * 1;
    jarValue = jarField.value * 1;
    floatValue = floatField.value * 1;

    let sum = countArr.reduce(function (a, b) {
      return a + b;
    });
    cbpValue = sum - floatValue;
    cbpField.value = cbpValue;
    sos = skipOr.reduce(function (a, b) {
      return a + b;
    });
    sknValue = sos * 0.8625;
    skipField.value = sos * 0.8625;

    uos = uberOr.reduce(function (a, b) {
      return a + b;
    });

    uberField.value = uos * 0.83375;
    dos = doordashOr.reduce(function (a, b) {
      return a + b;
    });

    doordashField.value = dos / 1.06;
    depositValue = cbpValue - payoutValue;
    depositField.value = depositValue;

    if (depositValue < 0) {
      ccValue = payoutValue + jarValue;
      ccField.textContent = ccValue;
    } else {
      ccValue = cbpValue + jarValue;
      ccField.textContent = ccValue;
    }
  } else {
    console.log('No such document!');
  }

  var summary = {
    cashBeforePayout: cbpValue,
    skipNetValue: sknValue,
    uberNetValue: uos * 0.83375,
    doordashNetValue: dos / 1.06,
    depositCash: depositValue,
    payoutAmount: payoutValue,
    jarTip: jarValue,
    cashInCover: ccValue,
  };
  updateFields('cashCount', todayDate(), { summary });
  payField.addEventListener('input', upData);
  jarField.addEventListener('input', upData);
  function upData() {
    summary.payoutAmount = payField.value * 1;
    summary.jarTip = jarField.value * 1;
  }
  const finalButton = document.getElementById('final-data');
  finalButton.addEventListener('click', function () {
    updateFields('cashCount', todayDate(), { summary });
    appDiv.innerHTML = dashboard;
  });
}

function linkEventHandler(e) {
  if (e.target.matches('#home-link')) {
    document.getElementById('firebaseui-auth-container').style.display = 'none';
    appDiv.innerHTML = home;
  }

  if (e.target.matches('#login-link')) {
    document.getElementById('firebaseui-auth-container').style.display = '';
    appDiv.innerHTML = null;
  }
}

function inputEventHandler(e) {}

async function main() {
  // Add Firebase project configuration object here
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: 'AIzaSyAfGFV2Y-T0toSwvw2mZ5ja09nEEyb3S1E',
    authDomain: 'hl-foods.firebaseapp.com',
    projectId: 'hl-foods',
    storageBucket: 'hl-foods.appspot.com',
    messagingSenderId: '904989510183',
    appId: '1:904989510183:web:2130808f07d00c6c63dc02',
    measurementId: 'G-LDQ6JNP29T',
  };

  initializeApp(firebaseConfig);
  auth = getAuth();
  db = getFirestore();

  loginAction();

  authState();
}
function loginAction() {
  // FirebaseUI config
  const uiConfig = {
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    signInOptions: [
      // Email / Password Provider.
      EmailAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult: function (authResult, redirectUrl) {
        // Handle sign-in.
        // Return false to avoid redirect.

        return false;
      },
    },
  };
  const ui = new firebaseui.auth.AuthUI(auth);
  // Called when the user clicks the RSVP button
  loginButton.addEventListener('click', () => {
    if (auth.currentUser) {
      // User is signed in; allows user to sign out
      signOut(auth);
    } else {
      // No user is signed in; allows user to sign in
      ui.start('#firebaseui-auth-container', uiConfig);
    }
  });
}

function authState() {
  // Listen to the current Auth state
  onAuthStateChanged(auth, (user) => {
    if (user) {
      loginButton.textContent = 'Logout';
      if (user.emailVerified) {
        authView(true);
      } else {
        appDiv.innerHTML = verifyEmail;
      }
      // Show guestbook to logged-in users
      // guestbookContainer.style.display = 'block';
    } else {
      loginButton.textContent = 'Login/Sign Up';
      document.getElementById('firebaseui-auth-container').style.display =
        'none';
      authView(false);
      // Hide guestbook for non-logged-in users
      // guestbookContainer.style.display = 'none';
    }
  });
}
main();

function authView(status) {
  if (status == false) {
    appDiv.innerHTML = home;
  } else {
    appDiv.innerHTML = dashboard;

    documentExists();
  }
}
async function documentExists() {
  const docSnap = await getDoc(doc(db, 'cashCount', todayDate()));

  if (docSnap.exists()) {
  } else {
    addDocByName('cashCount', todayDate(), {
      counts: '',
      doordashOrders: '',
      skipOrder: '',
      uberOrders: '',
      summary: '',
    });
  }
}
function userVerify() {
  sendEmailVerification(auth.currentUser).then(() => {
    // Email verification sent!
    // ...
  });
}
function convCount(arr) {
  var countArr = [
    arr[0] / 100,
    arr[1] / 50,
    arr[2] / 20,
    arr[3] / 10,
    arr[4] / 5,
    arr[5] / 2,
    arr[6] / 1,
    arr[7] / 0.25,
    arr[8] / 0.1,
    arr[9] / 0.05,
    arr[10] / 50,
    arr[11] / 25,
    arr[12] / 10,
    arr[13] / 5,
    arr[14] / 2,
  ];
  return countArr;
}
var myArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
function cashCount() {
  appDiv.innerHTML = cashCountPage;

  const i100 = document.getElementById('m-100');
  const i50 = document.getElementById('m-50');
  const i20 = document.getElementById('m-20');
  const i10 = document.getElementById('m-10');
  const i5 = document.getElementById('m-5');
  const i2 = document.getElementById('m-2');
  const i1 = document.getElementById('m-1');
  const i25c = document.getElementById('m-25c');
  const i10c = document.getElementById('m-10c');
  const i5c = document.getElementById('m-5c');
  const ir2 = document.getElementById('mr-2');
  const ir1 = document.getElementById('mr-1');
  const ir25c = document.getElementById('mr-25c');
  const ir10c = document.getElementById('mr-10c');
  const ir5c = document.getElementById('mr-5c');
  const totalBills = document.getElementById('total-bills');
  const totalCoins = document.getElementById('total-coins');
  const totalRolls = document.getElementById('total-rolls');
  const totalAll = document.getElementById('total-all');
  const sCount = document.getElementById('save-count');
  const countTable = document.getElementById('count-table');
  readData('cashCount', todayDate()).then((value) => {
    if (value != null) {
      if ('counts' in value) {
        if (value['counts'].length != 0) {
          const arr = value['counts'];
          const rarr = convCount(arr);
          myArr = arr;
          i100.value = rarr[0];
          i50.value = rarr[1];
          i20.value = rarr[2];
          i10.value = rarr[3];
          i5.value = rarr[4];
          i2.value = rarr[5];
          i1.value = rarr[6];
          i25c.value = rarr[7];
          i10c.value = rarr[8];
          i5c.value = rarr[9];
          ir2.value = rarr[10];
          ir1.value = rarr[11];
          ir25c.value = rarr[12];
          ir10c.value = rarr[13];
          ir5c.value = rarr[14];

          i100.parentElement.nextElementSibling.textContent = '$' + arr[0];
          i50.parentElement.nextElementSibling.textContent = '$' + arr[1];
          i20.parentElement.nextElementSibling.textContent = '$' + arr[2];
          i10.parentElement.nextElementSibling.textContent = '$' + arr[3];
          i5.parentElement.nextElementSibling.textContent = '$' + arr[4];
          i2.parentElement.nextElementSibling.textContent = '$' + arr[5];
          i1.parentElement.nextElementSibling.textContent = '$' + arr[6];
          i25c.parentElement.nextElementSibling.textContent = '$' + arr[7];
          i10c.parentElement.nextElementSibling.textContent = '$' + arr[8];
          i5c.parentElement.nextElementSibling.textContent = '$' + arr[9];
          ir2.parentElement.nextElementSibling.textContent = '$' + arr[10];
          ir1.parentElement.nextElementSibling.textContent = '$' + arr[11];
          ir25c.parentElement.nextElementSibling.textContent = '$' + arr[12];
          ir10c.parentElement.nextElementSibling.textContent = '$' + arr[13];
          ir5c.parentElement.nextElementSibling.textContent = '$' + arr[14];
          var tbValue = arr[1] + arr[2] + arr[3] + arr[4] + arr[0];
          var tcValue = arr[5] + arr[6] + arr[7] + arr[8] + arr[9];
          var trValue = arr[10] + arr[11] + arr[12] + arr[13] + arr[14];

          totalBills.textContent = tbValue;
          totalBills.textContent = '$' + totalBills.textContent;

          totalCoins.textContent = tcValue;
          totalCoins.textContent = '$' + totalCoins.textContent;

          totalRolls.textContent = trValue;
          totalRolls.textContent = '$' + totalRolls.textContent;
          var taValue = tbValue + tcValue + trValue;

          totalAll.textContent = taValue;
          totalAll.textContent = totalAll.textContent =
            '$' + totalAll.textContent;
        } else {
          console.log('nund');
        }
      } else {
        console.log('nfound');
      }
    } else {
      console.log('notfound');
    }
  });

  countTable.addEventListener('input', cashData);
  sCount.addEventListener('click', cashData);
}
function updateAppOrders(e) {
  allOrders.forEach(function (r, i) {
    var st = 'order-' + i;
    var nt = 'net-' + i;
    console.log(i);
    if (e.target.matches('#' + st)) {
      const valField = document.getElementById(st);
      const netField = document.getElementById(nt);
      allOrders[i] = valField.value * 1;
      netField.value = getNetAmount(pageName, allOrders[i]);
    }
  });
}
function cashData(e) {
  if (e.target.matches('#m-100')) {
    myArr[0] = e.target.value * 100;
    e.target.parentElement.nextElementSibling.textContent = '$' + myArr[0];
  }
  if (e.target.matches('#m-50')) {
    myArr[1] = e.target.value * 50;
    e.target.parentElement.nextElementSibling.textContent = '$' + myArr[1];
  }
  if (e.target.matches('#m-20')) {
    myArr[2] = e.target.value * 20;
    e.target.parentElement.nextElementSibling.textContent = '$' + myArr[2];
  }
  if (e.target.matches('#m-10')) {
    myArr[3] = e.target.value * 10;
    e.target.parentElement.nextElementSibling.textContent = '$' + myArr[3];
  }
  if (e.target.matches('#m-5')) {
    myArr[4] = e.target.value * 5;
    e.target.parentElement.nextElementSibling.textContent = '$' + myArr[4];
  }
  if (e.target.matches('#m-2')) {
    myArr[5] = e.target.value * 2;
    e.target.parentElement.nextElementSibling.textContent = '$' + myArr[5];
  }
  if (e.target.matches('#m-1')) {
    myArr[6] = e.target.value * 1;
    e.target.parentElement.nextElementSibling.textContent = '$' + myArr[6];
  }
  if (e.target.matches('#m-25c')) {
    myArr[7] = e.target.value * 0.25;
    e.target.parentElement.nextElementSibling.textContent = '$' + myArr[7];
  }
  if (e.target.matches('#m-10c')) {
    myArr[8] = e.target.value * 0.1;
    e.target.parentElement.nextElementSibling.textContent = '$' + myArr[8];
  }
  if (e.target.matches('#m-5c')) {
    myArr[9] = e.target.value * 0.05;
    e.target.parentElement.nextElementSibling.textContent = '$' + myArr[9];
  }

  if (e.target.matches('#mr-2')) {
    myArr[10] = e.target.value * 50;
    e.target.parentElement.nextElementSibling.textContent = '$' + myArr[10];
  }
  if (e.target.matches('#mr-1')) {
    myArr[11] = e.target.value * 25;
    e.target.parentElement.nextElementSibling.textContent = '$' + myArr[11];
  }
  if (e.target.matches('#mr-25c')) {
    myArr[12] = e.target.value * 10;
    e.target.parentElement.nextElementSibling.textContent = '$' + myArr[12];
  }
  if (e.target.matches('#mr-10c')) {
    myArr[13] = e.target.value * 5;
    e.target.parentElement.nextElementSibling.textContent = '$' + myArr[13];
  }
  if (e.target.matches('#mr-5c')) {
    myArr[14] = e.target.value * 2;
    e.target.parentElement.nextElementSibling.textContent = '$' + myArr[14];
  }
  if (e.target.matches('#save-count')) {
    console.log('clicked');
    saveCount(myArr);
  }

  var tbValue = myArr[1] + myArr[2] + myArr[3] + myArr[4] + myArr[0];
  var tcValue = myArr[5] + myArr[6] + myArr[7] + myArr[8] + myArr[9];
  var trValue = myArr[10] + myArr[11] + myArr[12] + myArr[13] + myArr[14];
  const totalBills = document.getElementById('total-bills');
  const totalCoins = document.getElementById('total-coins');
  const totalRolls = document.getElementById('total-rolls');
  const totalAll = document.getElementById('total-all');
  totalBills.textContent = tbValue;
  totalBills.textContent = '$' + totalBills.textContent;

  totalCoins.textContent = tcValue;
  totalCoins.textContent = '$' + totalCoins.textContent;

  totalRolls.textContent = trValue;
  totalRolls.textContent = '$' + totalRolls.textContent;
  var taValue = tbValue + tcValue + trValue;

  totalAll.textContent = taValue;
  totalAll.textContent = totalAll.textContent = '$' + totalAll.textContent;
}

function todayDate() {
  let objectDate = new Date();

  let day = objectDate.getDate();

  let month = objectDate.getMonth();
  month = month + 1;

  let year = objectDate.getFullYear();

  const date = year + '-' + month + '-' + day;
  return date;
}
function saveCount(counts) {
  const data = { counts };
  updateFields('cashCount', todayDate(), data);
}

var pageName = '';
var allOrders;

function appOrders(appName) {
  allOrders = [];
  appDiv.innerHTML = addOrders;
  pageName = appName;
  const title = appName + ' Orders';
  const aoTitle = document.getElementById('ao-title');
  aoTitle.textContent = title;

  const updateOrders = document.getElementById('update-orders');
  const backButton = document.getElementById('back-button');

  readData('cashCount', todayDate()).then((value) => {
    if (pageName == 'Skip') {
      var arr = value.skipOrder;
      allOrders = arr;
      orderList(arr);
      updateOrders.addEventListener('click', function () {
        saveOrders(pageName, allOrders).then(() => {
          appDiv.innerHTML = dashboard;
        });
      });
      backButton.addEventListener('click', function () {
        saveOrders(pageName, allOrders);
        appDiv.innerHTML = dashboard;
      });
    }
    if (pageName == 'Uber') {
      var arr = value.uberOrders;
      allOrders = arr;

      orderList(arr);
      updateOrders.addEventListener('click', function () {
        saveOrders(pageName, allOrders);
      });
      backButton.addEventListener('click', function () {
        saveOrders(pageName, allOrders);
        appDiv.innerHTML = dashboard;
      });
    }
    if (pageName == 'Doordash') {
      var arr = value.doordashOrders;
      allOrders = arr;
      orderList(arr);
      updateOrders.addEventListener('click', function () {
        saveOrders(pageName, allOrders);
      });
      backButton.addEventListener('click', function () {
        saveOrders(pageName, allOrders);
        appDiv.innerHTML = dashboard;
      });
    }
  });

  const addButton = document.getElementById('add-orders');

  const orderTotal = document.getElementById('order-total');
  const orderValue = document.getElementById('order-value');
  console.log(allOrders);

  orderValue.addEventListener('input', updateTotal);
  function updateTotal(e) {
    if (e.target.matches('#order-value')) {
      var val = e.target.value * 1;

      orderTotal.value = getNetAmount(pageName, val);
    }
    var val = e.target.value * 1;
    orderTotal.textContent = getNetAmount(pageName, val);
  }
  addButton.addEventListener('click', addOrder);

  const ordersTable = document.getElementById('orders-table');
  ordersTable.addEventListener('input', updateAppOrders);
}
function getNetAmount(pageName, value) {
  var valNet;
  if (pageName == 'Skip') {
    valNet = value * 0.8625;
  }
  if (pageName == 'Uber') {
    valNet = value * 0.83375;
  }
  if (pageName == 'Doordash') {
    valNet = value / 1.06;
  }
  return valNet;
}

function addOrder() {
  const orderValue = document.getElementById('order-value');
  var currentValue = orderValue.value * 1;
  console.log(currentValue);
  if (currentValue != 0) {
    if (allOrders) {
      allOrders.push(currentValue);
    } else {
      allOrders = [];
      allOrders.push(currentValue);
    }
  }

  orderList(allOrders);
  saveOrders(pageName, allOrders);
}
function saveOrders(p, data) {
  if (p == 'Skip') {
    var skipOrders = { skipOrder: data };

    updateFields('cashCount', todayDate(), skipOrders);
  }
  if (p == 'Uber') {
    var uberOrders = { uberOrders: data };
    updateFields('cashCount', todayDate(), uberOrders);
  }
  if (p == 'Doordash') {
    var doordashOrders = { doordashOrders: data };
    updateFields('cashCount', todayDate(), doordashOrders);
  }
}
function orderList(arr) {
  var rBox = document.getElementById('result-box');
  var tBox = document.getElementById('row-template');
  var template = tBox.content;

  rBox.innerHTML = '';
  if (arr != null) {
    if (arr.length != 0) {
      arr.forEach(function (r, i) {
        var tr = template.cloneNode(true);
        var oAm = tr.querySelector('.oAmount');
        var oNe = tr.querySelector('.oNet');
        oAm.value = r;
        oAm.id = 'order-' + i;
        oNe.value = getNetAmount(pageName, r);
        oNe.id = 'net-' + i;
        rBox.appendChild(tr);
      });
    }
  }
}

function otherFunc() {}

//l-firestore
async function updateFields(colPath, docName, data) {
  // Set the "capital" field of the city 'DC'
  await updateDoc(doc(db, colPath, docName), data);
}
async function addDocByName(colPath, docName, data) {
  //e.preventDefault();

  await setDoc(doc(db, colPath, docName), data)
    .then(() => {
      console.log('Document successfully written!');
    })
    .catch((error) => {
      console.error('Error writing document: ', error);
    });

  // Return false to avoid redirect
  return false;
}

async function addDocAutoId(colPath, data) {
  // e.preventDefault();

  await addDoc(collection(db, colPath), data)
    .then((docRef) => {
      console.log('Document written with ID: ', docRef.id);
      return docRef.id;
    })
    .catch((error) => {
      console.error('Error adding document: ', error);
    });

  // Return false to avoid redirect
}

async function readData(colPath, docName) {
  const docSnap = await getDoc(doc(db, colPath, docName));

  if (docSnap.exists()) {
    const rdata = docSnap.data();
    //console.log('Document data:', obj);

    return rdata;
    // runFunc('fireData', docSnap.data());
  } else {
    // doc.data() will be undefined in this case
    console.log('No such document!');
    return null;
  }
}
