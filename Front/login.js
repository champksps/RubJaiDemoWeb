document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('login-form');
  const messageDiv = document.getElementById('message');

  loginForm.addEventListener('submit', async function (event) {
      event.preventDefault();

      const username = loginForm.username.value;
      const password = loginForm.password.value;

      const urlAPILogin = "http://localhost/api/user";

      const response = await fetch(urlAPILogin, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();
        if (result.success) {
            console.log('Yes I can');
            messageDiv.textContent = 'Login successful';
        } else {
            messageDiv.textContent = 'Login failed. Please check your credentials.';
        }
  });
});

  
  