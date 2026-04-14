async function calculate()
{
	const a = parseFloat(document.getElementById('a').value);
	const b = parseFloat(document.getElementById('b').value);
	const operator = document.getElementById('operator').value;

	if (isNaN(a) || isNaN(b))
	{
		alert("Enter valid numbers");
		return;
	}

	let result;

	if (operator === '+') result = a + b;
	if (operator === '-') result = a - b;
	if (operator === '*') result = a * b;
	if (operator === '/') result = a / b;

	document.getElementById('result').innerText = result;

	const res = await fetch('https://calculator-c41x.onrender.com/api/history',
	{
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ a, operator, b, result })
	});

	const data = await res.json();

	await loadHistory();
}

async function loadHistory()
{
	const res = await fetch('https://calculator-c41x.onrender.com/api/history');
	const data = await res.json();

	const list = document.getElementById('history');
	list.innerHTML = '';

	data.forEach(item => {
		const li = document.createElement('li');
		li.innerText = `${item.a} ${item.operator} ${item.b} = ${item.result}`;
		list.appendChild(li);
	});
}

async function clearHistory()
{
	await fetch('https://calculator-c41x.onrender.com/api/history', {
		method: 'DELETE'
	});

	loadHistory(); // reload after delete
}

// Load history on page start
window.onload = loadHistory;
