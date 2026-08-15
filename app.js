//grabs the page elements we need to read from and write to
const search = document.getElementById('search');
const areaFilter = document.getElementById('area-filter');
const rowsEl = document.getElementById('rows');
const headers = document.querySelectorAll('th[data-key]');

//keeps track of which column we're sorted by, and which direction
let sortKey = 'name';
let sortDir = 1;

//builds the list of places for the dropdown from whatever areas are in the data
[...new Set(PLANTS.map(p => p.area))].sort().forEach(area => {
  const opt = document.createElement('option');
  opt.value = area;
  opt.textContent = area;
  areaFilter.appendChild(opt);
});

//re-draws the table based on the current search text, place filter, and sort settings
function render() {
  const query = search.value.trim().toLowerCase();
  const area = areaFilter.value;

  //filters the plants down to ones matching the place filter and search text
  let rows = PLANTS.filter(p => {
    if (area && p.area !== area) return false;
    if (!query) return true;
    const haystack = `${p.name} ${p.commonName} ${p.family} ${p.area}`.toLowerCase();
    return haystack.includes(query);
  });

  //sorts the filtered rows by the current sort column/direction
  rows.sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return -sortDir;
    if (a[sortKey] > b[sortKey]) return sortDir;
    return 0;
  });

  //clears the table and adds a row for each plant, clicking a row goes to its plant page
  rowsEl.textContent = '';
  for (const p of rows) {
    const tr = document.createElement('tr');
    tr.dataset.id = p.id;
    tr.onclick = () => location.href = `plant.html?id=${encodeURIComponent(p.id)}`;
    for (const value of [p.name, p.family, p.area, p.date]) {
      const td = document.createElement('td');
      td.textContent = value;
      tr.appendChild(td);
    }
    rowsEl.appendChild(tr);
  }
}

//clicking a column header sorts by that column, clicking it again reverses the direction
headers.forEach(th => {
  th.onclick = () => {
    const key = th.dataset.key;
    sortDir = sortKey === key ? -sortDir : 1;
    sortKey = key;
    render();
  };
});

//re-renders whenever the search text or place filter changes, and once on page load
search.oninput = render;
areaFilter.onchange = render;
render();
