//reads the plant id from the url (eg plant.html?id=123) and looks it up in the data
const id = new URLSearchParams(location.search).get('id');
const plant = PLANTS.find(p => p.id === id);
const container = document.getElementById('plant');

if (!plant) {
  //no plant with that id, just say so
  container.textContent = 'Plant not found.';
} else {
  //sets the browser tab title to the plant's name
  document.title = `${plant.name} — Digital Herbarium`;

  //adds the scientific name as the heading
  const h1 = document.createElement('h1');
  h1.textContent = plant.name;
  container.appendChild(h1);

  //adds the common name underneath, if there is one
  if (plant.commonName) {
    const p = document.createElement('p');
    p.textContent = plant.commonName;
    container.appendChild(p);
  }

  //adds the photo, if there is one
  if (plant.image) {
    const img = document.createElement('img');
    img.className = 'plant-image';
    img.width = '300';
    img.src = plant.image;
    img.alt = plant.name;
    container.appendChild(img);
  }

  //builds a list of label/value pairs for the rest of the details
  const dl = document.createElement('dl');
  const fields = [
    ['Family', plant.family],
    ['Date observed', plant.date],
    ['Place', plant.area],
    ['Coordinates', plant.lat && plant.lon ? `${plant.lat}, ${plant.lon}` : ''],
    ['Originally identified as', plant.originalName !== plant.name ? plant.originalName : ''],
  ];
  //only adds the fields that actually have a value, then appends the whole list
  for (const [label, value] of fields) {
    if (!value) continue;
    const dt = document.createElement('dt');
    dt.textContent = label;
    const dd = document.createElement('dd');
    dd.textContent = value;
    dl.append(dt, dd);
  }
  container.appendChild(dl);

  //adds the wikidata and original-observation links, if we have them
  const links = document.createElement('p');
  if (plant.wikidataId) {
    const a = document.createElement('a');
    a.href = `https://www.wikidata.org/wiki/${plant.wikidataId}`;
    a.target = '_blank';
    a.textContent = 'View on Wikidata';
    links.appendChild(a);
  }
  if (plant.url) {
    if (links.hasChildNodes()) links.appendChild(document.createElement('br'));
    const a = document.createElement('a');
    a.href = plant.url;
    a.target = '_blank';
    a.textContent = 'View original observation';
    links.appendChild(a);
  }
  
  if (plant.lat && plant.lon) {
    if (links.hasChildNodes()) links.appendChild(document.createElement('br'));
    const a = document.createElement('a');
    a.className = 'btn secondary';
    a.href = `https://www.openstreetmap.org/?mlat=${encodeURIComponent(plant.lat)}&mlon=${encodeURIComponent(plant.lon)}#map=16/${encodeURIComponent(plant.lat)}/${encodeURIComponent(plant.lon)}`;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = 'View on map';
    links.appendChild(a);
  }
  container.appendChild(links);
}
