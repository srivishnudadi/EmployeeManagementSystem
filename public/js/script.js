// Shrink the sidebar on scroll
window.onscroll = function() {
    shrinkNavbar();
  };
  
  function shrinkNavbar() {
    const navbar = document.getElementById("navbar");
    if (window.scrollY > 50) { // Shrink after scrolling 50px
      navbar.classList.add("shrink");
    } else {
      navbar.classList.remove("shrink");
    }
  }
  


  document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search');
    const groupSelect = document.getElementById('group');
    const tableBody = document.getElementById('employee-table-body');
  
    async function fetchAndRenderEmployees() {
      const search = searchInput.value;
      const group = groupSelect.value;
  
      const response = await fetch(`/api/employees?search=${search}&group=${group}`);
      const employees = await response.json();
  
      // Clear table
      tableBody.innerHTML = '';
  
      // Refill table
      employees.forEach(emp => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td><img src="${emp.photo}" height="60"></td>
          <td>${emp.name}</td>
          <td>${emp.designation}</td>
          <td>${emp.company_name}</td>
          <td>${new Date(emp.validity_date).toISOString().split('T')[0]}</td>
          <td>${emp.group}</td>
        `;
        tableBody.appendChild(row);
      });
    }
  
    // Trigger fetch on input change
    searchInput.addEventListener('input', fetchAndRenderEmployees);
    groupSelect.addEventListener('change', fetchAndRenderEmployees);
  
    // Load initial data
    fetchAndRenderEmployees();
  });
  
  
  // function sortTable() {
  //   const table = document.querySelector("table tbody");
  //   const rows = Array.from(table.rows);
  //   const sortedRows = rows.sort((rowA, rowB) => {
  //     const nameA = rowA.cells[2].textContent.trim().toLowerCase();  // Name column (3rd column)
  //     const nameB = rowB.cells[2].textContent.trim().toLowerCase();

  //     if (nameA < nameB) return -1;  // Sort alphabetically in ascending order
  //     if (nameA > nameB) return 1;
  //     return 0;
  //   });

  //   // Append the sorted rows back to the table
  //   table.append(...sortedRows);
  // }


  let isAscending = true; // This variable will track the sorting direction

  function sortTable() {
    const table = document.querySelector("table tbody");
    const rows = Array.from(table.rows);
    const sortArrow = document.getElementById("sort-arrow");

    // Sort the rows alphabetically by the Name column (index 2)
    const sortedRows = rows.sort((rowA, rowB) => {
      const nameA = rowA.cells[2].textContent.trim().toLowerCase();  // Name column (3rd column)
      const nameB = rowB.cells[2].textContent.trim().toLowerCase();

      if (isAscending) {
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
      } else {
        if (nameA < nameB) return 1;
        if (nameA > nameB) return -1;
      }
      return 0;
    });

    // Reorder the rows based on the sort
    table.append(...sortedRows);

    // Toggle the sorting direction and change the arrow
    isAscending = !isAscending;

    // Update the arrow
    if (isAscending) {
      sortArrow.innerHTML = "&#x2191;"; // Up arrow
    } else {
      sortArrow.innerHTML = "&#x2193;"; // Down arrow
    }
  }


