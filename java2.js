document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const name = document.getElementById('name').value.trim().toLowerCase();
  const password = document.getElementById('password').value;
  let valid = true;

  const user = ["admin", "admin1", "admin2", "admin3"];
  const sandi = ["admin123", "admin246", "admin135"];

  if (!user.includes(name)) {
    document.getElementById('nameError').style.display = 'block';
    valid = false;
  } else {
    document.getElementById('nameError').style.display = 'none';
  }

  if (!sandi.includes(password)) {
    document.getElementById('passwordError').style.display = 'block';
    valid = false;
  } else {
    document.getElementById('passwordError').style.display = 'none';
  }

  if (valid) {
    document.getElementById('loginForm').reset();
    window.location.href = "dash.html";
  }
});
