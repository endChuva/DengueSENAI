document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault(); 

  const User = document.getElementById('User').value;
  const Senha = document.getElementById('Senha').value;

  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ User, Senha })
  });

  const data = await response.json();  

  if (data.success) {
    window.location.href = '/crud';
  } else {
    alert('Login inválido!'); 
  }
});
