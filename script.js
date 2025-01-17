const standardSubjects = [
  "Norsk Muntlig", "Norsk Skriftlig", "Norsk Sidemål", "Matematikk", "Engelsk", "Naturfag", "Samfunnsfag",
  "Kroppsøving", "KRLE", "Kunst og håndverk", "Musikk", "Språk", "Valgfag"
];
const grades = ["1", "2", "3", "4", "5", "6"];
let entries = standardSubjects.map(subject => ({ subject, grade: "" }));

function renderEntries() {
  const entriesContainer = document.getElementById('entries');
  entriesContainer.innerHTML = '';
  entries.forEach((entry, index) => {
    const entryElement = document.createElement('div');
    entryElement.className = 'flex items-center space-x-4 mb-4';
    entryElement.innerHTML = `
      <div class="flex-grow">
        <input type="text" class="input w-full py-3 px-6 border-2 border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value="${entry.subject}" placeholder="Fag" data-index="${index}" oninput="updateSubject(event)" />
      </div>
      <div class="relative">
        <button class="w-40 py-3 px-6 border-2 border-gray-200 text-gray-700 bg-white rounded-md flex justify-between items-center" onclick="toggleSelect(${index})">
          <span>${entry.grade || '.....'}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        <div class="absolute top-full left-0 mt-2 w-full bg-white border-2 border-gray-300 rounded-md shadow-lg hidden z-10" id="select-${index}">
          ${grades.map(grade => `<div class="py-2 px-4 cursor-pointer hover:bg-gray-200" onclick="updateGrade(${index}, '${grade}')">${grade}</div>`).join('')}
        </div>
      </div>
      <button class="w-8 h-8 flex items-center justify-center text-red-500 hover:text-red-700" onclick="removeEntry(${index})">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </button>
    `;
    entriesContainer.appendChild(entryElement);
  });
  calculateAverage();
}

function toggleSelect(index) {
  const selectContent = document.getElementById(`select-${index}`);
  const isOpen = !selectContent.classList.contains('hidden');

  // Close all dropdowns
  document.querySelectorAll('.absolute').forEach(select => select.classList.add('hidden'));

  // Only toggle the clicked dropdown
  if (!isOpen) {
    selectContent.classList.remove('hidden');
  }
}

function updateSubject(event) {
  const index = event.target.getAttribute('data-index');
  entries[index].subject = event.target.value;
  calculateAverage();
}

function updateGrade(index, grade) {
  entries[index].grade = grade;
  document.getElementById(`select-${index}`).classList.add('hidden');
  document.querySelector(`button[onclick="toggleSelect(${index})"] span`).textContent = grade;
  calculateAverage();
}

function removeEntry(index) {
  entries.splice(index, 1);
  renderEntries();
}

function addEntry() {
  entries.push({ subject: "", grade: "" });
  renderEntries();
}

function calculateAverage() {
  const validEntries = entries.filter(entry => entry.subject && entry.grade);
  let average;
  if (validEntries.length === 0) {
    average = "0.00";
  } else {
    const totalPoints = validEntries.reduce((sum, entry) => sum + parseInt(entry.grade), 0);
    average = (totalPoints / validEntries.length).toFixed(2);
  }
  document.getElementById('averageDisplay').textContent = average;
}

document.getElementById('addSubject').addEventListener('click', addEntry);

// Close dropdowns if the click is outside the dropdown or input field
document.addEventListener('click', function(event) {
  if (!event.target.closest('.relative') && !event.target.closest('.input')) {
    document.querySelectorAll('.absolute').forEach(select => select.classList.add('hidden'));
  }
});

renderEntries();
