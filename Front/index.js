function loadTable() {
  fetchData();
  // fetch("http://localhost:5000/api/activity")
  //     .then(response => {
  //         if (!response.ok) {
  //             throw new Error(`HTTP error! Status: ${response.status}`);
  //         }
  //         return response.json();
  //     })
  //     .then(data => {
  //         console.log(data); // Log the fetched data
  //         populateTable(data); // Call a function to populate the table
  //     })
  //     .catch(error => {
  //         console.error('Fetch error:', error);
  //     });
}

async function fetchData() {
  try {
    const apiUrl = 'http://localhost:5000/api/activity';
    const response = await fetch(apiUrl); // Await the fetch operation
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json(); // Await parsing the JSON response
    console.log(data);
    populateTable(data);
    // You can manipulate and use 'data' as needed
  } catch (error) {
    console.error('Async fetch error:', error);
  }
}

function populateTable(data) {
  var trHTML = '';
  for (let object of data) {
    trHTML += '<tr>';
    trHTML += '<td>' + '<input type="checkbox" class="select-checkbox">' + '</td>';
    trHTML += '<td>' + object['id'] + '</td>';
    trHTML += '<td>' + object['date'] + '</td>';
    trHTML += '<td>' + object['detail'] + '</td>';
    trHTML += '<td>' + object['payment_type'] + '</td>';
    trHTML += '<td>' + object['payment_method'] + '</td>';
    trHTML += '<td>' + object['amount'] + '</td>';
    trHTML += '<td>' + object['status'] + '</td>';
    trHTML += '<td>' + object['payment_date'] + '</td>';
    trHTML += '</tr>';
  }
  document.getElementById("mytable").innerHTML = trHTML;
}

loadTable();

function showAddingUserBox() {
  Swal.fire({
    title: 'Add Payment',
    html:
      '<label>Create Date</label>' +
      '<input id="create-date" class="swal2-input" placeholder="Date" type="date" width="300px" value="11-08-2023">' +
      '<label>Detail</label>' +
      '<input id="detail" class="swal2-input" placeholder="Detail" width="300px" value="testtest">' +
      '<label>Payment Type</label>' +
      '<select id="payment-type" name="PaymentType" class="swal2-input" width="300px">' +
      '<option value="" disabled selected hidden>Select Payment Type</option>' +
      '<option value="Income">รายรับ</option>' +
      '<option value="Outcome">รายจ่าย</option>' +
      '</select>' +
      '<label>Payment Method</label>' +
      '<select id="payment-method" name="PaymentMethod" class="swal2-input" width="300px">' +
      '<option value="" disabled selected hidden>Select Payment Method</option>' +
      '<option value="Cash">เงินสด</option>' +
      '<option value="Credit Card">บัตรเครดิต</option>' +
      '</select>' +
      '<label>Payment Date</label>' +
      '<input id="payment-date" class="swal2-input" placeholder="Payment Date" type="date" width="300px" value="11-08-2023">' +
      '<label>Amount</label>' +
      '<input id="amount" class="swal2-input" placeholder="Amount" width="300px" value="1000">' +
      '<label>Status</label>' +
      '<select id="status" name="Status" class="swal2-input" width="300px">' +
      '<option value="" disabled selected hidden>Select Payment Method</option>' +
      '<option value="Done">Done</option>' +
      '<option value="Pending">Pending</option>' +
      '<option value="Cancelled">Cancelled</option>' +
      '</select>',
    showCancelButton: true,
    customClass: 'swal-wide',
    confirmButtonText: 'Add',
    cancelButtonText: 'Cancel',
  }).then((result) => {
    if (result.isConfirmed) {
      addTransaction();
    } else if (result.dismiss === Swal.DismissReason.cancel) {
    }
  })
}

function addTransaction() {
  const create_date = document.getElementById("create-date").value;
  const detail = document.getElementById("detail").value;
  const payment_type = document.getElementById("payment-type").value;
  const payment_method = document.getElementById("payment-method").value;
  const amount = document.getElementById("amount").value;
  const status = document.getElementById("status").value;
  const payment_date = document.getElementById("payment-date").value;

  const apiUrl = 'http://localhost:5000/api/activity';
  const postDataObj = {
    date: create_date,
    detail: detail,
    payment_type: payment_type,
    payment_method: payment_method,
    amount: amount,
    status: status,
    payment_date: payment_date
  }

  postData(apiUrl, postDataObj)
    .then(data => {
      console.log('Response data:', data);
      loadTable();
    })
    .catch(error => {
      console.error('Error sending data:', error);
    });
}

function postData(url, data) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
}

// Function to delete data by ID
function deleteDataById(id) {
  const apiUrl = `http://localhost:5000/api/activity/${id}`;

  fetch(apiUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Data deleted:', data);
    })
    .catch(error => {
      console.error('Error deleting data:', error);
    });
}

let selectedID = [];

document.addEventListener('DOMContentLoaded', function () {
  const dataTable = document.getElementById('mytable');
  const getSelectedButton = document.getElementById('btn_delete');

  dataTable.addEventListener('click', function (event) {
    if (event.target.classList.contains('select-checkbox')) {
      selectedID = [];

      const selectedCheckboxes = dataTable.querySelectorAll('.select-checkbox:checked');

      selectedCheckboxes.forEach(checkbox => {
        const row = checkbox.closest('tr');
        const id = row.querySelector('td:nth-child(2)').textContent;
        selectedID.push(id);
      });
      console.log(selectedID);
    }
  });
  getSelectedButton.addEventListener('click', function () {
    Swal.fire({
      title: 'Delete Selected Data?',
      text: 'Are you sure you want to delete the selected data?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        for(let i = 0; i < selectedID.length; i++){
          deleteDataById(selectedID[i]);
        }
        setTimeout(function() {
          loadTable();
        }, 1000);
      }
    });
  });
});

